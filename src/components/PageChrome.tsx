import { useEffect, useState } from 'react';

const SECTIONS = [
  ['top', 'Home'],
  ['flagship', 'Oja Ledger'],
  ['work', 'More projects'],
  ['capabilities', 'Capabilities'],
  ['experience', 'Experience'],
  ['about', 'About'],
  ['contact', 'Contact'],
] as const;

/** Thin scroll-progress bar on every page, plus (home only, wide screens) a sticky section rail that follows you down the page. */
export default function PageChrome({ rail = false }: { rail?: boolean }) {
  const [p, setP] = useState(0);
  const [cur, setCur] = useState('top');

  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setP(max > 0 ? Math.min(1, scrollY / max) : 0);
    };
    on();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
  }, []);

  useEffect(() => {
    if (!rail) return;
    const els = SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setCur(e.target.id); }, { rootMargin: '-40% 0px -55% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [rail]);

  return (
    <>
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
        <div className="h-full origin-left bg-gradient-to-r from-accent via-amber to-teal shadow-[0_0_12px_rgba(255,74,28,.6)]" style={{ transform: `scaleX(${p})` }} />
      </div>
      {rail && (
        <nav aria-label="Page sections" className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 min-[1500px]:block">
          <ol className="relative space-y-4 border-l border-white/15 pl-5">
            <span aria-hidden="true" className="absolute -left-px top-0 w-px bg-accent transition-all duration-500" style={{ height: `${((SECTIONS.findIndex(([id]) => id === cur) + 1) / SECTIONS.length) * 100}%` }} />
            {SECTIONS.map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`} className={`flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${cur === id ? 'text-white' : 'text-cream/60 hover:text-white'}`} aria-current={cur === id ? 'true' : undefined}>
                  <span className={cur === id ? 'text-accent' : ''}>{String(i + 1).padStart(2, '0')}</span>{label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}
