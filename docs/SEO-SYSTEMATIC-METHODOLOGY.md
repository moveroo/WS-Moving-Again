# SEO Systematic Methodology

**Version:** 1.0  
**Created:** 2026-01-10  
**Purpose:** Foundational methodology for systematic, scalable SEO improvements across multiple websites

---

## 🎯 Philosophy

**"Fix Once, Apply Everywhere"**

Instead of fixing issues page-by-page, we identify patterns and fix them at the source:

- **Component level** - Fix in one component, affects all pages
- **Utility level** - Centralized logic for consistent behavior
- **Configuration level** - Single source of truth for brand/data

This approach ensures:

- ✅ Consistency across all pages
- ✅ Maintainability (one change fixes many)
- ✅ Scalability (works for 10 or 10,000 pages)
- ✅ Reusability (same patterns across projects)

---

## 📁 Project Structure

### Core Files & Their Purpose

```
project-root/
├── src/
│   ├── utils/
│   │   ├── brand.ts              # Single source of truth for brand data
│   │   ├── seoGenerator.ts       # SEO content generation utilities
│   │   └── [other utilities]     # Domain-specific utilities
│   ├── components/
│   │   ├── SEO.astro             # Centralized SEO meta tags
│   │   ├── Schema.astro          # Structured data generation
│   │   └── Layout.astro          # Base layout with global schemas
│   └── pages/                    # Page templates
├── scripts/
│   ├── analyze-sitewide-issues.mjs    # Code-based issue analysis
│   ├── test-seo-generator.mjs        # Test SEO generation
│   └── [other automation scripts]    # Additional automation
└── docs/
    ├── SEO-SYSTEMATIC-METHODOLOGY.md  # This file
    └── [other documentation]
```

---

## 🏗️ Architecture Principles

### 1. Single Source of Truth (SSOT)

**Brand Information: `src/utils/brand.ts`**

All brand-related data lives in one file:

```typescript
// src/utils/brand.ts
export const FOUNDING_YEAR = 1995;
export const YEARS_IN_BUSINESS = new Date().getFullYear() - FOUNDING_YEAR;

export const BRAND = {
  name: 'Moving Again',
  email: 'info@movingagain.com.au',
  foundingYear: FOUNDING_YEAR,
  yearsInBusiness: YEARS_IN_BUSINESS,
  website: 'https://movingagain.com.au',
  // ... other brand constants
};
```

**Usage:**

- ✅ Import `BRAND` wherever needed
- ✅ Never hardcode brand values
- ✅ Update once, changes everywhere

**Benefits:**

- Consistency across all pages
- Easy to update (change once, affects all)
- Prevents errors (no typos or outdated info)

---

### 2. Centralized SEO Logic

**SEO Component: `src/components/SEO.astro`**

All SEO meta tags generated in one place:

```typescript
// SEO.astro handles:
- Title truncation (50-60 chars)
- Description validation (120-160 chars)
- Default fallbacks
- Suffix management
- Special cases (e.g., homepage)
```

**Layout Component: `src/layouts/Layout.astro`**

Global schemas and site-wide elements:

```typescript
// Layout.astro includes:
- Organization schema (from BRAND constants)
- Global meta tags
- Font preloading
- Analytics
```

**Benefits:**

- All pages get consistent SEO treatment
- Fix once, applies to all pages
- Easy to add new SEO features site-wide

---

### 3. Content Generation Utilities

**SEO Generator: `src/utils/seoGenerator.ts`**

Intelligent content generation:

```typescript
// Generates:
- SEO-optimized titles (45-60 chars)
- Attention-grabbing descriptions (150-160 chars)
- Route-specific content
- Question-based formats
```

**Benefits:**

- Consistent quality across all pages
- SEO best practices built-in
- Easy to test and refine

---

## 🔍 Analysis Workflow

### Step 1: Identify Site-Wide Issues

**Script: `scripts/analyze-sitewide-issues.mjs`**

