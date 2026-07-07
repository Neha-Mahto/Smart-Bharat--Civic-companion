import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import schemes from "@/data/schemes";

export async function POST(req) {
  try {
    const { ageRange, incomeBracket, needCategory, lang = "en" } =
      await req.json();

    if (process.env.MOCK_AI === "true") {
      const sample = schemes.slice(0, 3).map((s) => ({
        id: s.id,
        name: s.name,
        reason: "Sample recommendation (mock mode is on).",
      }));
      return NextResponse.json({ recommendations: sample });
    }

    const languageInstruction =
      lang === "hi"
        ? "Respond in Hindi (Devanagari script)."
        : "Respond in clear, simple English.";

    const messages = [
      {
        role: "system",
        content: `You are a government scheme recommender for Indian citizens. You will be given a
JSON array of available schemes, and a citizen's profile. Select the 2-3 MOST relevant schemes
strictly from the provided list — never invent a scheme that isn't in the list. Respond ONLY with
valid JSON, no markdown, in this exact shape:
{"recommendations": [{"id": "scheme-id-from-list", "name": "scheme name", "reason": "one sentence in plain language explaining why this fits, and which documents to prepare"}]}

${languageInstruction}

Available schemes:
${JSON.stringify(schemes.map(({ id, name, description, eligibility, requiredDocuments }) => ({ id, name, description, eligibility, requiredDocuments })))}`,
      },
      {
        role: "user",
        content: `Citizen profile — age range: ${ageRange || "not specified"}, income bracket: ${
          incomeBracket || "not specified"
        }, need category: ${needCategory || "not specified"}.`,
      },
    ];

    const raw = await callGroq(messages, { temperature: 0.3, max_tokens: 500 });
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { recommendations: [] };
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Recommend API error:", err);
    return NextResponse.json(
      { error: err.message || "Could not generate recommendations." },
      { status: 500 }
    );
  }
}
