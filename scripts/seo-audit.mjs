/**
 * SEO Technical Crawler - Main Audit Script
 *
 * Uses technical.again.com.au API to perform SEO audits
 * Run with: npm run seo:audit [command] [args]
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const API_BASE = 'https://technical.again.com.au/api';
const TOKEN = process.env.SEO_AUDITOR_TOKEN;

if (!TOKEN) {
  console.error('❌ SEO_AUDITOR_TOKEN not found in .env file');
  console.error('Please add: SEO_AUDITOR_TOKEN=your_token_here');
  process.exit(1);
}

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

// Helper: Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Make API request
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Run single page audit
async function runPageAudit(url) {
  console.log(`\n🔍 Auditing page: ${url}\n`);

  // Start audit
  const { audit_id } = await apiRequest('/audit', {
    method: 'POST',
    body: JSON.stringify({ url })
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
async function runCrawl(domain) {
  console.log(`\n🕷️  Starting crawl: ${domain}\n`);

  // Start crawl
  const { data } = await apiRequest('/crawls', {
    method: 'POST',
    body: JSON.stringify({
      domain,
      depth: 5,
      limit: 100
    })
  });

  const crawlId = data.id;
  console.log(`📋 Crawl ID: ${crawlId}`);
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
  const crawlList = Array.isArray(crawls) ? crawls : (crawls.data || []);
  
  console.log('\n📊 Crawl History\n');
  console.log('ID    | Score | Status     | Domain');
  console.log('------|-------|------------|-------------------');
  
  crawlList.forEach(crawl => {
    const score = crawl.score !== undefined && crawl.score !== null ? `${crawl.score}/100` : 'N/A';
    const status = crawl.status || 'unknown';
    const domain = crawl.domain || 'N/A';
    console.log(`${String(crawl.id).padEnd(5)} | ${String(score).padEnd(5)} | ${status.padEnd(10)} | ${domain}`);
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
    
    results.action_items.forEach(category => {
      console.log(`\n${category.category}:`);
      
      category.issues.forEach(issue => {
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
  
  console.log(`\n🎯 Health Score: ${crawl.score}/100`);
  console.log(`📄 Pages Processed: ${crawl.progress?.processed || 0}`);
  console.log(`❌ Failed Pages: ${crawl.progress?.failed || 0}`);
  
  if (crawl.timestamps) {
    console.log(`🕐 Started: ${crawl.timestamps.created_at}`);
    console.log(`🕐 Completed: ${crawl.timestamps.completed_at}`);
  }

  if (crawl.issues && crawl.issues.length > 0) {
    console.log(`\n⚠️  Issues Found: ${crawl.issues.length} types\n`);
    
    crawl.issues.forEach(issue => {
      console.log(`\n${issue.type || 'Unknown Issue'}:`);
      console.log(`  Count: ${issue.count}`);
      console.log(`  Message: ${issue.message || 'No description'}`);
      
      if (issue.data && issue.data.length > 0) {
        console.log(`  Affected URLs (showing first 10):`);
        issue.data.slice(0, 10).forEach(url => {
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
    
    sortedAudits.forEach(audit => {
      const score = audit.score !== undefined ? `${audit.score}/100` : 'N/A';
      console.log(`  ${score.padEnd(6)} - ${audit.url}`);
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

  case 'crawl':
    if (!arg) {
      console.error('❌ Please provide a domain: npm run seo:crawl https://example.com');
      process.exit(1);
    }
    runCrawl(arg).catch(console.error);
    break;

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
  npm run seo:page <url>        Audit a single page
  npm run seo:crawl <domain>     Run full site crawl
  npm run seo:status <id>        Check crawl status
  npm run seo:list               List all crawls
  npm run seo:audit help         Show this help

Examples:
  npm run seo:page https://movingagain.com.au/contact/
  npm run seo:crawl https://movingagain.com.au
  npm run seo:status 42
  npm run seo:list

Environment:
  Make sure SEO_AUDITOR_TOKEN is set in .env file
`);
    break;
}
