export const RELATIONS = ["self", "father", "mother", "spouse", "child", "sibling", "friend", "other"] as const;
export type Relation = (typeof RELATIONS)[number];

export function validateProfile(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const relation = (RELATIONS as readonly string[]).includes(String(body.relation)) ? String(body.relation) : "other";
  const birthDate = String(body.birthDate ?? "");
  const birthTime = /^\d{2}:\d{2}$/.test(String(body.birthTime ?? "")) ? String(body.birthTime) : "12:00";
  const placeName = String(body.placeName ?? "").trim();
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  const tzOffset = Number.isFinite(Number(body.tzOffset)) ? Number(body.tzOffset) : 5.5;
  if (name.length < 2) return { error: "Invalid name" } as const;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return { error: "Invalid date" } as const;
  if (!placeName || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return { error: "Invalid place" } as const;
  return { data: { name: name.slice(0, 80), relation, birthDate, birthTime, placeName: placeName.slice(0, 160), latitude, longitude, tzOffset } } as const;
}
