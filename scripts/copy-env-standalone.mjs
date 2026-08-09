import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const standaloneDir = join(root, ".next", "standalone");
const envSource = join(root, ".env.production");
const envTarget = join(standaloneDir, ".env.production");

if (!existsSync(standaloneDir)) {
  console.log("Standalone output not found, skipping env copy.");
  process.exit(0);
}

if (!existsSync(envSource)) {
  console.log(".env.production not found, skipping env copy.");
  process.exit(0);
}

mkdirSync(dirname(envTarget), { recursive: true });
copyFileSync(envSource, envTarget);
console.log("Copied .env.production into .next/standalone");
