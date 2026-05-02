/**
 * SEO Technical Crawler - Main Audit Script
 *
 * Uses local live-page checks by default and an explicitly configured audit API
 * for crawl/history commands.
 * Run with: npm run seo:audit [command] [args]
 */

/* global process, console, fetch, URL */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const RETIRED_API_HOST = 'technical.again.com.au';
const DEFAULT_SITE_URL = process.env.SEO_AUDITOR_SITE_URL || 'https://movingagain.com.au';
const API_BASE = process.env.SEO_AUDITOR_API_BASE?.replace(/\/$/, '');
const TOKEN = process.env.SEO_AUDITOR_TOKEN;

function assertApiConfigured() {
  if (!API_BASE) {
    console.error('❌ SEO_AUDITOR_API_BASE is not configured.');
    console.error('Fleet has retired the old technical.again.com.au auditor endpoint.');
    console.error(
      'Set SEO_AUDITOR_API_BASE to the current Fleet audit API before using crawl/status/list.'
    );
    process.exit(1);
  }

  if (API_BASE.includes(RETIRED_API_HOST)) {
    console.error(`❌ Refusing to call retired SEO auditor host: ${RETIRED_API_HOST}`);
    console.error('Update SEO_AUDITOR_API_BASE to the current Fleet audit API.');
    process.exit(1);
  }

  if (!TOKEN) {
    console.error('❌ SEO_AUDITOR_TOKEN not found in .env file');
    console.error('Please add: SEO_AUDITOR_TOKEN=your_token_here');
    process.exit(1);
  }
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

// Helper: Sleep function
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: Make API request
async function apiRequest(endpoint, options = {}) {
  assertApiConfigured();
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    // If not JSON, return text (might be HTML error page)
    const text = await response.text();
    throw new Error(`API returned non-JSON response: ${text.substring(0, 200)}`);
  }
}

function resolveAuditUrl(input) {
  return new URL(input, DEFAULT_SITE_URL).toString();
}

function getTagContent(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || '';
}

function findLinks(html, hrefPattern) {
  const links = [];
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/giu;
  let match;

  while ((match = anchorPattern.exec(html)) !== null) {
    if (hrefPattern.test(match[1])) {
      links.push(match[1]);
    }
  }

  return [...new Set(links)];
}

function displayLocalPageResults(url, html, status) {
  const title = getTagContent(html, /<title[^>]*>([^<]*)<\/title>/iu);
  const description = getTagContent(
    html,
    /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/iu
  );
  const canonical = getTagContent(
    html,
    /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/iu
  );
  const robots = getTagContent(
    html,
    /<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/iu
  );
  const h1 = getTagContent(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/iu).replace(/<[^>]+>/gu, '');
  const householdQuotes = findLinks(html, /\/quote\/household\/?$/iu);
  const vehicleQuotes = findLinks(html, /\/quote\/vehicle\/?$/iu);
  const issues = [];

  if (!title) issues.push('Missing <title>');
  if (title.length > 60) issues.push(`Title is long (${title.length} chars)`);
  if (!description) issues.push('Missing meta description');
  if (description.length > 160)
    issues.push(`Meta description is long (${description.length} chars)`);
  if (!canonical) issues.push('Missing canonical link');
  if (robots.toLowerCase().includes('noindex')) issues.push('Robots meta contains noindex');
  if (!h1) issues.push('Missing H1');
  if (!householdQuotes.length) issues.push('Household quote path not found');
  if (!vehicleQuotes.length) issues.push('Vehicle quote path not found');

  console.log('\n' + '='.repeat(60));
  console.log('📊 LOCAL PAGE SEO CHECK');
  console.log('='.repeat(60));
  console.log(`\n🔗 URL: ${url}`);
  console.log(`📡 HTTP status: ${status}`);
  console.log(`\n<title> ${title || 'MISSING'} (${title.length} chars)`);
  console.log(`description: ${description || 'MISSING'} (${description.length} chars)`);
  console.log(`canonical: ${canonical || 'MISSING'}`);
  console.log(`robots: ${robots || 'not set'}`);
  console.log(`h1: ${h1 || 'MISSING'}`);
  console.log(`household quote links: ${householdQuotes.length}`);
  console.log(`vehicle quote links: ${vehicleQuotes.length}`);

  if (issues.length > 0) {
    console.log('\n⚠️  Issues:');
    issues.forEach((issue) => console.log(`  - ${issue}`));
    console.log('\n' + '='.repeat(60) + '\n');
    process.exitCode = 1;
    return;
  }

  console.log('\n✅ No local page SEO issues found.');
  console.log('\n' + '='.repeat(60) + '\n');
}

