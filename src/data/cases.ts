// Long-form case-study content, condensed from each repo's docs/CASE_STUDY.md (real, not invented).
export interface Case {
  problem: string;
  role: string;
  decisions: { t: string; d: string }[];
  results: string[];
  next: string[];
  shots?: { src: string; alt: string; mobile?: boolean }[];
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
      '24 automated tests, including 7 property-based checks that each run 100 to 200 generated cases',
      'Strict TypeScript (strict, noUncheckedIndexedAccess) with no any',
      'Zero runtime dependencies beyond React; 59 kB of JavaScript after gzip',
    ],
    next: ['Sync across devices using the existing hash-linked log', 'Encrypted cloud backup with a PIN-derived key', 'Inventory by item so cost of goods sold is calculated', 'Review of the tax logic by a Nigerian chartered accountant'],
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
      'CI on every push: lint, production build and the payment tests; shipped with code reviews from the MALhub engineering team',
    ],
    next: ['Hold host payouts until check-in with Paystack split payments', 'Database tests in CI that prove the overlap constraint and security policies', 'Paystack webhooks as a second confirmation path if a guest closes the tab early'],
  },
};
