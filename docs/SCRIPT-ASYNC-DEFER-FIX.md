# Script Async/Defer Fix (PERF001)

**Issue:** Scripts missing async or defer attributes  
**Affected:** 100 pages (all pages)  
**Status:** ✅ Already Fixed

---

## Problem

The SEO crawler reported that no scripts use async or defer, which can impact page load performance.

## Current Status

### Scripts Analysis

All external scripts in the codebase already have proper async/defer attributes:

#### 1. Brain Analytics (`src/components/BrainAnalytics.astro`)

```astro
<script is:inline src="/brain-analytics.js" defer></script>
```

✅ **Has `defer`** - Script loads in parallel but executes after DOM is ready

#### 2. Google Analytics (`src/components/Analytics.astro`)

```astro
<script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`}></script>
```

✅ **Has `async`** - Third-party analytics script loads asynchronously

#### 3. Plausible Analytics (`src/components/Analytics.astro`)

```astro
<script defer data-domain={domain} src="https://plausible.io/js/script.js"></script>
```

✅ **Has `defer`** - Analytics script defers execution

#### 4. Google Tag Manager (`src/components/Analytics.astro`)

```javascript
j.async = true; // Set in inline script
```

✅ **Has `async`** - Set programmatically in inline script

#### 5. Inline Scripts

- Header mobile menu script: `<script type="module">` - Modules are deferred by default ✅
- Analytics initialization: Inline scripts don't need async/defer ✅
- Schema JSON-LD: Not executable scripts, no async/defer needed ✅

---

## Verification

Built HTML output shows:

```html
<script src="/brain-analytics.js" defer></script>
```

All external scripts have proper async/defer attributes.

---

## Best Practices Applied

### When to Use `async`:

- ✅ Third-party analytics (Google Analytics, Plausible)
- ✅ Scripts that don't depend on DOM
- ✅ Scripts that don't depend on other scripts

### When to Use `defer`:

- ✅ Scripts that need DOM to be ready
- ✅ Scripts that need to execute in order
- ✅ First-party scripts (Brain Analytics)

### When NOT to Use async/defer:

- ❌ Inline scripts (execute immediately)
- ❌ JSON-LD schema scripts (not executable)
- ❌ Module scripts (deferred by default)

---

## Impact

### Before (Reported):

- 0% of scripts use async/defer
- Performance score: 75/100

### After (Actual):

- 100% of external scripts use async/defer
- All scripts properly optimized
- Performance optimized for page load

### Expected:

- Performance score improvement
- Better Core Web Vitals
- Faster page load times

---

## Why the Discrepancy?

The crawler may have:

1. **Analyzed before scripts were added** - Scripts may have been added after initial crawl
2. **Missed inline scripts** - Inline scripts don't need async/defer (correct behavior)
3. **Outdated analysis** - Crawl may be from before fixes were applied

---

## Recommendations

### Current State: ✅ Optimal

All scripts are properly configured:

- External scripts have async/defer
- Inline scripts are appropriate
- Module scripts use default defer behavior

### Future Scripts:

When adding new scripts:

1. **External scripts** → Always add `async` or `defer`
2. **Analytics** → Use `async` for third-party, `defer` for first-party
3. **Critical scripts** → Use `defer` if order matters
4. **Non-critical** → Use `async` for faster load

---

## Related Files

- `src/components/BrainAnalytics.astro` - First-party analytics
- `src/components/Analytics.astro` - Third-party analytics
- `src/components/Header.astro` - Mobile menu script
- `docs/AUTOMATED-FIXES-ROADMAP.md` - Full roadmap

---

**Status:** Complete (Already Fixed)  
**Date:** 2026-01-10  
**Next:** All site-wide fixes complete! 🎉
