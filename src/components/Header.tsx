import { useEffect, useState } from 'react';

const links = [
  { label: 'Work', href: '/#work', id: 'work' },
  { label: 'Experience', href: '/#experience', id: 'experience' },
  { label: 'About', href: '/#about', id: 'about' },
  { label: 'Projects', href: '/work/', id: '' },
];

export default function Header({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 300 && !open);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => {
    if (!home) return;
    const ids = ['work', 'experience', 'about', 'contact'];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [home]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-transform duration-500 sm:top-5 ${hidden ? '-translate-y-[140%]' : ''}`}
    >
      <div className="w-full max-w-3xl">
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-2 rounded-full border border-white/[.14] bg-ink/70 p-1.5 pl-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,.7)] backdrop-blur-xl"
        >
          <a href={home ? '#top' : '/'} className="flex items-center gap-2 rounded-full pr-2 text-sm font-semibold" aria-label="Afolabi Peter, home">
            <span className="grid size-9 place-items-center rounded-full bg-accent text-[13px] font-semibold text-white">AP</span>
            <span className="hidden sm:inline">Afolabi Peter</span>
          </a>

          <ul className="hidden items-center gap-0.5 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  aria-current={active && l.id === active ? 'true' : undefined}
                  className={`rounded-full px-4 py-2 text-sm transition ${active && l.id === active ? 'bg-cream/12 text-white' : 'text-cream/90 hover:bg-cream/8 hover:text-white'}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <a href="/#contact" className="btn btn-primary !px-5 !py-2.5">Let’s talk</a>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 place-items-center rounded-full border border-white/[.22] md:hidden"
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-px w-4 bg-cream transition ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 top-1.5 h-px w-4 bg-cream transition ${open ? 'opacity-0' : ''}`} />
                <span className={`absolute left-0 h-px w-4 bg-cream transition ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          className={`mt-2 origin-top overflow-hidden rounded-3xl border border-white/[.14] bg-ink/90 backdrop-blur-xl transition-all duration-300 md:hidden ${open ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 border-transparent opacity-0'}`}
        >
          <ul className="p-2">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3.5 text-lg font-medium hover:bg-cream/8">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="flex gap-2 p-2 pt-3 text-sm text-cream/90">
              <a className="rounded-full border border-white/[.22] px-4 py-2" href="https://github.com/peterafolabi-dev" target="_blank" rel="noopener">GitHub ↗</a>
              <a className="rounded-full border border-white/[.22] px-4 py-2" href="https://www.linkedin.com/in/afolabipeter-dev" target="_blank" rel="noopener">LinkedIn ↗</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
