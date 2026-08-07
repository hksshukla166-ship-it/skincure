import { readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";

const { Client } = pg;

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

    const schemaPath = resolve(process.cwd(), "supabase", "schema.sql");
    let schema = readFileSync(schemaPath, "utf-8");

    // Remove comment-only lines
    schema = schema
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n");

    // Run entire schema in one batch (PostgreSQL supports multiple statements)
    try {
      await client.query(schema);
      logs.push("Schema executed successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // If batch fails due to partial existing objects, run statement-by-statement
      if (msg.includes("already exists") || msg.includes("duplicate")) {
        logs.push("Batch had conflicts, running statements individually...");
        await runStatementsIndividually(client, schema, logs);
      } else {
        throw err;
      }
    }

    await client.end();
    return { success: true, message: "Database tables created successfully!", details: logs };
  } catch (err) {
    await client.end().catch(() => {});
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Setup failed: ${msg}`, details: logs };
  }
}

async function runStatementsIndividually(
  client: pg.Client,
  schema: string,
  logs: string[]
) {
  const statements = splitSqlStatements(schema);

  for (const statement of statements) {
    const preview = statement.slice(0, 60).replace(/\s+/g, " ");
    try {
      await client.query(statement);
      logs.push(`OK: ${preview}...`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("already exists") ||
        msg.includes("duplicate key") ||
        msg.includes("multiple primary keys") ||
        (msg.includes("policy") && msg.includes("already exists"))
      ) {
        logs.push(`SKIP: ${preview}... (${msg.slice(0, 60)})`);
        continue;
      }
      throw err;
    }
  }
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
