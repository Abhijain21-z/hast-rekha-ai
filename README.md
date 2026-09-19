# Hast Rekha AI — हस्तरेखा AI

Premium bilingual (Hindi-default + 12 more languages) Vedic astrology & palmistry web app.
Next.js 16 (App Router) · PostgreSQL + Drizzle ORM · Framer Motion · React Three Fiber · rule-based Jyotish engine (no paid AI APIs).

## Features
- Rashi / Nakshatra / Lagna / Panchang from real astronomical positions (Lahiri ayanamsa)
- Complete palm analysis (10 lines, 7 mounts, fingers, auspicious signs) + detailed 12-area predictions
- Premium ₹51 five-year roadmap via UPI (`9522333669@jio`)
- Auth, dashboard with saved readings, birth profiles, user reviews, blog (15 articles), legal pages
- Ambient Om soundscape, 3D Navagraha mandala, zig-zag floating hand, sitemap + JSON-LD SEO

---

## Deploy to Vercel (step by step)

### 1) Push this code to GitHub
```bash
git init
git add .
git commit -m "Hast Rekha AI"
git branch -M main
git remote add origin https://github.com/<your-username>/hast-rekha-ai.git
git push -u origin main
```

### 2) Create a hosted Postgres database
Choose one (free tiers work):
- **Neon** (neon.tech) — recommended with Vercel
- **Vercel Postgres** (Vercel dashboard → Storage → Create Database)
- **Supabase** (supabase.com → Project settings → Database → connection string, use the *session pooler* URI)

Copy the connection string (it looks like `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).

### 3) Import the repo in Vercel
1. Go to [vercel.com/new](https://vercel.com/new) → import your GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Open **Environment Variables** and add:
   - `DATABASE_URL` = your Postgres connection string from step 2
   - `NEXT_PUBLIC_SITE_URL` = `https://<your-project>.vercel.app` (or your custom domain)
4. Open **Build & Development Settings** and set the **Build Command** to:
   ```
   npx drizzle-kit push && npm run build
   ```
   This creates/updates the database tables during every deploy. (The app then auto-seeds the demo account on first boot.)
5. Click **Deploy**. First deploy takes ~1–2 minutes.

### 4) Done
- Open the deployed URL. Demo login: `demo@hastrekha.ai` / `demo1234`
- Custom domain: Vercel project → Settings → Domains.

### Re-running schema manually (optional)
If you prefer pushing the schema from your laptop instead of at build time:
```bash
DATABASE_URL="<your remote url>" npx drizzle-kit push
```

---

## Local development
```bash
cp .env.example .env      # keep the local DATABASE_URL
npm install
npx drizzle-kit push      # create tables in local Postgres
npm run dev               # or: npm run build && npm start
```
The demo user is seeded automatically on first server start (`src/instrumentation.ts`).

## Environment variables
| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `NEXT_PUBLIC_SITE_URL` | Public origin for sitemap/OG URLs (optional) |

## Notes
- Payments are UPI deep-links + QR to `9522333669@jio`; premium is unlocked by the user's UTR reference.
- All astrology content is rule-based and deterministic; edit JSON files in `src/content/` to change predictions, blogs, palm meanings without touching code.
- For entertainment & self-reflection only (disclaimer included site-wide).
