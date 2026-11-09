import { useEffect, useRef } from 'react';

const COLORS = ['#ff4a1c', '#3de0c5', '#ffb347', '#a78bfa', '#ede9e3'];

/** Soft floating coloured dots over the hero; they drift and gently avoid the pointer. */
export default function Dots() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const cx = cv.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, visible = true;
    const mouse = { x: -999, y: -999 };
    type D = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let dots: D[] = [];
    const size = () => {
      const r = cv.getBoundingClientRect();
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(26, Math.max(10, w / 55)));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
        r: 1.5 + Math.random() * 2.2, c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    };
    const tick = () => {
      cx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.x - mouse.x, dy = d.y - mouse.y, dist = Math.hypot(dx, dy);
        if (dist < 120) { d.x += (dx / dist) * 1.4; d.y += (dy / dist) * 1.4; }
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0; if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
        cx.globalAlpha = .35; cx.fillStyle = d.c; cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, 6.283); cx.fill();
      }
      if (visible && !reduce) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { cancelAnimationFrame(raf); tick(); } });
    size(); tick(); io.observe(cv);
    addEventListener('resize', size); addEventListener('pointermove', move, { passive: true });
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', size); removeEventListener('pointermove', move); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}
