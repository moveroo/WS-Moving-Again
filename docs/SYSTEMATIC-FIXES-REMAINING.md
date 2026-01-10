# Systematic Fixes Remaining

**Created:** 2026-01-10  
**Purpose:** Identify remaining issues that can be fixed systematically

---

## 🎯 Quick Wins (High Impact, Low Effort)

### 1. ✅ Homepage Title Optimization

**Issue:** Homepage title is 64 chars (ideal: 50-60)  
**Current:** `"Moving Again | Australia's Interstate Removalists Since 1995"` (64 chars)  
**Target:** 50-60 chars while keeping "Moving Again" at start

**Fix:**

- Optimize homepage title in `src/pages/index.astro`
- Keep "Moving Again" at start (user requirement)
- Shorten middle part: `"Moving Again | Interstate Removalists Since 1995"` (58 chars) ✅

**Impact:** +1-2 points on homepage  
**Effort:** 1 minute (single file change)

---

### 2. ✅ Homepage Meta Description (Verify)

**Issue:** Crawl 44 reported 25 chars, but we fixed it  
**Current:** `"Australia's trusted interstate removalists since 1995. Save up to 60% with backloading, car transport & container shipping. ${BRAND.yearsInBusiness} years experience. Free quotes."`

**Action:** Verify the description is actually rendering correctly (should be ~157 chars)

**Impact:** Already fixed, just need to verify  
**Effort:** 1 minute (check rendered HTML)

---

## 🔧 Medium Priority (Can Be Automated)

### 3. Question Headings for AI Readiness

**Issue:** "Only 1 question heading(s)" on some pages  
**Affected:** Sydney, Service Areas, and potentially others  
**Priority:** Medium (for AI/LLM discoverability)

**Systematic Fix:**

1. Create analysis script: `scripts/analyze-question-headings.mjs`
   - Scan all pages for headings (h2, h3)
   - Identify headings that could be questions
   - Generate suggestions
2. Create conversion script (optional): `scripts/convert-headings-to-questions.mjs`
   - Convert headings like "How It Works" → "How Does It Work?"
   - Convert "Benefits" → "What Are the Benefits?"

**Examples:**

- "Why Choose Us" → "Why Choose Us?" (already a question)
- "How It Works" → "How Does It Work?"
- "Benefits" → "What Are the Benefits?"
- "Pricing" → "How Much Does It Cost?"

**Impact:** Better AI/LLM discoverability  
**Effort:** Medium (analysis script: 1 hour, conversion: 2 hours if automated)

---

### 4. Duplicate Title/Description Detection

**Issue:** Multiple pages may have same title/description  
**Affected:** Unknown (need to analyze)

**Systematic Fix:**

1. Create analysis script: `scripts/detect-duplicate-seo.mjs`
   - Scan all pages
   - Extract titles and descriptions
   - Find duplicates
   - Generate report with suggestions

**Impact:** Prevents duplicate content issues  
**Effort:** Low (analysis script: 30 minutes)

---

### 5. Alt Text Analysis & Suggestions

**Issue:** Missing or generic alt text on images  
**Affected:** Unknown (need to analyze)

**Systematic Fix:**

1. Create analysis script: `scripts/analyze-image-alt-text.mjs`
   - Find all `<img>` tags
   - Check for missing/generic alt text
   - Suggest descriptive alt text based on:
     - Image filename
     - Surrounding context
     - Page content

**Impact:** Better accessibility + SEO  
**Effort:** Medium (analysis script: 1 hour, suggestions: 2 hours if automated)

---

## 🔍 Verification Tasks

### 6. Content Freshness Meta Tag Format

**Issue:** Meta tag exists but crawler may not detect it  
**Current:** `<meta property="article:modified_time" content="2026-01-10T11:26:55.907Z">`  
**Status:** Tag is correctly implemented

**Action:**

- Verify format matches crawler expectations
- Check if we need `article:published_time` as well
- Consider adding `og:updated_time` for Open Graph

**Impact:** Better content freshness signals  
**Effort:** Low (verification: 15 minutes)

---

## 📊 Analysis Scripts to Create

### Priority 1: Quick Analysis Scripts

1. **`scripts/analyze-question-headings.mjs`**
   - Scan all pages
   - Count question headings vs. statement headings
   - Generate suggestions for conversion

2. **`scripts/detect-duplicate-seo.mjs`**
   - Extract all titles/descriptions
   - Find duplicates
   - Generate report

3. **`scripts/analyze-image-alt-text.mjs`**
   - Find all images
   - Check alt text quality
   - Generate suggestions

### Priority 2: Verification Scripts

4. **`scripts/verify-content-freshness.mjs`**
   - Check all pages for `article:modified_time`
   - Verify format
   - Report missing/incorrect dates

---

## 🎯 Recommended Next Steps

### ✅ Completed:

1. ✅ Fix homepage title length (64 → 42 chars)
2. ✅ Question headings analysis script created
3. ✅ Question headings conversion (213 converted, 179 skipped)
4. ✅ Duplicate SEO detection script created (no duplicates found)
5. ✅ Image alt text analysis script created
6. ✅ Image alt text fixes (100% good alt text now)

### 🔍 Remaining Verification:

7. Verify content freshness meta tag format
8. Run another crawl to measure improvements

---

## 📝 Notes

- **Question Headings:** Low priority but good for AI readiness
- **Duplicate Detection:** Important for SEO, should be done
- **Alt Text:** Important for accessibility, should be done
- **Content Freshness:** Already implemented correctly, may just need time for crawler to recognize

---

**Status:** Ready for Implementation  
**Next:** Start with homepage title fix, then create analysis scripts
