# Moving Again: Master Plan

> **Single Source of Truth** | Last Updated: Dec 26, 2025

---

## 📊 Source Data

- **Blueprint:** `backloading_removalists_austra_20251226.md`
- **GSC Data:** Dec 2025 (90-day analysis)
- **WordPress Sitemap:** Verified Dec 26, 2025
- **Quote System (Household):**
  `https://removalistquotes.movingagain.com.au/quote/household`
- **Quote System (Car):** `https://removalistquotes.movingagain.com.au/quote/vehicle`
- **Brain Baseline:** Snapshot ID 1, 2, 3

---

## ⚠️ Insurance Terminology (IMPORTANT)

**Transit Insurance** (default with all moves):

- Provided by Moving Again's contractor partners
- ONLY covers: fire, collision, overturning
- Does NOT cover: breakage, scratches, handling damage

**Moving Again Recommendation:**

> We ALWAYS recommend full moving insurance for every move.

**Link to:** `https://movinginsurance.com.au`

When mentioning insurance on pages:

- Be clear that transit insurance is LIMITED
- Always recommend full moving insurance
- Link to movinginsurance.com.au

---

## 🎯 Site Architecture (Hub & Spoke)

```
                       HOMEPAGE (/)
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
  BACKLOADING         INTERSTATE          CAR TRANSPORT
  (pillar)            MOVING (pillar)     (pillar)
        │                   │                   │
  ┌─────┴─────┐       ┌─────┴─────┐       ┌─────┴─────┐
  ▼           ▼       ▼           ▼       ▼           ▼
Perth    Townsville  Boxes    Inventory  Routes   Types
Routes   Pricing     Tips     Checklist  Pricing  FAQ
```

---

## 📌 Pillar Pages (3 Total)

### Pillar 1: Backloading

| Attribute        | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| **URL**          | `/backloading/`                                        |
| **Status**       | ✅ DONE                                                |
| **Blueprint**    | `blueprint_backloading_removalists_austra_20251226.md` |
| **Target Words** | 3,500+                                                 |

**Cluster Pages (link back to pillar):**

- `/perth/` ✅ DONE
- `/townsville/` ❌ TODO
- `/brisbane-cairns/` ❌ TODO (future)
- Route pages → redirect to pillar or hubs

---

### Pillar 2: Interstate Moving

| Attribute        | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| **URL**          | `/moving-interstate/`                                  |
| **Status**       | ✅ DONE                                                |
| **Blueprint**    | `blueprint_interstate_moving_australia_20251226.md` ✅ |
| **Target Words** | 3,559+                                                 |

**Cluster Pages (link back to pillar):**

- `/how-many-boxes-do-i-need-for-my-move/` ❌ TODO
- `/furniture-removal-inventory-list/` ❌ TODO
- `/moving-pot-plants-interstate/` ✅ DONE

---

### Pillar 3: Car Transport

| Attribute        | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| **URL**          | `/car-transport/`                                         |
| **Status**       | ✅ DONE                                                   |
| **Blueprint**    | `blueprint_car_transport_australia_inters_20251226.md` ✅ |
| **Target Words** | 2,028+                                                    |

**Cluster Pages (link back to pillar):**

- Route-specific car transport pages (future, low priority)

---

## 🔁 Repeatable Workflow

For **each pillar page**:

```
1. RUN BLUEPRINT
   └─→ research-engine blueprint "topic" --site "https://..."

2. REVIEW BLUEPRINT
   └─→ Target word count
   └─→ Competitor analysis
   └─→ Topics to cover (H2s)
   └─→ Content gaps

3. BUILD PILLAR PAGE
   └─→ Meet word count target
   └─→ Cover all recommended topics
   └─→ FAQ with schema
   └─→ Comparison tables
   └─→ Link to cluster pages

4. BUILD CLUSTER PAGES
   └─→ Each links BACK to pillar
   └─→ Each links to other clusters
   └─→ Pillar links DOWN to clusters

5. UPDATE HOMEPAGE
   └─→ Link to all pillars
```

### Blueprint Files

| Topic             | File                                                   | Status      |
| ----------------- | ------------------------------------------------------ | ----------- |
| Backloading       | `blueprint_backloading_removalists_austra_20251226.md` | ✅ Used     |
| Interstate Moving | `blueprint_interstate_moving_australia_20251226.md`    | ✅ Ready    |
| Car Transport     | TBD                                                    | ❌ Run next |

