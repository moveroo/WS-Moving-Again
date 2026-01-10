# Automated Fixes Roadmap

**Created:** 2026-01-10  
**Purpose:** Identify site-wide issues that can be fixed automatically with scripts

---

## ✅ Already Implemented

### 1. SEO Title & Description Generator

- **Status:** ✅ Complete
- **Script:** `src/utils/seoGenerator.ts`
- **Impact:** All 300+ route pages now have optimized titles/descriptions
- **Result:** Titles 45-60 chars, descriptions 150-160 chars

### 2. BreadcrumbList Schema

- **Status:** ✅ Complete
- **Location:** `src/pages/[...slug].astro`
- **Impact:** All 300+ route pages now have BreadcrumbList schema
- **Result:** Breadcrumb structure: Home → Backloading → [Origin] → [Route]

---

## 🎯 High Priority - Can Be Automated

### 1. Title Length Truncation (Site-Wide)

- **Issue:** Titles exceed 60 chars after adding suffix
- **Affected:** 34 pages (83%)
- **Fix Type:** Code modification (SEO.astro)
- **Script:** Update `SEO.astro` to truncate titles before adding suffix
- **Effort:** Low (single file change)
- **Impact:** High (fixes 34 pages automatically)

**Implementation:**

```typescript
// In SEO.astro
const maxTitleLength = 60;
const suffix = ` | ${siteName}`;
const maxTitleWithoutSuffix = maxTitleLength - suffix.length;

let pageTitle;
if (title) {
  if (title.length > maxTitleWithoutSuffix) {
    pageTitle = title.substring(0, maxTitleWithoutSuffix - 3) + '...' + suffix;
  } else {
    pageTitle = title + suffix;
  }
} else {
  pageTitle = siteName;
}
```

---

### 2. Meta Description Length Validation

- **Issue:** 9 pages too long (>170 chars), 4 pages too short (<120 chars)
- **Affected:** 13 pages
- **Fix Type:** Code modification (SEO.astro)
- **Script:** Add auto-truncation/padding logic
- **Effort:** Low
- **Impact:** Medium (fixes 13 pages automatically)

**Implementation:**

```typescript
// In SEO.astro
const maxDescLength = 160;
const minDescLength = 120;

let finalDescription = description;
if (finalDescription.length > maxDescLength) {
  finalDescription = finalDescription.substring(0, 157) + '...';
} else if (finalDescription.length < minDescLength && finalDescription.length > 0) {
  // Add padding or warning
}
```

---

### 3. Image Responsive srcset Attributes

- **Issue:** Images missing responsive srcset (MOB004)
- **Affected:** 100 pages (all pages)
- **Fix Type:** Component modification + content analysis
- **Script:**
  1. Scan all components for `<img>` tags
  2. Add srcset attributes based on image paths
  3. Update image components to use responsive images
- **Effort:** Medium
- **Impact:** High (fixes all pages)

**Implementation:**

```typescript
// Script to find all images and add srcset
// Update Image components to auto-generate srcset
function generateSrcset(imagePath: string): string {
  const base = imagePath.replace(/\.(jpg|png|webp)$/, '');
  return `${base}-320w.webp 320w, ${base}-640w.webp 640w, ${base}-1024w.webp 1024w`;
}
```

---

### 4. Script Async/Defer Attributes

- **Issue:** Scripts missing async/defer (PERF001)
- **Affected:** 100 pages (all pages)
- **Fix Type:** Component modification
- **Script:**
  1. Find all `<script>` tags in components
  2. Add `defer` to non-critical scripts
  3. Add `async` to analytics/third-party scripts
- **Effort:** Low-Medium
- **Impact:** Medium (performance improvement)

**Implementation:**

```typescript
// In components with scripts
<script src="..." defer></script>  // For non-critical
<script src="..." async></script>   // For analytics
```

---

### 5. Missing Organization Schema

