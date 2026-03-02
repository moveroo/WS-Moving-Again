<!-- prettier-ignore-start -->
# Deftly Builder Action: generate_sitemap

- Action ID: `31`
- Run ID: `36`
- Generated At (UTC): `2026-03-02T20:37:32+00:00`
- Issue Code: `missing_lastmod_in_sitemap`
- Target URL: `https://movingagain.com.au/`

## Why This PR Exists
One or more sitemap URL entries are missing a valid lastmod value.

## Detected Metrics
- `entries_total`: 50
- `missing_lastmod_total`: 50

## Suggested Implementation Steps
1. Ensure sitemap generation includes `<lastmod>` for every URL entry.
2. Use content publish/update timestamps for `<lastmod>` (ISO-8601).
3. Regenerate sitemap and verify no entries are missing `<lastmod>`.
4. Submit refreshed sitemap through connected search integrations.

## Sample Entries Missing lastmod
- URL: `https://movingagain.com.au/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`
- URL: `https://movingagain.com.au/adelaide-ballarat/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`
- URL: `https://movingagain.com.au/adelaide-bendigo/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`
- URL: `https://movingagain.com.au/adelaide-bunbury/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`
- URL: `https://movingagain.com.au/adelaide-bundaberg/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`
- URL: `https://movingagain.com.au/adelaide-cairns/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`
- URL: `https://movingagain.com.au/adelaide-canberra/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`
- URL: `https://movingagain.com.au/adelaide-darwin/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`
- URL: `https://movingagain.com.au/adelaide-geelong/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`
- URL: `https://movingagain.com.au/adelaide-gold-coast/` · sitemap: `https://movingagain.com.au/sitemap-0.xml`

## Notes
- This is a Builder-generated manual-safe PR artifact.
- Approve/merge only after validating rendered sitemap output in production-like environment.

<!-- prettier-ignore-end -->
