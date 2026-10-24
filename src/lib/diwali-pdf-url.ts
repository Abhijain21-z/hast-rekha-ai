/**
 * Server-only Diwali Puja PDF link.
 *
 * Keep this out of client components: the report page fetches the link from
 * /api/readings/[id]/diwali-puja so the Drive folder is only revealed to a
 * reading that has actually unlocked Pro.
 */
export const DIWALI_PUJA_PDF_URL =
  process.env.DIWALI_PUJA_URL?.trim() ||
  "https://drive.google.com/drive/folders/1TVEjXj8GgQHLQeWru5OjIEtOqeWP-oCN";
