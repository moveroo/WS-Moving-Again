# Moving Again Redirect Map

## Current Source Of Truth

- machine-readable redirect inventory: `vercel.json`
- generation helper: `scripts/generateRoutes.mjs`
- maintenance helpers: `scripts/updateRedirects.mjs`, `scripts/mergeRedirects.mjs`

## Current Redirect Estate

Recorded on 2026-04-18:

- total redirects in `vercel.json`: `934`

The current redirect set covers several different classes:

1. host normalization such as `www` to apex
2. sitemap alias normalization
3. contact aliases to the quote/contact destination
4. legacy city and service page consolidations
5. route-format normalization from old path patterns into canonical route URLs

## Operational Rule

Do not treat `vercel.json` as a disposable deployment artifact. In this repo it is also the live redirect ledger used by tooling and sitemap filtering.

When redirect work changes:

1. update or regenerate the redirect inventory
2. verify that sitemap filtering still excludes redirect-only sources
3. run `npm run check:seo`
