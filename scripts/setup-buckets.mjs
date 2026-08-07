/**
 * Run: node scripts/setup-buckets.mjs
 * Creates all Supabase storage buckets automatically.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  try {
    const envPath = resolve(root, ".env.local");
    const content = readFileSync(envPath, "utf-8");
    const env = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      env[key.trim()] = rest.join("=").trim();
    }
    return env;
  } catch {
    return process.env;
  }
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const BUCKETS = [
  "doctor-images",
  "gallery",
  "videos",
  "testimonials",
  "blogs",
  "certificates",
  "logo",
];

async function main() {
  console.log("Setting up Supabase storage buckets...\n");

  const { data: existing, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Failed to list buckets:", listError.message);
    process.exit(1);
  }

  const existingIds = new Set(existing?.map((b) => b.id) ?? []);

  for (const id of BUCKETS) {
    if (existingIds.has(id)) {
      console.log(`✓ ${id} (already exists)`);
      continue;
    }

    const { error } = await supabase.storage.createBucket(id, {
      public: true,
      fileSizeLimit: 52428800,
    });

    if (error) {
      console.error(`✗ ${id}: ${error.message}`);
    } else {
      console.log(`✓ ${id} (created)`);
    }
  }

  console.log("\nDone! All buckets are ready.");
  console.log("\nNext: Run supabase/schema.sql in Supabase SQL Editor if not done yet.");
}

main();
