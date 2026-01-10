# Priority Pages Strategy for SEO Crawler

**Date:** 2026-01-10  
**Purpose:** Strategic selection of priority URLs for Discovery Mode crawls  
**Max Priority URLs:** 10 (API limit)

---

## 🎯 Selection Criteria

Pages should be prioritized based on:

1. **Business Value** - Revenue-generating pages, conversion pages
2. **SEO Importance** - High-traffic, high-ranking, pillar pages
3. **Content Types** - Representative samples of different page types
4. **Recent Changes** - Pages we've recently fixed or improved
5. **User Journey** - Entry points, key decision pages
6. **Performance Tracking** - Pages we want to monitor over time

---

## 📊 Tier System

### Tier 1: Core Business Pages (Always Include)

**Priority:** 🔴 Critical  
**Count:** 3-4 pages  
**Reason:** These are the most important pages for business and SEO

| Page              | URL                   | Reason                            |
| ----------------- | --------------------- | --------------------------------- |
| Homepage          | `/`                   | Main entry point, highest traffic |
| Backloading       | `/backloading/`       | Main service pillar (3,500 words) |
| Moving Interstate | `/moving-interstate/` | Secondary service pillar          |
| Service Areas     | `/service-areas/`     | Hub for city discovery            |

### Tier 2: Major City Hubs (Rotate Selection)

**Priority:** 🟡 High  
**Count:** 3-4 pages  
**Reason:** Represent different states/regions, high search volume

**Capital Cities (Always include 2-3):**

- `/sydney/` - NSW, largest city
- `/melbourne/` - VIC, second largest
- `/brisbane/` - QLD, high migration
- `/perth/` - WA, isolated market

**Selection Strategy:**

- Include 2-3 capitals per crawl
- Rotate which ones to get coverage over time
- Prioritize capitals with highest traffic/rankings

### Tier 3: Service/Content Pages (Sample)

**Priority:** 🟢 Medium  
**Count:** 1-2 pages  
**Reason:** Represent different content types

| Page          | URL               | Content Type |
| ------------- | ----------------- | ------------ |
| Car Transport | `/car-transport/` | Service page |
| Contact       | `/contact/`       | Utility page |
| Questions     | `/questions/`     | FAQ page     |

### Tier 4: Route Pages (Sample)

**Priority:** 🔵 Low  
**Count:** 0-1 pages  
**Reason:** Sample of dynamic route pages

**Selection:**

- Pick 1 high-traffic route (e.g., `/sydney-to-melbourne/`)
- Or skip entirely (routes are similar, city hubs cover them)

---

## 🎯 Recommended Priority URL Sets

### Set A: Business Focus (Default)

**Use For:** Regular health checks, business-critical monitoring

```
1. https://movingagain.com.au/
2. https://movingagain.com.au/backloading/
3. https://movingagain.com.au/moving-interstate/
4. https://movingagain.com.au/service-areas/
5. https://movingagain.com.au/sydney/
6. https://movingagain.com.au/melbourne/
7. https://movingagain.com.au/brisbane/
8. https://movingagain.com.au/car-transport/
9. https://movingagain.com.au/contact/
10. https://movingagain.com.au/perth/
```

**Total:** 10 URLs ✅

### Set B: Regional Focus

**Use For:** When focusing on regional coverage

```
1. https://movingagain.com.au/
2. https://movingagain.com.au/backloading/
3. https://movingagain.com.au/moving-interstate/
4. https://movingagain.com.au/service-areas/
5. https://movingagain.com.au/perth/
6. https://movingagain.com.au/adelaide/
7. https://movingagain.com.au/canberra/
8. https://movingagain.com.au/darwin/
9. https://movingagain.com.au/hobart/
10. https://movingagain.com.au/car-transport/
```

**Total:** 10 URLs ✅

### Set C: Content Diversity

**Use For:** When testing different content types

```
1. https://movingagain.com.au/
2. https://movingagain.com.au/backloading/
3. https://movingagain.com.au/moving-interstate/
4. https://movingagain.com.au/service-areas/
5. https://movingagain.com.au/sydney/
6. https://movingagain.com.au/car-transport/
7. https://movingagain.com.au/contact/
8. https://movingagain.com.au/questions/
9. https://movingagain.com.au/moving-pot-plants-interstate/
10. https://movingagain.com.au/how-many-boxes-do-i-need-for-my-move/
```

**Total:** 10 URLs ✅

### Set D: Recently Improved Pages

