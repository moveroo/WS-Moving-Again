# Content Uniqueness & Quality Analysis

**Purpose:** Identify duplicate content, thin pages, and opportunities to make every page unique and useful.

---

## 🔍 Analysis Scripts

### 1. Content Uniqueness Analyzer

**Script:** `scripts/analyze-content-uniqueness.mjs`  
**Command:** `npm run analyze:content`

**What it does:**

- Analyzes all page content for uniqueness
- Identifies duplicate/similar content across pages
- Detects thin content (< 300 words)
- Finds common phrases appearing on multiple pages
- Calculates similarity scores between pages

**Output:**

- Console report with:
  - Word count distribution
  - High similarity pairs (≥70%)
  - Medium similarity pairs (50-69%)
  - Thin content pages
  - Common phrases analysis
- JSON report: `analysis-content-uniqueness.json`

**Example:**

```bash
npm run analyze:content
```

---

### 2. Content Improvement Suggestions

**Script:** `scripts/suggest-content-improvements.mjs`  
**Command:** `npm run suggest:content [page-file]`

**What it does:**

- Generates specific, actionable suggestions for each page
- Identifies what makes pages similar
- Suggests page-specific improvements
- Prioritizes pages needing the most work

**Usage:**

```bash
# Analyze all pages
npm run suggest:content

# Analyze specific page
npm run suggest:content ballarat.astro
```

**Output:**

- Top 10 pages needing improvement
- Detailed suggestions for top 5 pages
- JSON report: `content-improvement-suggestions.json`

---

## 📊 Key Metrics

### Word Count Categories

- **❌ Thin Content:** < 300 words
- **🟡 Good Content:** 300-999 words
- **✅ Excellent Content:** 1000+ words

### Similarity Thresholds

- **🔴 High Similarity:** ≥70% (potential duplicates)
- **🟡 Medium Similarity:** 50-69% (review for uniqueness)
- **✅ Low Similarity:** <50% (unique enough)

---

## 🎯 Common Issues Found

### 1. City Pages Are Too Similar

**Issue:** City hub pages (ballarat, bendigo, geelong, etc.) have 70-86% similarity.

**Why:** They use the same template with minimal customization.

**Solution:**

- Add city-specific details (population, economy, growth)
- Include local landmarks and areas
- Add city-specific transit times
- Include local moving considerations
- Add city-specific service areas

### 2. Thin Content Pages

**Issue:** 25 pages have < 300 words.

**Solution:**

- Expand to at least 300 words (ideally 500+)
- Add page-specific sections
- Include local information
- Add FAQs or tips

### 3. Common Phrases

**Issue:** Generic phrases appear on 20-25 pages:

- "major australian cities"
- "backloading services from"
- "get instant quote for your"
- "ready move from"

**Solution:**

- Customize phrases for each city/page
- Replace generic language with specific details
- Include city name in CTAs and headings

---

## 💡 Improvement Workflow

### Step 1: Run Analysis

```bash
npm run analyze:content
```

This generates `analysis-content-uniqueness.json` with all the data.

### Step 2: Get Suggestions

```bash
npm run suggest:content
```

This shows which pages need the most work and specific suggestions.

### Step 3: Focus on High-Priority Pages

Start with pages that have:

- **High similarity** (≥70%) to other pages
- **Thin content** (< 300 words)
- **Multiple common phrases**

### Step 4: Implement Improvements

For each page, add:

1. **Page-specific details** (city name, state, local info)
2. **Unique sections** (local landmarks, service areas)
3. **Customized content** (replace generic phrases)
4. **Additional content** (expand to 300+ words)

### Step 5: Re-run Analysis

After making changes, re-run the analysis to measure improvement.

---

## 📝 Example: Improving a City Page

**Before:**

- 170 words
- 75% similar to other city pages
- Uses 20 common phrases

**After (Target):**

- 400+ words
- <50% similar to other pages
- City-specific content throughout

**Improvements to Add:**

1. "About [City]" section with local information
2. "[City] Service Areas" with specific suburbs
3. "Popular Routes from [City]" with transit times
4. "[City]-specific moving tips"
5. Local statistics and data
6. Customized CTAs mentioning the city

---

## 🔄 Regular Analysis

**Recommended Frequency:**

- After major content updates
- Before SEO crawls
- Quarterly content audits

**Goal:**

- All pages: 300+ words
- All pages: <50% similarity to others
- All pages: Unique, useful content

---

## 📁 Output Files

1. **`analysis-content-uniqueness.json`**
   - Full analysis data
   - Similarity scores
   - Word counts
   - Common phrases

2. **`content-improvement-suggestions.json`**
   - Specific suggestions per page
   - Prioritized recommendations
   - Actionable improvements

---

## 🎯 Success Metrics

**Target Goals:**

- ✅ 0 pages with < 300 words
- ✅ 0 high-similarity pairs (≥70%)
- ✅ Average word count: 500+
- ✅ All pages have unique, valuable content

---

**Last Updated:** 2026-01-10  
**Status:** Active Analysis Tool
