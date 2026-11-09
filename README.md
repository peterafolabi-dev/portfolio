# Afolabi Peter: portfolio

Live: **https://portfolio-one-kappa-p2gg1ejjj4.vercel.app**

My portfolio as a junior full-stack engineer: six real projects, each with a case study covering the problem, my decisions and what I got wrong. No invented clients or metrics.

## What's on it

- A scroll-scrubbed hero: 190 video frames drawn to a canvas by scroll position, with lighter frame sets for phones and slow connections.
- Case studies for Oja Ledger, Travel & Stays, RedCart, StudyFlow, LogiTrack and SpendWise.
- "Ask about Peter", a chat that answers only questions about me, backed by a Vercel serverless function calling Groq (`api/chat.js`). Without a key it falls back to scripted answers.
- A live Lagos clock, count-up numbers, a section rail and a scroll progress bar.

## Stack

Astro 7 (static pages) · React 19 islands · Tailwind CSS 4 · TypeScript · Vercel.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

Chat in production needs one environment variable, `GROQ_API_KEY`, set in the Vercel project.

## Where things live

| Path | What |
|---|---|
| `src/data/projects.ts`, `cases.ts` | Project cards and case-study content |
| `src/components/SeqBackground.tsx` | Scroll-scrubbed hero canvas |
| `api/chat.js`, `api/_facts.json` | Chat endpoint and the facts it may use |
| `scripts/gen-facts.mjs` | Regenerates `_facts.json` from the data files |

## Contact

afolabiprosper329@gmail.com · [LinkedIn](https://www.linkedin.com/in/afolabipeter-dev) · [GitHub](https://github.com/peterafolabi-dev)
