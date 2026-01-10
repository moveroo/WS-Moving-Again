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
    headings.push({ level: 3, text: match[1].trim(), type: 'html' });
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

// Helper: Capitalize first letter of each word
function capitalizeWords(text) {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper: Suggest question version of heading
function suggestQuestion(text) {
  const originalText = text.trim();
  const lowerText = originalText.toLowerCase().trim();

  // Already a question
  if (isQuestion(text)) {
    return null;
  }

  // Patterns for conversion (order matters - more specific first)
  const conversions = [
    // "Routes from [City]" → "What Routes Are Available from [City]?"
    {
      pattern: /^routes?\s+from\s+(.+)$/i,
      suggestion: (match) => `What Routes Are Available from ${capitalizeWords(match[1])}?`,
    },

    // "Routes to [City]" → "What Routes Are Available to [City]?"
    {
      pattern: /^routes?\s+to\s+(.+)$/i,
      suggestion: (match) => `What Routes Are Available to ${capitalizeWords(match[1])}?`,
    },

    // "Popular [Noun]" → "What Are the Popular [Noun]?"
    {
      pattern: /^popular\s+(.+)$/i,
      suggestion: (match) => `What Are the Popular ${capitalizeWords(match[1])}?`,
    },

    // "[Noun] Guide" → "What Is the [Noun] Guide?"
    {
      pattern: /^(.+)\s+guide$/i,
      suggestion: (match) => `What Is the ${capitalizeWords(match[1])} Guide?`,
    },

    // "[Noun] Pricing" → "How Much Does [Noun] Cost?"
    {
      pattern: /^(.+)\s+pricing$/i,
      suggestion: (match) => {
        const noun = match[1].toLowerCase();
        if (noun === 'backloading' || noun.includes('backload')) {
          return 'How Much Does Backloading Cost?';
        }
        return `How Much Does ${capitalizeWords(match[1])} Cost?`;
      },
    },
    { pattern: /^pricing$/i, suggestion: () => 'How Much Does It Cost?' },

    // "Benefits" → "What Are the Benefits?"
    { pattern: /^benefits?$/i, suggestion: () => 'What Are the Benefits?' },

    // "[Noun] Benefits" → "What Are the Benefits of [Noun]?"
    {
      pattern: /^(.+)\s+benefits?$/i,
      suggestion: (match) => `What Are the Benefits of ${capitalizeWords(match[1])}?`,
    },

    // "How [verb]" → "How Does [verb] Work?"
    {
      pattern: /^how\s+(.+)$/i,
      suggestion: (match) => {
        const rest = match[1];
        if (rest.toLowerCase().includes('work')) {
          return `How Does ${rest}?`;
        }
        return `How Does ${rest} Work?`;
      },
    },

    // "How to [verb]" → "How Do You [verb]?"
    {
      pattern: /^how\s+to\s+(.+)$/i,
      suggestion: (match) => `How Do You ${capitalizeWords(match[1])}?`,
    },

    // "Why [noun]" → "Why [noun]?"
    { pattern: /^why\s+(.+)$/i, suggestion: (match) => `Why ${capitalizeWords(match[1])}?` },

    // "[Noun] Options" → "What Are [Noun] Options?"
    {
      pattern: /^(.+)\s+options?$/i,
      suggestion: (match) => `What Are ${capitalizeWords(match[1])} Options?`,
    },

    // "[Noun] Process" → "How Does the [Noun] Process Work?"
    {
      pattern: /^(.+)\s+process$/i,
      suggestion: (match) => `How Does the ${capitalizeWords(match[1])} Process Work?`,
    },

    // "[City] → [City]" (route patterns) → Skip template variables
    {
      pattern: /^(.+)\s*→\s*(.+)$/i,
      suggestion: (match) => {
        const origin = match[1].trim();
        const dest = match[2].trim();
        // Skip if it contains template variables
        if (origin.includes('{') || dest.includes('{')) {
          return null;
        }
        return `What Routes Are Available from ${capitalizeWords(origin)} to ${capitalizeWords(dest)}?`;
      },
    },

    // "[Noun] Coverage" or "Coverage" → "What Areas Do You Cover?"
    { pattern: /^(.+)\s+coverage$/i, suggestion: () => 'What Areas Do You Cover?' },
    { pattern: /^coverage$/i, suggestion: () => 'What Areas Do You Cover?' },

    // "[Noun] Service" → "What [Noun] Services Do You Offer?"
    {
      pattern: /^(.+)\s+service$/i,
      suggestion: (match) => `What ${capitalizeWords(match[1])} Services Do You Offer?`,
    },

    // "Moving to or from [City]" → "What Routes Are Available to or from [City]?"
    {
      pattern: /^moving\s+to\s+or\s+from\s+(.+)$/i,
      suggestion: (match) => `What Routes Are Available to or from ${capitalizeWords(match[1])}?`,
    },

    // "[City]: [Description]" → Skip generic descriptions
    {
      pattern: /^(.+):\s*.+$/i,
      suggestion: (match) => {
        const city = match[1].trim();
        // Skip if it's a generic description
        if (city.toLowerCase().includes('where') || city.toLowerCase().includes('hub')) {
          return null;
        }
        return `What Routes Are Available from ${capitalizeWords(city)}?`;
      },
    },

    // Generic patterns for common nouns
    {
      pattern: /^(.+)\s+specialists?$/i,
      suggestion: (match) => `What ${capitalizeWords(match[1])} Services Do You Offer?`,
    },

    // "Explore [Noun]" → "What [Noun] Are Available?"
    {
      pattern: /^explore\s+(.+)$/i,
      suggestion: (match) => `What ${capitalizeWords(match[1])} Are Available?`,
    },

    // "Backloading vs. [Noun]" → "What Is the Difference Between Backloading and [Noun]?"
    {
      pattern: /^(.+)\s+vs\.?\s+(.+)$/i,
      suggestion: (match) =>
        `What Is the Difference Between ${capitalizeWords(match[1])} and ${capitalizeWords(match[2])}?`,
    },

    // Generic fallback: Use "What" for short phrases, "How" for longer
    {
      pattern: /^(.+)$/,
      suggestion: (match) => {
        const text = match[1].trim();
        const words = text.split(' ');

        // Short single-word or two-word phrases → "What Is/Are"
        if (words.length <= 2 && text.length < 25) {
          // Check if plural
          const isPlural =
            words[words.length - 1].toLowerCase().endsWith('s') &&
            !words[words.length - 1].toLowerCase().endsWith('ss');
          return isPlural
            ? `What Are ${capitalizeWords(text)}?`
            : `What Is ${capitalizeWords(text)}?`;
        }

        // Longer phrases → "How Does" or "What Are"
        if (text.toLowerCase().includes('route') || text.toLowerCase().includes('option')) {
          return `What Are ${capitalizeWords(text)}?`;
        }

        // Default: "How Does [text] Work?"
        return `How Does ${capitalizeWords(text)} Work?`;
      },
    },
  ];

  for (const { pattern, suggestion } of conversions) {
    const match = lowerText.match(pattern);
    if (match) {
      const result = suggestion(match);
      // Skip null results (patterns that don't apply)
      if (result) {
        return result;
      }
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
