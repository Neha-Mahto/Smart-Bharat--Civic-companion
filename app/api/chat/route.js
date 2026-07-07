import { NextResponse } from "next/server";
import { callGroq, SMART_BHARAT_SYSTEM_PROMPT } from "@/lib/groq";

const MOCK_REPLIES = [
  "This is a sample AI response (mock mode is on). To get real answers, set GROQ_API_KEY in your .env.local and set MOCK_AI=false.",
];

export async function POST(req) {
  try {
    const { message, history = [], lang = "en" } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing 'message' in request body." },
        { status: 400 }
      );
    }

    if (process.env.MOCK_AI === "true") {
      return NextResponse.json({
        reply: `${MOCK_REPLIES[0]}\n\n(You asked: "${message}")`,
      });
    }

    const languageInstruction =
      lang === "hi"
        ? "Respond in Hindi (Devanagari script), unless the user's question is in English."
        : "Respond in clear, simple English.";

    const messages = [
      {
        role: "system",
        content: `${SMART_BHARAT_SYSTEM_PROMPT}\n\n${languageInstruction}`,
      },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
    ];

    const reply = await callGroq(messages);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err.message || "Something went wrong contacting the AI." },
      { status: 500 }
    );
  }
}
