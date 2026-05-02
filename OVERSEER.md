# OVERSEER

Repo tracking note for Bossman, Fleet, and Paperclip review.

## 2026-04-24 - Fleet Readiness Baseline

- Scope: website controller for `movingagain.com.au`.
- Fleet source of truth: `/Users/jasonhill/Projects/Business/websites/MM-fleet-program/docs/FLEET-SITE-TRACKER.md`.
- Paperclip readiness: this root `OVERSEER.md` has been added so the repo has a durable local state log before any future repo-ops routing.
- Current follow-up before broad Paperclip routing: resolve the existing dirty worktree, then backfill Fleet-standard indexed coverage evidence if the tracker still expects `docs/indexed-coverage-audit.md`.
- Logging rule: update this file only for material repo state, routing, deployment, cutover, or Fleet-standard changes.

## 2026-05-02 - Fleet SEO Controlled Test Routed

- Issue or trigger: `moveroo/WS-Moving-Again#11`, routed from the Fleet SEO intelligence workflow for `/cairns-toowoomba/`.
- What changed: added a route-scoped controlled SEO override for the Cairns to Toowoomba title and meta description, and aligned the route content frontmatter with the approved brief.
- What was fixed: generated HTML now emits the controlled title, controlled description, canonical `https://movingagain.com.au/cairns-toowoomba/`, no `noindex`, and the household plus vehicle quote paths remain present.
- What remains: merge and deploy the site change, then write the PR/change/deploy refs back to the MM-Google measurement row for follow-up tracking.

## 2026-05-02 - Retired Technical SEO Auditor Removed

- Issue or trigger: `technical.again.com.au` is retired and Fleet now owns the SEO checking path.
- What changed: `npm run seo:page` now performs a local live-page SEO check by default, the old API crawler commands require an explicit `SEO_AUDITOR_API_BASE`, and the scripts refuse to call `technical.again.com.au` if it is still configured.
- What was fixed: the repo no longer hard-codes or allows the retired auditor endpoint in active scripts or deploy CSP headers.
- What remains: wire `SEO_AUDITOR_API_BASE` to a current Fleet audit API later if Fleet restores a crawl/status service; single-page route checks work locally now.
