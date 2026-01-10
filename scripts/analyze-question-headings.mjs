/**
 * Question Headings Analysis Script
 *
 * Analyzes all pages to identify headings that could be converted to questions
 * for better AI/LLM discoverability.
 *
 * Usage: node scripts/analyze-question-headings.mjs
 */

/* eslint-env node */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Helper: Read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// Helper: Find all Astro page files
function findPageFiles() {
  const pagesDir = join(projectRoot, 'src', 'pages');
  const files = fs.readdirSync(pagesDir, { recursive: true });
  return files.filter((file) => file.endsWith('.astro')).map((file) => join(pagesDir, file));
}

// Helper: Extract headings from Astro file
function extractHeadings(content) {
  const headings = [];

  // Match h2 and h3 headings (both in JSX and markdown-style)
  // Pattern: <h2>...</h2> or <h3>...</h3> or ## Heading or ### Heading
  const h2Pattern = /<h2[^>]*>([^<]+)<\/h2>/gi;
  const h3Pattern = /<h3[^>]*>([^<]+)<\/h3>/gi;
  const markdownH2Pattern = /^##\s+(.+)$/gm;
  const markdownH3Pattern = /^###\s+(.+)$/gm;

  // Extract from HTML tags
  let match;
  while ((match = h2Pattern.exec(content)) !== null) {
    headings.push({ level: 2, text: match[1].trim(), type: 'html' });
  }
  while ((match = h3Pattern.exec(content)) !== null) {
    headings.push({ level: 3, text: match[3].trim(), type: 'html' });
  }

  // Extract from markdown-style
  while ((match = markdownH2Pattern.exec(content)) !== null) {
    headings.push({ level: 2, text: match[1].trim(), type: 'markdown' });
  }
  while ((match = markdownH3Pattern.exec(content)) !== null) {
    headings.push({ level: 3, text: match[1].trim(), type: 'markdown' });
  }

  return headings;
}

// Helper: Check if heading is already a question
function isQuestion(text) {
  const questionWords = [
    'what',
    'why',
    'how',
    'when',
    'where',
    'who',
    'which',
    'can',
    'do',
    'does',
    'is',
    'are',
    'will',
    'should',
  ];
  const lowerText = text.toLowerCase().trim();
  return questionWords.some((word) => lowerText.startsWith(word)) || lowerText.endsWith('?');
}

// Helper: Suggest question version of heading
function suggestQuestion(text) {
  const lowerText = text.toLowerCase().trim();

  // Already a question
  if (isQuestion(text)) {
    return null;
  }

  // Patterns for conversion
  const conversions = [
    // "How [verb]" patterns
    { pattern: /^how\s+(.+)$/i, suggestion: (match) => `How Does ${match[1]} Work?` },
    { pattern: /^how\s+to\s+(.+)$/i, suggestion: (match) => `How Do You ${match[1]}?` },

    // "Benefits" → "What Are the Benefits?"
    { pattern: /^benefits?$/i, suggestion: () => 'What Are the Benefits?' },

    // "Pricing" → "How Much Does It Cost?"
    { pattern: /^pricing$/i, suggestion: () => 'How Much Does It Cost?' },

    // "Why [noun]" → "Why [noun]?"
    { pattern: /^why\s+(.+)$/i, suggestion: (match) => `Why ${match[1]}?` },

    // "[Noun] Guide" → "What Is [Noun]?"
    { pattern: /^(.+)\s+guide$/i, suggestion: (match) => `What Is ${match[1]}?` },

    // "[Noun] Options" → "What Are [Noun] Options?"
    { pattern: /^(.+)\s+options?$/i, suggestion: (match) => `What Are ${match[1]} Options?` },

    // "[Noun] Process" → "How Does [Noun] Process Work?"
    {
      pattern: /^(.+)\s+process$/i,
      suggestion: (match) => `How Does the ${match[1]} Process Work?`,
    },

    // Generic: Add "What Is" or "How Does"
    {
      pattern: /^(.+)$/,
      suggestion: (match) => {
        const text = match[1];
        // If it's a noun phrase, use "What Is"
        if (text.length < 30 && !text.includes(' ')) {
          return `What Is ${text}?`;
        }
        // Otherwise use "How Does"
        return `How Does ${text} Work?`;
      },
    },
  ];

  for (const { pattern, suggestion } of conversions) {
    const match = lowerText.match(pattern);
    if (match) {
      return suggestion(match);
    }
  }

  return null;
}

