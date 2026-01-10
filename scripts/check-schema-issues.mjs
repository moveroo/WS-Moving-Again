/**
 * Check all pages for schema issues
 *
 * Checks for:
 * - Missing telephone in LocalBusiness schema
 * - Missing FAQPage schema where FAQs exist
 * - Missing BreadcrumbList schema
 * - Missing aggregateRating where applicable
 *
 * Usage: node scripts/check-schema-issues.mjs
 */

/* global */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const pagesDir = join(projectRoot, 'src', 'pages');

// Find all .astro files in pages directory
function findAstroFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findAstroFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.astro')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Extract schema information from a file
function analyzeSchema(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = filePath.replace(projectRoot + '/', '');
  const issues = [];

  // Check for LocalBusiness schema
  const hasLocalBusiness =
    content.includes('schemaType="LocalBusiness"') ||
    content.includes("schemaType='LocalBusiness'");

  if (hasLocalBusiness) {
    // Check if telephone is in schemaData
    const schemaDataMatch = content.match(/schemaData\s*=\s*\{([^}]+)\}/s);
    if (schemaDataMatch) {
      const schemaData = schemaDataMatch[1];
      if (!schemaData.includes('telephone') && !schemaData.includes('telephone:')) {
        issues.push({
          type: 'missing-telephone',
          severity: 'high',
          message: 'LocalBusiness schema missing telephone field',
        });
      }
    } else {
      // Check if telephone is passed at all
      if (!content.includes('telephone')) {
        issues.push({
          type: 'missing-telephone',
          severity: 'high',
          message: 'LocalBusiness schema missing telephone field',
        });
      }
    }
  }

  // Check for FAQ content
  const hasFAQContent =
    content.includes('<details') &&
    (content.includes('summary') || content.includes('Frequently Asked Questions'));

  if (hasFAQContent) {
    // Count FAQ items
    const faqMatches = content.matchAll(/<details[^>]*>[\s\S]*?<\/details>/g);
    const faqCount = Array.from(faqMatches).length;

    if (faqCount > 0) {
      // Check for FAQPage schema
      const hasFAQSchema =
        content.includes('FAQPage') ||
        content.includes('"@type": "FAQPage"') ||
        content.includes("'@type': 'FAQPage'");

      if (!hasFAQSchema) {
        issues.push({
          type: 'missing-faq-schema',
          severity: 'medium',
          message: `Found ${faqCount} FAQ items but no FAQPage schema`,
          faqCount,
        });
      }
    }
  }

  // Check for BreadcrumbList schema
  const hasBreadcrumbSchema =
    content.includes('BreadcrumbList') ||
    content.includes('"@type": "BreadcrumbList"') ||
    content.includes("'@type': 'BreadcrumbList'");

  // Check if page should have breadcrumbs (not homepage, not dynamic routes)
  const isHomepage = relativePath === 'src/pages/index.astro';
  const isDynamicRoute = relativePath.includes('[...slug]');
  const shouldHaveBreadcrumbs = !isHomepage && !isDynamicRoute;

  if (shouldHaveBreadcrumbs && !hasBreadcrumbSchema) {
    issues.push({
      type: 'missing-breadcrumb',
      severity: 'low',
      message: 'Page could benefit from BreadcrumbList schema',
    });
  }

  // Check for aggregateRating (optional, but good to know)
  const hasAggregateRating =
    content.includes('aggregateRating') || content.includes('AggregateRating');

  // Check if it's a LocalBusiness that might benefit from ratings
  if (hasLocalBusiness && !hasAggregateRating) {
    issues.push({
      type: 'missing-rating',
      severity: 'low',
      message: 'LocalBusiness could include aggregateRating for star snippets (optional)',
    });
  }

  return {
    file: relativePath,
    hasLocalBusiness,
    issues,
  };
}

