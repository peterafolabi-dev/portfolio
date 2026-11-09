import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://portfolio-one-kappa-p2gg1ejjj4.vercel.app',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
