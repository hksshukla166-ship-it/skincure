import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const env = { ...process.env };
  const content = readFileSync(resolve(root, ".env.local"), "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

function splitSqlStatements(sql) {
  const statements = [];
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

async function main() {
  const env = loadEnv();
  const password = env.SUPABASE_DB_PASSWORD;
  const projectRef = env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1];

  if (!password || !projectRef) {
    console.error("Missing SUPABASE_DB_PASSWORD or SUPABASE URL");
    process.exit(1);
  }

  const connectionString = `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`;
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  await client.connect();
  console.log("Connected to Supabase Postgres\n");

  let schema = readFileSync(resolve(root, "supabase", "schema.sql"), "utf-8");
  schema = schema.split("\n").filter((line) => !line.trim().startsWith("--")).join("\n");

  const migrationSql = readFileSync(resolve(root, "supabase", "migrations.sql"), "utf-8")
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  console.log("Running migrations...\n");
  for (const statement of splitSqlStatements(migrationSql)) {
    const preview = statement.slice(0, 55).replace(/\s+/g, " ");
    try {
      await client.query(statement);
      console.log("OK:", preview);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists") || msg.includes("duplicate")) {
        console.log("SKIP:", preview);
      } else {
        console.error("FAIL:", preview, msg);
      }
    }
  }

  console.log("\nRunning schema...\n");
  const statements = splitSqlStatements(schema);
  let ok = 0;
  let skip = 0;

  for (const statement of statements) {
    const preview = statement.slice(0, 55).replace(/\s+/g, " ");
    try {
      await client.query(statement);
      console.log("OK:", preview);
      ok++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("already exists") ||
        msg.includes("duplicate key") ||
        (msg.includes("policy") && msg.includes("already exists"))
      ) {
        console.log("SKIP:", preview);
        skip++;
      } else {
        console.error("FAIL:", preview);
        console.error(" ", msg);
        await client.end();
        process.exit(1);
      }
    }
  }

  // Create admin user
  const username = env.ADMIN_USERNAME || "ASkiNcare";
  const adminPass = env.ADMIN_PASSWORD || "SAskinCare134@1";
  const hash = await bcrypt.hash(adminPass, 12);

  const { rows } = await client.query("SELECT id FROM profiles WHERE username = $1", [username]);
  if (rows.length === 0) {
    await client.query(
      "INSERT INTO profiles (username, password_hash, role) VALUES ($1, $2, $3)",
      [username, hash, "super_admin"]
    );
    console.log("\nAdmin user created:", username);
  } else {
    console.log("\nAdmin user already exists:", username);
  }

  await client.end();
  console.log(`\nDone! ${ok} statements OK, ${skip} skipped.`);
  console.log("Login at /admin/login with ASkiNcare / SAskinCare134@1");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
