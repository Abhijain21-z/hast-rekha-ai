import { pool } from "@/db";
import { getChatConfig } from "@/lib/ai-chat";
import { sendTextMessage } from "@/lib/whatsapp";
import { isStopMessage, toIndiaTenDigits } from "@/lib/whatsapp";
import { buildReportLink, fixLinks, wantsReportLink } from "@/lib/whatsapp-links";

const MAX_HISTORY = 8;

interface ChatMsg { role: "user" | "assistant"; content: string }

async function getHistory(phone: string): Promise<ChatMsg[]> {
  try {
    const r = await pool.query<{ messages: ChatMsg[] }>(
      "SELECT messages FROM whatsapp_chat_history WHERE phone = $1",
      [phone],
    );
    return Array.isArray(r.rows[0]?.messages) ? r.rows[0].messages : [];
  } catch {
    return [];
  }
}

async function saveHistory(phone: string, messages: ChatMsg[]): Promise<void> {
  const trimmed = messages.slice(-MAX_HISTORY * 2);
  try {
    await pool.query(
      `INSERT INTO whatsapp_chat_history (phone, messages, updated_at)
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT (phone) DO UPDATE SET messages = $2::jsonb, updated_at = now()`,
      [phone, JSON.stringify(trimmed)],
    );
  } catch (e) {
    console.error("[whatsapp-chat] save failed:", e);
  }
}

async function getUserContext(
  phone: string,
): Promise<{ context: string; readingId: string | null }> {
  try {
    const r = await pool.query<{
      id: string;
      name: string | null;
      rashi: string | null;
      hasPro: boolean;
    }>(
      `SELECT r.id,
              r.full_name as name,
              r.result->>'moonRashi' as rashi,
              (r.premium = true OR r.ultra = true OR EXISTS (SELECT 1 FROM payments p WHERE p.status='paid' AND right(regexp_replace(coalesce(p.customer_phone,''),'[^0-9]','','g'),10) = $1)) as "hasPro"
       FROM readings r
       WHERE right(regexp_replace(coalesce(r.whatsapp_phone,''),'[^0-9]','','g'),10) = $1
       ORDER BY r.created_at DESC LIMIT 1`,
      [phone],
    );
    const row = r.rows[0];
    if (!row) {
      return {
        context: "No reading found for this number. The user has not filled the reading form yet.",
        readingId: null,
      };
    }
    return {
      context: `Name: ${row.name || "unknown"}. Moon Rashi: ${row.rashi || "unknown"}. Has Pro: ${row.hasPro ? "Yes" : "No"}.`,
      readingId: row.id,
    };
  } catch {
    return { context: "Could not fetch user context.", readingId: null };
  }
}

export async function handleWhatsAppChat(from: string, text: string): Promise<void> {
  const phone = toIndiaTenDigits(from);
  if (!phone) return;

  // STOP handling
  if (isStopMessage(text)) {
    await pool.query(
      `UPDATE readings SET marketing_opt_in = false, updated_at = now()
       WHERE right(regexp_replace(coalesce(whatsapp_phone,''),'[^0-9]','','g'),10) = $1`,
      [phone],
    ).catch(() => {});
    await sendTextMessage(phone, "Aapko marketing messages band kar diye gaye hain. Dobara shuru karne ke liye 'START' type karein. 🙏").catch(() => {});
    return;
  }

  const config = getChatConfig();
  if (!config.configured) {
    await sendTextMessage(phone, "Namaste! 🙏 HastrekhaAI yahan hai. Aapka sawal suna. Hum jald hi reply karenge.").catch(() => {});
    return;
  }

  const history = await getHistory(phone);
  const { context, readingId } = await getUserContext(phone);

  // The report page is the only place where the Pro payment can actually
  // happen, so the bot always hands out this exact URL (never an invented one).
  const reportLink = buildReportLink(readingId);

  const systemPrompt = `You are "Hast Rekha AI" — a warm, caring Vedic astrology friend chatting on WhatsApp. You're talking to someone who got a free reading and saw the Pro plan offer. Your REAL goal: make them feel understood and gently guide them to buy the Pro plan (Rs 51 for 5 years of predictions). Sales should feel like a friend's advice, never pushy.

User context: ${context}
The user's own report link: ${reportLink}

How to reply (follow strictly):
- Sound like a real human — warm, emotional, caring. Use "aap", "tum", "bhai", "didi" naturally. Small emojis (🙏✨) sparingly.
- VERY SHORT: 2-3 lines max, under 50 words. WhatsApp style. No long paragraphs ever.
- Listen to EXACTLY what they said and reply to that. Don't repeat generic lines.
- Empathise first ("samajh sakti hoon", "bilkul valid") then one gentle point.
- If price doubt: "Sirf Rs 51 mein 5 saal ki predictions — ek chai se bhi sasta. Is Diwali, Diwali Puja PDF bhi free mil rahi hai."
- Diwali hook (use when natural, once): "Rs 51 ke Pro me sampurn Diwali Puja PDF bhi free hai — vidhi, samagri, mantra, aarti."
- If trust doubt: "Aapka naam aur chart safe hai, hum data share nahi karte."
- If not interested: respect, "koi baat nahi", leave door open, offer free general help.
- Ask only ONE question at a time to keep flow.
- Match their language (Hindi/Hinglish/English).
- Never ask for payment info or personal details.
- LINK RULE (most important): the ONLY link you may ever send is this exact URL: ${reportLink}
  Never invent, shorten, change or add any other link. When the user shares their details (name, birth date/time/place), or asks for the reading, the report, the Pro plan, payment or "link", reply in 1-2 short lines and then put this exact URL on its own line.`;

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: text },
  ];

  try {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: Math.min(config.maxOutputTokens, 500),
        temperature: 0.8,
        ...(config.reasoningEffort ? { reasoning_effort: config.reasoningEffort } : {}),
      }),
      signal: AbortSignal.timeout(25_000),
    });

    const json = (await res.json().catch(() => null)) as
      | { choices?: { message?: { content?: string; reasoning?: string; reasoning_content?: string } }[]; error?: { message?: string } }
      | null;
    const msg = json?.choices?.[0]?.message;
    const rawContent = msg?.content?.trim() || msg?.reasoning?.trim() || msg?.reasoning_content?.trim() || "";
    if (!res.ok) {
      console.error("[whatsapp-chat] LLM http error:", res.status, json?.error?.message?.slice(0, 300));
      throw new Error(json?.error?.message || `LLM ${res.status}`);
    }
    if (!rawContent) {
      console.error("[whatsapp-chat] LLM empty reply. raw:", JSON.stringify(json).slice(0, 800));
      throw new Error("LLM empty reply");
    }

    let reply = fixLinks(rawContent.slice(0, 1000), reportLink);

    // The owner wants the real form/report link after the user shares details
    // or asks about Pro/payment — append it deterministically so the LLM can
    // never leave the user without a working link.
    if (wantsReportLink(text) && !reply.includes(reportLink)) {
      reply = `${reply}\n\n👉 Apni report yahan kholein / Pro lein: ${reportLink}`;
    }

    // Save history
    const updated = [...history, { role: "user" as const, content: text }, { role: "assistant" as const, content: reply }];
    await saveHistory(phone, updated);

    // Send reply
    await sendTextMessage(phone, reply);
  } catch (error) {
    console.error("[whatsapp-chat] LLM failed:", error);
    await sendTextMessage(
      phone,
      `Namaste! 🙏 Thoda technical issue hai. Kripya thodi der baad try karein. Aapki report yahan hai: ${reportLink}`,
    ).catch(() => {});
  }
}
