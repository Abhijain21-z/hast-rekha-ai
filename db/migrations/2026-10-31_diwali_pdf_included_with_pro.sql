-- From 2026-10-31 the Diwali Puja PDF is included with every report plan,
-- including the ₹51 Pro report. Grant it to every existing Pro buyer so their
-- entitlement matches what the plan now promises. Safe to re-run.
UPDATE readings
SET diwali_pdf = true
WHERE premium = true
  AND diwali_pdf = false;
