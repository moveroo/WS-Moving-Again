# MM-movingagain.com.au

Canonical Astro controller for `movingagain.com.au`.

This repo contains the live Moving Again Astro rebuild and the large route/content estate that replaced the former WordPress implementation. It also contains a deeper set of SEO and content-analysis scripts than most fleet sites, so this standardization pass adds the missing migration and cutover contract without stripping out the existing tooling.

## Current State

- domain: `https://movingagain.com.au`
- framework: Astro
- hosting: Vercel
- local controller path: `MM-movingagain.com.au`
- redirect source of truth: `vercel.json` plus supporting redirect-generation scripts

The current migration and operating paperwork lives in:

- [docs/migration-ledger.md](docs/migration-ledger.md)
- [docs/redirect-map.md](docs/redirect-map.md)
- [docs/indexed-valid-inventory.md](docs/indexed-valid-inventory.md)
- [docs/homepage-audit.md](docs/homepage-audit.md)
- [docs/live-cutover-status.md](docs/live-cutover-status.md)

Existing SEO analysis material remains valuable, especially:

- [docs/INDEX-SYSTEMATIC-SEO.md](docs/INDEX-SYSTEMATIC-SEO.md)
- [docs/PRIORITY-PAGES-STRATEGY.md](docs/PRIORITY-PAGES-STRATEGY.md)
- [docs/CRAWL-42-ANALYSIS.md](docs/CRAWL-42-ANALYSIS.md)
- [docs/CRAWL-44-ANALYSIS.md](docs/CRAWL-44-ANALYSIS.md)

## Important Commands

```bash
npm run dev
npm run build
npm run check:seo
npm run seo:audit
```

Useful supporting commands:

- `npm run seo:page`
- `npm run seo:crawl`
- `npm run analyze:duplicates`
- `npm run analyze:content`
- `npm run analyze:alt-text`

## Content And Redirect Sources

- route markdown: `src/content/routes/`
- core commercial pages: `src/pages/`
- brand constants: `src/utils/brand.ts`
- redirect config: `vercel.json`
- redirect helper scripts: `scripts/generateRoutes.mjs`, `scripts/updateRedirects.mjs`, `scripts/mergeRedirects.mjs`

## Environment

Copy `.env.example` and set the real values when needed:

- `PUBLIC_SITE_URL`
- `PUBLIC_SITE_NAME`
- `PUBLIC_SITE_DESCRIPTION`
- `PUBLIC_SITE_IMAGE`
- `PUBLIC_GA_ID`
- `PUBLIC_MATOMO_BASE_URL`
- `PUBLIC_MATOMO_SITE_ID`

## Notes

- this repo carries a heavier SEO-analysis history than the newer fleet builds; the new docs are there to make that work legible, not to replace it
- `vercel.json` remains the live redirect source of truth and is also aligned with the active Vercel hosting setup
