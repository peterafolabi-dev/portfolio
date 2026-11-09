import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/projects';

type Msg = { from: 'bot' | 'me'; text: string; links?: { label: string; href: string }[] };

const EMAIL = 'afolabiprosper329@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/afolabipeter-dev';
const GITHUB = 'https://github.com/peterafolabi-dev';

const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

function answer(raw: string): Msg {
  const q = raw.toLowerCase();

  // A named project
  const p = projects.find((x) => q.includes(x.title.toLowerCase()) || q.includes(x.slug.replace('-', ' ')) || (x.slug === 'redcart' && q.includes('red cart')));
  if (p) {
    const links = [{ label: 'Case study page', href: `/work/${p.slug}/` }, { label: 'Live demo', href: p.live }, { label: 'Code on GitHub', href: p.repo }];
    return { from: 'bot', text: `${p.title} (${p.kind}, ${p.year}). ${p.summary} The hard part: ${p.hard}${p.note ? ' Note: ' + p.note : ''}`, links };
  }
  if (has(q, ['hire', 'contact', 'email', 'reach', 'talk', 'interview', 'job', 'role', 'available', 'open to']))
    return { from: 'bot', text: 'Peter is open to remote roles and internships. The fastest way is email; he replies from his phone.', links: [{ label: `Email ${EMAIL}`, href: `mailto:${EMAIL}?subject=${encodeURIComponent('Role or interview: Afolabi Peter')}` }, { label: 'LinkedIn', href: LINKEDIN }, { label: 'CV (PDF)', href: '/Afolabi-Peter-CV.pdf' }] };
  if (has(q, ['cv', 'resume', 'résumé']))
    return { from: 'bot', text: 'The CV is a PDF. A note: it still has some older numbers (the site and GitHub READMEs are the current source).', links: [{ label: 'Download CV', href: '/Afolabi-Peter-CV.pdf' }] };
  if (has(q, ['project', 'built', 'build', 'work', 'portfolio', 'made']))
    return { from: 'bot', text: 'Six real projects, all with code on GitHub: ' + projects.map((x) => `${x.title} (${x.kind.split(' · ')[0]})`).join(', ') + '. Ask me about any one by name.', links: [{ label: 'See all projects', href: '/work/' }] };
  if (has(q, ['test', 'ci', 'quality', 'property']))
    return { from: 'bot', text: 'Tests are a habit, not an afterthought. Oja Ledger runs 4 ledger invariants against 200 generated ledgers on every push (29 tests). Travel & Stays has 11 unit tests on the Paystack payment decision plus Postgres tests that run on a real database in CI. RedCart has 98 Django tests including the payment-amount check.', links: [{ label: 'Oja Ledger case study', href: '/work/oja-ledger/' }] };
  if (has(q, ['paystack', 'payment', 'pay']))
    return { from: 'bot', text: 'Payments are verified on the server: the amount and currency are re-checked against the order before anything is marked paid (Travel & Stays and RedCart). All of it runs in Paystack test mode, so no real money moves.', links: [{ label: 'Travel & Stays', href: '/work/travel-stays/' }, { label: 'RedCart', href: '/work/redcart/' }] };
  if (has(q, ['stack', 'skill', 'tech', 'language', 'framework', 'tool', 'react', 'django', 'typescript', 'python']))
    return { from: 'bot', text: 'Languages: TypeScript, JavaScript, Python. Frontend: React, Next.js, Tailwind CSS. Backend and data: Django, Supabase, PostgreSQL. This site is Astro + React + Tailwind.' };
  if (has(q, ['experience', 'intern', 'malhub', 'tools by fk', 'company', 'employ']))
    return { from: 'bot', text: 'Software Engineering Intern at MALhub, Ilorin (Aug – Oct 2026, on-site industrial training): built Travel & Stays in React and Supabase. Also Customer Support & Sales Assistant at Tools by FK (Jul 2026 – now, remote, part-time).', links: [{ label: 'Experience', href: '/#experience' }] };
  if (has(q, ['school', 'study', 'university', 'education', 'cgpa', 'grade', 'degree', 'minna', 'futminna']))
    return { from: 'bot', text: 'B.Eng. Computer Engineering at the Federal University of Technology, Minna (2024 – 2028). CGPA 3.79/5.00, plus a Frontend Development certificate from MALhub (Oct 2026).' };
  if (has(q, ['where', 'location', 'nigeria', 'live', 'based', 'time zone', 'timezone']))
    return { from: 'bot', text: 'Based in Nigeria (Lagos time, WAT, UTC+1), open to remote work.' };
  if (has(q, ['wrong', 'mistake', 'weak', 'limit', 'honest', 'gap', 'improve']))
    return { from: 'bot', text: 'Honest gaps, all listed in the case studies: RedCart keeps money as float naira (Oja Ledger uses whole kobo); Travel & Stays has hold-expiry and a payment webhook written and tested but not switched on yet; payments are test mode; LogiTrack carrier sync is simulated without API keys.', links: [{ label: 'Travel & Stays case study', href: '/work/travel-stays/' }] };
  if (has(q, ['github', 'code', 'repo', 'source']))
    return { from: 'bot', text: 'All the code is public on GitHub.', links: [{ label: 'github.com/peterafolabi-dev', href: GITHUB }] };
  if (has(q, ['who', 'about', 'peter', 'yourself', 'introduce']))
    return { from: 'bot', text: 'Afolabi Peter is a Junior Full-Stack Engineer and Computer Engineering student at FUT Minna (class of 2028). He builds money-handling software: an offline ledger that catches a changed naira, bookings the database refuses to double, and payments the server confirms.', links: [{ label: 'About', href: '/#about' }] };
  if (has(q, ['hi', 'hello', 'hey', 'help', 'what can']))
    return { from: 'bot', text: 'Hi! Ask me about Peter’s projects, tests, experience, stack, education or how to hire him.' };
  return { from: 'bot', text: 'I can only answer from what is on this site, and I am not sure about that one. Try asking about a project (for example “Oja Ledger”), tests, experience, stack, education, or how to contact Peter. Or just email him.', links: [{ label: `Email ${EMAIL}`, href: `mailto:${EMAIL}` }] };
}

