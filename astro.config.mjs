import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { getContentCollectionDate } from './src/utils/fileDates.js';

// Sitemap serializer to add lastmod dates to entries
function sitemapSerialize(item) {
  // Extract collection and slug from URL for route pages
  // Routes look like: https://movingagain.com.au/adelaide-ballarat/
  const urlPath = new URL(item.url).pathname.replace(/^\/|\/$/g, '');

  // Check if this is a route page (contains a dash separator)
  // Route pages are for the 'routes' collection
  if (urlPath && urlPath.includes('-') && !urlPath.includes('/')) {
    try {
      // For route pages, get the lastmod date from the content file
      const lastmod = getContentCollectionDate('routes', urlPath);
      return {
        ...item,
        lastmod: new Date(lastmod),
      };
    } catch (error) {
      // Log error for debugging but still provide a lastmod using fallback
      // This ensures all pages have lastmod even if we can't get the exact date
      console.warn(`Failed to get content collection date for route "${urlPath}":`, error.message);
      return {
        ...item,
        lastmod: new Date(),
      };
    }
  }

  // For other pages (homepage, static pages, etc.), use current date as fallback
  // This ensures all sitemap entries have a lastmod value for SEO
  return {
    ...item,
    lastmod: new Date(),
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://movingagain.com.au',
  integrations: [tailwind(), sitemap({ serialize: sitemapSerialize })],
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
