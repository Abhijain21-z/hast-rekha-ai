# Diwali Puja PDF — Pro bonus

## What it is

A complete Diwali Puja PDF (vidhi, samagri, muhurat, mantras, aarti, visarjan)
offered free with the ₹51 Pro report. Ultra Pro includes Pro, so it gets the same
bonus.

The public Drive folder is:

```text
https://drive.google.com/drive/folders/1TVEjXj8GgQHLQeWru5OjIEtOqeWP-oCN
```

That URL must **not** be imported into a client component. It lives only in
`src/lib/diwali-pdf-url.ts` and is returned by a server route after a Pro check.

## Gating

- `GET /api/readings/[id]/diwali-puja`
- `premium = false` (or missing reading) → `403 { "error": "Locked" }`
- `premium = true` (Pro or Ultra Pro) → `200 { "url": "..." }`
- `Cache-Control: no-store`

The report page renders `DiwaliPujaCard` only inside the unlocked Pro section.
The card fetches the route; the Drive URL never appears in the page source or the
client bundle.

## Where the offer is shown

- Home page and `/pricing` — `DiwaliPujaPromo` under the pricing cards.
- `/diwali-2026` — a prominent promo section near the top.
- Reading report — in the locked Pro upsell as a bonus strip, and as a
  `DiwaliPujaCard` with the download button after unlock.
- Pro comparison table — a dedicated row.
- `src/content/premium.json` and the Pro perk list — a dedicated line.

The public promo CTAs go to `/reading` (start free reading) or
`/pricing#pricing`; they never link directly to Drive.

## Environment variable

| Variable | Required | Purpose |
| --- | --- | --- |
| `DIWALI_PUJA_URL` | no | Override the hard-coded Drive folder, e.g. if the PDF moves |

If unset, the route uses the published folder above.

## Manual checks

1. Open a free reading and scroll to the Pro section. The bonus strip should be
   visible, and the download card should not.
2. Unlock Pro (or set `premium = true` on a test reading). The
   `DiwaliPujaCard` should show “Open the Diwali Puja PDF”.
3. Open DevTools → Network and confirm the link comes from
   `/api/readings/<id>/diwali-puja`, not from the HTML.
4. Open the same route for a free reading; it must return `403`.
5. Check `/`, `/pricing` and `/diwali-2026` for the promo, and confirm no
   `drive.google.com` URL appears in the page source before unlock.