const SUGGEST = ['What has Peter built?', 'Tell me about Oja Ledger', 'How does he test?', 'Is he available to hire?', 'What did he get wrong?'];

export default function AskPeter() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: 'Hi! I answer questions about Peter using only what is on this site. Ask away, or tap a question.' }]);
  const [val, setVal] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [msgs, open]);
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);

  const [ai, setAi] = useState(false);
  const [busy, setBusy] = useState(false);

  // Tries the AI endpoint (Groq, via /api/chat). If it is not configured or fails, the scripted answers still work.
  const ask = async (t: string) => {
    const text = t.trim();
    if (!text || busy) return;
    const history = [...msgs.filter((m) => m !== msgs[0]).map((m) => ({ role: m.from === 'me' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: text }];
    setMsgs((m) => [...m, { from: 'me', text }]);
    setVal('');
    setBusy(true);
    try {
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }) });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      if (!j.reply) throw new Error('empty');
      setAi(true);
      setMsgs((m) => [...m, { from: 'bot', text: j.reply }]);
    } catch {
      setAi(false);
      await new Promise((ok) => setTimeout(ok, 300));
      setMsgs((m) => [...m, answer(text)]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-[5.25rem] right-3 z-50 md:bottom-6 md:right-6">
      {open && (
        <div role="dialog" aria-label="Ask about Peter" className="mb-3 flex h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-white/20 bg-ink/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,.9),0_0_30px_rgba(255,74,28,.12)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/[.14] px-4 py-3">
            <div><p className="text-sm font-semibold text-white">Ask about Peter</p><p className="font-mono text-[10px] uppercase tracking-widest text-cream/75">{ai ? 'AI (Groq) · may make mistakes' : 'Answers from this site'}</p></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="grid size-8 place-items-center rounded-full text-cream/90 hover:bg-white/10">✕</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === 'me' ? 'flex justify-end' : 'flex'}>
                <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.from === 'me' ? 'bg-accent text-white' : 'border border-white/[.14] bg-panel text-cream/95'}`}>
                  <p>{m.text}</p>
                  {m.links && <div className="mt-2 flex flex-wrap gap-1.5">{m.links.map((l) => <a key={l.href} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener" className="rounded-full border border-white/25 px-2.5 py-1 font-mono text-[11px] text-teal hover:bg-white/10">{l.label} →</a>)}</div>}
                </div>
              </div>
            ))}
            {msgs.length < 3 && <div className="flex flex-wrap gap-1.5 pt-1">{SUGGEST.map((s) => <button key={s} type="button" onClick={() => ask(s)} className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-cream/95 hover:border-accent hover:text-white">{s}</button>)}</div>}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(val); }} className="flex gap-2 border-t border-white/[.14] p-3">
            <input ref={input} value={val} onChange={(e) => setVal(e.target.value)} placeholder="Ask about projects, tests, hiring…" aria-label="Your question" className="min-w-0 flex-1 rounded-full border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-cream/60 focus:border-accent focus:outline-none" />
            <button type="submit" disabled={busy} className="rounded-full bg-accent px-4 text-sm font-medium text-white active:scale-95 disabled:opacity-60">{busy ? '…' : 'Send'}</button>
          </form>
        </div>
      )}
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close chat' : 'Ask about Peter'} className="ml-auto grid h-10 place-items-center rounded-full bg-accent px-4 text-xs md:h-12 md:px-5 md:text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.28),0_0_0_1px_rgba(255,74,28,.55),0_8px_28px_-6px_rgba(255,74,28,.6)] transition active:scale-95">
        {open ? 'Close' : 'Ask about Peter'}
      </button>
    </div>
  );
}
