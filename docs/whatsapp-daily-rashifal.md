# Daily WhatsApp rashifal — setup and operations

## Status

The app now has a complete opt-in and daily-send path, but **no message can be
sent until the Meta credentials and an approved template exist**. The cron route
returns `503 whatsapp_not_configured` until both `WHATSAPP_ACCESS_TOKEN` and
`WHATSAPP_PHONE_NUMBER_ID` are set, and `503 cron_secret_missing` until
`CRON_SECRET` is set.

This is deliberate: the existing `readings.whatsapp_phone` consent is for the
payment link and report updates, not for a recurring marketing message. Numbers
are never auto-enrolled.

## Consent model

A visitor must take two separate actions:

1. Enter a 10-digit WhatsApp number.
2. Tick the daily-rashifal consent box (unchecked by default) and submit.

The consent is stored as a `whatsapp_subscribers` row with:

- normalized 10-digit phone (unique — one daily message per person)
- Moon-sign key used for the personalized link
- `opted_in_at` timestamp
- `source` (`reading_form` or `report_page`)
- `status` (`opted_in` / `opted_out`)

A STOP reply flips the row to `opted_out` immediately. Re-opting in requires the
box to be ticked again.

## Flow

1. **Reading form** — optional checkbox under the WhatsApp number.
2. **Reading report** — a card under the rashifal panel for existing readings.
3. **Daily cron** — at 09:00 IST, sends one approved template to each opted-in
   subscriber, then records the attempt in `whatsapp_daily_sends`.
4. **STOP webhook** — Meta calls `/api/whatsapp/webhook`; the subscriber is
   marked opted out before the next run.
5. **Link** — `/rashifal?sign=<rashi>&utm_source=whatsapp&utm_medium=daily&utm_campaign=daily_rashifal`.

## Database

- `whatsapp_subscribers` — one row per phone, consent timestamps, rashi, status,
  last send time, send count, last error.
- `whatsapp_daily_sends` — one row per attempt, with a unique
  `(subscriber_id, send_date)` constraint so a retried cron cannot send twice on
  the same India date.

Migration: `db/migrations/2026-10-24_add_whatsapp_daily_rashifal.sql`.
The same tables are also in `db/schema.sql` for fresh databases.

## Environment variables

Add these in Vercel → Project → Settings → Environment Variables. Use the
production values for the Production environment.

| Variable | Required | Purpose |
| --- | --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | yes | Permanent Meta system-user token with `whatsapp_business_messaging` |
| `WHATSAPP_PHONE_NUMBER_ID` | yes | The WhatsApp sender's phone-number ID (not the display number) |
| `WHATSAPP_API_VERSION` | no | Graph API version, default `v23.0` |
| `WHATSAPP_DAILY_TEMPLATE_NAME` | no | Default `daily_rashifal` |
| `WHATSAPP_DAILY_TEMPLATE_LANG` | no | Default `hi` |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | yes | Random string also entered in Meta's webhook setup |
| `WHATSAPP_APP_SECRET` | yes in production | Verifies Meta's `X-Hub-Signature-256` on STOP webhooks |
| `CRON_SECRET` | yes | Vercel Cron sends `Authorization: Bearer <value>` |
| `DAILY_WHATSAPP_LIMIT` | no | Max sends per run, default `50`, hard max `100` |

Vercel automatically sends the `CRON_SECRET` header to cron routes when the
variable is set.

## Meta template

Create a **Marketing** template named `daily_rashifal`, language **Hindi
(`hi`)**. Exact body:

```
Namaste {{1}} ji 🙏
Aaj ka aapka {{2}} rashifal taiyar hai. Din ka mood, career, love, health aur lucky factors dekhne ke liye yahan click karein:
{{3}}

Daily message band karne ke liye STOP likhein.
```

Variable examples for Meta's review:

| Variable | Example |
| --- | --- |
| `{{1}}` | `Aarav` |
| `{{2}}` | `मेष` |
| `{{3}}` | `https://www.hastrekhaai.online/rashifal?sign=mesha&utm_source=whatsapp&utm_medium=daily&utm_campaign=daily_rashifal` |

Notes:

