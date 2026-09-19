import "dotenv/config";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, pool } from "./index";
import { users, readings, birthProfiles, contactMessages } from "./schema";
import { computeChart } from "../lib/astrology";

export const DEMO_EMAIL = "demo@hastrekha.ai";
export const DEMO_PASSWORD = "demo1234";

const demoReadings = [
  { title: "My Janm Kundli", fullName: "Aarav Sharma", birthDate: "1992-11-14", birthTime: "06:45", placeName: "Jaipur, Rajasthan, India", latitude: 26.9124, longitude: 75.7873, isFavorite: true, notes: "Pandit ji confirmed Tula lagna. Ask about Shani dasha timing." },
  { title: "Papa ki Kundli", fullName: "Rajesh Sharma", birthDate: "1962-03-02", birthTime: "23:20", placeName: "Jodhpur, Rajasthan, India", latitude: 26.2389, longitude: 73.0243, isFavorite: false, notes: null },
  { title: "Mummy ki Kundli", fullName: "Sunita Sharma", birthDate: "1966-08-21", birthTime: "04:10", placeName: "Udaipur, Rajasthan, India", latitude: 24.5854, longitude: 73.7125, isFavorite: true, notes: "Chitra nakshatra — matches the old handwritten kundli." },
  { title: "Ananya – Match Check", fullName: "Ananya Iyer", birthDate: "1995-05-28", birthTime: "14:05", placeName: "Chennai, Tamil Nadu, India", latitude: 13.0827, longitude: 80.2707, isFavorite: false, notes: "Compatibility looks strong. Compare Moon signs." },
  { title: "Little Vihaan", fullName: "Vihaan Sharma", birthDate: "2021-01-09", birthTime: "09:32", placeName: "Bengaluru, Karnataka, India", latitude: 12.9716, longitude: 77.5946, isFavorite: false, notes: "Namkaran done as per nakshatra syllable." },
];

const demoProfiles = [
  { name: "Aarav Sharma", relation: "self", birthDate: "1992-11-14", birthTime: "06:45", placeName: "Jaipur, Rajasthan, India", latitude: 26.9124, longitude: 75.7873 },
  { name: "Rajesh Sharma", relation: "father", birthDate: "1962-03-02", birthTime: "23:20", placeName: "Jodhpur, Rajasthan, India", latitude: 26.2389, longitude: 73.0243 },
  { name: "Sunita Sharma", relation: "mother", birthDate: "1966-08-21", birthTime: "04:10", placeName: "Udaipur, Rajasthan, India", latitude: 24.5854, longitude: 73.7125 },
  { name: "Kavya Sharma", relation: "sibling", birthDate: "1997-07-03", birthTime: "18:50", placeName: "Jaipur, Rajasthan, India", latitude: 26.9124, longitude: 75.7873 },
];

export async function seedIfEmpty(): Promise<"seeded" | "skipped"> {
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, DEMO_EMAIL)).limit(1);
  if (existing.length) return "skipped";

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const [demo] = await db
    .insert(users)
    .values({ name: "Aarav Sharma", email: DEMO_EMAIL, passwordHash, preferredLang: "en" })
    .returning();

  const now = Date.now();
  await db.insert(readings).values(
    demoReadings.map((r, i) => ({
      userId: demo.id,
      title: r.title,
      fullName: r.fullName,
      birthDate: r.birthDate,
      birthTime: r.birthTime,
      timeUnknown: false,
      placeName: r.placeName,
      latitude: r.latitude,
      longitude: r.longitude,
      tzOffset: 5.5,
      result: computeChart({ date: r.birthDate, time: r.birthTime, latitude: r.latitude, longitude: r.longitude, tzOffset: 5.5 }),
      isFavorite: r.isFavorite,
      notes: r.notes,
      createdAt: new Date(now - (demoReadings.length - i) * 86400000 * 3),
      updatedAt: new Date(now - (demoReadings.length - i) * 86400000 * 3),
    })),
  );

  await db.insert(birthProfiles).values(demoProfiles.map((p) => ({ ...p, userId: demo.id, tzOffset: 5.5 })));

  await db.insert(contactMessages).values([
    { name: "Priya Sharma", email: "priya@example.com", message: "Can you add Kannada language support?" },
    { name: "Vikram Singh", email: "vikram@example.com", message: "Loved the transparency of calculations. Please add Navamsa chart." },
  ]);

  return "seeded";
}

// Allow running directly: `npx tsx src/db/seed.ts`
if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  seedIfEmpty()
    .then((status) => {
      console.log(`Seed ${status}`);
      return pool.end();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