// Main analysis
function main() {
  console.log('\n🔍 Checking All Pages for Schema Issues\n');
  console.log('='.repeat(70));

  const files = findAstroFiles(pagesDir);
  console.log(`\n📄 Found ${files.length} pages to analyze\n`);

  const results = files.map(analyzeSchema);

  // Group issues by type
  const issuesByType = {
    'missing-telephone': [],
    'missing-faq-schema': [],
    'missing-breadcrumb': [],
    'missing-rating': [],
  };

  results.forEach((result) => {
    result.issues.forEach((issue) => {
      if (issuesByType[issue.type]) {
        issuesByType[issue.type].push({
          file: result.file,
          ...issue,
        });
      }
    });
  });

  // Report results
  let totalIssues = 0;

  // High priority: Missing telephone
  if (issuesByType['missing-telephone'].length > 0) {
    console.log('\n🔴 HIGH PRIORITY: Missing Telephone in LocalBusiness Schema');
    console.log('─'.repeat(70));
    issuesByType['missing-telephone'].forEach((issue) => {
      console.log(`  ❌ ${issue.file}`);
      console.log(`     ${issue.message}`);
    });
    totalIssues += issuesByType['missing-telephone'].length;
  }

  // Medium priority: Missing FAQ schema
  if (issuesByType['missing-faq-schema'].length > 0) {
    console.log('\n🟡 MEDIUM PRIORITY: Missing FAQPage Schema');
    console.log('─'.repeat(70));
    issuesByType['missing-faq-schema'].forEach((issue) => {
      console.log(`  ⚠️  ${issue.file}`);
      console.log(`     ${issue.message}`);
    });
    totalIssues += issuesByType['missing-faq-schema'].length;
  }

  // Low priority: Missing breadcrumbs
  if (issuesByType['missing-breadcrumb'].length > 0) {
    console.log('\n🔵 LOW PRIORITY: Missing BreadcrumbList Schema');
    console.log('─'.repeat(70));
    // Only show first 10 to avoid clutter
    const toShow = issuesByType['missing-breadcrumb'].slice(0, 10);
    toShow.forEach((issue) => {
      console.log(`  💡 ${issue.file}`);
    });
    if (issuesByType['missing-breadcrumb'].length > 10) {
      console.log(`  ... and ${issuesByType['missing-breadcrumb'].length - 10} more pages`);
    }
    totalIssues += issuesByType['missing-breadcrumb'].length;
  }

  // Optional: Missing ratings
  if (issuesByType['missing-rating'].length > 0) {
    console.log('\n💡 OPTIONAL: Missing aggregateRating (for star snippets)');
    console.log('─'.repeat(70));
    // Only show first 5
    const toShow = issuesByType['missing-rating'].slice(0, 5);
    toShow.forEach((issue) => {
      console.log(`  💡 ${issue.file}`);
    });
    if (issuesByType['missing-rating'].length > 5) {
      console.log(`  ... and ${issuesByType['missing-rating'].length - 5} more pages`);
    }
    // Don't count these in total (they're optional)
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 SUMMARY\n');
  console.log(`Total Pages Analyzed: ${files.length}`);
  console.log(`Pages with Issues: ${results.filter((r) => r.issues.length > 0).length}`);
  console.log(`\nIssue Breakdown:`);
  console.log(`  🔴 Missing Telephone: ${issuesByType['missing-telephone'].length}`);
  console.log(`  🟡 Missing FAQ Schema: ${issuesByType['missing-faq-schema'].length}`);
  console.log(`  🔵 Missing Breadcrumbs: ${issuesByType['missing-breadcrumb'].length}`);
  console.log(`  💡 Missing Ratings (optional): ${issuesByType['missing-rating'].length}`);

  if (totalIssues === 0) {
    console.log('\n✅ No critical schema issues found!');
  } else {
    console.log(`\n⚠️  Total Issues Found: ${totalIssues}`);
    console.log('\n💡 Next Steps:');
    if (issuesByType['missing-telephone'].length > 0) {
      console.log('  1. Add telephone field to all LocalBusiness schemaData');
    }
    if (issuesByType['missing-faq-schema'].length > 0) {
      console.log('  2. Add FAQPage schema for pages with FAQ content');
    }
    if (issuesByType['missing-breadcrumb'].length > 0) {
      console.log('  3. Consider adding BreadcrumbList schema to key pages');
    }
  }

  // Save detailed report
  const report = {
    analyzedAt: new Date().toISOString(),
    totalPages: files.length,
    issuesByType: {
      'missing-telephone': issuesByType['missing-telephone'],
      'missing-faq-schema': issuesByType['missing-faq-schema'],
      'missing-breadcrumb': issuesByType['missing-breadcrumb'],
      'missing-rating': issuesByType['missing-rating'],
    },
    allResults: results,
  };

  const reportPath = join(projectRoot, 'schema-issues-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Detailed report saved to: schema-issues-report.json\n`);
}

main();
