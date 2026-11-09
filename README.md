# Afolabi Peter — portfolio (Astro)

Prototype built with Astro. Sample project cards only; replace in `src/data/projects.ts`.

    npm install
    npm run dev       # local preview
    npm run build     # outputs ./dist

Deploy: import the repo in Vercel (Astro is auto-detected, no settings needed).

Add `public/img/portrait.jpg` for the hero and About photo. Edit `projects.ts` for real case studies.


## Stack
Astro 7 (static pages) · React 19 islands (header, scroll background, project carousel) · Tailwind CSS 4 · TypeScript.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

The hero animation is 230 JPG frames in `public/img/seq/` (001.jpg to 230.jpg), scrubbed on scroll by `src/components/SeqBackground.tsx`. Replace the frames to change the animation.
