# Moving Again Live Cutover Status

## Site

- domain: `movingagain.com.au`
- local controller: `MM-movingagain.com.au`
- hosting platform: Netlify (per current controller record)
- previous live platform: WordPress
- current live platform: Astro

## Current State

- lifecycle: `astro_live`
- production status: live
- local controller naming: aligned to `MM-<domain>` standard
- WordPress compatibility layer: none currently retained in `_wp-house`

## Launch Evidence

- canonical local controller retained during the verified Astro folder cleanup
- active redirect inventory present in `vercel.json`
- sitemap support present in Astro config
- robots route now aligned to canonical site URL environment variables

## Operational Caveat

`vercel.json` remains part of the live operational picture even though the recorded hosting target is Netlify, because this repo still uses it as the redirect inventory and Astro config reads from it when filtering sitemap entries.

## Follow-Up

- decide later whether to refactor the custom SEO layer toward the newer fleet-wide baseline
- keep redirect generation and redirect documentation in sync whenever route format or canonical path rules change
