# Programmatic Site Building Checklist: Lessons from Moving Again

This checklist encapsulates the best practices, architectural decisions, and
lessons learned (including recent SEO fixes) from the _Moving Again_ project.
Use this as a foundation for the _Movingcars_ migration.

## 1. Project Initialization & Architecture

- [ ] **Framework**: Initialize with **Astro** (latest) + **Tailwind CSS**.
  - `npm create astro@latest ./ -- --template minimal`
  - `npx astro add tailwind sitemap`
- [ ] **Config**: Set up `astro.config.mjs` with `output: 'static'` ( SSG is
      perfect for thousands of pages).
- [ ] **Image Optimization**: Ensure `experimental.assets` (if older Astro) or
      standard `image` service with `sharp` is configured.
  - _Fixes MOB004_: Prevents "no responsive images" warnings.

## 2. Data Architecture (The "Programmatic" Core)

- [ ] **Content Collections**: Use `src/content/` for your data source, _not_
      raw JSON files scattered around.
  - Create a schema in `src/content/config.ts` to strictly type your route data
    (origin, destination, price, etc.).
- [ ] **Data Structure**:
  - Maintain the "Route" concept: `origin`, `destination`, `slugFs` (filesystem
    slug), `transitDays`, etc.
  - _Lesson_: Ensure your data source includes fields for "machine-readable
    facts" (price range, transit time) to inject into the HTML for LLMs.

## 3. Content Strategy (Combating Duplicate Content)

- [ ] **Uniqueness Threshold**: The latest analysis flagged **95%+ similarity**
      between routes like `/brisbane-adelaide/` and `/brisbane-perth/`.
  - _Goal_: Aim for <80% text similarity.
- [ ] **Variable Injection**:
  - Don't just swap City Names.
  - Dynamically inject: Distance (km), Climate data, Road vs Rail specifics,
    localized "Moving to {City}" tips.
- [ ] **Template Logic**: Use conditional partials.
  - Example: `if (transitDays > 7)` -> Show "Long Haul Advice" block.
  - Example: `if (destinationState === 'QLD')` -> Show "Tropical Weather
    Warning" block.

## 4. Dynamic Routing Strategy

- [ ] **Slug Pattern**: Use a single catch-all route `src/pages/[...slug].astro`
      instead of generating thousands of individual files.
- [ ] **`getStaticPaths`**:
  - Fetch all entries from your content collection.
  - Map them to `params: { slug: entry.slug }` and pass the data as `props`.
- [ ] **Hub Pages**: Plan for "Hub" pages (e.g., `/sydney/`) separate from
      "Route" pages (`/sydney-to-melbourne/`).
  - _Improvement_: Avoid hardcoded lists like `HUB_CITIES` in utils if possible.
    Use a directory scan or a separate collection for Hubs to ensure the map
    never falls out of sync.

## 5. SEO & Schema (Critical for Migration)

- [ ] **Canonical URLs**: Implement strict canonical tag logic in a shared
      `SEO.astro` component.
  - _Rule_: Always force the production domain (e.g.,
    `https://movingcars.com.au`) to avoid duplicate content on staging/dev URLs.
- [ ] **Structured Data**:
  - **Service Schema**: Inject `Product` or `Service` schema dynamically in the
    route template.
  - **FAQ Schema**: Generate valid `FAQPage` schema from your route data.
  - _Metric_: Moving Again has 100/100 schema score. Maintain this.
- [ ] **Meta Tags**:
  - Unique Title & Description for _every_ programmatic page (use templates:
    "Car Transport from {Origin} to {Destination}").
  - `noindex` logic for low-quality or search-result pages.
- [ ] **Favicons**: Set up full suite (SVG, PNG, Apple Touch, Manifest)
      immediately.

## 6. Components & UI Patterns

- [ ] **Layout**: Create a standard `Layout.astro` with `Header`, `Footer`, and
      `<slot />`.
- [ ] **Reusability**: Build specific components for repeated sections:
  - `TrustSection.astro` (Reviews, badges).
  - `QuoteCTA.astro` (The conversion form/button).
  - `ProcessSteps.astro`.
- [ ] **Internal Linking (Orphan Prevention)**:
  - _Critical_: Ensure every programmatic page links to:
    1. Its Origin Hub (e.g., link to "Sydney Car Transport").
    2. Its Destination Hub.
    3. Related Routes (e.g., "Other routes from Sydney").
  - _Fix_: Verify the `RelatedRoutes` logic actually returns links. The issue
    report showed orphan pages—these usually happen when a city isn't in the
    "Hub" list or has no related routes.

## 7. Performance & Technical SEO (Lessons from Report)

- [ ] **Scripts**: All third-party scripts (Analytics, Chat, Tracking) MUST use
      `defer` or `async`.
  - _Fixs PERF001_: "No scripts use async or defer".
- [ ] **Images**: Use Astro's `<Image />` component or strictly enforce `srcset`
      on standard `<img>` tags.
  - _Fixes MOB004_: "Images not responsive".
- [ ] **Font Loading**: Use `@fontsource` or self-hosted fonts with
      `font-display: swap`.

## 8. Migration Specifics (Movingcars.com.au)

- [ ] **Sitemap**: Ensure `sitemap-index.xml` is generated and includes all
      thousands of programmatic routes.
- [ ] **Redirects**: If the URL structure changes (e.g., from
      `/transport-sydney-melbourne` to `/sydney-to-melbourne`), prepare a
      massive `_redirects` or `nginx` map immediately.
- [ ] **404 Page**: Custom 404 page to catch broken legacy links.

## 9. Development Workflow

- [ ] **Linting**: Install `eslint-plugin-astro` and `prettier-plugin-astro`
      from Day 1 to avoid formatting wars.
- [ ] **Type Safety**: Use TypeScript for all Utils and Components.
