// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ian-treleaven-outlook.github.io',
  base: '/theo-falkiner-portfolio',
  vite: {
    plugins: [tailwindcss()]
  }
});