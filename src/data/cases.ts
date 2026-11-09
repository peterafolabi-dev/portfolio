// Long-form case-study content, condensed from each repo's docs/CASE_STUDY.md (real, not invented).
export interface Case {
  problem: string;
  role: string;
  decisions: { t: string; d: string }[];
  results: string[];
  next: string[];
  shots?: { src: string; alt: string; mobile?: boolean }[];
  ci?: { badge: string; url: string };
  wrong: string[];
  /** Optional walkthrough video: put the file in public/video/ and set src (and optional poster). Renders nothing until set. */
  video?: { src: string; poster?: string };
}

export const cases: Record<string, Case> = {
  'oja-ledger': {
    problem:
      'A provisions seller in a Nigerian market may take 40 payments a day across cash, transfer and POS, sell on credit and restock weekly. At month end she can say roughly what came in, but not her profit, her VAT, or whether she qualifies for the 0% small-company tax rate. Existing tools assume reliable internet, a laptop and an accountant’s vocabulary. The goal: books that are correct by construction, kept on a phone, usable with no network, in plain language.',
    role: 'Solo project: product, design, accounting engine, tests and deployment.',
    decisions: [
      { t: 'Real double-entry, hidden from the user', d: 'Every tap becomes a balanced journal entry over a small chart of accounts, so credit sales, VAT and owner drawings all work and a balance sheet is possible. The UI never says “debit”; an accountant can export everything as CSV.' },
      { t: 'Whole kobo, never floats', d: 'Every amount is an integer number of kobo behind a branded Kobo type, so TypeScript blocks a stray float. VAT is stored in basis points and split so net + VAT always equals the gross price.' },
      { t: 'Prove the rules with property-based tests', d: 'On every push, CI builds 200 random trading histories and asserts the trial balance balances, assets equal liabilities plus equity, reversals restore every account, and six kinds of tampering are caught.' },
      { t: 'Make tampering visible with a hash chain', d: 'Each entry stores a SHA-256 hash that includes the previous entry’s hash. Changing one naira in an old entry breaks every later link, and the app re-verifies the chain on open.' },
      { t: 'Append-only, with reversals', d: 'No edit and no delete. A mistake is fixed by a linked mirror-image entry and the original stays visible, crossed out, the way real accounting systems work.' },
      { t: 'Offline-first and atomic', d: 'The book lives in IndexedDB. Each save writes the entries and the new chain head in one transaction, and a service worker lets the app open with no network.' },
    ],
    results: [
      '29 automated tests in CI, including 4 ledger invariants each checked against 200 generated trading histories on every push',
      'Strict TypeScript (strict, noUncheckedIndexedAccess) with no any',
      'Zero runtime dependencies beyond React; about 68 kB of JavaScript after gzip',
    ],
    next: ['Sync across devices using the existing hash-linked log', 'Encrypted cloud backup with a PIN-derived key', 'Inventory by item so cost of goods sold is calculated', 'Review of the tax logic by a Nigerian chartered accountant'],
    video: { src: '/video/oja-ledger-tour.mp4', poster: '/img/oja-tour-poster.jpg' },
    ci: { badge: 'https://github.com/peterafolabi-dev/oja-ledger/actions/workflows/ci.yml/badge.svg', url: 'https://github.com/peterafolabi-dev/oja-ledger/actions/workflows/ci.yml' },
    wrong: [
      'My own test had a bug. The first property-test run found a signed-zero (−0) bug in my reversal test. Hand-written example tests would never have hit it.',
      'Tamper-evident is not tamper-proof. Someone with the device could recompute the whole chain. The fingerprint only protects the owner if it is written down somewhere else, which is exactly what the demo above shows.',
      'I assumed two tabs could fork the chain. They cannot, because entry numbers are unique keys and the second save is rejected whole. I only proved that with a test later, and added a clear message plus cross-tab reload.',
      'Browsers can silently clear site storage. The app now asks for persistent storage and tells the owner whether it was granted, but a CSV export is still the real backup.',
      'No sync yet. One device is the source of truth, so losing the phone without an export loses the book.',
    ],
    shots: [
      { src: '/img/oja-today.jpg', alt: 'Oja Ledger Today screen with sales, profit and VAT' },
      { src: '/img/oja-journal.jpg', alt: 'Oja Ledger journal with sealed entries' },
      { src: '/img/oja-reports.jpg', alt: 'Oja Ledger reports and tax check' },
      { src: '/img/oja-sealed.jpg', alt: 'Oja Ledger hash-chain fingerprint' },
      { src: '/img/oja-record-mobile.jpg', alt: 'Recording a sale on a phone', mobile: true },
    ],
  },
  'travel-stays': {
    problem:
      'Travellers in Nigeria book short stays mostly through WhatsApp and Instagram: they send money to a stranger and hope the apartment exists. Hosts can’t easily prove they are legitimate, take payment in naira, or stop two people booking the same weekend. The brief was a marketplace for travellers, hosts and tour guides where money, dates and identity can be trusted.',
    role: 'Built during my MALhub industrial training (Aug to Oct 2026): React front end, Supabase back end, payments, and CI.',
    decisions: [
      { t: 'Two guests, same weekend, same second', d: 'A “is the date free?” check followed by an insert has a race. I moved the guarantee into Postgres with an exclusion constraint on listing and date range, so a double booking is impossible, not merely unlikely.' },
      { t: '“The popup said success” is not proof', d: 'The Paystack popup runs in the browser, so anyone can fake it. A server-side Edge Function asks Paystack directly and only accepts the payment when the status, the exact amount to the kobo and the NGN currency all match.' },
      { t: 'Prices come from the server', d: 'create_booking reads the nightly price and cleaning fee from the listing and computes nights, fee and total in SQL, then the charge uses exactly that total. A guest can change what they see, not what they pay.' },
      { t: 'Users can only touch their own rows', d: 'Every table has row-level security and writes go through security-definer functions that check the signed-in user, so the rules hold even if someone calls the API directly.' },
      { t: 'Trust before visibility', d: 'ID documents sit in a private bucket only admins can read. A host’s listings show Verified only after admin approval, and any listing can be reported and paused immediately.' },
    ],
    results: [
      'Live on Vercel with demo data for stays in all 36 states and the FCT, plus tours',
      'The payment decision is a pure function covered by 11 unit tests, including underpaying by one kobo and the wrong currency',
      'CI on every push: lint, production build, the payment tests, and a database job that builds a fresh Postgres 16 from the real migrations and checks overlap, a same-instant race (8 sessions, exactly one winner), row-level security and hold expiry',
      'Payments run in Paystack test mode; shipped with code reviews from the MALhub engineering team',
    ],
    next: ['Hold host payouts until check-in with Paystack split payments', 'Run the database tests against the Supabase CLI’s local stack (real auth and storage) instead of my small stand-ins', 'Row-level-security tests for the tours tables as well as stays'],
    ci: { badge: 'https://github.com/peterafolabi-dev/travel-stays/actions/workflows/ci.yml/badge.svg', url: 'https://github.com/peterafolabi-dev/travel-stays/actions/workflows/ci.yml' },
    wrong: [
      'The headline claim had no test. “The database refuses double bookings” was only true by reading the SQL. There is now a CI job that builds Postgres from the real migrations and proves it, including a same-instant race.',
      'Unpaid holds never expired. Each traveller was capped at 3 unpaid holds, but a hold lasted forever. Migration 019 releases unpaid stays after 72 hours and never touches paid ones or one being paid right now.',
      'If a guest closes the tab right after paying, only the browser call confirmed the payment. I wrote a signature-checked Paystack webhook as a second path.',
      'Two of those fixes (hold expiry and the webhook) are in the repo and tested, but not yet switched on for the live demo project. They need the migration run and the function deployed.',
      'Host payouts are not held until check-in, and refunds are recorded for an admin to process by hand. Paystack is in test mode.',
    ],
  },
  redcart: {
    problem:
      'Small electronics sellers in Nigeria run their shops over WhatsApp: prices change in chats, orders get lost, and a customer has to trust a screenshot of a transfer. RedCart gives them a real storefront and order flow, with Paystack for payment and an assistant that answers from the actual catalogue.',
    role: 'Solo project: Django REST backend, two frontends, payment flow, tests and deployment.',
    decisions: [
      { t: 'Never trust the browser about payments', d: 'After Paystack redirects back, the server calls Paystack’s verify endpoint itself and compares the amount and reference with the order before marking anything paid. A customer cannot mark an order paid by editing a request.' },
      { t: 'No double credit', d: 'Referral rewards are paid into wallets inside a database transaction with select_for_update, so two requests at the same moment cannot pay the same reward twice.' },
      { t: 'An assistant that does not lie', d: 'Order status, stock and prices come from the database, not the model. Policy answers are retrieved from real policy documents, the bot must never claim to have added something to the cart or invent a discount, and a script re-runs guardrail and retrieval checks after changes.' },
      { t: 'Two frontends, one source of truth', d: 'A Next.js and TypeScript storefront reads the same catalogue through the Django API, so prices and stock cannot drift between the two.' },
      { t: 'Fake reviews without punishing real customers', d: 'Each review gets a fraud score from signals like near-duplicate text, a burst on one product, brand-new accounts and generic text with an extreme rating. Only high-confidence fraud is hidden; borderline reviews stay public and are flagged for staff.' },
    ],
    results: [
      '98 Django tests pass in CI, including new tests for payment verification (wrong amount, replayed reference, failed payment)',
      'Moved from Render to Vercel with a Neon Postgres database',
      'Payments run in Paystack test mode only; no real money moves',
    ],
    next: ['Paystack webhooks, so a payment still lands if the customer closes the tab', 'Move the payment checks into a service function with its own unit tests', 'Embeddings for product search instead of keyword matching'],
    wrong: [
      'The amount-mismatch branch of my payment check had no test. I found that while writing this page and added tests for it, then checked they fail when the check is removed.',
      'Amounts are float naira rounded to two places. That is fine for a demo and wrong for a ledger; Oja Ledger uses whole kobo for exactly this reason.',
      'The payment logic lives inside a view. That made it harder to test than it should have been.',
    ],
  },
  studyflow: {
    problem:
      'Students juggle courses, deadlines and revision with a mix of notes apps and calendars, and nothing tells them what to study next. StudyFlow puts courses, tasks and study sessions in one place and adds an AI study coach.',
    role: 'Solo project: Django backend, templates and JavaScript, AI integration, tests and deployment.',
    decisions: [
      { t: 'The coach works from the student’s own data', d: 'The AI coach is given the student’s real courses and tasks, so its suggestions refer to things that exist rather than generic advice.' },
      { t: 'Say when the AI is not configured', d: 'If no AI key is set, the app says so instead of returning a made-up reply.' },
      { t: 'Everything is scoped to the signed-in user', d: 'Every query filters by the current user, and the tests check one student cannot read another’s records.' },
    ],
    results: [
      'A large Django test suite. The README says 168 tests and my CV says 128; I have not reconciled them, so treat both as approximate',
      'Free-tier hosting: the first request after idle takes about 30 seconds while the server wakes up',
    ],
    next: ['Reconcile the test count between README and CV', 'Reminders by email', 'Better handling of the cold start'],
    wrong: [
      'The test count is written differently in two places. Small, but it is the kind of inconsistency that costs trust, so it is on my list.',
      'The free-tier cold start makes the first impression slow. A cheap warm-up would help.',
    ],
  },
  logitrack: {
    problem:
      'Small delivery businesses track parcels in spreadsheets and chat. LogiTrack gives each business its own workspace for shipments, status changes, bulk imports, delivery proof and a public tracking page.',
    role: 'Solo project: Django app, background jobs, import pipeline, tests and deployment.',
    decisions: [
      { t: 'Strict tenant isolation', d: 'Each business only sees its own shipments, exports and import results. There are tests for the multi-tenant case and for the import detail page.' },
      { t: 'Status changes are validated on the server', d: 'A shipment can only move along allowed transitions, and a terminal status cannot change again. The same rule applies in the form and on the server.' },
      { t: 'Idempotent bulk import', d: 'A CSV import (up to 5 MB and 5,000 rows) validates row by row, excludes bad rows, and uses the customer reference as an idempotency key so re-uploading does not create duplicates.' },
      { t: 'One-time recipient links', d: 'When a parcel goes out for delivery, the recipient gets a link that expires after seven days and works once. The token is stored hashed.' },
      { t: 'Safe public tracking', d: 'The public tracking page and API leave out delivery proof and other sensitive fields. Proof-of-delivery files are private with signed links that expire after five minutes.' },
      { t: 'Signed webhooks', d: 'Outgoing webhooks are HMAC-signed, must be HTTPS, and failures are logged to a dead-letter record.' },
    ],
    results: [
      'Around 35 test methods in the repo, covering transitions, tenant isolation, import idempotency, webhook signing, token expiry and rate limiting',
      'The live demo runs in demo mode: no Postgres, Redis or S3, jobs run inline, and data rebuilds on cold start',
    ],
    next: ['Real carrier integrations: without API keys it uses a deterministic simulated status model, not live carrier data', 'Run the full production stack (Postgres, Redis worker, S3/R2) as a public demo', 'Screenshots and a walkthrough video'],
    wrong: [
      'The live demo is not the production setup. Carrier sync falls back to a simulated model without API keys, and I say so rather than calling it live tracking.',
      'Email invitations only reach recipients once SMTP is configured; the demo uses the console backend.',
    ],
  },
  spendwise: {
    problem:
      'Most budgeting apps either connect to your bank or are spreadsheets in disguise. SpendWise is a Naira-first tracker for accounts, transactions, category budgets and savings goals that does not touch a bank connection.',
    role: 'Solo project: Django app, passkey authentication, import/export, tests and deployment.',
    decisions: [
      { t: 'Decimal money, not floats', d: 'Balances and budget maths use Python Decimal, with a test for the arithmetic.' },
      { t: 'Passkeys verified on the server', d: 'WebAuthn challenges and signatures are checked server-side, and a regression test makes sure an invalid assertion does not log anyone in.' },
      { t: 'CSV that is safe to open', d: 'Export escapes cells that start with =, +, - or @ so a spreadsheet cannot run them as formulas. Import previews rows, flags likely duplicates and skips malformed ones.' },
      { t: 'Honest projection', d: 'The 90-day view is based on recent average net cash flow and is labelled indicative, not a forecast.' },
      { t: 'No faked AI', d: 'The money coach uses the signed-in user’s real data and says so when the AI key is missing or the provider fails.' },
    ],
    results: [
      'Around 34 test methods covering ownership, decimal maths, budgets, CSV import/export, passkeys and the coach endpoints',
      'Privacy mode only blurs amounts in the browser; it is a display feature, not encryption',
    ],
    next: ['Screenshots in the case study', 'More tests on the cash-flow projection edge cases', 'Bank statement import formats beyond CSV'],
    wrong: [
      'Privacy mode can look like a security feature. It is not one, and the README says so.',
      'The README describes more features than I have written about tests for. The test list above is what is actually covered.',
    ],
  },
};