// Helper: Analyze a single page
function analyzePage(filePath) {
  const content = readFile(filePath);
  if (!content) return null;

  const fileName = filePath.replace(join(projectRoot, 'src', 'pages') + '/', '');
  const headings = extractHeadings(content);

  const analysis = {
    file: fileName,
    totalHeadings: headings.length,
    questionHeadings: 0,
    statementHeadings: 0,
    suggestions: [],
  };

  headings.forEach((heading) => {
    if (isQuestion(heading.text)) {
      analysis.questionHeadings++;
    } else {
      analysis.statementHeadings++;
      const suggestion = suggestQuestion(heading.text);
      if (suggestion) {
        analysis.suggestions.push({
          original: heading.text,
          suggested: suggestion,
          level: heading.level,
        });
      }
    }
  });

  return analysis;
}

// Main execution
async function main() {
  console.log('\n🔍 Analyzing Question Headings Across All Pages\n');
  console.log('======================================================================\n');

  const pageFiles = findPageFiles();
  console.log(`📋 Found ${pageFiles.length} page files\n`);

  const allAnalyses = [];
  for (let i = 0; i < pageFiles.length; i++) {
    process.stdout.write(`⏳ Processing ${i + 1}/${pageFiles.length}...\r`);
    const analysis = analyzePage(pageFiles[i]);
    if (analysis && analysis.totalHeadings > 0) {
      allAnalyses.push(analysis);
    }
  }
  process.stdout.write(`✅ Processed ${pageFiles.length} pages\n\n`);

  // Aggregate results
  let totalHeadings = 0;
  let totalQuestions = 0;
  let totalStatements = 0;
  const pagesWithSuggestions = [];

  allAnalyses.forEach((analysis) => {
    totalHeadings += analysis.totalHeadings;
    totalQuestions += analysis.questionHeadings;
    totalStatements += analysis.statementHeadings;
    if (analysis.suggestions.length > 0) {
      pagesWithSuggestions.push(analysis);
    }
  });

  // Output results
  console.log('======================================================================');
  console.log('📊 ANALYSIS RESULTS');
  console.log('======================================================================\n');

  console.log(`Total Headings Found: ${totalHeadings}`);
  console.log(
    `  ✅ Question Headings: ${totalQuestions} (${Math.round((totalQuestions / totalHeadings) * 100)}%)`
  );
  console.log(
    `  📝 Statement Headings: ${totalStatements} (${Math.round((totalStatements / totalHeadings) * 100)}%)\n`
  );

  console.log(`Pages with Conversion Suggestions: ${pagesWithSuggestions.length}\n`);

  if (pagesWithSuggestions.length > 0) {
    console.log('======================================================================');
    console.log('💡 CONVERSION SUGGESTIONS');
    console.log('======================================================================\n');

    pagesWithSuggestions.forEach((analysis) => {
      console.log(`📄 ${analysis.file}`);
      console.log(
        `   Headings: ${analysis.totalHeadings} total, ${analysis.questionHeadings} questions, ${analysis.statementHeadings} statements`
      );
      console.log(`   Suggestions: ${analysis.suggestions.length}\n`);

      analysis.suggestions.slice(0, 5).forEach((suggestion) => {
        console.log(`   • "${suggestion.original}"`);
        console.log(`     → "${suggestion.suggested}"`);
        console.log(`     (H${suggestion.level})\n`);
      });

      if (analysis.suggestions.length > 5) {
        console.log(`   ... and ${analysis.suggestions.length - 5} more suggestions\n`);
      }
      console.log('');
    });
  }

  // Save detailed report
  const outputPath = join(projectRoot, 'analysis-question-headings.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        analyzedAt: new Date().toISOString(),
        summary: {
          totalPages: pageFiles.length,
          pagesWithHeadings: allAnalyses.length,
          totalHeadings,
          totalQuestions,
          totalStatements,
          questionPercentage: Math.round((totalQuestions / totalHeadings) * 100),
          pagesWithSuggestions: pagesWithSuggestions.length,
        },
        detailedPages: allAnalyses,
      },
      null,
      2
    )
  );

  console.log(`📁 Detailed report saved: ${outputPath}\n`);
}

main();
