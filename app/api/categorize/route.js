import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

const CATEGORIES = [
  "roads",
  "water",
  "electricity",
  "sanitation",
  "other",
];

export async function POST(req) {
  try {
    const { description } = await req.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Missing 'description' in request body." },
        { status: 400 }
      );
    }

    if (process.env.MOCK_AI === "true") {
      return NextResponse.json({
        category: "other",
        summary: description.slice(0, 80),
      });
    }

    const messages = [
      {
        role: "system",
        content: `You classify civic complaint descriptions. Respond ONLY with valid JSON,
no markdown, no preamble, in this exact shape:
{"category": one of ${JSON.stringify(CATEGORIES)}, "summary": "a one-line summary under 15 words"}`,
      },
      { role: "user", content: description },
    ];

    const raw = await callGroq(messages, { temperature: 0.1, max_tokens: 150 });
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { category: "other", summary: description.slice(0, 80) };
    }

    if (!CATEGORIES.includes(parsed.category)) {
      parsed.category = "other";
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Categorize API error:", err);
    return NextResponse.json(
      { error: err.message || "Could not categorize the complaint." },
      { status: 500 }
    );
  }
}
