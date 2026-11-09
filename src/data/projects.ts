export interface Project {
  slug: string; title: string; kind: string; year: string; img: string; real: boolean;
  live: string; liveLabel: string; case?: string; repo: string; stack: string[]; summary: string; hard: string;
}
// Real project data, taken from the live site afolabi-peter.vercel.app.
export const projects: Project[] = [
  {
    "slug": "oja-ledger",
    "title": "Oja Ledger",
    "kind": "Fintech · Own product",
    "year": "2026",
    "img": "/img/oja.jpg",
    "real": true,
    "live": "https://oja-ledger.vercel.app",
    "repo": "https://github.com/peterafolabi-dev/oja-ledger",
    "stack": [
      "TypeScript",
      "React",
      "IndexedDB",
      "PWA",
      "fast-check"
    ],
    "summary": "Offline double-entry bookkeeping for Nigerian traders. Record a sale in two taps with no network, then get profit, VAT returns and the small-company tax check under the Nigeria Tax Act 2025.",
    "hard": "Every entry is sealed with a SHA-256 hash of the one before it, so editing any past naira is detectable. Money is whole kobo, never floats, and 800 random trading histories are tested on every push.",
    "liveLabel": "Live demo",
    "case": "https://github.com/peterafolabi-dev/oja-ledger/blob/main/docs/CASE_STUDY.md"
  },
  {
    "slug": "travel-stays",
    "title": "Travel & Stays",
    "kind": "Marketplace · MALhub internship",
    "year": "Aug – Oct 2026",
    "img": "/img/travel.jpg",
    "real": true,
    "live": "https://travel-stays.vercel.app",
    "repo": "https://github.com/peterafolabi-dev/travel-stays",
    "stack": [
      "React",
      "Supabase",
      "PostgreSQL",
      "Row-level security",
      "Paystack"
    ],
    "summary": "A two-sided marketplace for verified stays and local tours across Nigeria, with guests, hosts and tour guides, Paystack payments in naira, and an admin dashboard.",
    "hard": "Two guests can't book the same dates, even in the same second: a Postgres exclude using gist constraint makes the double booking impossible. A booking is only marked paid after the server confirms the exact amount and currency with Paystack, covered by 11 unit tests.",
    "liveLabel": "Live site",
    "case": "https://github.com/peterafolabi-dev/travel-stays/blob/master/docs/CASE_STUDY.md"
  },
  {
    "slug": "redcart",
    "title": "RedCart",
    "kind": "E-commerce · Own product",
    "year": "Dec 2025 – now",
    "img": "/img/redcart.jpg",
    "real": true,
    "live": "https://redcart-ten.vercel.app",
    "repo": "https://github.com/peterafolabi-dev/Retail-Logistics-Core",
    "stack": [
      "Django",
      "PostgreSQL",
      "Next.js",
      "TypeScript",
      "Groq LLM",
      "RAG"
    ],
    "summary": "An online store with 103 products, Google sign-in, Paystack checkout, review fraud scoring, an AI shopping assistant, and a second storefront in Next.js reading the store's API.",
    "hard": "The AI assistant isn't allowed to guess. Order status and stock come from the database, and policy answers come from real documents through a small retrieval layer. Payments are re-checked against the cart total on the server before an order exists. 94 tests run in CI.",
    "liveLabel": "Live site",
    "case": "https://github.com/peterafolabi-dev/Retail-Logistics-Core/blob/main/docs/CASE_STUDY.md"
  },
  {
    "slug": "studyflow",
    "title": "StudyFlow",
    "kind": "EdTech · For FUT Minna students",
    "year": "2026",
    "img": "/img/studyflow.jpg",
    "real": true,
    "live": "https://studyflow-xt1x.onrender.com",
    "repo": "https://github.com/peterafolabi-dev/studyflow",
    "stack": [
      "Django",
      "Python",
      "Tailwind",
      "KaTeX",
      "Groq"
    ],
    "summary": "A study platform with an AI coach that knows each student's courses and deadlines, a CGPA tracker, an attendance tracker for the 75% rule, spaced-repetition flashcards, CBT practice and study groups.",
    "hard": "Uploads are judged by their bytes, not their names: a renamed .exe is rejected by its magic bytes. AI output is sanitised before it touches the page, and AI features are rate-limited per user. 168 tests run in CI.",
    "liveLabel": "Live site",
    "case": ""
  },
  {
    "slug": "logitrack",
    "title": "LogiTrack",
    "kind": "Shipment tracking · Demo",
    "year": "2026",
    "img": "/img/logitrack.jpg",
    "real": true,
    "live": "https://logitrack-demo-kappa.vercel.app",
    "repo": "https://github.com/peterafolabi-dev/LogiTrack",
    "stack": [
      "Django",
      "Celery",
      "CSV import"
    ],
    "summary": "Shipment tracking for small delivery businesses: bulk CSV manifest import with row-level validation, a shipment timeline, and a customer tracking page. Runs as a free demo without Redis or S3.",
    "hard": "35 automated tests. Free demo login is shown on the live site.",
    "liveLabel": "Live demo",
    "case": ""
  },
  {
    "slug": "spendwise",
    "title": "SpendWise",
    "kind": "Personal finance · Naira",
    "year": "2026",
    "img": "/img/spendwise.jpg",
    "real": true,
    "live": "https://spendwise-topaz-nine.vercel.app",
    "repo": "https://github.com/peterafolabi-dev/Spendwise",
    "stack": [
      "Django",
      "WebAuthn",
      "Passkeys"
    ],
    "summary": "Track your naira budget, savings goals and monthly bills. Sign in with a passkey instead of a password.",
    "hard": "33 automated tests, decimal money maths and WebAuthn passkeys.",
    "liveLabel": "Live site",
    "case": ""
  }
];
