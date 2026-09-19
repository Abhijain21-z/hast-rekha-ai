import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Reads DATABASE_URL from the environment so the same config works locally
 * (`.env`) and on Vercel (project environment variables / build step).
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
