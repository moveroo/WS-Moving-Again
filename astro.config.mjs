import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://movingagain.com.au',
  integrations: [tailwind(), sitemap()],
  // Optimize images automatically
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  // Build output
  output: 'static',
  build: {
    // Inline small assets
    inlineStylesheets: 'auto',
  },
});