**Use For:** After making SEO improvements, verify fixes

```
1. https://movingagain.com.au/
2. https://movingagain.com.au/backloading/
3. https://movingagain.com.au/moving-interstate/
4. https://movingagain.com.au/service-areas/
5. https://movingagain.com.au/sydney/
6. https://movingagain.com.au/melbourne/
7. https://movingagain.com.au/brisbane/
8. https://movingagain.com.au/perth/
9. https://movingagain.com.au/adelaide/
10. https://movingagain.com.au/canberra/
```

**Total:** 10 URLs ✅

---

## 🔄 Rotation Strategy

### Weekly Crawls

- **Week 1:** Set A (Business Focus)
- **Week 2:** Set B (Regional Focus)
- **Week 3:** Set A (Business Focus)
- **Week 4:** Set C (Content Diversity)

### After Major Changes

- Use Set D (Recently Improved Pages)
- Include all pages that were modified

### Monthly Deep Analysis

- Use Set A + Full Crawl (--limit=200)
- Get comprehensive site analysis

---

## 📋 Decision Framework

### When to Use Priority URLs:

✅ **Use Priority URLs When:**

- Running Discovery Mode (10 pages)
- Want to ensure specific pages are analyzed
- Testing recent improvements
- Monitoring business-critical pages
- Limited time/resources

❌ **Skip Priority URLs When:**

- Running Full Crawl (--limit=100+)
- Want to discover all pages naturally
- Testing page discovery/internal linking
- Comprehensive site audit

---

## 🎯 Quick Reference Commands

### Discovery Mode with Priority URLs (Set A)

```bash
npm run seo:crawl https://movingagain.com.au --urls=https://movingagain.com.au/,https://movingagain.com.au/backloading/,https://movingagain.com.au/moving-interstate/,https://movingagain.com.au/service-areas/,https://movingagain.com.au/sydney/,https://movingagain.com.au/melbourne/,https://movingagain.com.au/brisbane/,https://movingagain.com.au/car-transport/,https://movingagain.com.au/contact/,https://movingagain.com.au/perth/
```

### Discovery Mode with Priority URLs (Set B - Regional)

```bash
npm run seo:crawl https://movingagain.com.au --urls=https://movingagain.com.au/,https://movingagain.com.au/backloading/,https://movingagain.com.au/moving-interstate/,https://movingagain.com.au/service-areas/,https://movingagain.com.au/perth/,https://movingagain.com.au/adelaide/,https://movingagain.com.au/canberra/,https://movingagain.com.au/darwin/,https://movingagain.com.au/hobart/,https://movingagain.com.au/car-transport/
```

### Full Crawl (No Priority URLs - Natural Discovery)

```bash
npm run seo:crawl https://movingagain.com.au --limit=200
```

---

## 📊 Tracking & Analysis

### What to Track:

1. **Page Scores** - Monitor individual page scores over time
2. **Issue Detection** - Track which issues appear on priority pages
3. **Score Trends** - Watch for score improvements after fixes
4. **Issue Resolution** - Verify fixes are working

### Comparison Points:

- **Before Fixes:** Baseline scores from Crawl 41
- **After Fixes:** Compare to verify improvements
- **Ongoing:** Track trends over time

---

## 🎯 Recommended Starting Point

**For Next Crawl: Use Set A (Business Focus)**

This ensures:

- ✅ All business-critical pages are analyzed
- ✅ Good geographic coverage (major capitals)
- ✅ Mix of page types (homepage, services, cities, utility)
- ✅ Representative sample of site structure

**Command:**

```bash
npm run seo:crawl https://movingagain.com.au --urls=https://movingagain.com.au/,https://movingagain.com.au/backloading/,https://movingagain.com.au/moving-interstate/,https://movingagain.com.au/service-areas/,https://movingagain.com.au/sydney/,https://movingagain.com.au/melbourne/,https://movingagain.com.au/brisbane/,https://movingagain.com.au/car-transport/,https://movingagain.com.au/contact/,https://movingagain.com.au/perth/
```

---

## 📝 Notes

- **Max 10 URLs:** API limit, so choose carefully
- **Homepage Always First:** Ensures it's always analyzed
- **Rotate City Hubs:** Get coverage of all major cities over time
- **Track Changes:** Use Set D after making improvements
- **Full Crawls:** Skip priority URLs for comprehensive analysis

---

**Status:** Ready to use  
**Next Action:** Run first crawl with Set A to establish baseline
