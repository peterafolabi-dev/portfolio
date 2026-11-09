import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://afolabi-peter.vercel.app',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
