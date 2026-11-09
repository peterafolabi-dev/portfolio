import { useEffect, useRef } from 'react';

const COUNT = 230;
const small = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 767px)').matches;
const src = (i: number) => `/img/${small ? 'seq-s' : 'seq'}/${String(i + 1).padStart(3, '0')}.jpg`;

/** Full-screen scroll-scrubbed image sequence (230 frames) behind the whole page. */
export default function SeqBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frames: HTMLImageElement[] = [];
    let last = -1;
    let ready = false;

    const draw = (i: number) => {
      const ok = (k: number) => !!(frames[k]?.complete && frames[k].naturalWidth);
      let lo = i, hi = i;
      while (lo > 0 && !ok(lo)) lo--;
      while (hi < COUNT - 1 && !ok(hi)) hi++;
      i = ok(lo) && (!ok(hi) || i - lo <= hi - i) ? lo : hi;
      const im = frames[i];
      if (!im || !im.naturalWidth || i === last) return;
      last = i;
      if (cv.width !== im.naturalWidth) { cv.width = im.naturalWidth; cv.height = im.naturalHeight; }
      cx.drawImage(im, 0, 0);
    };
    const progress = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    };
    const update = () => { if (ready) draw(reduce ? 0 : Math.round(progress() * (COUNT - 1))); };

    for (let i = 0; i < COUNT; i++) { const im = new Image(); im.decoding = 'async'; frames.push(im); }
    // load first frame now, then every 8th frame (coarse turn first), then the rest, a few at a time
    const order = [0, ...Array.from({ length: COUNT }, (_, i) => i).filter((i) => i % 8 === 0 && i), ...Array.from({ length: COUNT }, (_, i) => i).filter((i) => i % 8 !== 0)];
    let next = 0, dead = false;
    const pump = () => {
      if (dead || next >= order.length) return;
      const i = order[next++];
      const im = frames[i];
      im.onload = im.onerror = () => { if (i === 0) { ready = true; } update(); pump(); };
      im.src = src(i);
    };
    pump();
    const start = () => { for (let k = 0; k < 3; k++) pump(); };
    if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });

    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => { dead = true; removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        width={960}
        height={540}
        role="img"
        aria-label="Portrait of Afolabi Peter, animated as you scroll"
        className="fixed inset-y-0 right-0 -z-20 h-full w-full object-cover object-[70%_center] md:w-[68%] md:object-center md:[mask-image:linear-gradient(90deg,transparent,#000_28%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(90deg,rgba(14,18,20,.8),rgba(14,18,20,.3)_50%,rgba(14,18,20,0)),linear-gradient(transparent_55%,rgba(14,18,20,.7))] max-md:bg-ink/35"
      />
    </>
  );
}