```bash
node scripts/analyze-sitewide-issues.mjs
```

**What it does:**

1. Scans all page files
2. Analyzes SEO component patterns
3. Identifies issues affecting multiple pages
4. Generates report with recommendations

**Output:**

- List of site-wide issues
- Affected page count
- Fix recommendations
- Priority levels

**Example Output:**

```
🔴 Site-Wide Issues:
- Title length: 34 pages (83%) exceed 60 chars
- Description length: 13 pages need adjustment

💡 Fix Recommendations:
1. Add title truncation to SEO.astro (fixes 34 pages)
2. Add description validation to SEO.astro (fixes 13 pages)
```

---

### Step 2: Verify with Crawl Data

**Tool: SEO Technical Crawler**

```bash
npm run seo:crawl https://example.com --limit=50
```

**What it does:**

1. Crawls pages via API
2. Identifies technical SEO issues
3. Provides detailed audit results

**Use Cases:**

- Verify site-wide fixes worked
- Find new issues
- Track improvements over time

---

### Step 3: Implement Fixes

**Priority Order:**

1. **Site-Wide Fixes First** (affect most pages)
   - Component modifications
   - Utility updates
   - Configuration changes

2. **Content Generation** (automated)
   - SEO generators
   - Schema generators
   - Content utilities

3. **Individual Page Fixes** (last resort)
   - Only if can't be automated
   - Document why manual fix needed

---

## 🛠️ Implementation Patterns

### Pattern 1: Component-Level Fixes

**When to use:** Issue affects all/most pages using a component

**Example: Title Truncation**

```typescript
// Before: Hardcoded in each page
<title>Very Long Title That Exceeds 60 Characters | Site Name</title>

// After: Fixed in SEO.astro
const MAX_TITLE_LENGTH = 60;
let pageTitle = title;
if (pageTitle.length > MAX_TITLE_LENGTH) {
  // Truncate logic
}
```

**Impact:** Fixes all pages automatically

---

### Pattern 2: Utility-Based Generation

**When to use:** Need consistent content generation across many pages

**Example: SEO Generator**

```typescript
// src/utils/seoGenerator.ts
export function generateRouteSEO(route) {
  return {
    title: generateSEOTitle(...),
    description: generateSEODescription(...),
  };
}

// Usage in pages
import { generateRouteSEO } from '../utils/seoGenerator';
const seo = generateRouteSEO(route);
```

**Impact:** Consistent, optimized content for all route pages

---

### Pattern 3: Configuration-Driven

**When to use:** Data that should be consistent but may change

**Example: Brand Constants**

```typescript
// src/utils/brand.ts
export const BRAND = {
  foundingYear: 1995,
  // ...
};

// Usage everywhere
import { BRAND } from '../utils/brand';
foundingDate: BRAND.foundingYear.toString();
```

**Impact:** Update once, changes everywhere

---

## 📋 Standard Workflow

### For Each New Issue:

1. **Analyze** - Run analysis script to identify scope
2. **Categorize** - Is it site-wide, content-specific, or individual?
3. **Design** - Plan fix at appropriate level (component/utility/config)
4. **Implement** - Create/update files following patterns
5. **Test** - Verify fix works across sample pages
6. **Document** - Update methodology if new pattern created
7. **Deploy** - Commit and push

---

## 🎨 Code Standards

### File Naming

- **Utilities:** `camelCase.ts` (e.g., `seoGenerator.ts`)
- **Components:** `PascalCase.astro` (e.g., `SEO.astro`)
- **Scripts:** `kebab-case.mjs` (e.g., `analyze-sitewide-issues.mjs`)
- **Docs:** `UPPERCASE-WITH-DASHES.md` (e.g., `SEO-SYSTEMATIC-METHODOLOGY.md`)

### Import Patterns

```typescript
// Brand constants
import { BRAND } from '../utils/brand';

// Utilities
import { generateRouteSEO } from '../utils/seoGenerator';

// Components
import Layout from '../layouts/Layout.astro';
import SEO from '../components/SEO.astro';
```

