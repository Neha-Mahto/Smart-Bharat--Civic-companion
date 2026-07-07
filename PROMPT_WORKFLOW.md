# Prompt Workflow / Strategy — Smart Bharat

This document describes the GenAI integration approach and the prompting strategy used to build
and run this project.

## Why Groq + Llama 3.3 70B

We chose Groq's API (OpenAI-compatible endpoint, `llama-3.3-70b-versatile` model) as the core
GenAI provider because of its generous free-tier rate limits and very low latency, which matters
for a citizen-facing chat experience where response speed affects trust and usability.

## Where GenAI is used

| Feature | Prompting approach |
|---|---|
| AI chat companion (`/ask-ai`) | System prompt fixes the "Smart Bharat" persona — a civic assistant instructed to simplify complex government information, admit uncertainty rather than invent facts, and respond in the citizen's selected language. |
| Complaint categorization (`/report`) | The complaint description is sent with a strict JSON-only system prompt, constrained to a fixed category list, so the output is always parseable and mapped onto a known set of issue types. |
| Scheme recommendations (`/services`) | The citizen's profile (age range, income bracket, need category) is sent alongside the full curated scheme dataset as context, with an explicit instruction that the model must only recommend schemes present in that dataset — this prevents hallucinated scheme names or fabricated eligibility rules. |
| Multilingual support | A language instruction is appended to every AI system prompt (English or Hindi), so both static UI strings (translated ahead of time) and dynamic AI responses stay consistent in the selected language. |

## Reliability strategies

- **Retry with exponential backoff** on 429 (rate limit) responses from Groq, implemented in
  `lib/groq.js`.
- **Mock mode** (`MOCK_AI=true`) returns canned responses instead of calling the real API, so UI
  development and testing don't consume API quota.
- **Grounding**: for factual/structured tasks (categorization, recommendations), the model is
  restricted to a fixed vocabulary (category list, scheme dataset) rather than allowed to
  free-generate, reducing hallucination risk.

## Build process (high level)

1. Scaffolded the Next.js 14 App Router project with Tailwind CSS.
2. Built the homepage to match the challenge's reference design (chat card, banner, quick-access
   grid, feature strip).
3. Implemented the Groq API helper (`lib/groq.js`) with retry/backoff logic.
4. Built each core feature (chat, complaint reporting + tracking, service recommendations)
   incrementally, testing each in isolation before moving to the next.
5. Added multilingual support as a cross-cutting layer (React context + static translation
   dictionary + language-aware AI prompts).
6. Verified the full user flow end-to-end (ask a question → report an issue → track it → browse
   recommended schemes) before deployment.
7. Deployed to Vercel with environment variables configured in the hosting dashboard (API keys
   never committed to the repository).
