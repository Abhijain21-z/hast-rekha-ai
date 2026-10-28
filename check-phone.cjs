const { Client } = require("pg");

(async () => {
  const url = process.env.DATABASE_URL || "postgresql://abhishek:JmIMon7c1lXAPM9vx1rwjA@rose-orca-35581.j77.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=allow";
  const c = new Client({ connectionString: url, ssl: false, connectionTimeoutMillis: 10000 });
  try {
    await c.connect();
    console.log("Connected to CockroachDB");
    
    // Check for the phone number
    const r = await c.query(
      "SELECT id, full_name, whatsapp_phone, premium, premium_at, created_at FROM readings WHERE whatsapp_phone LIKE $1 ORDER BY created_at DESC LIMIT 5",
      ["%7582006369%"]
    );
    
    console.log("\n=== Readings with phone 7582006369 ===");
    console.log("Count:", r.rows.length);
    r.rows.forEach((row, i) => {
      console.log(`\n--- Reading ${i + 1} ---`);
      console.log("ID:", row.id);
      console.log("Name:", row.full_name);
      console.log("WhatsApp Phone:", row.whatsapp_phone);
      console.log("Premium:", row.premium);
      console.log("Premium At:", row.premium_at);
      console.log("Created At:", row.created_at);
    });
    
    if (r.rows.length === 0) {
      console.log("\nNo readings found with phone 7582006369");
    }
    
    if (r.rows.length === 0) {
      console.log("\nNo readings found with phone 7582006369");
    }
    
    await c.end();
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
})();
