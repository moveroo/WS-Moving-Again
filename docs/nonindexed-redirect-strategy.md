# Non-Indexed Redirect Strategy

This document records how Moving Again should treat low-value inherited URLs that are not worth keeping as full Astro pages.

## Goal

Preserve the strongest city, route, guide, and legal pages while redirecting weak or repetitive inherited URLs to the closest live service, guide, or legal destination.

## Redirect Families

- general moving help -> `/moving-interstate/`
- FAQ-style content -> `/questions/`
- backloading intent -> `/backloading/`
- car transport intent -> `/car-transport/`
- review/testimonial intent -> `/reviews/`
- privacy-like pages -> `/privacy/`
- terms-like pages -> `/terms/`

## Decision Rule

Keep a legacy URL when it is indexed, useful, and clearly distinct. Redirect it when it is repetitive, thin, or better served by a stronger guide or legal page already in the Astro build.