- This is a recurring promotional message, so it is **Marketing**, not Utility.
- Do not put the link in a dynamic URL button; the body link keeps the UTM
  parameters and works with the approved template as written.
- The STOP line is mandatory in practice, not decoration. Meta and Indian users
  both expect it.
- If Meta rejects the copy, keep the same three variables and adjust only the
  wording. Then set `WHATSAPP_DAILY_TEMPLATE_NAME` if the approved name changes.

## Meta setup checklist

1. Finish Meta Business verification (current owner-side reference: `#2494070`).
2. Confirm the WhatsApp sender number is connected to the WABA and note its
   **phone-number ID**.
3. Create a permanent system-user token with `whatsapp_business_messaging` and
   `whatsapp_business_management`.
4. Create and submit the `daily_rashifal` template above.
5. Set the webhook callback URL to
   `https://www.hastrekhaai.online/api/whatsapp/webhook`, enter the same value as
   `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, and subscribe to the `messages` field.
6. Add every environment variable above, then redeploy.
7. Test in this order:
   - `GET /api/cron/daily-rashifal?dry=1` with the cron bearer token — lists
     opted-in candidates without sending.
   - `GET /api/cron/daily-rashifal?testPhone=91XXXXXXXXXX` with the cron bearer
     token — sends one message to the owner's own number using the approved
     template.
   - Opt in through a reading, wait for the 09:00 IST run, and confirm the row in
     `whatsapp_daily_sends` is `sent`.

PowerShell example:

```powershell
$headers = @{ Authorization = "Bearer $env:CRON_SECRET" }
Invoke-RestMethod -Headers $headers "https://www.hastrekhaai.online/api/cron/daily-rashifal?dry=1"
```

## Schedule and cost

- Vercel Cron: `30 3 * * *` UTC = **09:00 IST**.
- WhatsApp's business-messaging guidance keeps marketing messages inside the
  recipient's 9 AM–9 PM window, so 09:00 is the earliest safe daily slot.
- Approximate Meta India marketing price used in the existing payment-recovery
  notes: **₹0.8631 + GST per message**. Prices change; verify the current rate in
  Meta's pricing dashboard before raising the cap.
- At the default cap of 50/day: about **₹43/day + GST** (roughly ₹1,300/month +
  GST).
- At the hard cap of 100/day: about **₹86/day + GST** (roughly ₹2,600/month +
  GST).

The cap is a cost guard, not a growth target. Start with the owner's own number
and a small opt-in cohort, then raise `DAILY_WHATSAPP_LIMIT` only after the
template, delivery and STOP flow are verified.

## Failure behaviour

- Missing sender credentials → `503 whatsapp_not_configured`; nothing is sent.
- Missing `CRON_SECRET` → `503 cron_secret_missing`; nothing is sent.
- Unapproved template / Meta error → that subscriber's row is logged as `failed`
  with the provider message in `last_error`; other subscribers continue.
- Duplicate cron invocation → the unique `(subscriber_id, send_date)` row prevents
  a second send on the same India date.
- Invalid saved rashi → the subscriber is skipped and `last_error` is set to
  `invalid_rashi`.
- Webhook without `WHATSAPP_APP_SECRET` in production → `503`, so an unsigned
  caller cannot unsubscribe arbitrary numbers.
- Webhook STOP for an unknown number → returns `200` and does nothing.

## Data deletion

`whatsapp_subscribers` is keyed by phone, not `user_id`. When the owner erases an
account or a reading on request, also delete or opt out the matching subscriber
row by phone. Deleting a `readings` row sets the subscriber's `reading_id` to
null but does not remove the subscriber, so the daily message would continue.

## What is intentionally not done

- No existing reading numbers are auto-subscribed.
- No message is sent at deploy time.
- No broadcast to all users.
- No WhatsApp Channel is created automatically.
- The owner still has to approve the per-message marketing budget and the daily
  cap before raising `DAILY_WHATSAPP_LIMIT`.

For users who never revisit their report, a WhatsApp Channel is the
policy-safe broadcast alternative: users follow the channel themselves, and no
individual marketing template is sent. That can run alongside this flow.
