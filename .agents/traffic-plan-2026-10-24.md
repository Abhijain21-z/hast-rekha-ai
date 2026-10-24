# Traffic Plan — 24 October 2026

## 1. What the data actually says

- GSC 24h view: 173 clicks, 3.24k impressions, 5.3% CTR. The graph is flat after ~22:30 because the view was last updated four hours before the screenshot; it is not a live outage signal.
- Vercel production logs: 50 requests between 09:32 and 09:38 IST on 24 Oct (48×200, 1×201, 1×0). Paths included `/`, `/rashi`, `/reading`, `/rashifal`, `/register`, `/pricing`.
- Conclusion: the site was not receiving zero traffic. The overnight drop is a normal low-traffic window, and GSC's 24h graph lags. The real problem is growth, not uptime.

## 2. Crawl audit — 65 sitemap URLs

All 65 returned 200. Issues found:

- 10 pages had no canonical: `/reading`, `/upay`, `/terms`, `/about`, `/contact`, `/privacy-policy`, `/refund-policy`, `/login`, `/register`, `/disclaimer`.
- 8 pages shared the default site description.
- `/rashi` had no H1.
- `/login` and `/register` were in the sitemap despite being `noindex`.
- Root layout attached `hreflang hi/en` pointing at `/` to every page without its own alternates.
- `/reading/[id]` (personal saved reading) was indexable.
- Thin pages: `/reading` (330 words), `/contact` (274), `/disclaimer` (385). Login/register are intentionally thin and noindex.

## 3. Fixes shipped in this iteration

- Removed the root-level `alternates.languages` that pointed every page at `/`.
- Added canonical + unique descriptions to all missing pages.
- Added a visible H1 to `/rashi` via `SectionHeading as="h1"`.
- Removed `/login` and `/register` from the sitemap.
- Marked personal `/reading/[id]` pages `noindex, follow: false`.
- Added `/diwali-2026` — date, Lakshmi Puja muhurat, 12-rashi Diwali indications, palm-line links, 5 traditional upay, 6 FAQs, Article/FAQ/Breadcrumb schema.
- Added 12 evergreen `/rashi/[sign]` guides with unique intros, predictions, lucky factors, compatibility, 5 FAQs and Article/FAQ/Breadcrumb schema.
- Removed the old `/rashi/<sign>` → `?sign=` redirects so the real landing pages are reachable; colloquial aliases now redirect to the canonical sign page.
- Added a Diwali banner on `/rashifal` and a footer link.
- Added a UTM-tagged share row (WhatsApp, Telegram, X, Facebook, copy) to rashifal, blog posts, the Diwali page and every rashi guide.
- Added Vercel Analytics (`@vercel/analytics`) for real-time traffic and referrers, plus a privacy-policy note.

## 4. Next actions (priority order)

1. **Deploy and validate** — after deploy, request indexing for `/diwali-2026` in GSC and re-submit the sitemap.
2. **Enable Vercel Analytics** in the Vercel project dashboard (Project → Analytics → Enable). Code is already installed; data starts after enablement.
3. **GSC indexing cleanup** — use the URL Inspection tool on the 3 duplicate-canonical, 2 redirect, 1 404, 1 noindex and 1 robots-blocked URLs. The redirects already exist in `next.config.ts`; validation was marked Started.
4. **Expand the rashi set** — the 12 `/rashi/[sign]` guides are live. Next, add "Diwali upay by rashi" and a New Year 2027 rashifal hub closer to December.
5. **Content calendar** — 2 posts/week targeting high-intent queries:
   - Diwali 2026 upay by rashi
   - New Year 2027 rashifal
   - Marriage timing from palm + kundli
   - Career switch after 30
   - Money line vs fate line
6. **Distribution** — WhatsApp status/channel, Instagram Reels (30-second rashi clips), Pinterest (palm-line diagrams), Quora/Reddit answers, and relevant Indian astrology directories. Do not auto-submit; get owner approval first.
7. **Measure** — weekly: GSC clicks/impressions, indexed pages, Vercel visitors/referrers, free-reading starts, Pro unlocks. Use UTM data from the new share row.

## 5. Guardrails

- No guarantee of traffic or rankings.
- No fear-based or medical/financial claims.
- No directory submissions or social posting without owner approval.
- Cashfree webhook configuration remains owner-side.
