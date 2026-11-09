// Builds api/_facts.json (what the AI chat may talk about) from the same data the site renders.
// Run after editing src/data: node scripts/gen-facts.mjs   (needs Node 22+ for TypeScript stripping)
import { writeFileSync } from 'node:fs';
const { projects } = await import('../src/data/projects.ts');
const { cases } = await import('../src/data/cases.ts');
const facts = {
  person: 'Afolabi Peter, Junior Full-Stack Engineer in Nigeria (Lagos time, WAT). B.Eng. Computer Engineering at the Federal University of Technology, Minna, class of 2028, CGPA 3.79/5.00. Frontend Development certificate from MALhub (Oct 2026). Open to remote roles and internships.',
  contact: { email: 'afolabiprosper329@gmail.com', linkedin: 'https://www.linkedin.com/in/afolabipeter-dev', github: 'https://github.com/peterafolabi-dev' },
  experience: [
    'Software Engineering Intern at MALhub, Ilorin (Aug – Oct 2026, on-site industrial training): built Travel & Stays in React and Supabase; double bookings made impossible by a PostgreSQL exclusion constraint; Paystack payments verified server-side with 11 unit tests in CI.',
    'Customer Support & Sales Assistant at Tools by FK (Jul 2026 – now, remote, part-time): advises students and professionals on AI and digital tools, manages orders, subscription activations and account access.',
  ],
  stack: 'Languages: TypeScript, JavaScript, Python. Frontend: React, Next.js, Tailwind CSS. Backend and data: Django, Supabase, PostgreSQL.',
  projects: projects.map((p) => ({
    name: p.title, kind: p.kind, year: p.year, summary: p.summary, hardestPart: p.hard, note: p.note ?? null, stack: p.stack,
    live: p.live, code: p.repo, page: `/work/${p.slug}/`,
    caseStudy: cases[p.slug] ? { problem: cases[p.slug].problem, decisions: cases[p.slug].decisions, results: cases[p.slug].results, whatIGotWrong: cases[p.slug].wrong, next: cases[p.slug].next } : null,
  })),
};
writeFileSync(new URL('../api/_facts.json', import.meta.url), JSON.stringify(facts));
console.log('facts bytes:', JSON.stringify(facts).length);
