# WhatsApp payment recovery — setup notes

## What is already live in the app

- Name is mandatory on the reading form (2–80 characters, browser + server validation).
- WhatsApp number is asked on the reading form (optional at that stage).
- The number is saved with the reading but is **not** included in the public reading payload.
- At payment time the number is compulsory and labelled as the WhatsApp number.
- The payment row stores `customer_phone`, `whatsapp_opt_in`, and the consent timestamp.
- Nothing is sent automatically yet: the WhatsApp sender still has to be connected.

## Recommended low-cost path

Do **not** buy Cashfree's WhatsApp add-on just for payment links. Cashfree's standard
Payment Links API already creates a payment URL. We can send that URL ourselves
through a WhatsApp sender. That gives us full control over the 30 min / Day 1 /
Day 3 sequence and avoids a second paid channel.

Flow:

1. Customer enters the WhatsApp number and opts in.
2. Cashfree order is created as it is today (SDK checkout stays fast).
3. If the order is still unpaid after 30 minutes, the server creates a Cashfree
   Payment Link for the same reading/plan and stores its `link_id` + `link_url`.
4. Our reminder job sends the link on WhatsApp.
5. Day 1 and Day 3: two more reminders, only if still unpaid.
6. Cashfree webhook marks the payment paid → cancel all future reminders.
7. Paid message sends the reading/PDF link and a "technical problem? reply here"
   line.

No message is sent after payment. `STOP` also stops all reminders.

## Sender options (pick one)

### A. Meta WhatsApp Cloud API (cheapest at low volume)

- No monthly platform fee.
- You pay Meta per delivered message (India utility rate is about ₹0.115 +
  GST; marketing is about ₹0.8631 + GST as of October 2026).
- First 1,000 service replies per business number per month are free.
- Needs: Meta Business account, WhatsApp Business Account, a dedicated phone
  number, permanent access token, approved templates, and a payment method.

Best if we build the sender inside this repo. No BSP subscription.

### B. AiSensy / Interakt (easiest free trial)

- AiSensy has a 14-day Pro trial and a free-forever plan with limited
  conversations.
- Interakt also advertises a free plan/trial.
- Easier dashboard, but the free plan may not expose all automation/API
  features. Confirm before relying on it.
- After the trial, paid plans start around ₹999–₹1,500/month (confirm current
  pricing).

### C. Cashfree WhatsApp payment links (optional; paid, selected merchants)

- Cashfree sends the payment link from its own verified WABA; sender shows
  "Cashfree", not "Hast Rekha AI".
- Activation: 4–5 working days.
- Cashfree says this is a **paid feature for selected merchants**; ask for
  pricing and a trial. Do not assume it is free.
- Payment Link auto reminders: max 3, normally scheduled on days 1/2/3/7/14,
  between 12 PM and 6 PM. The 30-minute first touch is not a standard payment
  link reminder; that is the separate abandoned-order flow.
- Good fallback if you want Cashfree to handle delivery. It cannot send your
  PDF or run a custom daily sequence.

## Cashfree support request (copy-paste)

Use the Merchant Dashboard → Help/Support → Raise a Request, or:
https://merchant.cashfree.com/merchants/landing?env=prod&raise_issue=1

**Subject:** Enable Payment Links + abandoned payment WhatsApp recovery for Hast Rekha AI

**Body:**

> Hello Cashfree Support,
>
> Merchant: Hast Rekha AI
> Website: https://www.hastrekhaai.online
> Merchant ID: [paste from Dashboard → Profile]
> Contact: [name, phone, email]
>
> We sell two digital reports: Pro at ₹51 and Ultra Pro at ₹351. We use the
> Cashfree Payment Gateway (Create Order + JS SDK) in production.
>
> Please help us with:
>
> 1. Enable WhatsApp delivery for Payment Links from Cashfree WABA
>    (`link_notify.send_whatsapp = true`).
> 2. Enable the abandoned-order WhatsApp recovery flow with a 30-minute delay.
>    No discount offer is required.
> 3. Confirm whether Payment Link auto-reminders can be set to Day 1 and Day 3
>    (maximum 3 reminders), and whether the 30-minute abandoned-order message
>    can be combined with them.
> 4. Please share the activation steps, template requirements, UAT process,
>    pricing, and any free trial available for a new/low-volume merchant.
>
> We are currently validating the flow and have not purchased the WhatsApp
> add-on yet. Please confirm what is included and what is chargeable before
> activation.
>
> Thank you.

After they reply, share the Merchant ID and complete KYC if asked. Test with a
₹1 payment link to your own WhatsApp before going live.

## Three-message sequence

| Timing | Purpose | Stop condition |
|---|---|---|
| 30 min after order created | First nudge + direct pay link + technical-help line | Paid or STOP |
| Day 1 | Reminder + pay link + help line | Paid or STOP |
| Day 3 | Final reminder + pay link + help line | Paid or STOP |

Keep the template transactional. Do not put discounts or upsells in the
reminder template; that can get it classified as Marketing and reduce delivery.

## Message copy (Hinglish)

Replace `{{1}}` name, `{{2}}` amount, `{{3}}` payment link, `{{4}}` report/PDF link.

**30 minutes**

> Namaste {{1}} ji 🙏
> Aapki Hast Rekha AI report ke liye ₹{{2}} ka payment adhoora reh gaya hai.
> Payment link: {{3}}
>
> Agar payment ke waqt kisi bhi technical problem (UPI fail, page stuck, amount cut but report not unlocked) ka saamna ho, isi message ka reply karein — hum turant madad karenge.
> Reminder band karne ke liye STOP likhein.

**Day 1**

> {{1}} ji, aapki report abhi bhi ready hai. Payment link: {{3}}
> Koi technical dikkat ho to isi message ka reply karein — hum help karenge.
> STOP likhkar reminders band kar sakte hain.

**Day 3**

> Aakhri reminder: aapki ₹{{2}} wali report ka payment pending hai.
> Payment link: {{3}}
> Technical problem? Isi message ka reply karein — hum turant help karenge.
> STOP likhkar reminders band kar sakte hain.

**Payment received**

> Payment received ✅
> {{1}} ji, aapki Pro report unlock ho gayi hai.
> PDF/report link: {{4}}
> Agar download ya payment me koi technical problem ho to isi message ka reply karein — hum madad karenge.

## PDF link first

For the first release, send a secure report link with a "Download PDF" button.
Actual PDF file attachment needs server-side PDF generation and comes later.
The link should be tokenised and expire (for example, 7 days), not expose a raw
reading ID.

## What is needed from the owner

1. Decide sender: Meta Cloud API (recommended for cost) or AiSensy trial.
2. If Meta Cloud API: create/confirm Meta Business account + dedicated WhatsApp
   number, then provide the phone-number ID and permanent token.
3. Approve the three templates above.
4. Confirm whether Cashfree WhatsApp add-on is free/trial; if not, skip it and
   use our own sender with standard Cashfree Payment Links.
5. Confirm the PDF-link page can be public-with-token for 7 days.

## Compliance notes

- Collect opt-in explicitly; do not pre-tick the box.
- Keep a consent timestamp.
- Honour STOP immediately.
- Cap reminders at 3 (do not send daily forever).
- Do not send promotional content in a utility reminder template.
- Update the privacy policy whenever the WhatsApp sender is connected.
