/**
 * Idempotent database schema sync.
 *
 * Runs at the start of `npm run build`, so a Vercel deploy applies it to the
 * production database before the new code starts serving traffic. It is also
 * safe to run by hand at any time:
 *
 *   node scripts/migrate.mjs
 *
 * It applies db/schema.sql (CREATE TABLE IF NOT EXISTS ...) and then every
 * db/migrations/*.sql in name order (each one is ADD COLUMN IF NOT EXISTS ...),
 * so running it twice changes nothing.
 *
 * - No DATABASE_URL anywhere: prints a note and exits 0, so builds on machines
 *   without a database keep working.
 * - Any SQL failure: exits 1 and the deploy stops, instead of shipping code
 *   that expects columns the database does not have yet.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// On Vercel DATABASE_URL is already in the environment. Locally we read it from
// .env.local / .env without pulling in a dependency that the build may lack.
if (!process.env.DATABASE_URL) {
  for (const file of [".env.local", ".env"]) {
    const filePath = path.join(root, file);
    if (!existsSync(filePath)) continue;
    for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
      const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
      if (!match) continue;
      const value = match[2].replace(/^["']|["']$/g, "");
      if (!(match[1] in process.env)) process.env[match[1]] = value;
    }
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[migrate] DATABASE_URL is not set — skipping schema sync.");
  process.exit(0);
}

const migrationsDir = path.join(root, "db", "migrations");
const files = [
  path.join(root, "db", "schema.sql"),
  ...(existsSync(migrationsDir) ? readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort().map((f) => path.join(migrationsDir, f)) : []),
];

const isLocal = /localhost|127\.0\.0\.1/.test(url);
const client = new pg.Client({ connectionString: url, ssl: isLocal ? false : { rejectUnauthorized: false } });

try {
  await client.connect();
  for (const file of files) {
    const sql = readFileSync(file, "utf8");
    if (!sql.trim()) continue;
    await client.query(sql);
    console.log(`[migrate] applied ${path.relative(root, file).replace(/\\/g, "/")}`);
  }
  console.log("[migrate] schema is up to date.");
} catch (error) {
  console.error(`[migrate] failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
