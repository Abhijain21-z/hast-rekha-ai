export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { seedIfEmpty } = await import("./db/seed");
      const status = await seedIfEmpty();
      console.log(`[hast-rekha] demo data ${status}`);
    } catch (err) {
      console.warn("[hast-rekha] seed skipped:", (err as Error).message);
    }
  }
}
