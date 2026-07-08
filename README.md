# Smart Bharat – AI-Powered Civic Companion

A GenAI-powered civic platform that helps citizens access government services, report public
issues, and receive personalized assistance through an intelligent, multilingual AI companion.

## Features

1. **AI Chat Companion** — ask questions about government schemes, documents, and civic
   processes in plain language, powered by Groq's Llama 3.3 70B model.
2. **Smart Complaint Reporting** — submit civic issues (roads, water, electricity, sanitation)
   through a simple form.
3. **AI Auto-Categorization** — complaints are automatically classified and summarized by AI.
4. **Real-Time Complaint Tracking** — look up a complaint by ID and see its status progress.
5. **Government Scheme Directory** — browse a curated list of key Indian government schemes.
6. **Personalized Scheme Recommendations** — AI-matched suggestions based on a citizen's
   profile, grounded strictly in the verified scheme dataset (no hallucinated schemes).
7. **Multilingual Support** — full UI and AI responses in English and Hindi.
8. **Guided Quick-Ask Suggestions** — one-tap sample questions to help first-time users start
   immediately.

## Tech stack

- **Frontend/Backend**: Next.js 14 (App Router), React, Tailwind CSS
- **AI**: Groq API (OpenAI-compatible endpoint), Llama 3.3 70B Versatile
- **Storage**: Browser localStorage for complaints (no external DB required for this build)
- **Testing**: Jest + React Testing Library
- **Built with**: Google Antigravity

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment example and add your Groq API key:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   MOCK_AI=false
   ```
   Get a free key at [console.groq.com](https://console.groq.com).

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Running tests

```bash
npm test
```

## Mock mode (optional, for UI development without using API quota)

Set in `.env.local`:
```
MOCK_AI=true
```
This makes AI routes return sample responses instantly instead of calling the real API.

## Deployment

Deploy to [Vercel](https://vercel.com) by importing this GitHub repository, then add
`GROQ_API_KEY` and `MOCK_AI` as environment variables in the Vercel project settings
(Production environment). Redeploy after adding/changing environment variables.

## Project structure

```
app/
  page.js                    → Homepage
  ask-ai/page.js              → AI chat companion
  report/page.js               → Report an issue form
  track/page.js                 → Track complaint status
  services/page.js               → Browse services + AI recommendations
  api/chat/route.js               → Groq-powered chat endpoint
  api/categorize/route.js          → Groq-powered complaint categorization
  api/recommend/route.js            → Groq-powered scheme recommendations
  __tests__/                         → Jest test suite
lib/
  groq.js                     → Groq API helper with retry/backoff
  i18n.js                       → Static UI translations (English/Hindi)
  LanguageContext.jsx             → React context for language state
  complaints.js                     → localStorage complaint store
data/
  schemes.js                    → Curated government scheme dataset
components/
  Navbar.jsx                      → Shared navigation bar
  Icons.jsx                         → Inline SVG icon set
```

## Notes on data

The government scheme details in `data/schemes.js` are illustrative and simplified for demo
purposes. Verify current eligibility, documents, and benefits on official government portals
before relying on this for real decisions.

## Live demo

👉 **[View the Live Website Here](https://smart-bharat-civic-companion-zmky-megaravens.vercel.app?_vercel_share=e3JL68BI63buKJfakMnT5soCDDYMOFic)**
