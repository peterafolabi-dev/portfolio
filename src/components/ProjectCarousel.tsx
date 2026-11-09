import CodePeek, { type PeekData } from './CodePeek';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface Item { slug: string; title: string; kind: string; year: string; img: string; stack: string[]; peek?: PeekData }

export default function ProjectCarousel({ items }: { items: Item[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const update = useCallback(() => {
    const t = track.current; if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    setPct(max > 0 ? t.scrollLeft / max : 0);
    setAtStart(t.scrollLeft < 8);
    setAtEnd(t.scrollLeft > max - 8);
  }, []);

  useEffect(() => { update(); addEventListener('resize', update); return () => removeEventListener('resize', update); }, [update]);

  const go = (dir: 1 | -1) => {
    const t = track.current; if (!t) return;
    t.scrollBy({ left: dir * Math.max(300, t.clientWidth * 0.7), behavior: 'smooth' });
  };

  return (
    <div>
      <div
        ref={track}
        onScroll={update}
        tabIndex={0}
        aria-label="Projects. Scroll sideways, drag, or use the arrow keys."
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { go(1); e.preventDefault(); } if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); } }}
        onPointerDown={(e) => { if (e.pointerType !== 'mouse') return; drag.current = { down: true, x: e.clientX, left: track.current!.scrollLeft, moved: false }; }}
        onPointerMove={(e) => {
          const d = drag.current; if (!d.down) return;
          const dx = e.clientX - d.x; if (Math.abs(dx) > 5) d.moved = true;
          track.current!.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => { drag.current.down = false; }}
        onPointerLeave={() => { drag.current.down = false; }}
        onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; } }}
        className="no-scrollbar flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-(--gut) pb-4 scroll-pl-(--gut) [--gut:max(1.25rem,calc((100vw-72rem)/2+1.25rem))] sm:gap-6 sm:[--gut:max(2rem,calc((100vw-72rem)/2+2rem))] md:cursor-grab md:snap-none md:active:cursor-grabbing"
      >
        {items.map((p, i) => (
          <div key={p.slug} className="group w-[82vw] max-w-[420px] shrink-0 snap-start sm:w-[400px]">
            <div className="card overflow-hidden p-2.5 transition duration-500 group-hover:-translate-y-1.5 group-hover:border-accent/60 group-hover:shadow-[0_0_0_1px_rgba(255,74,28,.35),0_18px_48px_-16px_rgba(255,74,28,.35)]">
              <a href={`/work/${p.slug}/`} draggable={false} className="block rounded-2xl focus-visible:outline-offset-4">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-slate ring-1 ring-white/10">
                  <img src={p.img} alt={`${p.title} screenshot`} draggable={false} className="size-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="px-2 pb-2 pt-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-light tracking-tight transition group-hover:text-accent">{p.title}</h3>
                    <span className="font-mono text-[11px] text-cream/86">0{i + 1}</span>
                  </div>
                  <p className="mt-1 text-sm text-cream/92">{p.kind}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 3).map((s) => (
                      <span key={s} className="rounded-full border border-white/20 px-2.5 py-1 font-mono text-[10.5px] text-cream/90">{s}</span>
                    ))}
                  </div>
                </div>
              </a>
              {p.peek && <div className="px-2 pb-1"><CodePeek peek={p.peek} /></div>}
            </div>
          </div>
        ))}
        <a href="/work/" draggable={false} className="group grid w-[60vw] max-w-[300px] shrink-0 snap-start place-items-center rounded-3xl bg-gradient-to-br from-accent to-amber p-6 text-ink sm:w-[280px]">
          <span className="text-center">
            <span className="block text-3xl font-extralight uppercase leading-none">All<br />projects</span>
            <span className="mt-4 inline-block font-mono text-xs transition group-hover:translate-x-1">Live demos + code →</span>
          </span>
        </a>
      </div>

      <div className="wrap mt-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-cream/15" aria-hidden="true">
          <div className="h-full bg-accent transition-[width] duration-200" style={{ width: `${12 + pct * 88}%` }} />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(-1)} disabled={atStart} aria-label="Previous projects" className="grid size-11 place-items-center rounded-full border border-cream/20 transition hover:bg-cream hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cream">←</button>
          <button type="button" onClick={() => go(1)} disabled={atEnd} aria-label="Next projects" className="grid size-11 place-items-center rounded-full border border-cream/20 transition hover:bg-cream hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cream">→</button>
        </div>
      </div>
    </div>
  );
}
