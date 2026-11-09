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
        <nav aria-label="Page sections" className="fixed left-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
          <ol className="space-y-3">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="group flex items-center gap-3" aria-current={cur === id ? 'true' : undefined}>
                  <span className={`h-px transition-all duration-300 ${cur === id ? 'w-8 bg-accent' : 'w-4 bg-white/40 group-hover:w-6 group-hover:bg-white'}`} />
                  <span className={`font-mono text-[10px] uppercase tracking-widest transition-opacity duration-300 ${cur === id ? 'text-white opacity-100' : 'text-cream/75 opacity-0 group-hover:opacity-100'}`}>{label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}
