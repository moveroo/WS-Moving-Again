# Vercel Headers Configuration - Fixed

**Date:** 2026-01-10  
**Issue:** Headers were configured in `netlify.toml` but site is hosted on Vercel  
**Status:** ✅ Fixed

---

## ✅ Changes Made

### 1. Content Security Policy Header

**File:** `vercel.json`  
**Location:** Global headers section (`source: "/(.*)"`)  
**Added:** CSP header with appropriate policies for Astro + Brain Analytics

### 2. Cache-Control for HTML Pages

**File:** `vercel.json`  
**Added:** Two new header rules:

- `/(.*)\\.html` - HTML files with extension
- `/` - Root/index pages

Both set to: `public, max-age=3600, must-revalidate`

---

## 📝 Note on netlify.toml

The `netlify.toml` file exists but **will not be used** since the site is hosted on Vercel. The headers have been correctly configured in `vercel.json` instead.

**Recommendation:** Either:

1. Remove `netlify.toml` if not needed, OR
2. Keep it for reference but note it's not active on Vercel

---

## ✅ Verification

After deployment to Vercel, verify headers:

```bash
# Check HTML page headers
curl -I https://movingagain.com.au/

# Should see:
# - Content-Security-Policy: ...
# - Cache-Control: public, max-age=3600, must-revalidate
```

---

**Status:** Ready for deployment to Vercel ✅