- **Issue:** Missing Organization or LocalBusiness schema (SD003)
- **Affected:** 97 pages
- **Fix Type:** Component modification (Schema.astro)
- **Script:** Add Organization schema to all pages
- **Effort:** Low
- **Impact:** Medium (brand visibility)

**Implementation:**

```typescript
// In Schema.astro or Layout.astro
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Moving Again',
  url: 'https://movingagain.com.au',
  // ... other org data
};
```

---

## 🟡 Medium Priority - Can Be Automated

### 6. ✅ BreadcrumbList Schema

- **Status:** ✅ Complete
- **Issue:** Missing breadcrumb schema
- **Affected:** All route pages (300+)
- **Fix Type:** Template modification
- **Result:** BreadcrumbList schema added to all route pages
- **Files:** `src/pages/[...slug].astro`

---

### 7. Content Freshness Dates

- **Issue:** Using build time instead of actual modification dates
- **Affected:** All pages
- **Fix Type:** Build-time script
- **Script:**
  1. Get Git commit date for each file
  2. Or use file system modification date
  3. Pass to SEO component
- **Effort:** Medium
- **Impact:** Low-Medium

**Implementation:**

```typescript
// Build-time script
import { execSync } from 'child_process';
const gitDate = execSync(`git log -1 --format=%cI ${filePath}`).toString();
```

---

### 8. Question Headings

- **Issue:** Not enough question-based headings
- **Affected:** Multiple pages
- **Fix Type:** Content analysis + suggestions
- **Script:**
  1. Scan headings (h2, h3)
  2. Identify headings that could be questions
  3. Generate suggestions or auto-convert
- **Effort:** Medium-High
- **Impact:** Low-Medium

**Example:**

- "Why choose us" → "Why choose us?"
- "How it works" → "How does it work?"

---

### 9. ✅ Table of Contents Generation

- **Status:** ✅ Complete
- **Issue:** Long-form content without TOC
- **Affected:** Backloading page (1629 words)
- **Fix Type:** Component creation
- **Result:** TableOfContents component created and added to backloading page
- **Files:** `src/components/TableOfContents.astro`, `src/pages/backloading.astro`
- **Features:**
  - Manual heading list (most reliable)
  - Anchor links with smooth scroll
  - Only shows if 3+ headings
  - Responsive design

---

### 10. ✅ Missing Meta Tags

- **Status:** ✅ Complete
- **Issue:** Various missing meta tags (Twitter site, author, etc.)
- **Affected:** All pages (340+)
- **Fix Type:** Component modification
- **Result:** Added author attribution meta tags for E-E-A-T
- **Files:** `src/components/SEO.astro`
- **Added:**
  - `name="author"` meta tag
  - `article:author` meta tag (Open Graph)
  - `article:published_time` support
  - Defaults to organization name (Moving Again) for business pages
- **Impact:** Better E-E-A-T signals for search engines

---

### 11. ✅ Security Trust Signals

- **Status:** ✅ Complete
- **Issue:** Missing Security dimension in Trust Triangle (only 2/3 dimensions covered)
- **Affected:** 321 pages (300+ route pages, 4 service pages, ~17 city pages)
- **Fix Type:** Hybrid approach (component enhancement + standalone component)
- **Result:** Complete Trust Triangle (Authority, Social Proof, Security)
- **Files:**
  - `src/components/RouteTrustSection.astro` - Enhanced with security signals
  - `src/components/TrustSignals.astro` - New standalone component
  - `src/pages/backloading.astro` - Added TrustSignals
  - `src/pages/moving-interstate.astro` - Added TrustSignals
  - `src/pages/car-transport.astro` - Added TrustSignals
  - `src/pages/service-areas.astro` - Added TrustSignals
  - All city pages (sydney, melbourne, brisbane, etc.) - Added TrustSignals
- **Automation:** Created `scripts/add-trust-signals-to-cities.mjs` for batch processing
- **Impact:**
  - All pages now have security trust signals
  - Trust Triangle complete (3/3 dimensions)
  - Better user confidence and SEO signals
