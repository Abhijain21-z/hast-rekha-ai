# AI Jyotishi chat — setup and operations

## Status

Configured on **24 October 2026** with Groq:

```text
AI_CHAT_BASE_URL=https://api.groq.com/openai/v1
AI_CHAT_MODEL=openai/gpt-oss-120b
AI_CHAT_MAX_TOKENS=900
AI_CHAT_REASONING_EFFORT=low
```

The key is server-side only. Chart-aware and generic chats both returned
Hindi/Hinglish answers; the chart-aware reply used the saved Rahu mahadasha,
Sun antardasha and Venus placement.

The API stays dormant without a key:

- no key → `503 { "error": "chat_not_configured" }`
- configured → `POST /api/chat` returns `{ "reply": "..." }`

No database migration is needed. Chat history is not persisted.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `AI_CHAT_API_KEY` | yes | Provider key. `OPENAI_API_KEY` is accepted as a fallback |
| `AI_CHAT_BASE_URL` | no | Default `https://api.openai.com/v1` |
| `AI_CHAT_MODEL` | no | Default `gpt-4o-mini` |
| `AI_CHAT_MAX_TOKENS` | no | Default `500`, hard max `1000` |
| `AI_CHAT_REASONING_EFFORT` | no | `low`, `medium` or `high` for reasoning models. Groq `gpt-oss-120b` should use `low`, otherwise the model can spend the whole budget thinking and return an empty answer |

Provider examples:

```text
OpenAI:     AI_CHAT_BASE_URL=https://api.openai.com/v1
OpenRouter: AI_CHAT_BASE_URL=https://openrouter.ai/api/v1
Groq:       AI_CHAT_BASE_URL=https://api.groq.com/openai/v1
Ollama:     AI_CHAT_BASE_URL=http://localhost:11434/v1
```

The key stays server-side. It is never sent to the browser.

## What is sent to the provider

The route builds the chart summary on the server from the saved reading:

- Moon sign (Chandra Rashi)
- Nakshatra and pada
- Ascendant (Lagna)
- Vedic Sun sign
- Tithi and paksha
- Yoga
- Moon degree in sign
- Current Vimshottari mahadasha, antardasha and pratyantardasha
- The six strongest yogas
- The three strongest grahas with dignity and house
- Saturn and Jupiter transits from the Moon, and Sade Sati
- Mulank, bhagyank and namank

It does **not** send the visitor's name, birth date, birth time, birth place,
phone number, payment data or palm photo. The browser sends only:

```json
{
  "readingId": "optional UUID",
  "messages": [{ "role": "user", "content": "..." }]
}
```

The API validates and trims messages, keeps the last 12, caps each at 1,000
characters, and requires the final message to be from the user.

## Safety and privacy

- The system prompt forbids death/terminal-illness/pregnancy predictions,
  guaranteed outcomes, medical/legal/financial advice and fear-based upselling.
- The reply is capped at 4,000 characters on the way out.
- Rate limit: 20 requests per 10 minutes per IP (best-effort, in-memory).
- Privacy policy and disclaimer text live in `src/content/legal.json`.
- The UI shows a privacy note and a “not professional advice” disclaimer.

## Files

- `src/lib/ai-chat.ts` — sanitizer, chart context, system prompt, provider config.
- `src/app/api/chat/route.ts` — validation, rate limit, provider call.
- `src/components/chat/AstrologyChat.tsx` — chat UI.
- `src/app/(site)/chat/page.tsx` — `/chat` page with `?reading=<id>` support.
- `src/lib/__tests__/ai-chat.test.ts` — unit tests for the pure helpers.

## Manual checks

```powershell
# Without a key: must return 503 and no provider call
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/chat `
  -ContentType "application/json" `
  -Body '{"messages":[{"role":"user","content":"Mera career kaisa rahega?"}]}'

# With a key: open /chat and ask a question
# From a report: click "Open AI chat" and confirm the chart context is attached
```

If the owner changes providers, only the `AI_CHAT_*` env vars are needed; the
route uses the OpenAI-compatible `/chat/completions` shape. For a reasoning
model, set `AI_CHAT_REASONING_EFFORT=low` and keep `AI_CHAT_MAX_TOKENS` near the
1000-token cap.
