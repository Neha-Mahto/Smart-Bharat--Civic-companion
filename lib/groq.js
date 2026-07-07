// lib/groq.js
// Thin wrapper around Groq's OpenAI-compatible chat completions endpoint.
// Docs: https://console.groq.com/docs/quickstart

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/**
 * Call Groq's chat completions API.
 * @param {Array<{role: string, content: string}>} messages
 * @param {object} options - { model, temperature, max_tokens }
 * @returns {Promise<string>} the assistant's reply text
 */
export async function callGroq(messages, options = {}) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to your .env.local file."
    );
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.4,
    max_tokens = 800,
  } = options;

  const maxRetries = 3;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
        }),
      });

      if (response.status === 429) {
        // Rate limited — exponential backoff, then retry
        const waitMs = 1000 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, waitMs));
        lastError = new Error("Rate limited by Groq API (429)");
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? "";
    } catch (err) {
      lastError = err;
      if (attempt === maxRetries - 1) throw lastError;
    }
  }

  throw lastError;
}

export const SMART_BHARAT_SYSTEM_PROMPT = `You are Smart Bharat, an AI civic assistant for Indian citizens.
Your job is to explain government schemes, procedures, documents, and public services in simple, clear,
everyday language. Be concise and practical. If you are unsure of a specific real-world detail
(exact scheme rules, deadlines, fees), say so honestly rather than inventing it, and suggest the
citizen verify on the relevant official government portal. Always be respectful, patient, and
encouraging — many users may be unfamiliar with digital or bureaucratic processes.`;