---

## 📄 Pages to Build

### Tier 1: Core Pages (DONE)

| Page                             | Status    | Target Words | Notes                                |
| -------------------------------- | --------- | ------------ | ------------------------------------ |
| `/`                              | ⚠️ EXPAND | 800+         | Homepage needs more content          |
| `/backloading/`                  | ✅ DONE   | 3,500+       | Pillar page, rewritten per blueprint |
| `/backloading-quotes/`           | ✅ DONE   | -            | Redirects to external quote system   |
| `/moving-pot-plants-interstate/` | ✅ DONE   | 1,500+       | Top performer, utility content       |
| `/perth/`                        | ✅ DONE   | 800+         | WA location hub                      |

### Tier 2: Content Pages (TODO)

| Page                                     | Status  | Target Words | Source (WordPress)            |
| ---------------------------------------- | ------- | ------------ | ----------------------------- |
| `/townsville/`                           | ❌ TODO | 800+         | QLD hub (template from Perth) |
| `/how-many-boxes-do-i-need-for-my-move/` | ❌ TODO | 1,940+       | Cluster → Interstate Moving   |
| `/furniture-removal-inventory-list/`     | ❌ TODO | 1,940+       | Cluster → Interstate Moving   |
| `/townsville/`                           | ❌ TODO | 800+         | Cluster → Backloading         |

### Tier 3: Essential Pages (TODO)

| Page        | Status  | Target Words | Notes                                          |
| ----------- | ------- | ------------ | ---------------------------------------------- |
| `/contact/` | ❌ TODO | 300+         | Replace `/contact-moving-again/`               |
| `/reviews/` | ❌ TODO | 500+         | Replace `/moving-again-reviews-from-customer/` |
| `/terms/`   | ❌ TODO | Legal        | Merge T&Cs and Terms of Use                    |
| `/privacy/` | ❌ TODO | Legal        | Privacy policy                                 |

### Tier 4: Special - Multi-Pillar FAQ Page

**`/questions/`** (from `/questions-on-moving/`)

| Attribute    | Value                      |
| ------------ | -------------------------- |
| Status       | ❌ TODO                    |
| Target Words | 1,500+                     |
| Structure    | 3 sections, one per pillar |

**Page Structure:**

```
/questions/
├── Section 1: Backloading FAQs
│   └── Links to → /backloading/
├── Section 2: Interstate Moving FAQs
│   └── Links to → /moving-interstate/
└── Section 3: Car Transport FAQs
    └── Links to → /car-transport/
```

### Tier 5: Future Expansion (LOW PRIORITY)

| Page                | Status  | Target Words | Notes                  |
| ------------------- | ------- | ------------ | ---------------------- |
| `/brisbane-cairns/` | ❌ TODO | 800+         | Keep as working route  |
| `/perth-toowoomba/` | ❌ TODO | 800+         | Keep as specific route |

---

## 🔄 Redirects

### Currently in vercel.json (57)

| Target          | Count | Reason              |
| --------------- | ----- | ------------------- |
| `/backloading/` | 48    | Main service pillar |
| `/perth/`       | 6     | WA-related routes   |
| `/townsville/`  | 3     | QLD-related routes  |

### Additional Redirects Needed

| Old URL                                               | New Target      | Reason                   |
| ----------------------------------------------------- | --------------- | ------------------------ |
| `/removalist-quotes/`                                 | External quote  | Redirect to quote system |
| `/interstate-removalists/`                            | `/backloading/` | Consolidate              |
| `/interstate-removalists-perth/`                      | `/perth/`       | Consolidate              |
| `/removalists-brisbane-perth-how-is-it-done/`         | `/backloading/` | Consolidate              |
| `/contact-moving-again/`                              | `/contact/`     | URL cleanup              |
| `/moving-again-reviews-from-customer/`                | `/reviews/`     | URL cleanup              |
| `/questions-on-moving/`                               | `/questions/`   | URL cleanup              |
| `/terms-and-conditions-of-booking-with-moving-again/` | `/terms/`       | URL cleanup              |
| `/terms-of-use/`                                      | `/terms/`       | Consolidate              |

---

