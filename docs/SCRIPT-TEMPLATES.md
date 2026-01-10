# Script Templates & Patterns

**Purpose:** Reusable script patterns for SEO analysis and automation  
**Location:** `scripts/`

---

## Analysis Script Template

### Purpose

Analyze codebase to identify site-wide issues without API calls.

### Template: `analyze-sitewide-issues.mjs`

```javascript
/**
 * Site-Wide Issue Analyzer
 *
 * Analyzes the codebase to identify SEO issues that affect all/most pages
 * by examining how titles, meta descriptions, and other elements are generated.
 *
 * Usage: node scripts/analyze-sitewide-issues.mjs
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ============================================
// CONFIGURATION
// ============================================

const SITE_NAME = '[Site Name]';
const SITE_NAME_SUFFIX_LENGTH = ` | ${SITE_NAME}`.length;

// SEO Constraints
const TITLE_MAX_LENGTH = 60;
const TITLE_MIN_LENGTH = 50;
const DESC_MIN_LENGTH = 120;
const DESC_MAX_LENGTH = 160;

// Analysis Thresholds
const SITEWIDE_THRESHOLD = 0.8; // 80% of pages must have issue
const MIN_PAGES_TO_ANALYZE = 20;

// ============================================
// HELPER FUNCTIONS
// ============================================

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function findPageFiles() {
  // Implementation: Scan src/pages/ for .astro files
}

function analyzeComponent(componentPath) {
  // Implementation: Analyze component for patterns
}

function analyzePage(pagePath) {
  // Implementation: Analyze individual page
}

// ============================================
// ANALYSIS FUNCTIONS
// ============================================

function identifySiteWideIssues(analyses) {
  // Group issues by type
  // Calculate frequency
  // Identify patterns above threshold
}

function generateRecommendations(issues) {
  // For each site-wide issue:
  // - Identify root cause
  // - Suggest fix location
  // - Provide code changes
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  console.log('\n🔍 Analyzing Codebase for Site-Wide SEO Issues\n');

  // 1. Find all pages
  const pages = findPageFiles();
  console.log(`✅ Found ${pages.length} page files\n`);

  // 2. Analyze components
  const componentIssues = analyzeComponent('src/components/SEO.astro');

  // 3. Analyze pages
  const pageAnalyses = pages.map(analyzePage);

  // 4. Identify site-wide issues
  const siteWideIssues = identifySiteWideIssues(pageAnalyses);

  // 5. Generate recommendations
  const recommendations = generateRecommendations(siteWideIssues);

  // 6. Display results
  displayResults(componentIssues, siteWideIssues, recommendations);

  // 7. Save report
  saveReport(componentIssues, siteWideIssues, recommendations);
}

main();
```

---

## Test Script Template

### Purpose

Test utilities and generators before deploying.

### Template: `test-[utility-name].mjs`

```javascript
/**
 * Test [Utility Name]
 *
 * Tests [utility] on a specific [item] to preview results.
 *
 * Usage: node scripts/test-[utility-name].mjs [item-id]
 * Example: node scripts/test-seo-generator.mjs sydney-melbourne
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Import or inline utility functions
// (For .mjs files, may need to inline TypeScript logic)

function testItem(itemId) {
  // 1. Load item data
  const item = loadItem(itemId);

  // 2. Get current values
  const current = getCurrentValues(item);

  // 3. Generate optimized values
  const optimized = generateOptimized(item);

  // 4. Display comparison
  displayComparison(current, optimized);

  // 5. Show preview
  showPreview(optimized);
}

// Main execution
const itemId = process.argv[2] || 'default';
testItem(itemId);
```

---

## Fix Automation Script Template

### Purpose

Apply fixes automatically across multiple files.

### Template: `fix-[issue-name].mjs`

```javascript
/**
 * Fix [Issue Name]
 *
 * Automatically applies fix for [issue] across affected files.
 *
 * Usage: node scripts/fix-[issue-name].mjs [--dry-run]
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');

function findAffectedFiles() {
  // Find all files that need fixing
}

function applyFix(filePath) {
  // Read file
  // Apply fix
  // Return modified content
}

function main() {
  console.log('\n🔧 Fixing [Issue Name]\n');

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }

  const files = findAffectedFiles();
  console.log(`Found ${files.length} files to fix\n`);

  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  files.forEach((file) => {
    try {
      const newContent = applyFix(file);

      if (!DRY_RUN) {
        fs.writeFileSync(file, newContent, 'utf-8');
        fixed++;
        console.log(`✅ Fixed: ${file}`);
      } else {
        console.log(`🔍 Would fix: ${file}`);
        fixed++;
      }
    } catch (error) {
      errors++;
      console.error(`❌ Error fixing ${file}:`, error.message);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Fixed: ${fixed}`);
  console.log(`   Errors: ${errors}`);

  if (DRY_RUN) {
    console.log(`\n💡 Run without --dry-run to apply fixes`);
  }
}

main();
```

---

## Common Patterns

### Pattern 1: File Scanning

```javascript
function findFiles(directory, extension) {
  const files = [];

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach((entry) => {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    });
  }

  scanDir(directory);
  return files;
}
```

### Pattern 2: Content Analysis

```javascript
function analyzeContent(content, patterns) {
  const issues = [];

  patterns.forEach((pattern) => {
    const matches = content.match(pattern.regex);
    if (matches) {
      issues.push({
        type: pattern.type,
        severity: pattern.severity,
        matches: matches,
        recommendation: pattern.fix,
      });
    }
  });

  return issues;
}
```

### Pattern 3: Report Generation

```javascript
function generateReport(issues, outputPath) {
  const report = {
    analyzedAt: new Date().toISOString(),
    totalIssues: issues.length,
    issuesByType: groupByType(issues),
    recommendations: generateRecommendations(issues),
  };

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\n📁 Report saved: ${outputPath}`);
}
```

---

## Script Naming Convention

- **Analysis:** `analyze-[what].mjs`
- **Test:** `test-[what].mjs`
- **Fix:** `fix-[what].mjs`
- **Generate:** `generate-[what].mjs`
- **Check:** `check-[what].mjs`

Examples:

- `analyze-sitewide-issues.mjs`
- `test-seo-generator.mjs`
- `fix-image-srcset.mjs`
- `generate-routes.mjs`
- `check-schema-validity.mjs`

---

## Best Practices

### 1. Always Include:

- ✅ Usage instructions in header comment
- ✅ Error handling
- ✅ Progress indicators
- ✅ Summary output
- ✅ Dry-run mode for destructive operations

### 2. Output Format:

- ✅ Clear section headers
- ✅ Emoji indicators (✅ ❌ ⚠️ 🔍)
- ✅ Color-coded severity
- ✅ Actionable recommendations

### 3. Error Handling:

- ✅ Try-catch blocks
- ✅ Graceful failures
- ✅ Clear error messages
- ✅ Continue on non-critical errors

---

## Integration with Package.json

```json
{
  "scripts": {
    "analyze": "node scripts/analyze-sitewide-issues.mjs",
    "test:seo": "node scripts/test-seo-generator.mjs",
    "fix:images": "node scripts/fix-image-srcset.mjs",
    "check:schema": "node scripts/check-schema-validity.mjs"
  }
}
```

---

**Template Version:** 1.0  
**Last Updated:** 2026-01-10
