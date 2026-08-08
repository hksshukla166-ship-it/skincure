import { readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Client } = pg;

function isSkippableSqlError(message: string): boolean {
  return (
    message.includes("already exists") ||
    message.includes("duplicate key") ||
    message.includes("multiple primary keys") ||
    (message.includes("policy") && message.includes("already exists")) ||
    (message.includes("does not exist") && message.includes("DROP"))
  );
}

function isSkippableSeedError(message: string): boolean {
  return (
    isSkippableSqlError(message) ||
    message.includes("duplicate key value") ||
    message.includes("violates unique constraint")
  );
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let depth = 0;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const prev = sql[i - 1];

    if (char === "'" && prev !== "\\" && !inDoubleQuote) inSingleQuote = !inSingleQuote;
    if (char === '"' && prev !== "\\" && !inSingleQuote) inDoubleQuote = !inDoubleQuote;

    if (!inSingleQuote && !inDoubleQuote) {
      if (char === "(") depth++;
      if (char === ")") depth--;
    }

    if (char === ";" && !inSingleQuote && !inDoubleQuote && depth === 0) {
      const trimmed = current.trim();
      if (trimmed.length > 0) statements.push(trimmed);
      current = "";
    } else {
      current += char;
    }
  }

  const last = current.trim();
  if (last.length > 0) statements.push(last);

  return statements;
}

function loadSqlFile(relativePath: string): string {
  const filePath = resolve(process.cwd(), relativePath);
  return readFileSync(filePath, "utf-8")
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
}

async function runStatements(
  client: pg.Client,
  statements: string[],
  logs: string[],
  options: { allowSeedSkips?: boolean } = {}
): Promise<void> {
  for (const statement of statements) {
    const preview = statement.slice(0, 70).replace(/\s+/g, " ");
    try {
      await client.query(statement);
      logs.push(`OK: ${preview}...`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isSeed = statement.trim().toUpperCase().startsWith("INSERT");
      const skippable = isSeed && options.allowSeedSkips
        ? isSkippableSeedError(msg)
        : isSkippableSqlError(msg);

      if (skippable) {
        logs.push(`SKIP: ${preview}... (${msg.slice(0, 80)})`);
        continue;
      }
      throw err;
    }
  }
}

async function ensureAdminUser(client: pg.Client, logs: string[]): Promise<void> {
  const username = process.env.ADMIN_USERNAME || "ASkiNcare";
  const password = process.env.ADMIN_PASSWORD || "SAskinCare134@1";
  const passwordHash = await bcrypt.hash(password, 12);

  const { rows } = await client.query("SELECT id FROM profiles WHERE username = $1", [username]);
  if (rows.length === 0) {
    await client.query(
      "INSERT INTO profiles (username, password_hash, role) VALUES ($1, $2, $3)",
      [username, passwordHash, "super_admin"]
    );
    logs.push(`Admin user created: ${username}`);
  } else {
    logs.push(`Admin user already exists: ${username}`);
  }
}

export async function runDatabaseSetup(): Promise<{
  success: boolean;
  message: string;
  details?: string[];
}> {
  const password = process.env.SUPABASE_DB_PASSWORD;
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1];

  if (!password || !projectRef) {
    return {
      success: false,
      message:
        "Add SUPABASE_DB_PASSWORD to .env.local (Supabase Dashboard → Settings → Database → Database password)",
    };
  }

  const connectionString =
    process.env.DATABASE_URL ||
    `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const logs: string[] = [];

  try {
    await client.connect();
    logs.push("Connected to Supabase Postgres");

    logs.push("Running migrations...");
    const migrationStatements = splitSqlStatements(loadSqlFile("supabase/migrations.sql"));
    await runStatements(client, migrationStatements, logs);

    logs.push("Running schema...");
    const schemaStatements = splitSqlStatements(loadSqlFile("supabase/schema.sql"));
    await runStatements(client, schemaStatements, logs, { allowSeedSkips: true });

    await ensureAdminUser(client, logs);

    await client.end();
    return { success: true, message: "Database initialized successfully! You can sign in now.", details: logs };
  } catch (err) {
    await client.end().catch(() => {});
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Setup failed: ${msg}`, details: logs };
  }
}