## 🔗 External Links

All "Get Quote" CTAs point to:

```
https://removalistquotes.movingagain.com.au/quote/household
```

### Pages Updated with External Quote Link

- [x] `index.astro`
- [x] `backloading.astro`
- [x] `perth.astro`
- [x] `moving-pot-plants-interstate.astro`
- [x] `backloading-quotes.astro` (redirects)

---

## 📋 Blueprint Requirements (MET)

| Requirement       | Target   | Actual | Status |
| ----------------- | -------- | ------ | ------ |
| Pillar page words | 3,386+   | ~3,500 | ✅     |
| FAQ with schema   | Required | Yes    | ✅     |
| Comparison table  | Required | Yes    | ✅     |
| Pricing guide     | Required | Yes    | ✅     |
| Routes/coverage   | Required | Yes    | ✅     |

---

## 🎯 Success Metrics

| Metric                   | Baseline (Dec 2025) | Target (Mar 2026) |
| ------------------------ | ------------------- | ----------------- |
| Monthly Clicks           | 57                  | 150+              |
| Monthly Impressions      | 9,472               | 15,000+           |
| `/backloading/` Position | 50.1                | Top 10            |
| Cannibalization Issues   | 20                  | <5                |
| Total Live Pages         | 100+                | ~15               |

---

## ✅ Execution Checklist

### Phase 1: Foundation ✅ COMPLETE

- [x] Add 57 redirects to `vercel.json`
- [x] Build `/backloading/` pillar page (3,500 words)
- [x] Build `/perth/` location hub
- [x] Build `/moving-pot-plants-interstate/`
- [x] Update all quote links to external system
- [x] Redirect `/backloading-quotes/` to external

### Phase 2: Remaining Content Pages

- [ ] Expand `/` homepage (add routes, trust, FAQ)
- [ ] Build `/townsville/` (copy Perth template)
- [ ] Build `/how-many-boxes-do-i-need-for-my-move/`
- [ ] Build `/furniture-removal-inventory-list/`
- [ ] Build `/moving-interstate/` pillar
- [ ] Build `/questions/` FAQ page

### Phase 3: Essential Pages

- [ ] Build `/contact/`
- [ ] Build `/reviews/`
- [ ] Build `/terms/`
- [ ] Build `/privacy/`
- [ ] Add additional redirects to `vercel.json`

### Phase 4: Polish & Launch

- [ ] Enhance 404 error page
- [ ] Generate sitemap
- [ ] Submit to GSC
- [ ] Deploy to production domain
- [ ] Capture post-launch baseline in Brain

---

## 📁 File Structure (Current)

```
src/pages/
├── index.astro                     ⚠️ NEEDS EXPANSION
├── backloading.astro               ✅ DONE (3,500 words)
├── backloading-quotes.astro        ✅ DONE (redirect)
├── moving-pot-plants-interstate.astro  ✅ DONE
├── perth.astro                     ✅ DONE
├── townsville.astro                ❌ TODO
├── how-many-boxes-do-i-need-for-my-move.astro  ❌ TODO
├── furniture-removal-inventory-list.astro      ❌ TODO
├── moving-interstate.astro         ❌ TODO
├── questions.astro                 ❌ TODO
├── contact.astro                   ❌ TODO
├── reviews.astro                   ❌ TODO
├── terms.astro                     ❌ TODO
├── privacy.astro                   ❌ TODO
├── 404.astro                       ✅ EXISTS
└── robots.txt.ts                   ✅ EXISTS
```

---

## 📊 Summary

| Category        | Done  | TODO   |
| --------------- | ----- | ------ |
| Core pages      | 5     | 0      |
| Content pages   | 0     | 5      |
| Essential pages | 0     | 4      |
| Future pages    | 0     | 3      |
| **Total**       | **5** | **12** |

**Homepage** needs expansion from ~150 words to 800+.

---

## 🚀 Quick Commands

```bash
# Development
cd "/Users/jasonhill/Projects/Websites Control Folder/Moving Again Astro"
npm run dev

# Build
npm run build

# Deploy
git add . && git commit -m "feat: ..." && git push
```

---

## 📞 Contact Info (for pages)

- **Domain:** movingagain.com.au
- **Quote System:** removalistquotes.movingagain.com.au
- **Phone:** TBD
