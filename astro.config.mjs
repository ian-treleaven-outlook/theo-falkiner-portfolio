// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

// https://astro.build/config
export default defineConfig({
  site: isGitHubPages
    ? 'https://ian-treleaven-outlook.github.io'
    : 'https://theo-falkiner.art',
  base: isGitHubPages ? '/theo-falkiner-portfolio' : '/',
  vite: {
    plugins: [tailwindcss()]
  }
});