- **Time Saved:** Manual fix would take ~321 pages × 5 min = 26.75 hours. Systematic fix took 2 hours.

---

## 🔵 Lower Priority - Can Be Automated

### 11. Internal Link Analysis & Fixes

- **Issue:** Orphan pages, missing internal links
- **Affected:** 82 orphan pages (reduced from original)
- **Fix Type:** Content analysis + link injection
- **Script:**
  1. Map all internal links
  2. Identify orphan pages
  3. Suggest/add links from related content
- **Effort:** High
- **Impact:** High (but already partially addressed)

---

### 12. Duplicate Title/Description Detection

- **Issue:** Multiple pages with same title/description
- **Affected:** Unknown
- **Fix Type:** Analysis script
- **Script:**
  1. Scan all pages
  2. Find duplicates
  3. Generate unique alternatives
- **Effort:** Medium
- **Impact:** Medium

---

### 13. Alt Text for Images

- **Issue:** Missing or generic alt text
- **Affected:** Unknown
- **Fix Type:** Content analysis
- **Script:**
  1. Find images without alt text
  2. Generate descriptive alt text from context
  3. Suggest improvements
- **Effort:** Medium-High
- **Impact:** Medium (accessibility + SEO)

---

### 14. Reading Level Optimization

- **Issue:** Reading score too high (36-38, ideal: 60+)
- **Affected:** Homepage, Melbourne
- **Fix Type:** Content analysis + suggestions
- **Script:**
  1. Analyze reading level
  2. Identify complex sentences
  3. Suggest simplifications
- **Effort:** High (AI-assisted)
- **Impact:** Low (content is technical by nature)

---

## 📋 Script Categories

### Type 1: Code Modification Scripts

- Modify existing components/files
- Examples: Title truncation, description validation, schema additions
- **Risk:** Low (can test before deploying)
- **Speed:** Fast (one change fixes many pages)

### Type 2: Content Analysis Scripts

- Analyze content and generate reports
- Examples: Question headings, reading level, duplicate detection
- **Risk:** Very Low (read-only)
- **Speed:** Fast (generates actionable reports)

### Type 3: Content Generation Scripts

- Generate new content/components
- Examples: TOC generation, alt text generation, breadcrumbs
- **Risk:** Medium (generated content needs review)
- **Speed:** Medium (generates new content)

### Type 4: Build-Time Scripts

- Run during build process
- Examples: Git dates, file modification dates, content analysis
- **Risk:** Low (build-time only)
- **Speed:** Fast (automated during build)

---

## 🎯 Recommended Next Steps

### Phase 1: Quick Wins (1-2 hours)

1. ✅ Title truncation in SEO.astro
2. ✅ Description length validation
3. Organization schema addition

### Phase 2: Component Improvements (2-4 hours)

4. Image srcset attributes
5. Script async/defer attributes
6. BreadcrumbList schema

### Phase 3: Content Enhancements (4-8 hours)

7. Table of contents generation
8. Question headings suggestions
9. Content freshness dates

### Phase 4: Advanced (8+ hours)

10. Internal link optimization
11. Alt text generation
12. Reading level optimization

---

## 🛠️ Script Template

For each fix type, we can create:

1. **Analysis Script** - Identifies issues
2. **Fix Script** - Applies fixes (with dry-run mode)
3. **Verification Script** - Confirms fixes worked
4. **Documentation** - How to use and maintain

**Example Structure:**

```
scripts/
  fix-title-length.mjs      # Applies title truncation
  fix-description-length.mjs # Applies description validation
  fix-image-srcset.mjs      # Adds srcset to images
  analyze-issues.mjs         # General analysis
```

---

## 💡 Benefits of Automated Fixes

1. **Consistency:** All pages fixed uniformly
2. **Speed:** Fix hundreds of pages in minutes
3. **Accuracy:** No human error
4. **Maintainability:** Scripts can be re-run as needed
5. **Scalability:** Works for new pages automatically

---

**Status:** Ready to implement  
**Next:** Choose which fixes to implement first
