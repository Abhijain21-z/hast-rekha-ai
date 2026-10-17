/**
 * Rasterises the app logo (src/app/icon.svg) into the PNG sizes the web app
 * manifest and mobile home screens need. Run with: node scripts/generate-icons.mjs
 * Only needs to be re-run when src/app/icon.svg changes.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "src/app/icon.svg"));
const out = (p) => join(root, p);

mkdirSync(out("public/icons"), { recursive: true });

const raster = (size) => sharp(svg, { density: 1200 }).resize(size, size, { fit: "cover" }).png();

await raster(192).toFile(out("public/icons/icon-192.png"));
await raster(512).toFile(out("public/icons/icon-512.png"));
await raster(180).toFile(out("src/app/apple-icon.png"));

// Maskable icons need the logo inside the inner 80% safe zone.
const inner = await sharp(svg, { density: 1200 }).resize(400, 400, { fit: "cover" }).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#0b0618" } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile(out("public/icons/icon-maskable-512.png"));

console.log("icons written: public/icons/icon-192.png, icon-512.png, icon-maskable-512.png, src/app/apple-icon.png");
