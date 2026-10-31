-- WhatsApp AI chat conversation history
CREATE TABLE IF NOT EXISTS whatsapp_chat_history (
  phone VARCHAR(15) PRIMARY KEY,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS whatsapp_chat_history_updated_idx
  ON whatsapp_chat_history (updated_at);