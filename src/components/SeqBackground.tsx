import { useEffect, useRef } from 'react';

const COUNT = 230;
const src = (i: number) => `/img/seq/${String(i + 1).padStart(3, '0')}.jpg`;

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
      while (i > 0 && !(frames[i]?.complete && frames[i].naturalWidth)) i--;
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

    for (let i = 0; i < COUNT; i++) { const im = new Image(); im.src = src(i); frames.push(im); }
    frames[0].onload = () => { ready = true; update(); };

    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);

  return (
    <>
      <canvas
        ref={ref}
        width={960}
        height={540}
        role="img"
        aria-label="Portrait of Afolabi Peter, animated as you scroll"
        className="fixed inset-0 -z-20 h-full w-full object-cover object-[62%_center]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(90deg,rgba(14,18,20,.85),rgba(14,18,20,.45)_55%,rgba(14,18,20,.15)),linear-gradient(transparent_55%,rgba(14,18,20,.7))] max-md:bg-ink/45"
      />
    </>
  );
}
