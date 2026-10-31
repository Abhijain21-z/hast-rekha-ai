/** The only domain the bot may ever send. Anything else is rewritten. */
export const WHATSAPP_SITE_URL = "https://www.hastrekhaai.online";

/**
 * The reader's own report page. With a reading id the link opens that report
 * (where Pro can be bought); without one it opens the reading form.
 */
export function buildReportLink(readingId: string | null): string {
  const path = readingId ? `/reading/${readingId}` : "/reading";
  return `${WHATSAPP_SITE_URL}${path}?utm_source=whatsapp&utm_campaign=pro_followup`;
}

/**
 * Keep only the real report link in a bot reply. Every other URL — including
 * invented paths on our own domain and hallucinated reading ids — is replaced.
 * Bare domain mentions are expanded too, so WhatsApp always sees a full link.
 */
export function fixLinks(reply: string, link: string): string {
  return reply
    .replace(/(?<![@\w/.])(?:www\.)?hastrekhaai\.online(?:\/[^\s)>\]}]*)?/gi, link)
    .replace(/https?:\/\/[^\s)>\]}]+/gi, (url) => (url === link ? url : link));
}

/**
 * True when the user's message is about the report, Pro, payment or the
 * details the reading form asks for. Those replies must always carry the link.
 */
export function wantsReportLink(text: string): boolean {
  return (
    /(link|kharid|lena|lelu|le lu|payment|pay|pro|plan|report|reading|form|detail|naam|name|janm|birth|dob|date|samay|time|sthan|place)/i.test(
      text,
    ) || /\b\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}\b/.test(text)
  );
}
