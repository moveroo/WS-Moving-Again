# SEO Technical Crawler - Complete Guide

**Purpose:** This guide documents the complete setup, usage, and methodology for using the technical.again.com.au SEO crawler to audit and improve website SEO performance.

**Test Site:** moveroo.com.au (used as reference implementation)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Scripts](#scripts)
4. [Basic Usage](#basic-usage)
5. [Querying Results](#querying-results)
6. [Testing Methodology](#testing-methodology)
7. [Common Issues & False Positives](#common-issues--false-positives)
8. [Best Practices](#best-practices)
9. [API Reference](#api-reference)

---

## Overview

The SEO Technical Crawler uses the **technical.again.com.au** API to perform comprehensive SEO audits of websites. It provides:

- **Single Page Audits:** Quick analysis of individual pages
- **Full Site Crawls:** Complete site analysis with health scores
- **Detailed Issue Detection:** Identifies SEO problems with actionable fixes
- **Score Tracking:** Monitor improvements over time

### Health Score Ranges

- 🟢 **80-100** - Excellent - Minor improvements possible
- 🟡 **60-79** - Good - Some issues to address
- 🟠 **40-59** - Fair - Several issues need attention
- 🔴 **0-39** - Poor - Significant SEO problems

---

## Setup

### 1. Get API Token

check official docs here curl https://technical.again.com.au/api

1. Visit: https://technical.again.com.au/api-access
2. Sign up or log in
3. Generate an API token
4. Copy the token

### 2. Configure Environment

Create a `.env` file in your project root:

```env
SEO_AUDITOR_TOKEN=your_token_here
```

### 3. Install Dependencies

The scripts require Node.js and the `dotenv` package:

```bash
npm install dotenv
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "dotenv": "^17.2.3"
  }
}
```

### 4. Add Scripts to package.json

Add these npm scripts to your `package.json`:

```json
{
  "scripts": {
    "seo:audit": "node scripts/seo-audit.mjs",
    "seo:page": "node scripts/seo-audit.mjs page",
    "seo:crawl": "node scripts/seo-audit.mjs crawl",
    "seo:status": "node scripts/seo-audit.mjs status",
    "seo:list": "node scripts/seo-audit.mjs list"
  }
}
```

---

## Scripts

### 1. Main SEO Audit Script

**Location:** `scripts/seo-audit.mjs`

This is the primary script for running audits and crawls.

**Features:**

- Single page audits
- Full site crawls
- Status checking
- Crawl history listing
- Real-time progress tracking
- Detailed results display

**Commands:**

- `npm run seo:audit page [url]` - Audit a single page
- `npm run seo:audit crawl [domain]` - Full site crawl
- `npm run seo:audit status [id]` - Check crawl status
- `npm run seo:audit list` - List all crawls
- `npm run seo:audit help` - Show help

### 2. Individual Page Details Script

**Location:** `scripts/check-crawl-pages.mjs`

Fetches detailed information for each page in a crawl.

**Usage:**

```bash
node scripts/check-crawl-pages.mjs [crawlId]
```

**What it does:**

- Fetches full audit details for each page in a crawl
- Saves individual page JSON files
- Creates a summary JSON file
- Displays score, fails, warnings, and category scores

**Output:**

- Creates `crawl-{id}-details/` directory
- Saves individual page JSON files
- Creates `summary.json` with all page data

---

## Basic Usage

### Single Page Audit

Audit a single page for quick analysis:

```bash
npm run seo:audit page https://example.com/contact/
```

**Output includes:**

- Overall score (0-100)
- Summary
- Action items by category
- Issue priorities (high/medium/low)
- Remediation suggestions

### Full Site Crawl

Run a complete site crawl:

```bash
npm run seo:audit crawl https://example.com
```

**Process:**

1. Starts crawl and returns crawl ID
2. Polls for completion (up to 10 minutes)
3. Displays results when complete

**Output includes:**

- Overall health score
- Issues found (with counts)
- Individual page scores
- Affected URLs
- Timestamps

### Check Crawl Status

If a crawl is still running or you want to check a previous crawl:

```bash
npm run seo:audit status 42
```

### List All Crawls

View history of all crawls:

```bash
npm run seo:audit list
```

Shows:

- Crawl ID
- Health Score
- Status
- Domain

---

## Querying Results

### Full Crawl Results

When you run a crawl, the main script displays:

1. **Overall Health Score** - Site-wide score
2. **Issues Summary** - Types of issues found
3. **Page Scores** - Individual page scores sorted by lowest first
4. **Issue Details** - For each issue type:
   - Count of affected pages
   - Description
   - Fix suggestions
   - Affected URLs (up to 10 shown)

### Individual Page Details

To get detailed information for each page in a crawl:

```bash
node scripts/check-crawl-pages.mjs [crawlId]
```

**This script:**

1. Fetches the crawl summary
2. For each page in the crawl:
   - Gets full audit details via `/audit/{auditId}`
   - Extracts score, fails, warnings
   - Shows category scores
   - Saves full JSON to file

**Output Structure:**

```
crawl-{id}-details/
├── summary.json              # All pages summary
├── example-com-contact.json  # Individual page details
├── example-com-services.json
└── ...
```

**summary.json structure:**

```json
[
  {
    "url": "https://example.com/contact/",
    "auditId": "12345",
    "score": 98,
    "failCount": 0,
    "warningCount": 3,
    "categoryScores": {
      "content_quality": 95,
      "structured_data": 94,
      "performance_hints": 95
    }
  }
]
```

**Individual page JSON includes:**

- `overall_score` - Page score
- `action_items` - All issues by category
- `category_scores` - Scores per category
- `summary` - Text summary
- Full issue details with priorities and remediation

### API Endpoints Used

**Base URL:** `https://technical.again.com.au/api`

1. **Start Page Audit:**

   ```
   POST /audit
   Body: { "url": "https://example.com/page" }
   Returns: { "audit_id": "12345" }
   ```

2. **Check Page Audit Status:**

   ```
   GET /audit/{audit_id}
   Returns: Full audit results
   ```

3. **Start Crawl:**

   ```
   POST /crawls
   Body: { "domain": "https://example.com", "depth": 5, "limit": 100 }
   Returns: { "data": { "id": "42" } }
   ```

4. **Get Crawl Status:**

   ```
   GET /crawls/{crawl_id}
   Returns: Crawl results with audits array
   ```

5. **List All Crawls:**
   ```
   GET /crawls
   Returns: Array of all crawls
   ```

---

## Testing Methodology

### Workflow for Testing Changes

1. **Baseline Crawl**

   ```bash
   npm run seo:audit crawl https://example.com
   ```

   - Note the crawl ID
   - Document scores and issues
   - Save results

2. **Make Changes**
   - Implement fixes
   - Deploy to production
   - Wait for deployment to complete

3. **Verification Crawl**

   ```bash
   npm run seo:audit crawl https://example.com
   ```

   - Note the new crawl ID
   - Compare with baseline

4. **Detailed Analysis**

   ```bash
   node scripts/check-crawl-pages.mjs [newCrawlId]
   ```

   - Review individual page details
   - Check if fixes were detected
   - Identify any new issues

5. **Documentation**
   - Create comparison document
   - Note score changes
   - Document false positives
   - Update action plans

### Comparison Document Template

Create a file like `CRAWL-{id1}-vs-{id2}-COMPARISON.md`:

```markdown
# Crawl {id1} vs Crawl {id2} - Comparison

**Crawl {id1} Date:** [date and time]
**Crawl {id2} Date:** [date and time]
**Time Between Crawls:** [duration]
**Changes Made:** [brief description]

## Overall Results Comparison

| Metric          | Crawl {id1} | Crawl {id2} | Change       |
| --------------- | ----------- | ----------- | ------------ |
| Health Score    | X/100       | Y/100       | +/-Z         |
| Issues Found    | X types     | Y types     | +/-Z         |
| Pages Processed | X/Y         | X/Y         | Same/Changed |

## Page-by-Page Score Comparison

| Page     | Crawl {id1} | Crawl {id2} | Change | Status                       |
| -------- | ----------- | ----------- | ------ | ---------------------------- |
| Homepage | X           | Y           | +/-Z   | Improved/Maintained/Declined |

## Improvements Detected

### [Page Name]: X → Y (+Z points)

**Issues Resolved:**

- ✅ Issue 1 - Description
- ✅ Issue 2 - Description

**Remaining Issues:**

- ⚠️ Issue 3 - Description

## False Positives

### [Issue Name]

**Crawler Says:** [what crawler reports]
**Reality:** [actual implementation]
**Status:** FALSE POSITIVE
```

### Tracking Progress

**Recommended approach:**

1. **Number your crawls sequentially** (Crawl 1, 2, 3, etc.)
2. **Document each crawl** with:
   - Date and time
   - Changes made since last crawl
   - Scores (overall and per-page)
   - Issues found
3. **Create comparison documents** between significant crawls
4. **Track false positives** separately
5. **Maintain a roadmap** document for planned improvements

---

## Common Issues & False Positives

### Known False Positives

Based on testing with moveroo.com.au, these issues may appear but are actually implemented:

#### 1. Content Freshness

**Crawler Says:**

- "No content date detected"
- "Add article:modified_time meta tag"

**Reality:**

- Meta tag is present: `<meta property="article:modified_time" content="2026-01-10T00:00:00.000Z" />`
- Structured data includes: `"dateModified": "2026-01-10T00:00:00.000Z"`

**Status:** FALSE POSITIVE - May take time for crawler to detect

#### 2. FAQ/HowTo Schema

**Crawler Says:**

- "FAQ content detected - add FAQPage schema"
- "Step-by-step content detected - add HowTo schema"

**Reality:**

- FAQPage schema is present with Q&A pairs
- HowTo schema is present with steps

**Status:** FALSE POSITIVE - Schema may not be detected immediately

#### 3. Author Attribution

**Crawler Says:**

- "No author attribution found"

**Reality:**

- Author schema is present
- Organization attribution is present

**Status:** FALSE POSITIVE - May require specific schema structure

#### 4. External Stylesheets

**Crawler Says:**

- "7-8 external stylesheets detected"

**Reality:**

- CSS is fully inlined/bundled
- Only 1-2 actual external stylesheets

**Status:** FALSE POSITIVE - Crawler may count CSS chunks as separate files

### Common Real Issues

#### 1. Orphan Pages

**Issue:** Pages with no incoming internal links

**Fix:** Add internal links from:

- Navigation menu
- Footer links
- Related content pages
- Sitemap

#### 2. Duplicate Titles/Descriptions

**Issue:** Multiple pages share the same title or meta description

**Fix:** Write unique, descriptive titles and descriptions for each page

#### 3. Missing from Sitemap

**Issue:** Important pages not included in sitemap

**Fix:** Add pages to sitemap.xml

#### 4. Sitemap Orphans

**Issue:** Pages listed in sitemap but not found by crawler

**Fix:** Remove non-existent pages or ensure they're accessible

#### 5. Reading Level

**Issue:** Content reading level too high (college/graduate level)

**Fix:**

- Simplify sentences
- Use shorter words
- Break up long paragraphs
- Target: 60+ (high school level)

#### 6. Question Headings

**Issue:** Not enough question-based headings

**Fix:** Rephrase some headings as questions:

- "Why this matters" → "Why does this matter?"
- "How it works" → "How does it work?"

---

## Best Practices

### 1. Crawl Frequency

- **After major changes:** Run immediately after deployment
- **Regular monitoring:** Weekly or bi-weekly
- **Before/after comparisons:** Always run baseline before changes

### 2. Documentation

- **Track all crawls:** Number them sequentially
- **Document changes:** What was changed between crawls
- **Compare results:** Create comparison documents
- **Note false positives:** Keep a list of known false positives

### 3. Fix Priority

**High Priority (Fails):**

- Fix immediately
- These significantly impact scores
- Examples: External stylesheets, content depth

**Medium Priority (Warnings):**

- Address in batches
- Examples: Reading level, question headings

**Low Priority (Optional):**

- May be false positives
- Examples: Review/rating markup (if not applicable)

### 4. Testing Strategy

1. **One change at a time** (when possible) to isolate effects
2. **Wait for deployment** before re-crawling
3. **Compare immediately** after changes
4. **Document everything** - you'll forget details later

### 5. Score Interpretation

- **Small changes (±1-2 points):** May be algorithm weighting, not actual issues
- **Larger changes (±3+ points):** Likely real improvements or regressions
- **Category scores:** More granular than overall score
- **Fails vs Warnings:** Fails have more impact on score

### 6. Issue Verification

Before fixing an issue:

1. **Verify it's real:** Check the actual page source
2. **Check if already fixed:** May be a false positive
3. **Understand the fix:** Read the remediation suggestion
4. **Test after fix:** Re-crawl to verify

---

## API Reference

### Authentication

All requests require a Bearer token:

```javascript
headers: {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
}
```

### Endpoints

#### POST /audit

Start a single page audit.

**Request:**

```json
{
  "url": "https://example.com/page"
}
```

**Response:**

```json
{
  "audit_id": "12345"
}
```

#### GET /audit/{audit_id}

Get audit results.

**Response:**

```json
{
  "status": "completed",
  "overall_score": 98,
  "summary": "Page summary...",
  "action_items": [
    {
      "category": "Content Quality",
      "issues": [
        {
          "title": "Issue title",
          "description": "Issue description",
          "priority": "high|medium|low",
          "status": "fail|warning",
          "remediation": "How to fix"
        }
      ]
    }
  ],
  "category_scores": {
    "content_quality": 95,
    "structured_data": 94
  }
}
```

#### POST /crawls

Start a full site crawl.

**Request:**

```json
{
  "domain": "https://example.com",
  "depth": 5,
  "limit": 100
}
```

**Response:**

```json
{
  "data": {
    "id": "42"
  }
}
```

#### GET /crawls/{crawl_id}

Get crawl results.

**Response:**

```json
{
  "id": "42",
  "domain": "https://example.com",
  "status": "completed",
  "score": 94,
  "issues_count": 0,
  "issues": [
    {
      "type": "orphan_page",
      "count": 2,
      "message": "Pages with no incoming internal links",
      "data": ["https://example.com/page1", "https://example.com/page2"]
    }
  ],
  "audits": [
    {
      "id": "12345",
      "audit_id": "12345",
      "url": "https://example.com/page",
      "score": 98
    }
  ],
  "progress": {
    "processed": 9,
    "total": 9,
    "failed": 0
  },
  "timestamps": {
    "created_at": "2026-01-10T10:00:00Z",
    "completed_at": "2026-01-10T10:05:00Z"
  }
}
```

#### GET /crawls

List all crawls.

**Response:**

```json
{
  "data": [
    {
      "id": "42",
      "domain": "https://example.com",
      "status": "completed",
      "score": 94
    }
  ]
}
```

### Polling Strategy

For both audits and crawls:

1. Start the operation (returns ID)
2. Poll status endpoint every 5 seconds
3. Check `status` field:
   - `"pending"` or `"running"` → Continue polling
   - `"completed"` → Process results
   - `"failed"` → Handle error
4. Timeout after reasonable duration (60 attempts for audits, 120 for crawls)

---

## Script Files

### scripts/seo-audit.mjs

Complete script for running audits and crawls. Copy this file to your project's `scripts/` directory.

**Key Functions:**

- `runPageAudit(url)` - Audit single page
- `runCrawl(domain)` - Run full site crawl
- `checkCrawlStatus(crawlId)` - Check crawl status
- `showCrawlList()` - List all crawls
- `displayCrawlResults(crawl)` - Format and display results
- `displayPageResults(results)` - Format and display page audit

### scripts/check-crawl-pages.mjs

Script for fetching detailed information about each page in a crawl.

**Key Functions:**

- `getCrawlStatus(crawlId)` - Get crawl summary
- `getAuditDetails(auditId)` - Get full page audit details
- Saves individual JSON files for each page
- Creates summary JSON file

---

## Example Workflow

### Complete Testing Cycle

```bash
# 1. Baseline crawl
npm run seo:audit crawl https://example.com
# Note: Crawl ID 10, Score: 92/100

# 2. Make changes (fix issues, deploy)

# 3. Verification crawl
npm run seo:audit crawl https://example.com
# Note: Crawl ID 11, Score: 95/100

# 4. Get detailed page information
node scripts/check-crawl-pages.mjs 11

# 5. Review results
# - Check crawl-11-details/summary.json
# - Review individual page JSON files
# - Create comparison document

# 6. Document findings
# Create: docs/CRAWL-10-vs-11-COMPARISON.md
```

---

## Troubleshooting

### Token Not Found

**Error:** `SEO_AUDITOR_TOKEN not found in .env file`

**Fix:**

1. Check `.env` file exists in project root
2. Verify token is set: `SEO_AUDITOR_TOKEN=your_token_here`
3. Ensure no quotes around token value
4. Restart terminal/process

### Crawl Timeout

**Issue:** Crawl takes longer than expected

**Fix:**

1. Check status manually: `npm run seo:audit status [id]`
2. Large sites may take 10+ minutes
3. Check API status at technical.again.com.au

### API Errors

**Error:** `API Error: 401 - Unauthorized`

**Fix:**

1. Verify token is correct
2. Check token hasn't expired
3. Regenerate token if needed

**Error:** `API Error: 429 - Too Many Requests`

**Fix:**

1. Wait a few minutes
2. Reduce crawl frequency
3. Check API rate limits

### Results Not Updating

**Issue:** Changes not reflected in new crawl

**Fix:**

1. Ensure changes are deployed to production
2. Wait for deployment to complete
3. Clear CDN cache if applicable
4. Wait 5-10 minutes after deployment before crawling
5. Some changes may take time for crawler to detect

---

## Additional Resources

- **API Documentation:** https://technical.again.com.au/api-access
- **Get API Token:** https://technical.again.com.au/api-access
- **Test Site Example:** moveroo.com.au (reference implementation)

---

## Summary

This guide provides everything needed to:

1. ✅ Set up the SEO technical crawler
2. ✅ Run single page audits
3. ✅ Run full site crawls
4. ✅ Query and analyze results
5. ✅ Track improvements over time
6. ✅ Identify and handle false positives
7. ✅ Follow best practices

**Key Takeaways:**

- Always document your crawls
- Compare before/after results
- Be aware of false positives
- Fix high-priority issues first
- Test one change at a time when possible
- Wait for deployment before re-crawling

---

**Last Updated:** January 2026  
**Test Site:** moveroo.com.au  
**Status:** Production-ready guide based on real-world testing
