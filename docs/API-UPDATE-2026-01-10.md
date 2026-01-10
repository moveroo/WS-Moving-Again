# SEO Technical Crawler API - Update Summary

**Date:** 2026-01-10  
**API Version:** 1.0  
**Status:** ✅ Scripts Updated

---

## 🔄 API Changes

### 1. Discovery Mode (New Default)

- **Default Behavior:** Crawls now default to **Discovery Mode** (10 pages)
- **Purpose:** Lightweight scan focusing on site-wide issues
- **Benefits:**
  - Fast results
  - Focuses on: orphan pages, duplicates, AI readiness
  - Lower resource usage

### 2. Priority URLs Parameter

- **New Parameter:** `urls` (array, optional)
- **Purpose:** Specify up to 10 priority URLs as entry points
- **Use Case:** Ensure your "best" pages are always included in discovery scans
- **Example:**
  ```json
  {
    "domain": "https://example.com",
    "urls": ["https://example.com/", "https://example.com/pricing", "https://example.com/contact"]
  }
  ```

### 3. Updated Default Limits

- **Discovery Mode:** 10 pages (default)
- **Full Crawl:** Up to 500 pages (use `limit` parameter)
- **Depth:** Default 5, max 10

### 4. Enhanced Issue Types

The API now reports specific issue types:

- `orphan_page` - Pages with no incoming internal links
- `sitemap_orphan` - Pages in sitemap but not found by crawler
- `missing_from_sitemap` - Crawled pages not in sitemap
- `duplicate_title` - Multiple pages with same title
- `duplicate_description` - Multiple pages with same meta description

---

## ✅ Script Updates

### Updated: `scripts/seo-audit.mjs`

#### Changes:

1. **Discovery Mode Support**
   - Defaults to 10 pages (Discovery Mode)
   - Shows mode in output
   - Supports `--limit` parameter for full crawls

2. **Priority URLs Support**
   - New `--urls` parameter
   - Accepts comma-separated list of URLs
   - Validates and limits to 10 URLs

3. **Enhanced Display**
   - Shows Discovery Mode vs Full Crawl
   - Better issue type formatting
   - Handles null scores (Discovery Mode may not calculate overall score)

#### Usage Examples:

```bash
# Discovery Mode (default, 10 pages)
npm run seo:crawl https://movingagain.com.au

# Full Crawl (100 pages)
npm run seo:crawl https://movingagain.com.au --limit=100

# Discovery Mode with Priority URLs
npm run seo:crawl https://movingagain.com.au --urls=https://movingagain.com.au/,https://movingagain.com.au/backloading

# Full Crawl with Priority URLs
npm run seo:crawl https://movingagain.com.au --limit=200 --urls=https://movingagain.com.au/,https://movingagain.com.au/contact
```

---

## 📊 API Endpoints (Updated)

### POST `/api/crawls`

**Request Body:**

```json
{
  "domain": "https://example.com",
  "depth": 5, // Optional, default: 5, max: 10
  "limit": 10, // Optional, default: 10 (Discovery Mode), max: 500
  "urls": [
    // Optional, up to 10 URLs
    "https://example.com/",
    "https://example.com/pricing"
  ]
}
```

**Response:**

```json
{
  "message": "Crawl started successfully.",
  "data": {
    "id": 18,
    "domain": "https://example.com",
    "status": "pending",
    "score": null
  }
}
```

### GET `/api/crawls/{id}`

**Response (Completed):**

```json
{
  "id": 18,
  "domain": "https://example.com",
  "status": "completed",
  "score": 85,
  "progress": {
    "processed": 10,
    "total": 10,
    "failed": 0
  },
  "issues_count": 2,
  "issues": [
    {
      "type": "orphan_page",
      "count": 3,
      "message": "Found 3 orphan pages...",
      "data": ["url1", "url2", "url3"]
    }
  ]
}
```

---

## 🎯 Recommendations

### For Quick Site Health Checks:

Use **Discovery Mode** (default):

```bash
npm run seo:crawl https://movingagain.com.au
```

### For Comprehensive Analysis:

Use **Full Crawl**:

```bash
npm run seo:crawl https://movingagain.com.au --limit=200
```

### For Focused Analysis:

Use **Priority URLs** to ensure key pages are analyzed:

```bash
npm run seo:crawl https://movingagain.com.au --urls=https://movingagain.com.au/,https://movingagain.com.au/backloading,https://movingagain.com.au/moving-interstate
```

---

## 📝 Notes

- **Discovery Mode** is perfect for regular health checks
- **Full Crawl** should be used for comprehensive audits (monthly/quarterly)
- **Priority URLs** ensure your most important pages are always included
- Health Score may be `null` in Discovery Mode (focuses on issue detection, not scoring)

---

**Status:** ✅ Scripts updated and ready to use  
**Next:** Test with a new crawl to verify functionality
