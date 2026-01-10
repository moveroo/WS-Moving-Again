# Site-Wide Fixes - Priority List

**Source:** Crawl 41 - Service Areas Page Audit (ID: 398)  
**Date:** 2026-01-10  
**Strategy:** Fix issues that affect ALL pages first, then address page-specific issues

---

## 🎯 Site-Wide Issues (Affect All Pages)

These issues, when fixed once, will improve scores across the entire site.

---

### Priority 1: Critical Site-Wide Fixes

#### 1. ✅ robots.txt - Missing llms.txt Reference

- **Issue:** robots.txt does not reference llms.txt
- **Impact:** ALL pages - AI/LLM discoverability
- **Current Status:** llms.txt exists in `/public/llms.txt`
- **Fix Location:** `src/pages/robots.txt.ts`
- **Fix:** Add `Sitemap: https://movingagain.com.au/llms.txt` to robots.txt
- **Effort:** ⚡ 2 minutes
- **Expected Impact:** AI Readiness category improvement across all pages

#### 2. ✅ Cache-Control Headers for HTML Pages

- **Issue:** No Cache-Control header for HTML pages (only static assets have it)
- **Impact:** ALL pages - Performance
- **Current Status:** netlify.toml has Cache-Control for JS/CSS/images, but NOT for HTML
- **Fix Location:** `netlify.toml`
- **Fix:** Add Cache-Control header for HTML pages (shorter cache, e.g., `public, max-age=3600`)
- **Effort:** ⚡ 2 minutes
- **Expected Impact:** Performance Hints category improvement across all pages

#### 3. ✅ Skip Navigation Link

- **Issue:** No skip navigation link detected
- **Impact:** ALL pages - Accessibility
- **Fix Location:** `src/layouts/Layout.astro` (add at top of `<body>`)
- **Fix:** Add `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`
- **Effort:** ⚡ 5 minutes
- **Expected Impact:** Accessibility category improvement across all pages

#### 4. ✅ Content Security Policy (CSP) Header

- **Issue:** CSP header missing
- **Impact:** ALL pages - Security Headers
- **Fix Location:** `netlify.toml`
- **Fix:** Add Content-Security-Policy header
- **Effort:** ⚡ 10 minutes (need to test for any violations)
- **Expected Impact:** Security Headers category improvement across all pages

---

### Priority 2: High-Value Site-Wide Fixes

#### 5. ✅ Image Optimization - Global Pattern

- **Issue:** Images missing alt, srcset, lazy loading, modern formats
- **Impact:** ALL pages with images - Image Optimization (currently 17/100)
- **Current Status:**
  - Header logo has `alt=""` and `aria-hidden="true"` (decorative, OK)
  - Need to check other image usage patterns
- **Fix Strategy:**
  - Create/update global image component or utility
  - Ensure all images have alt attributes
  - Add lazy loading by default
  - Use Astro's Image component for srcset support
- **Fix Location:**
  - Create `src/components/OptimizedImage.astro` or update existing image usage
  - Check all components using images
- **Effort:** ⚡ 30-60 minutes (depending on number of images)
- **Expected Impact:** Image Optimization category improvement from 17 → 80+ across all pages

#### 6. ✅ Content Freshness Meta Tag

- **Issue:** No content date detected
- **Impact:** ALL pages - Meta Tags
- **Fix Location:** `src/components/SEO.astro` or `src/layouts/Layout.astro`
- **Fix:** Add `article:modified_time` meta tag or `dateModified` in Schema.org
- **Note:** May need to track last modified date per page, or use build date
- **Effort:** ⚡ 15 minutes
- **Expected Impact:** Meta Tags category improvement across all pages

#### 7. ✅ Twitter Site Attribution

- **Issue:** No Twitter account attribution
- **Impact:** ALL pages - Social Media
- **Fix Location:** `src/components/SEO.astro`
- **Fix:** Add `<meta name="twitter:site" content="@username">` (if Twitter account exists)
- **Effort:** ⚡ 2 minutes (if account exists)
- **Expected Impact:** Social Media category improvement across all pages

---

### Priority 3: Optional Site-Wide Enhancements

#### 8. ⚠️ BreadcrumbList Schema (Conditional)

- **Issue:** No BreadcrumbList schema found
- **Impact:** ALL pages - Structured Data
- **Fix Location:** `src/components/Schema.astro` or `src/layouts/Layout.astro`
- **Fix:** Add BreadcrumbList schema (may need to be page-specific based on URL structure)
- **Effort:** ⚡ 30 minutes
- **Note:** May need page-specific implementation
- **Expected Impact:** Structured Data category improvement across all pages

#### 9. ⚠️ Hreflang Tags (If Applicable)

- **Issue:** No hreflang tags detected
- **Impact:** ALL pages - Advanced SEO
- **Fix Location:** `src/components/SEO.astro`
- **Fix:** Add hreflang tags if multiple language/regional versions exist
- **Effort:** ⚡ 5 minutes (if applicable)
- **Note:** May not be applicable for single-language site
- **Expected Impact:** Advanced SEO category improvement (if applicable)

---

## 📋 Implementation Order

### Phase 1: Quick Wins (15 minutes total)

1. ✅ robots.txt - Add llms.txt reference
2. ✅ Cache-Control for HTML pages
3. ✅ Skip navigation link
4. ✅ Twitter site attribution (if account exists)

### Phase 2: Medium Effort (30-45 minutes)

5. ✅ Content Security Policy header
6. ✅ Content freshness meta tag

### Phase 3: Image Optimization (30-60 minutes)

7. ✅ Image optimization - audit all images and fix patterns

### Phase 4: Optional Enhancements

8. ⚠️ BreadcrumbList schema (if applicable)
9. ⚠️ Hreflang tags (if applicable)

---

## 📊 Expected Impact

### After Phase 1 (Quick Wins):

- **AI Readiness:** 90 → 95+ (robots.txt fix)
- **Performance Hints:** 85 → 90+ (Cache-Control for HTML)
- **Accessibility:** 80 → 85+ (skip navigation)
- **Social Media:** 92 → 95+ (Twitter attribution)
- **Overall Score:** 87 → 90-91/100

### After Phase 2 (Medium Effort):

- **Security Headers:** 92 → 95+ (CSP)
- **Meta Tags:** 81 → 85+ (content freshness)
- **Overall Score:** 90-91 → 92-93/100

### After Phase 3 (Image Optimization):

- **Image Optimization:** 17 → 80+ (major improvement!)
- **Overall Score:** 92-93 → 96-98/100

---

## 🔍 Files to Modify

1. `src/pages/robots.txt.ts` - Add llms.txt reference
2. `netlify.toml` - Add Cache-Control for HTML, add CSP header
3. `src/layouts/Layout.astro` - Add skip navigation link
4. `src/components/SEO.astro` - Add Twitter attribution, content freshness
5. Image components/files - Audit and fix image patterns

---

## ✅ Verification

After fixes, verify by:

1. Running: `npm run seo:page https://movingagain.com.au/service-areas`
2. Checking robots.txt: `curl https://movingagain.com.au/robots.txt`
3. Checking headers: Use browser DevTools Network tab
4. Running new crawl: `npm run seo:crawl https://movingagain.com.au`

---

**Next Steps:** Start with Phase 1 (Quick Wins) - these can be done in 15 minutes and will improve scores across all pages immediately.
