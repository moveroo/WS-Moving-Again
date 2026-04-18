# Moving Again Migration Ledger

## Controller

- domain: `movingagain.com.au`
- current local controller: `MM-movingagain.com.au`
- framework: Astro
- recorded hosting target: Netlify
- previous platform: WordPress

## Migration Shape

Moving Again is already a substantial Astro estate rather than a thin first-wave rebuild.

Current content model:

1. core commercial pages in `src/pages/`
2. route estate in `src/content/routes/`
3. redirect inventory managed in `vercel.json`
4. supporting SEO and content analysis scripts in `scripts/`

## Current Content Sources

- route markdown collection: `src/content/routes/`
- brand/source constants: `src/utils/brand.ts`
- route generation tooling: `scripts/generateRoutes.mjs`
- redirect tooling: `scripts/updateRedirects.mjs` and `scripts/mergeRedirects.mjs`

## Evidence Captured

- route markdown files currently present: `300`
- large redirect estate currently present: `934` redirects in `vercel.json`
- existing crawl and SEO analysis documentation already lives under `docs/`

## Standardization Outcome On 2026-04-18

- README rewritten to describe the repo as the canonical Moving Again controller
- standard fleet docs added for migration, redirects, indexed coverage, homepage audit, and live cutover
- `check:seo` added for fast local validation
- `robots.txt` route corrected to use canonical site URL env vars instead of `import.meta.env.SITE`

## Notes

- this repo already contains a lot of SEO work; the gap was not lack of effort, it was lack of a clean fleet-wide operating contract
- `vercel.json` remains operationally important because the repo uses it as the machine-readable redirect source even though Netlify is the current recorded live platform