### Constants Location

- **Brand data:** `src/utils/brand.ts`
- **Site config:** Environment variables or `astro.config.mjs`
- **Page-specific:** Frontmatter or props

---

## 🔄 Reusability Across Projects

### What Transfers:

1. **Methodology** - This document
2. **Scripts** - Analysis and automation scripts
3. **Patterns** - Component/utility structures
4. **Workflow** - Analysis → Fix → Test → Deploy

### What's Project-Specific:

1. **Brand data** - `brand.ts` file
2. **Domain logic** - Business-specific utilities
3. **Content** - Page templates and content

### Setup for New Project:

1. Copy methodology document
2. Create `src/utils/brand.ts` with project data
3. Set up `SEO.astro` with project-specific defaults
4. Create analysis scripts (adapt from templates)
5. Document project-specific patterns

---

## 📊 Success Metrics

### Before Fix:

- 34 pages with title issues
- 13 pages with description issues
- 97 pages missing Organization schema

### After Fix:

- 0 pages with title issues (fixed in SEO.astro)
- 0 pages with description issues (fixed in SEO.astro)
- 0 pages missing Organization schema (fixed in Layout.astro)

### Time Saved:

- **Manual approach:** 144 pages × 5 min = 12 hours
- **Systematic approach:** 3 files × 30 min = 1.5 hours
- **Savings:** 10.5 hours (87% reduction)

---

## 🚀 Scaling Principles

### For 10 Pages:

- Manual fixes acceptable
- Still use brand.ts for consistency

### For 100+ Pages:

- **Must** use component-level fixes
- **Must** use utilities for generation
- **Must** use analysis scripts

### For 1000+ Pages:

- **Must** automate everything possible
- **Must** have comprehensive testing
- **Must** document all patterns

---

## 🎓 Best Practices

### DO:

✅ **Fix at the source** - Component/utility level  
✅ **Use brand.ts** - Never hardcode brand data  
✅ **Analyze first** - Run scripts before fixing  
✅ **Test systematically** - Verify across sample pages  
✅ **Document patterns** - Help future you and others

### DON'T:

❌ **Fix page-by-page** - Unless absolutely necessary  
❌ **Hardcode values** - Use constants/utilities  
❌ **Skip analysis** - You might miss site-wide issues  
❌ **Assume it works** - Always test  
❌ **Forget documentation** - Future you will thank you

---

## 📚 Related Documents

- `AUTOMATED-FIXES-ROADMAP.md` - List of fixable issues
- `SITEWIDE-ISSUES-ANALYSIS.md` - Analysis results
- `SEO-GENERATOR-IMPLEMENTATION.md` - SEO generator docs
- `# SEO Technical Crawler - Complete Guide.md` - Crawler usage

---

## 🔮 Future Enhancements

### Planned Additions:

1. **Image Optimization Script** - Auto-add srcset
2. **Script Optimization Script** - Auto-add async/defer
3. **Content Analysis Script** - Reading level, question headings
4. **Link Analysis Script** - Orphan page detection
5. **Schema Validation Script** - Verify all schemas valid

### Pattern Library:

As we create more utilities, document them here:

- SEO generators
- Schema generators
- Content analyzers
- Fix automation scripts

---

## 💡 Key Takeaways

1. **Think Systematically** - One fix for many pages
2. **Use Brand Constants** - Single source of truth
3. **Analyze Before Fixing** - Know the scope
4. **Fix at Component Level** - Maximum impact
5. **Document Everything** - Build institutional knowledge
6. **Test Thoroughly** - Verify across sample pages
7. **Reuse Patterns** - Don't reinvent the wheel

---

**This methodology is a living document. Update it as we discover new patterns and best practices.**

---

**Status:** Active  
**Last Updated:** 2026-01-10  
**Maintained By:** Development Team
