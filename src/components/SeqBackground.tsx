import { useEffect, useRef } from 'react';

const COUNT = 230;
const conn = (typeof navigator !== 'undefined' ? (navigator as any).connection : undefined) as { saveData?: boolean; effectiveType?: string } | undefined;
/** Slow links load fewer frames (never different-shaped ones): Data Saver or 2G -> every 4th, 3G -> every 2nd. */
const step = !conn ? 1 : conn.saveData === true || ['slow-2g', '2g'].includes(conn.effectiveType ?? '') ? 4 : conn.effectiveType === '3g' ? 2 : 1;
const small = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 767px)').matches;
/** Large desktop screens get the 1920x1080 frames (upscaled from the 720p source); smaller screens the 1280x720 ones. */
const hd = !small && step === 1 && typeof matchMedia !== 'undefined' && matchMedia('(min-width: 1100px)').matches;
const src = (i: number) => `/img/${small ? 'seq-s' : hd ? 'seq-hd' : 'seq'}/${String(i + 1).padStart(3, '0')}.jpg`;

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

    // Retina-sharp drawing: the canvas backing store is sized to its CSS box x devicePixelRatio,
    // and each frame is drawn with "cover" scaling at that resolution (no CSS up-scaling of a small bitmap).
    let dpr = 1, cw = 0, ch = 0;
    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      cw = Math.max(1, Math.round(r.width * dpr));
      ch = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
      last = -1;
    };
    const draw = (i: number) => {
      const ok = (k: number) => !!(frames[k]?.complete && frames[k].naturalWidth);
      let lo = i, hi = i;
      while (lo > 0 && !ok(lo)) lo--;
      while (hi < COUNT - 1 && !ok(hi)) hi++;
      i = ok(lo) && (!ok(hi) || i - lo <= hi - i) ? lo : hi;
      const im = frames[i];
      if (!im || !im.naturalWidth || i === last) return;
      last = i;
      // Desktop: show the whole frame (fit to width, no zoom-crop) so the portrait is the same size as in the
      // source video; its top and bottom edges are faded into the page below. Mobile keeps the cover crop.
      const wide = innerWidth >= 768 && im.naturalWidth > im.naturalHeight;
      const scale = wide ? cw / im.naturalWidth : Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
      cx.globalCompositeOperation = 'source-over';
      cx.clearRect(0, 0, cw, ch);
      const w = im.naturalWidth * scale, h = im.naturalHeight * scale;
      const px = 0.5; // frames are pre-cropped around the subject
      cx.imageSmoothingEnabled = true;
      cx.imageSmoothingQuality = 'high';
      cx.drawImage(im, (cw - w) * px, (ch - h) * 0.5, w, h);
      if (wide && h < ch) {
        const y0 = (ch - h) * 0.5;
        const g = cx.createLinearGradient(0, y0, 0, y0 + h);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.2, 'rgba(0,0,0,1)'); g.addColorStop(0.8, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        cx.globalCompositeOperation = 'destination-in';
        cx.fillStyle = g; cx.fillRect(0, 0, cw, ch);
        cx.globalCompositeOperation = 'source-over';
      }
    };
    const progress = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    };
    const update = () => {
      // After the hero the portrait sinks to a faint backdrop so it never competes with section content (e.g. the About portrait).
      cv.style.opacity = String(Math.max(0.22, 1 - (scrollY / Math.max(1, innerHeight * 0.9)) * 0.78));
      if (ready) draw(reduce ? 0 : Math.round(progress() * (COUNT - 1)));
    };

    for (let i = 0; i < COUNT; i++) { const im = new Image(); im.decoding = 'async'; frames.push(im); }
    // load first frame now, then every 8th frame (coarse turn first), then the rest, a few at a time (slow links only load every 2nd or 4th)
    const all = Array.from({ length: COUNT }, (_, i) => i);
    const wanted = step > 1 ? all.filter((i) => i % step === 0) : all;
    const state = new Map<number, 'loading' | 'done'>();
    let dead = false;
    const target = () => (reduce ? 0 : Math.round(progress() * (COUNT - 1)));
    // Frame 0 first, then whichever missing frame is closest to where the reader is scrolling now,
    // so a fast scroll up or down lands on real frames instead of a far-away coarse one.
    const nextFrame = () => {
      if (!state.has(0)) return 0;
      const t = target();
      let best = -1, bd = 1e9;
      for (const i of wanted) { if (state.has(i)) continue; const d = Math.abs(i - t); if (d < bd) { bd = d; best = i; } }
      return best;
    };
    const pump = () => {
      if (dead) return;
      const i = nextFrame();
      if (i < 0) return;
      state.set(i, 'loading');
      const im = frames[i];
      im.onload = im.onerror = () => { state.set(i, 'done'); if (i === 0) ready = true; update(); pump(); };
      im.src = src(i);
    };
    const start = () => { for (let k = 0; k < 6; k++) pump(); };
    pump();
    if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });

    const onResize = () => { fit(); update(); };
    fit();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', onResize);
    return () => { dead = true; removeEventListener('scroll', update); removeEventListener('resize', onResize); };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        role="img"
        aria-label="Portrait of Afolabi Peter, animated as you scroll"
        className="fixed inset-y-0 right-0 -z-20 h-full w-full md:w-[68%] md:[mask-image:linear-gradient(90deg,transparent,#000_28%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,9,11,.8),rgba(9,9,11,.3)_50%,rgba(9,9,11,0)),linear-gradient(transparent_55%,rgba(9,9,11,.7))] max-md:bg-ink/35"
      />
    </>
  );
}
