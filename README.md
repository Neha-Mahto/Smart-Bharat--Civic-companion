# Smart Bharat – AI-Powered Civic Companion

A GenAI-powered civic platform that helps citizens access government services, report public
issues, and get personalized assistance through an intelligent AI companion — built for the
Smart Bharat PromptWars challenge.

## Features

- **AI chat companion** — ask questions about government schemes, documents, and civic processes
  in plain language, powered by Groq's Llama 3.3 70B model.
- **Report public issues** — submit civic complaints (roads, water, electricity, sanitation),
  auto-categorized and summarized by AI.
- **Track complaints** — look up a complaint by ID and see its status progress.
- **Personalized scheme recommendations** — answer a few quick questions and get AI-matched
  government scheme suggestions, grounded in a curated real-scheme dataset (no hallucinated
  schemes).
- **Multilingual support** — toggle between English and Hindi across the UI and AI responses.

## Tech stack

- **Frontend/Backend**: Next.js 14 (App Router), React, Tailwind CSS
- **AI**: Groq API (OpenAI-compatible endpoint), Llama 3.3 70B Versatile
- **Storage**: Browser localStorage for complaints (no external DB required for this demo)

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
   ```
   Get a free key at [console.groq.com](https://console.groq.com).

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Mock mode (optional)

To build/test the UI without using API quota, set in `.env.local`:
```
MOCK_AI=true
```
This makes all AI routes return sample responses instantly.

## Deployment

Deploy to [Vercel](https://vercel.com) by importing this GitHub repository, then add
`GROQ_API_KEY` (and optionally `MOCK_AI`) as environment variables in the Vercel project
settings.

## Project structure

```
app/
  page.js              → Homepage
  ask-ai/page.js        → AI chat companion
  report/page.js         → Report an issue form
  track/page.js           → Track complaint status
  services/page.js         → Browse services + AI recommendations
  api/chat/route.js         → Groq-powered chat endpoint
  api/categorize/route.js     → Groq-powered complaint categorization
  api/recommend/route.js       → Groq-powered scheme recommendations
lib/
  groq.js               → Groq API helper with retry/backoff
  i18n.js                → Static UI translations (English/Hindi)
  LanguageContext.jsx      → React context for language state
  complaints.js             → localStorage complaint store
data/
  schemes.js             → Curated government scheme dataset
components/
  Navbar.jsx              → Shared navigation bar
```

## Notes on data

The government scheme details in `data/schemes.js` are illustrative and simplified for demo
purposes. Verify current eligibility, documents, and benefits on official government portals
before relying on this for real decisions.
