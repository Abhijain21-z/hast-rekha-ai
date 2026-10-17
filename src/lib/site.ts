/**
 * Single source of truth for the site's canonical origin.
 *
 * Vercel 308-redirects the apex (hastrekhaai.online) to www.hastrekhaai.online,
 * so www is the canonical host. Any canonical / sitemap / OG / JSON-LD URL that
 * uses the apex shows up in Search Console as "Duplicate without
 * user-selected canonical" and "Page with redirect".
 *
 * This normalises our own domain to https://www.hastrekhaai.online even when
 * NEXT_PUBLIC_SITE_URL is still set to the apex — so the sitemap stays correct
 * whether or not the Vercel env var has been updated. Preview/localhost URLs are
 * left untouched.
 */
const DEFAULT_ORIGIN = "https://www.hastrekhaai.online";
const OUR_DOMAIN = /^https?:\/\/(?:www\.)?hastrekhaai\.online$/i;

const raw = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_ORIGIN).replace(/\/+$/, "");

export const SITE_URL = OUR_DOMAIN.test(raw) ? DEFAULT_ORIGIN : raw;
