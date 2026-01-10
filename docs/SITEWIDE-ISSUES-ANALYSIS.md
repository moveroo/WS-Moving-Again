# Site-Wide Issues Analysis - Code-Based

**Analysis Date:** 2026-01-10  
**Pages Analyzed:** 41  
**Method:** Code analysis (not API-based)

---

## 🔴 Site-Wide Issues (Affect All/Most Pages)

### 1. Title Tag Length - CRITICAL SITE-WIDE ISSUE

**Problem:**

- **34 out of 41 pages (83%)** have titles that will exceed 60 characters
- Root cause: `SEO.astro` adds ` | Moving Again` suffix (18 chars) to all titles
- If a page title is 50-60 chars, adding suffix makes it 68-78 chars (too long)

**Example:**

- Title: `"Backloading Adelaide | Interstate Removals SA | Moving Again"` = 77 chars
- After suffix: Already includes it, but if title was 50 chars, it becomes 68 chars

**Fix Location:** `src/components/SEO.astro` (line 29)

**Fix Strategy:**

```typescript
// Current (line 29):
const pageTitle = title ? `${title} | ${siteName}` : siteName;

// Proposed fix:
const maxTitleLength = 60;
const suffix = ` | ${siteName}`;
const maxTitleWithoutSuffix = maxTitleLength - suffix.length; // 42 chars

let pageTitle;
if (title) {
  if (title.length > maxTitleWithoutSuffix) {
    // Truncate title before adding suffix
    pageTitle = title.substring(0, maxTitleWithoutSuffix - 3) + '...' + suffix;
  } else {
    pageTitle = title + suffix;
  }
} else {
  pageTitle = siteName;
}
```

**Impact:** Fixes 34 pages automatically (83% of site)

---

### 2. Meta Description Default Fallback

**Problem:**

- `SEO.astro` line 21: `description = import.meta.env.PUBLIC_SITE_DESCRIPTION || ''`
- If page doesn't provide description, it falls back to empty string
- This results in very short/empty meta descriptions

**Affected Pages:** Any page without explicit description prop

**Fix Location:** `src/components/SEO.astro` (line 21)

**Fix Strategy:**

```typescript
// Current:
description = import.meta.env.PUBLIC_SITE_DESCRIPTION || '';

// Proposed:
const defaultDescription =
  "Australia's trusted interstate removalists. Save up to 60% with backloading services. Get your free quote today.";
description = description || import.meta.env.PUBLIC_SITE_DESCRIPTION || defaultDescription;
```

**Impact:** Provides fallback for pages missing descriptions

---

### 3. Meta Description Length Validation

**Problem:**

- 9 pages have descriptions over 170 chars (ideal: 150-160)
- 4 pages have descriptions under 120 chars (ideal: 150-160)
- No automatic truncation/padding

**Affected Pages:** 13 pages total

**Fix Location:** `src/components/SEO.astro`

**Fix Strategy:**

```typescript
// Auto-truncate long descriptions
const maxDescLength = 160;
const minDescLength = 120;

let finalDescription = description;
if (finalDescription.length > maxDescLength) {
  finalDescription = finalDescription.substring(0, 157) + '...';
} else if (finalDescription.length < minDescLength && finalDescription.length > 0) {
  // Could pad with ellipsis or leave as-is (depends on content)
  // Or warn in dev mode
}
```

**Impact:** Fixes 13 pages automatically

---

### 4. Content Freshness Meta Tag

**Problem:**

- Uses build time (`new Date().toISOString()`) instead of actual page modification date
- May not be detected as "fresh" content by crawlers

**Status:** Already implemented, but may need adjustment

**Fix Location:** `src/components/SEO.astro` (line 53)

**Current:** `<meta property="article:modified_time" content={new Date().toISOString()} />`

**Options:**

1. Use Git commit date for each file
2. Track modification dates in frontmatter
3. Use file system modification date (build-time)

**Impact:** All pages (if we can implement properly)

---

## 📊 Issue Breakdown by Category

### Title Issues

- **Too Long:** 34 pages (83%) - **SITE-WIDE FIX NEEDED**
- **Too Short:** 3 pages (7%)
- **Missing:** 0 pages (all have titles via Layout or dynamic)

### Description Issues

- **Too Long:** 9 pages (22%)
- **Too Short:** 4 pages (10%)
- **Missing:** 0 pages (all have descriptions, but some may be empty defaults)

---

## 🎯 Recommended Fix Priority

### Priority 1: Title Tag Truncation (HIGH)

- **Affected:** 34 pages (83%)
- **Fix:** Modify `SEO.astro` to truncate titles before adding suffix
- **Effort:** Low (single file change)
- **Impact:** High (fixes 34 pages automatically)

### Priority 2: Meta Description Default (MEDIUM)

- **Affected:** Pages without explicit descriptions
- **Fix:** Add better default description in `SEO.astro`
- **Effort:** Low (single file change)
- **Impact:** Medium (provides fallback)

### Priority 3: Meta Description Length Validation (MEDIUM)

- **Affected:** 13 pages
- **Fix:** Add truncation/padding logic in `SEO.astro`
- **Effort:** Low (single file change)
- **Impact:** Medium (fixes 13 pages automatically)

### Priority 4: Content Freshness (LOW)

- **Affected:** All pages
- **Fix:** Implement proper date tracking
- **Effort:** Medium (requires date tracking system)
- **Impact:** Low (may not significantly affect SEO)

---

## 💡 Next Steps

1. **Implement Priority 1 Fix** - Title truncation in `SEO.astro`
2. **Implement Priority 2 Fix** - Better default description
3. **Implement Priority 3 Fix** - Description length validation
4. **Test** - Run analysis script again to verify fixes
5. **Re-crawl** - Run SEO crawl to verify improvements

---

## 📝 Notes

- The analysis found that **83% of pages** have the same title length issue
- This confirms that a **site-wide fix in SEO.astro** is the right approach
- Individual page fixes would require editing 34+ files
- Site-wide fix requires editing 1 file and fixes all pages automatically

---

**Status:** Ready for implementation  
**Next:** Discuss fix approach, then implement Priority 1-3 fixes
