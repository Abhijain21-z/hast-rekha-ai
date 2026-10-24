# Referral tokens and Ultra Pro redemption

## The programme

- A signed-in reader shares a personal referral link or 8-character code.
- When someone opens that link and **creates an account**, the referrer earns
  **50 tokens**.
- Opening the link, creating a free reading without an account, or registering
  without the code earns nothing.
- **350 tokens** unlock one **Ultra Pro (₹351)** report.
- Tokens are **never** accepted for the **₹51 Pro** report. Pro is always paid in
  real money at checkout.
- Tokens have no cash value and are not transferable or refundable.

The referred person does not receive tokens. The reward belongs to the referrer
only, and only once per new account.

## Why the reward is credited on account creation

The requirement is deliberately narrow: a click is not a referral. Credit happens
inside registration, after the new user row exists, so a visitor cannot farm
tokens by repeatedly opening their own link. Self-referral (same user or same
email) is rejected, and duplicate referred accounts are blocked by a unique index.

## Data model

Migration: `db/migrations/2026-10-24_add_referrals_tokens.sql`

| Table / column | Purpose |
| --- | --- |
| `users.referral_code` | Unique 8-character code, allocated lazily for older accounts |
| `users.token_balance` | Spendable balance, updated in the same transaction as the ledger |
| `referrals` | One row per successful referral, unique on `referred_user_id` |
| `token_ledger` | Append-only history: `referral_signup`, `ultra_redemption`, `admin_adjustment` |
| `token_ledger.acknowledged_at` | Null until the gift popup has been shown and dismissed |

A partial unique index on `token_ledger (reading_id) WHERE reason = 'ultra_redemption'`
prevents a second 350-token charge for the same reading. Both credit and
redemption run in a transaction with `SELECT … FOR UPDATE` on the user row.

## Flow

1. `ReferralCapture` reads `?ref=` or `?referral=` and stores it in the
   `hr_ref` cookie for 60 days.
2. `/register` prefills the code and sends `referralCode` to `POST /api/auth/register`.
3. Registration creates the user, allocates the new user's own code, and calls
   `creditReferral`. Errors never block registration; an invalid code is ignored.
4. The referrer's balance increases by 50 and a `referral_signup` ledger row is
   written with `acknowledged_at = null`.
5. On the referrer's next dashboard visit, `TokenRewardPopup` fetches the oldest
   unseen reward and shows the gift/sparkles modal. Dismissing it calls
   `POST /api/tokens/rewards/ack`, so it does not appear again.
6. `ReferralCard` on the dashboard shows the balance, progress to 350, the
   referral link, the referral count and the ledger.
7. `POST /api/tokens/redeem-ultra` spends 350 tokens and sets `premium` + `ultra`
   on the chosen reading. Already-Ultra readings are a no-op, never a second
   charge.

## API surface

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/tokens` | Balance and the 20 most recent ledger rows |
| `GET` | `/api/tokens/rewards/pending` | Oldest unseen referral reward for the popup |
| `POST` | `/api/tokens/rewards/ack` | Mark one reward popup as seen |
| `POST` | `/api/tokens/redeem-ultra` | Spend 350 tokens on one owned reading |

All routes require a signed-in user and return `401` otherwise.

## Copy rules

- Say “50 tokens after your friend creates an account”, not “50 tokens per click”.
- Say “350 tokens = one Ultra Pro report (₹351)”.
- Always add that the ₹51 Pro report is cash-only and cannot be bought with
  tokens.
- Never promise cash value, transferability or expiry that the code does not
  implement.

The legal wording lives in `src/content/legal.json` under **Terms → Referral
Tokens and Ultra Pro Redemption**, with a matching note in the refund policy.

## Manual checks

1. Register a new account with a valid `?ref=CODE` link; the referrer's balance
   should rise by 50, and the referral count by one.
2. Register with the same code from the same email, or while signed in as the
   referrer; no tokens should be credited.
3. Open the referrer dashboard in a fresh session; the sparkles popup should show
   once and stay dismissed after a reload.
4. With fewer than 350 tokens, `POST /api/tokens/redeem-ultra` returns
   `insufficient_tokens` and the balance is unchanged.
5. With 350 tokens, redeem on a free reading; `premium` and `ultra` become true,
   the balance drops by exactly 350, and a second attempt does not charge again.
6. Confirm the ₹51 Pro checkout never offers a token option.