async function runLocalPageAudit(input) {
  const url = resolveAuditUrl(input);
  console.log(`\n🔍 Checking page locally: ${url}\n`);

  const response = await fetch(url);
  const html = await response.text();

  if (!response.ok) {
    throw new Error(`Fetch failed: HTTP ${response.status}`);
  }

  displayLocalPageResults(url, html, response.status);
}

// Run single page audit
async function runPageAudit(url) {
  if (!API_BASE) {
    await runLocalPageAudit(url);
    return;
  }

  console.log(`\n🔍 Auditing page: ${url}\n`);

  // Start audit
  const { audit_id } = await apiRequest('/audit', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });

  console.log(`📋 Audit ID: ${audit_id}`);
  console.log('⏳ Waiting for results...');

  // Poll for results
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  while (attempts < maxAttempts) {
    await sleep(5000); // Wait 5 seconds
    attempts++;

    const results = await apiRequest(`/audit/${audit_id}`);

    if (results.status === 'completed') {
      displayPageResults(results);
      return;
    }

    if (results.status === 'failed') {
      console.error('❌ Audit failed');
      return;
    }

    process.stdout.write('.');
  }

  console.error('\n❌ Timeout waiting for audit results');
}

// Run full site crawl
async function runCrawl(domain, options = {}) {
  const { limit = 10, depth = 5, urls = [] } = options;

  const isDiscoveryMode = limit <= 10;
  const mode = isDiscoveryMode ? 'Discovery Mode' : 'Full Crawl';

  console.log(`\n🕷️  Starting ${mode}: ${domain}\n`);
  if (isDiscoveryMode) {
    console.log('💡 Discovery Mode: Lightweight scan focusing on site-wide issues (10 pages)\n');
  }

  // Build request body
  const requestBody = { domain, depth, limit };

  // Add priority URLs if provided (up to 10)
  if (urls.length > 0) {
    if (urls.length > 10) {
      console.warn('⚠️  Warning: Only first 10 URLs will be used as priority entry points');
      requestBody.urls = urls.slice(0, 10);
    } else {
      requestBody.urls = urls;
    }
    console.log(`📌 Priority URLs: ${requestBody.urls.length} specified\n`);
  }

  // Start crawl
  const response = await apiRequest('/crawls', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  // Handle response structure (may be wrapped in 'data' or direct)
  const crawlData = response.data || response;
  const crawlId = crawlData.id;

  console.log(`📋 Crawl ID: ${crawlId}`);
  console.log(`📊 Status: ${crawlData.status}`);
  console.log('⏳ Waiting for crawl to complete...');

  // Poll for results
  let attempts = 0;
  const maxAttempts = 120; // 10 minutes max

  while (attempts < maxAttempts) {
    await sleep(5000); // Wait 5 seconds
    attempts++;

    const response = await apiRequest(`/crawls/${crawlId}`);
    // Handle API response wrapped in 'data' object
    const crawl = response.data || response;

    if (crawl.status === 'completed') {
      console.log('\n✅ Crawl completed!\n');
      displayCrawlResults(crawl);
      return;
    }

    if (crawl.status === 'failed') {
      console.error('❌ Crawl failed');
      return;
    }

    if (crawl.progress) {
      const { processed, total, failed } = crawl.progress;
      process.stdout.write(`\r⏳ Progress: ${processed}/${total} pages (${failed || 0} failed)`);
    } else {
      process.stdout.write('.');
    }
  }

  console.error('\n❌ Timeout waiting for crawl results');
  console.log(`\n💡 Check status manually: npm run seo:status ${crawlId}`);
}

// Check crawl status
async function checkCrawlStatus(crawlId) {
  const response = await apiRequest(`/crawls/${crawlId}`);
  // Handle API response wrapped in 'data' object
  const crawl = response.data || response;
  displayCrawlResults(crawl);
}

// List all crawls
async function showCrawlList() {
  const response = await apiRequest('/crawls');
  // Handle API response wrapped in 'data' object or direct array
  const crawls = response.data || response;
  const crawlList = Array.isArray(crawls) ? crawls : crawls.data || [];

  console.log('\n📊 Crawl History\n');
  console.log('ID    | Score | Status     | Domain');
  console.log('------|-------|------------|-------------------');

  crawlList.forEach((crawl) => {
    const score = crawl.score !== undefined && crawl.score !== null ? `${crawl.score}/100` : 'N/A';
    const status = crawl.status || 'unknown';
    const domain = crawl.domain || 'N/A';
    console.log(
      `${String(crawl.id).padEnd(5)} | ${String(score).padEnd(5)} | ${status.padEnd(10)} | ${domain}`
    );
  });

  console.log('');
}

// Display page audit results
function displayPageResults(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 AUDIT RESULTS');
  console.log('='.repeat(60));

  console.log(`\n🎯 Overall Score: ${results.overall_score}/100`);

  if (results.summary) {
    console.log(`\n📝 Summary:\n${results.summary}\n`);
  }

  if (results.action_items && results.action_items.length > 0) {
    console.log('\n📋 Action Items:\n');

    results.action_items.forEach((category) => {
      console.log(`\n${category.category}:`);

      category.issues.forEach((issue) => {
        const icon = issue.status === 'fail' ? '🔴' : '🟡';
        const priority = issue.priority ? ` [${issue.priority}]` : '';
        console.log(`  ${icon} ${issue.title}${priority}`);
        if (issue.description) {
          console.log(`     ${issue.description}`);
        }
        if (issue.remediation) {
          console.log(`     💡 Fix: ${issue.remediation}`);
        }
      });
    });
  }

  if (results.category_scores) {
    console.log('\n📊 Category Scores:');
    Object.entries(results.category_scores).forEach(([category, score]) => {
      console.log(`  ${category}: ${score}/100`);
    });
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Display crawl results
function displayCrawlResults(crawl) {
  console.log('='.repeat(60));
  console.log('📊 CRAWL RESULTS');
  console.log('='.repeat(60));

  console.log(
    `\n🎯 Health Score: ${crawl.score !== null && crawl.score !== undefined ? `${crawl.score}/100` : 'N/A (Discovery Mode)'}`
  );
  console.log(`📄 Pages Processed: ${crawl.progress?.processed || 0}`);
  console.log(`📊 Total Pages Found: ${crawl.progress?.total || 0}`);
  console.log(`❌ Failed Pages: ${crawl.progress?.failed || 0}`);

  if (crawl.timestamps) {
    console.log(`🕐 Started: ${crawl.timestamps.created_at}`);
    console.log(`🕐 Completed: ${crawl.timestamps.completed_at}`);
  }

  if (crawl.issues && crawl.issues.length > 0) {
    console.log(`\n⚠️  Issues Found: ${crawl.issues_count || crawl.issues.length} types\n`);

    crawl.issues.forEach((issue) => {
      const issueType = issue.type || 'Unknown Issue';
      const issueName = issueType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

      console.log(`\n${issueName}:`);
      console.log(`  Count: ${issue.count || 'N/A'}`);
      console.log(`  Message: ${issue.message || 'No description'}`);

      if (issue.data && issue.data.length > 0) {
        console.log(`  Affected URLs (showing first 10):`);
        issue.data.slice(0, 10).forEach((url) => {
          console.log(`    - ${url}`);
        });
        if (issue.data.length > 10) {
          console.log(`    ... and ${issue.data.length - 10} more`);
        }
      }
    });
  } else {
    console.log('\n✅ No issues found!');
  }

  if (crawl.audits && crawl.audits.length > 0) {
    console.log('\n📄 Page Scores (sorted by lowest first):\n');

    const sortedAudits = [...crawl.audits].sort((a, b) => (a.score || 0) - (b.score || 0));

    sortedAudits.forEach((audit) => {
      const score = audit.score !== undefined ? `${audit.score}/100` : 'N/A';
      const url = audit.url || audit.target_url || 'Unknown URL';
      console.log(`  ${score.padEnd(6)} - ${url}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n💡 Get detailed page info: node scripts/check-crawl-pages.mjs ${crawl.id}\n`);
}

// Main CLI handler
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'page':
    if (!arg) {
      console.error('❌ Please provide a URL: npm run seo:page https://example.com/page');
      process.exit(1);
    }
    runPageAudit(arg).catch(console.error);
    break;

  case 'crawl': {
    if (!arg) {
      console.error('❌ Please provide a domain: npm run seo:crawl https://example.com');
      console.error(
        '   Optional: Add --limit=100 for full crawl (default: 10 pages, Discovery Mode)'
      );
      console.error('   Optional: Add --urls=url1,url2 for priority URLs');
      process.exit(1);
    }

    // Parse optional parameters
    const limitArg = process.argv.find((a) => a.startsWith('--limit='));
    const urlsArg = process.argv.find((a) => a.startsWith('--urls='));

    const options = {};
    if (limitArg) {
      options.limit = parseInt(limitArg.split('=')[1], 10);
    }
    if (urlsArg) {
      options.urls = urlsArg
        .split('=')[1]
        .split(',')
        .map((u) => u.trim());
    }

    runCrawl(arg, options).catch(console.error);
    break;
  }

  case 'status':
    if (!arg) {
      console.error('❌ Please provide a crawl ID: npm run seo:status 42');
      process.exit(1);
    }
    checkCrawlStatus(arg).catch(console.error);
    break;

  case 'list':
    showCrawlList().catch(console.error);
    break;

  case 'help':
  default:
    console.log(`
SEO Technical Crawler - Usage

Commands:
  npm run seo:page <url>                    Audit a single page
  npm run seo:crawl <domain>                 Run discovery crawl (10 pages, default)
  npm run seo:crawl <domain> --limit=100     Run full crawl (up to 500 pages)
  npm run seo:crawl <domain> --urls=url1,url2  Specify priority URLs (up to 10)
  npm run seo:status <id>                    Check crawl status
  npm run seo:list                           List all crawls
  npm run seo:audit help                     Show this help

Examples:
  npm run seo:page https://movingagain.com.au/contact/
  npm run seo:crawl https://movingagain.com.au
  npm run seo:crawl https://movingagain.com.au --limit=100
  npm run seo:crawl https://movingagain.com.au --urls=https://movingagain.com.au/,https://movingagain.com.au/backloading
  npm run seo:status 42
  npm run seo:list

Discovery Mode (default):
  - Lightweight scan: 10 pages
  - Focuses on site-wide issues (orphans, duplicates, AI readiness)
  - Fast results

Full Crawl:
  - Use --limit=100 or higher (max 500)
  - Comprehensive analysis of all pages
  - Takes longer but provides complete coverage

Environment:
  seo:page runs a local live-page check by default.
  Crawl/status/list commands require SEO_AUDITOR_API_BASE and SEO_AUDITOR_TOKEN.
  The retired technical.again.com.au endpoint is blocked.
`);
    break;
}
