# Crawl 42 Analysis - Moving Again (After Site-Wide Fixes)

**Crawl ID:** 42  
**Domain:** https://movingagain.com.au/  
**Date:** 2026-01-10 09:40:08 UTC  
**Status:** Completed  
**Mode:** Discovery Mode with Priority URLs (Business Focus Set)  
**Pages Processed:** 10

---

## 📊 Overall Results

### Health Score

- **Overall Score:** N/A (Discovery Mode - focuses on site-wide issues)
- **Status:** ✅ Completed successfully
- **Failed Pages:** 0
- **Duration:** ~14 seconds

### Page Scores Summary

| Page              | Score  | Warnings | Fails | Status       |
| ----------------- | ------ | -------- | ----- | ------------ |
| Backloading       | 96/100 | 5        | 0     | 🟢 Excellent |
| Contact           | 95/100 | 5        | 0     | 🟢 Excellent |
| Moving Interstate | 95/100 | 5        | 0     | 🟢 Excellent |
| Homepage          | 94/100 | 6        | 0     | 🟢 Excellent |
| Service Areas     | 94/100 | 6        | 0     | 🟢 Excellent |
| Brisbane          | 94/100 | 6        | 0     | 🟢 Excellent |
| Perth             | 94/100 | 6        | 0     | 🟢 Excellent |
| Sydney            | 94/100 | 6        | 0     | 🟢 Excellent |
| Car Transport     | 94/100 | 5        | 0     | 🟢 Excellent |
| Melbourne         | 93/100 | 7        | 0     | 🟢 Excellent |

**Average Score:** 94.3/100 🟢 **Excellent Range**  
**Total Warnings:** 57 (all minor)  
**Total Fails:** 0 ✅

---

## 🎯 Comparison: Crawl 41 vs Crawl 42

### Score Improvement

| Metric           | Crawl 41 | Crawl 42 | Change             |
| ---------------- | -------- | -------- | ------------------ |
| Average Score    | 87.6/100 | 94.3/100 | **+6.7 points** ✅ |
| Highest Score    | 88/100   | 96/100   | **+8 points** ✅   |
| Lowest Score     | 87/100   | 93/100   | **+6 points** ✅   |
| Critical Fails   | 0        | 0        | ✅ Maintained      |
| Site-Wide Issues | 0        | 0        | ✅ Maintained      |

### Key Improvements

1. **Overall Score Increase:** +6.7 points average improvement
2. **Backloading Page:** 88 → 96 (+8 points) - Best performing page!
3. **Homepage:** 88 → 94 (+6 points)
4. **Service Areas:** 87 → 94 (+7 points)
5. **All Pages:** Now scoring 93-96 (up from 87-88)

---

## 🔍 Common Issues Across Pages

### 1. Meta Tags (Category Score: 81-88)

#### Title Tag Length

- **Issue:** Most titles are 77-79 characters (ideal: 50-60)
- **Affected Pages:** All pages
- **Impact:** May be truncated in search results
- **Priority:** 🟡 Medium

#### Meta Description

- **Issue:**
  - Homepage: 25 chars (too short, ideal: 150-160)
  - Melbourne: 171 chars (slightly long, ideal: 150-160)
- **Affected Pages:** Homepage, Melbourne
- **Impact:** Suboptimal search result display
- **Priority:** 🟡 Medium

#### Content Freshness

- **Issue:** No content date detected
- **Affected Pages:** All pages
- **Status:** ⚠️ We added `article:modified_time` but it may not be detected
- **Priority:** 🟡 Medium
- **Action:** Verify meta tag is rendering correctly

### 2. Content Quality (Category Score: 85)

#### Author Attribution (E-E-A-T)

- **Issue:** No author attribution found
- **Affected Pages:** All pages
- **Impact:** E-E-A-T signals
- **Priority:** 🟡 Medium
- **Note:** May not be applicable for business/service pages

#### Reading Level

- **Issue:** Reading score 36-38 (College level, ideal: 60+)
- **Affected Pages:** Homepage, Melbourne
- **Impact:** May be too complex for general audience
- **Priority:** 🟡 Low (content is technical by nature)

#### Trust Signals

- **Issue:** Missing Security dimension (2/3 covered)
- **Affected Pages:** All pages
- **Impact:** Trust Triangle incomplete
- **Priority:** 🟡 Medium
- **Action:** Add security trust signals (SSL badges, certifications)

#### Table of Contents

- **Issue:** Long-form content (1629 words) without TOC
- **Affected Pages:** Backloading page
- **Impact:** Navigation and potential jump links in search
- **Priority:** 🟡 Medium
- **Action:** Add table of contents with anchor links

### 3. AI Readiness (Category Score: 90)

#### Question Headings

- **Issue:** Only 1 question heading detected
- **Affected Pages:** Melbourne
- **Impact:** AI/LLM discoverability
- **Priority:** 🟡 Low
- **Action:** Rephrase some subheadings as questions

---

## ✅ What's Working Well

1. **No Critical Issues:** Zero fails across all pages
2. **Consistent High Scores:** All pages 93-96/100
3. **Site-Wide Fixes Working:**
   - Skip navigation ✅
   - Cache-Control headers ✅
   - CSP header ✅
   - robots.txt llms.txt ✅
4. **Excellent Performance:** Backloading page leading at 96/100

---

## 🎯 Priority Action Items

### Priority 1: Quick Wins (High Impact, Low Effort)

1. **Fix Homepage Meta Description**
   - Current: 25 chars
   - Target: 150-160 chars
   - File: `src/pages/index.astro`
   - **Estimated Impact:** +1-2 points

2. **Optimize Title Tags**
   - Shorten to 50-60 characters
   - Affects: All pages
   - **Estimated Impact:** +1 point per page

3. **Add Table of Contents to Backloading Page**
   - Long-form content (1629 words)
   - File: `src/pages/backloading.astro`
   - **Estimated Impact:** +1-2 points

### Priority 2: Medium Effort

4. **Verify Content Freshness Meta Tag**
   - We added it, but may not be rendering
   - Check: `src/components/SEO.astro`
   - **Estimated Impact:** +1 point

5. **Add Security Trust Signals**
   - SSL badges, security certifications
   - **Estimated Impact:** +1-2 points

### Priority 3: Optional Enhancements

6. **Author Attribution** (if applicable)
7. **Question Headings** (AI readiness)
8. **Reading Level** (may not be applicable for technical content)

---

## 📈 Expected Score After Fixes

**Current Average:** 94.3/100

**After Priority 1 Fixes:**

- Homepage meta description: +1-2 points
- Title tag optimization: +1 point (average)
- Table of contents: +1-2 points
- **Estimated New Average:** 96-97/100

**After Priority 2 Fixes:**

- Content freshness verification: +1 point
- Security trust signals: +1-2 points
- **Estimated Final Average:** 97-98/100

---

## 🔄 Next Steps

1. **Fix Priority 1 Issues** - Quick wins for immediate improvement
2. **Run Crawl 43** - After fixes, verify improvements
3. **Compare Results** - Track score progression over time
4. **Continue Monitoring** - Regular discovery crawls with priority URLs

---

## 📝 Notes

- **Discovery Mode:** Focuses on site-wide issues, not comprehensive page scoring
- **No Critical Issues:** All pages performing excellently
- **Site-Wide Fixes:** Successfully improved scores by 6-7 points
- **Remaining Issues:** All minor warnings, no fails

---

**Analysis Date:** 2026-01-10  
**Crawl ID:** 42  
**Status:** Excellent performance, minor optimizations remaining
