# WhatsApp rashifal reminders — setup and operations

## Status

The app has a complete opt-in and twice-weekly send path. As of **24 October 2026**
the sender and local credentials are in place, but no marketing message can be
sent until Meta approves the template:

- Sender **+91 96697 36939** (`Abhishek jain`, phone-number ID
  `1385715234624833`, quality GREEN, `CLOUD_API`) is connected.
- The `rashifal_3day` Marketing template (Hindi) was submitted on 24 October
  2026 (template id `1646644140176306`) and is **PENDING** review.
- The permanent system-user token, phone-number ID, webhook verify token and
  `CRON_SECRET` are configured locally. They must also be added in Vercel.
- `WHATSAPP_APP_SECRET` is now set locally. It must also be added in Vercel;
  production webhook POSTs return `503` until it is (dev accepts unsigned POSTs
  only because `NODE_ENV !== "production"`).
- Webhook `GET` verification returns the challenge, and the cron `?dry=1` run
  returns `200` with an empty candidate list.
- The Meta app currently has **no webhook subscription**, and the WABA has **no
  subscribed app**. Both must be set after the production deploy; see
  [Meta webhook, step by step](#meta-webhook-step-by-step).

A free-form WhatsApp text was accepted by Meta for the owner's number
`+91 75820 06369` on 24 October 2026 (within the 24-hour customer-service
window), which confirms the sender, token and phone-number ID. The **template**
send still has to wait for approval — `?testPhone=` uses the approved rashifal
template and cannot run while it is `PENDING`.

This is deliberate: the WhatsApp number is required to create a reading (for the
report link and payment updates), but that is **not** marketing consent. Numbers
are never auto-enrolled in the rashifal reminder.

## Consent model

A visitor takes two separate actions:

1. Enter a valid 10-digit WhatsApp number (now required for a new reading).
2. Tick the **optional** rashifal-reminder box (unchecked by default) and submit.

The consent is stored as a `whatsapp_subscribers` row with:

- normalized 10-digit phone (unique — one reminder stream per person)
- Moon-sign key used for the personalized link
- `opted_in_at` timestamp
- `source` (`reading_form` or `report_page`)
- `status` (`opted_in` / `opted_out`)

A STOP reply flips the row to `opted_out` immediately. Re-opting in requires the
box to be ticked again. Pro and Ultra Pro readers are excluded from the reminder
audience at send time and do not see the opt-in card on their report.

## Flow

1. **Reading form** — optional 2x/week checkbox under the required WhatsApp
   number.
2. **Reading report** — a card under the rashifal panel for existing free
   readings. It is hidden once the reading is Pro/Ultra.
3. **Reminder cron** — every day at 09:00 IST. Each subscriber is assigned two
   fixed weekdays at opt-in time, so only the people due that day receive the
   approved template (2 messages per person per week). Each attempt is recorded
   in `whatsapp_daily_sends`.
4. **STOP webhook** — Meta calls `/api/whatsapp/webhook`; the subscriber is
   marked opted out before the next run.
5. **Link** — `/rashifal?sign=<rashi>&utm_source=whatsapp&utm_medium=weekly&utm_campaign=rashifal_reminder`.

## Pro exclusion

A reader is skipped if any of these is true:

- the subscriber's linked reading has `premium = true` or `ultra = true`;
- any reading with the same normalized `whatsapp_phone` has `premium = true` or
  `ultra = true`.

The first rule covers an old reading whose phone was never saved; the second
covers a free reading that opted in and a later Pro purchase on another reading.
This is implemented as a `NOT EXISTS` filter in
`src/app/api/cron/daily-rashifal/route.ts`, so the exclusion applies to both the
real run and `?dry=1`.

If a reader buys Pro after opting in, the subscriber row stays in the database
but is not messaged. Keeping the row preserves the consent audit trail and makes
the STOP flow idempotent.

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
| `WHATSAPP_RASHIFAL_TEMPLATE_NAME` | no | Preferred template name, default `rashifal_3day` |
| `WHATSAPP_DAILY_TEMPLATE_NAME` | no | Legacy fallback if the new name is not set |
| `WHATSAPP_DAILY_TEMPLATE_LANG` | no | Default `hi` |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | yes | Random string also entered in Meta's webhook setup |
| `WHATSAPP_APP_SECRET` | yes in production | Verifies Meta's `X-Hub-Signature-256` on STOP webhooks |
| `CRON_SECRET` | yes | Vercel Cron sends `Authorization: Bearer <value>` |
| `RASHIFAL_WHATSAPP_LIMIT` | no | Max sends per daily run, default `50`, hard max `100` |
| `DAILY_WHATSAPP_LIMIT` | no | Legacy fallback for the run cap |

Vercel automatically sends the `CRON_SECRET` header to cron routes when the
variable is set.

## Meta template

Create a **Marketing** template named `rashifal_3day`, language **Hindi (`hi`)**.
Suggested body:

```
Namaste {{1}} ji 🙏
Aaj, kal aur is hafte ka aapka {{2}} rashifal taiyar hai. Din ka mood, career, love, health aur lucky factors dekhne ke liye yahan click karein:
{{3}}

Reminder band karne ke liye STOP likhein.
```

Variable examples for Meta's review:

| Variable | Example |
| --- | --- |
| `{{1}}` | `Aarav` |
| `{{2}}` | `मेष` |
| `{{3}}` | `https://www.hastrekhaai.online/rashifal?sign=mesha&utm_source=whatsapp&utm_medium=weekly&utm_campaign=rashifal_reminder` |

Notes:

- This is a recurring promotional message, so it is **Marketing**, not Utility.
- The name `rashifal_3day` is historical. It is only a template identifier and
  does not control frequency; the cron sends it twice a week per subscriber.
- Do not put the link in a dynamic URL button; the body link keeps the UTM
  parameters and works with the approved template as written.
- The STOP line is mandatory in practice, not decoration. Meta and Indian users
  both expect it.
- If Meta rejects the copy, keep the same three variables and adjust only the
  wording. Then set `WHATSAPP_RASHIFAL_TEMPLATE_NAME` if the approved name
  changes.
- The old `daily_rashifal` name is still accepted through
  `WHATSAPP_DAILY_TEMPLATE_NAME` so an existing approved template does not break
  while the new one is reviewed.

## Meta setup checklist

1. Finish Meta Business verification (current owner-side reference: `#2494070`).
2. Confirm the WhatsApp sender number is connected to the WABA and note its
   **phone-number ID**.
3. Create a permanent system-user token with `whatsapp_business_messaging` and
   `whatsapp_business_management`.
4. Create and submit the `rashifal_3day` template above.
5. Add every environment variable above, then redeploy. The callback URL must be
   live before Meta will save the webhook.
6. Set the webhook callback URL to
   `https://www.hastrekhaai.online/api/whatsapp/webhook`, enter the same value as
   `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, subscribe to the `messages` field, and
   subscribe the WABA to the app. Full steps:
   [Meta webhook, step by step](#meta-webhook-step-by-step).
7. Test in this order:
   - `GET /api/cron/daily-rashifal?dry=1` with the cron bearer token — lists
     only the subscribers assigned to today, including their `sendDays`
     (`1 = Monday … 7 = Sunday`), without sending. A Pro reader must not appear.
   - Check that each test subscriber has exactly two different `sendDays` and
     that the cohort is spread across all seven days.
   - `GET /api/cron/daily-rashifal?testPhone=91XXXXXXXXXX` with the cron bearer
     token — sends one message to the owner's own number using the approved
     template.
   - Opt in through a free reading, wait for one of that subscriber's two
     assigned days at 09:00 IST, and confirm the row in
     `whatsapp_daily_sends` is `sent`.
   - Unlock Pro on that reading, run `?dry=1` again, and confirm the reader is
     no longer listed.

PowerShell example:

```powershell
$headers = @{ Authorization = "Bearer $env:CRON_SECRET" }
Invoke-RestMethod -Headers $headers "https://www.hastrekhaai.online/api/cron/daily-rashifal?dry=1"
```

## Meta webhook, step by step

Two separate links must exist before Meta delivers a STOP reply:

1. **App-level callback** — tells Meta which URL to call.
2. **WABA subscription** — attaches this WhatsApp business account to the app.

Both are currently empty. The callback URL must already return the challenge
before Meta will save it, so do this **after** the production deploy that adds
`/api/whatsapp/webhook`.

IDs for this project:

| Item | Value |
| --- | --- |
| Meta app ID | `1191824343813411` |
| WhatsApp business account (WABA) | `28556337814067378` |
| Sender phone-number ID | `1385715234624833` |
| Callback URL | `https://www.hastrekhaai.online/api/whatsapp/webhook` |
| Verify token | value of `WHATSAPP_WEBHOOK_VERIFY_TOKEN` |
| App secret | value of `WHATSAPP_APP_SECRET` |

### Option A — Meta dashboard (recommended first time)

1. Open `https://developers.facebook.com/apps/1191824343813411/`.
2. Left menu → **WhatsApp** → **Configuration**.
3. Under **Webhook**, click **Edit**.
4. **Callback URL**: paste the callback URL above.
5. **Verify token**: paste the exact `WHATSAPP_WEBHOOK_VERIFY_TOKEN` value from
   `.env.local` / Vercel. No quotes, no trailing space.
6. Click **Verify and save**. Meta sends a `GET` request with
   `hub.challenge`; the route must answer with the same challenge. A 404, 503
   or a different body means the deploy or the env var is wrong.
7. In **Webhook fields**, click **Manage** and subscribe to **`messages`**.
   Without this field, STOP replies never reach the app.
8. Open **WhatsApp → API Setup** and confirm the sender
   `+91 96697 36939` is still connected.

### Option B — Graph API

Load the three values from `.env.local` into the current PowerShell session first:

```powershell
function Read-EnvValue($name) {
  ((Get-Content .env.local | Where-Object { $_ -match "^$name=" }) -split "=", 2)[1].Trim('"')
}
$env:WHATSAPP_APP_SECRET = Read-EnvValue "WHATSAPP_APP_SECRET"
$env:WHATSAPP_WEBHOOK_VERIFY_TOKEN = Read-EnvValue "WHATSAPP_WEBHOOK_VERIFY_TOKEN"
$env:WHATSAPP_ACCESS_TOKEN = Read-EnvValue "WHATSAPP_ACCESS_TOKEN"
```

App-level callback, using the app access token `APP_ID|APP_SECRET`:

```powershell
$appId = "1191824343813411"
$appSecret = $env:WHATSAPP_APP_SECRET
$verify = $env:WHATSAPP_WEBHOOK_VERIFY_TOKEN
$body = @{
  object = "whatsapp_business_account"
  callback_url = "https://www.hastrekhaai.online/api/whatsapp/webhook"
  verify_token = $verify
  fields = "messages"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "https://graph.facebook.com/v23.0/$appId/subscriptions" `
  -Headers @{ Authorization = "Bearer $appId|$appSecret" } `
  -ContentType "application/json" `
  -Body $body
```

Then subscribe the WABA to the app, using the system-user token:

```powershell
Invoke-RestMethod -Method Post `
  -Uri "https://graph.facebook.com/v23.0/28556337814067378/subscribed_apps" `
  -Headers @{ Authorization = "Bearer $env:WHATSAPP_ACCESS_TOKEN" }
```

Verify both links:

```powershell
Invoke-RestMethod -Uri "https://graph.facebook.com/v23.0/1191824343813411/subscriptions" `
  -Headers @{ Authorization = "Bearer $appId|$appSecret" }
Invoke-RestMethod -Uri "https://graph.facebook.com/v23.0/28556337814067378/subscribed_apps" `
  -Headers @{ Authorization = "Bearer $env:WHATSAPP_ACCESS_TOKEN" }
```

The first call must list one subscription with the callback URL and
`fields: ["messages"]`; the second must list the app.

### Signature check

Meta sends `X-Hub-Signature-256: sha256=<hmac>` on every POST. The route
recomputes the HMAC with `WHATSAPP_APP_SECRET` and rejects a mismatch. In
production a missing secret returns `503`, so the STOP endpoint cannot be
abused by an unsigned caller. The app secret is server-side only — never put it
in `NEXT_PUBLIC_*` or any browser code.

### Test the STOP flow

1. Opt in a free reading with a test phone.
2. Send `STOP` from that phone to `+91 96697 36939`.
3. Check the subscriber row: `status` must be `opted_out` and `opted_out_at`
   must be set.
4. Run `?dry=1`; that phone must not be listed.

If the webhook returns `200` but the row does not change, the usual causes are a
missing `messages` subscription or a WABA that is not subscribed to the app.

## Schedule, frequency and cost

- Vercel Cron: `30 3 * * *` UTC = **09:00 IST every day**.
- Each subscriber is assigned **two weekdays** from their subscriber id: day
  `d` and day `d + 3` (Monday-first). The days are stable across runs and always
  different, so one person receives **2 messages a week**, three or four days
  apart.
- The assignment is uniform, so each weekday carries roughly **2/7 of the
  cohort**. Users are spread across the week instead of the whole cohort being
  messaged on the same three days, which also flattens the daily cost.
- `RASHIFAL_WHATSAPP_LIMIT` is a **per-day send cap** (default 50, hard max
  100). If more subscribers are due than the cap, the remainder are skipped for
  that day and wait for their next assigned day — there is no catch-up send on
  the following day.
- The route scans at most 1000 opted-in rows per run. That is well above the
  50/100 send cap; if the audience grows past it, store the assigned days in a
  database column so the filter can run in SQL.
- WhatsApp's business-messaging guidance keeps marketing messages inside the
  recipient's 9 AM–9 PM window, so 09:00 is the earliest safe slot.
- Approximate Meta India marketing price used in the payment-recovery notes:
  **₹0.8631 + GST per message**. Prices change; verify the current rate in
  Meta's pricing dashboard before raising the cap.
  - Per reader: 2 messages/week ≈ **₹1.73/week + GST** (about ₹7.48/month + GST).
  - Daily cap of 50: at most **₹43.16/day + GST**.
  - If the cap is hit every day: about **₹302/week + GST** (roughly
    ₹1,309/month + GST).

The cap is a cost guard, not a growth target. Start with the owner's own number
and a small opt-in cohort, then raise `RASHIFAL_WHATSAPP_LIMIT` only after the
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
- Not one of the subscriber's two assigned days → the row is not selected, no
  `whatsapp_daily_sends` row is written, and no message is sent.
- More subscribers due than the per-day cap → the remainder are skipped for that
  day and wait for their next assigned day; no catch-up send.
- Paid reader → excluded by the `NOT EXISTS` filter; no row is written.
- Webhook without `WHATSAPP_APP_SECRET` in production → `503`, so an unsigned
  caller cannot unsubscribe arbitrary numbers.
- Webhook STOP for an unknown number → returns `200` and does nothing.

## Data deletion

`whatsapp_subscribers` is keyed by phone, not `user_id`. When the owner erases an
account or a reading on request, also delete or opt out the matching subscriber
row by phone. Deleting a `readings` row sets the subscriber's `reading_id` to
null but does not remove the subscriber, so the reminder would continue until the
row is deleted or marked `opted_out`.

## What is intentionally not done

- No existing reading numbers are auto-subscribed.
- No message is sent at deploy time.
- No catch-up or extra message if an assigned day is missed; the next message is
  the next assigned day, so the maximum stays two per subscriber per week.
- No broadcast to all users, and no messages to Pro/Ultra readers.
- No WhatsApp Channel is created automatically.
- The owner still has to approve the per-message marketing budget and the run cap
  before raising `RASHIFAL_WHATSAPP_LIMIT`.

For users who never revisit their report, a WhatsApp Channel is the
policy-safe broadcast alternative: users follow the channel themselves, and no
individual marketing template is sent. That can run alongside this flow.
