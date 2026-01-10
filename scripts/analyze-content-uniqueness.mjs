/**
 * Content Uniqueness & Quality Analyzer
 *
 * Analyzes page content to identify:
 * - Duplicate or similar content across pages
 * - Thin content (too short)
 * - Content quality metrics
 * - Uniqueness scores
 * - Suggestions for improvement
 *
 * Usage: node scripts/analyze-content-uniqueness.mjs
 */

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

// Helper: Extract text content from Astro file (remove HTML, frontmatter, scripts)
function extractTextContent(content) {
  // Remove frontmatter
  let text = content.replace(/^---[\s\S]*?---\n/, '');

  // Remove script tags
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove style tags
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Remove HTML tags but keep text
  text = text.replace(/<[^>]+>/g, ' ');

  // Remove template variables
  text = text.replace(/\{[^}]+\}/g, '');

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

// Helper: Extract visible text (from specific sections)
function extractVisibleContent(content) {
  // Extract text from common content sections
  const sections = [];

  // Extract from <p> tags
  const pMatches = content.matchAll(/<p[^>]*>([^<]+)<\/p>/gi);
  for (const match of pMatches) {
    sections.push(match[1].trim());
  }

  // Extract from <h2>, <h3> tags
  const hMatches = content.matchAll(/<h[23][^>]*>([^<]+)<\/h[23]>/gi);
  for (const match of hMatches) {
    sections.push(match[1].trim());
  }

  // Extract from <li> tags
  const liMatches = content.matchAll(/<li[^>]*>([^<]+)<\/li>/gi);
  for (const match of liMatches) {
    sections.push(match[1].trim());
  }

  return sections.join(' ');
}

// Helper: Calculate word count
function getWordCount(text) {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

// Helper: Calculate content similarity (simple word overlap)
function calculateSimilarity(text1, text2) {
  const words1 = new Set(
    text1
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
  const words2 = new Set(
    text2
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

  // Remove common stop words
  const stopWords = new Set([
    'the',
    'and',
    'for',
    'are',
    'but',
    'not',
    'you',
    'all',
    'can',
    'her',
    'was',
    'one',
    'our',
    'out',
    'day',
    'get',
    'has',
    'him',
    'his',
    'how',
    'its',
    'may',
    'new',
    'now',
    'old',
    'see',
    'two',
    'way',
    'who',
    'boy',
    'did',
    'she',
    'use',
    'her',
    'many',
    'than',
    'them',
    'these',
    'so',
    'some',
    'would',
    'make',
    'like',
    'into',
    'time',
    'has',
    'look',
    'more',
    'very',
    'what',
    'know',
    'just',
    'first',
    'also',
    'after',
    'back',
    'other',
    'many',
    'then',
    'them',
    'these',
    'want',
    'been',
    'good',
    'much',
    'some',
    'time',
    'very',
    'when',
    'come',
    'here',
    'just',
    'like',
    'long',
    'make',
    'many',
    'over',
    'such',
    'take',
    'than',
    'them',
    'well',
    'were',
  ]);

  const filtered1 = Array.from(words1).filter((w) => !stopWords.has(w));
  const filtered2 = Array.from(words2).filter((w) => !stopWords.has(w));

  if (filtered1.length === 0 || filtered2.length === 0) {
    return 0;
  }

  const intersection = filtered1.filter((w) => filtered2.includes(w));
  const union = new Set([...filtered1, ...filtered2]);

  // Jaccard similarity
  return intersection.length / union.size;
}

// Helper: Extract key phrases (n-grams)
function extractKeyPhrases(text, minLength = 3, maxLength = 5) {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const phrases = new Set();

  for (let n = minLength; n <= maxLength && n <= words.length; n++) {
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(' ');
      if (phrase.length > 10) {
        // Only meaningful phrases
        phrases.add(phrase);
      }
    }
  }

  return Array.from(phrases);
}

// Helper: Analyze a single page
function analyzePage(filePath) {
  const content = readFile(filePath);
  if (!content) return null;

  const fileName = filePath.replace(join(projectRoot, 'src', 'pages') + '/', '');
  const fullText = extractTextContent(content);
  const visibleText = extractVisibleContent(content);
  const wordCount = getWordCount(fullText);
  const visibleWordCount = getWordCount(visibleText);

  // Extract title and description
  const titleMatch =
    content.match(/title\s*=\s*["']([^"']+)["']/) || content.match(/title\s*=\s*\{`([^`]+)`\}/);
  const descMatch =
    content.match(/description\s*=\s*["']([^"']+)["']/) ||
    content.match(/description\s*=\s*\{`([^`]+)`\}/);

  return {
    file: fileName,
    wordCount,
    visibleWordCount,
    title: titleMatch ? titleMatch[1] : null,
    description: descMatch ? descMatch[1] : null,
    fullText,
    visibleText,
    keyPhrases: extractKeyPhrases(visibleText),
  };
}

// Main execution
async function main() {
  console.log('\n🔍 Analyzing Content Uniqueness & Quality\n');
  console.log('======================================================================\n');

  const pageFiles = findPageFiles();
  console.log(`📋 Found ${pageFiles.length} page files\n`);

  const allPages = [];
  for (let i = 0; i < pageFiles.length; i++) {
    process.stdout.write(`⏳ Processing ${i + 1}/${pageFiles.length}...\r`);
    const analysis = analyzePage(pageFiles[i]);
    if (analysis) {
      allPages.push(analysis);
    }
  }
  process.stdout.write(`✅ Processed ${pageFiles.length} pages\n\n`);

  // Calculate similarities
  console.log('📊 Calculating content similarities...\n');
  const similarities = [];
  const duplicateThreshold = 0.7; // 70% similarity considered duplicate

  for (let i = 0; i < allPages.length; i++) {
    for (let j = i + 1; j < allPages.length; j++) {
      const similarity = calculateSimilarity(allPages[i].visibleText, allPages[j].visibleText);
      if (similarity > 0.3) {
        // Only report if > 30% similar
        similarities.push({
          page1: allPages[i].file,
          page2: allPages[j].file,
          similarity: Math.round(similarity * 100),
          wordCount1: allPages[i].wordCount,
          wordCount2: allPages[j].wordCount,
        });
      }
    }
  }

  // Sort by similarity
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Identify thin content
  const thinContent = allPages.filter((page) => page.wordCount < 300);
  const goodContent = allPages.filter((page) => page.wordCount >= 300 && page.wordCount < 1000);
  const excellentContent = allPages.filter((page) => page.wordCount >= 1000);

  // Identify duplicate/similar content
  const highSimilarity = similarities.filter((s) => s.similarity >= duplicateThreshold);
  const mediumSimilarity = similarities.filter(
    (s) => s.similarity >= 50 && s.similarity < duplicateThreshold
  );

  // Output results
  console.log('======================================================================');
  console.log('📊 CONTENT ANALYSIS RESULTS');
  console.log('======================================================================\n');

  console.log(`Total Pages Analyzed: ${allPages.length}\n`);

  // Word count distribution
  console.log('📝 Word Count Distribution:\n');
  console.log(`  ❌ Thin Content (< 300 words): ${thinContent.length} pages`);
  console.log(`  🟡 Good Content (300-999 words): ${goodContent.length} pages`);
  console.log(`  ✅ Excellent Content (1000+ words): ${excellentContent.length} pages\n`);

  // Similarity analysis
  console.log('🔍 Content Similarity Analysis:\n');
  console.log(`  🔴 High Similarity (≥70%): ${highSimilarity.length} pairs`);
  console.log(`  🟡 Medium Similarity (50-69%): ${mediumSimilarity.length} pairs`);
  console.log(
    `  ✅ Low Similarity (<50%): ${similarities.length - highSimilarity.length - mediumSimilarity.length} pairs\n`
  );

  // Thin content details
  if (thinContent.length > 0) {
    console.log('======================================================================');
    console.log('❌ THIN CONTENT PAGES (< 300 words)');
    console.log('======================================================================\n');

    thinContent
      .sort((a, b) => a.wordCount - b.wordCount)
      .forEach((page) => {
        console.log(`📄 ${page.file}`);
        console.log(`   Word Count: ${page.wordCount} words`);
        console.log(`   Title: ${page.title || 'N/A'}`);
        console.log(`   Recommendation: Expand to at least 300 words (ideally 500+)\n`);
      });
  }

  // High similarity pairs
  if (highSimilarity.length > 0) {
    console.log('======================================================================');
    console.log('🔴 HIGH SIMILARITY CONTENT (≥70% - Potential Duplicates)');
    console.log('======================================================================\n');

    highSimilarity.slice(0, 20).forEach((pair) => {
      console.log(`📄 ${pair.page1} ↔ ${pair.page2}`);
      console.log(`   Similarity: ${pair.similarity}%`);
      console.log(`   Word Counts: ${pair.wordCount1} vs ${pair.wordCount2} words`);
      console.log(
        `   Recommendation: Make content more unique - add page-specific details, local information, unique examples\n`
      );
    });

    if (highSimilarity.length > 20) {
      console.log(`   ... and ${highSimilarity.length - 20} more high-similarity pairs\n`);
    }
  }

  // Medium similarity pairs (top 10)
  if (mediumSimilarity.length > 0) {
    console.log('======================================================================');
    console.log('🟡 MEDIUM SIMILARITY CONTENT (50-69% - Review for Uniqueness)');
    console.log('======================================================================\n');

    mediumSimilarity.slice(0, 10).forEach((pair) => {
      console.log(`📄 ${pair.page1} ↔ ${pair.page2}`);
      console.log(`   Similarity: ${pair.similarity}%`);
      console.log(`   Recommendation: Consider adding unique elements to differentiate\n`);
    });

    if (mediumSimilarity.length > 10) {
      console.log(`   ... and ${mediumSimilarity.length - 10} more medium-similarity pairs\n`);
    }
  }

  // Key phrase analysis (find common phrases across pages)
  console.log('======================================================================');
  console.log('🔑 COMMON PHRASES ANALYSIS');
  console.log('======================================================================\n');

  const phraseFrequency = new Map();
  allPages.forEach((page) => {
    page.keyPhrases.forEach((phrase) => {
      if (!phraseFrequency.has(phrase)) {
        phraseFrequency.set(phrase, []);
      }
      phraseFrequency.get(phrase).push(page.file);
    });
  });

  // Find phrases that appear on many pages (potential duplicate content)
  const commonPhrases = Array.from(phraseFrequency.entries())
    .filter(([, pages]) => pages.length >= 3)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 20);

  if (commonPhrases.length > 0) {
    console.log('Phrases appearing on 3+ pages (potential duplicate content):\n');
    commonPhrases.forEach(([phrase, pages]) => {
      console.log(`  "${phrase}"`);
      console.log(`    Appears on: ${pages.length} pages`);
      console.log(
        `    Pages: ${pages.slice(0, 5).join(', ')}${pages.length > 5 ? ` ... and ${pages.length - 5} more` : ''}\n`
      );
    });
  } else {
    console.log('✅ No overly common phrases found across multiple pages.\n');
  }

  // Save detailed report
  const outputPath = join(projectRoot, 'analysis-content-uniqueness.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        analyzedAt: new Date().toISOString(),
        summary: {
          totalPages: allPages.length,
          thinContent: thinContent.length,
          goodContent: goodContent.length,
          excellentContent: excellentContent.length,
          highSimilarityPairs: highSimilarity.length,
          mediumSimilarityPairs: mediumSimilarity.length,
          averageWordCount: Math.round(
            allPages.reduce((sum, p) => sum + p.wordCount, 0) / allPages.length
          ),
        },
        thinContent: thinContent.map((p) => ({
          file: p.file,
          wordCount: p.wordCount,
          title: p.title,
        })),
        highSimilarity: highSimilarity,
        mediumSimilarity: mediumSimilarity,
        commonPhrases: commonPhrases.map(([phrase, pages]) => ({
          phrase,
          pageCount: pages.length,
          pages,
        })),
        allPages: allPages.map((p) => ({
          file: p.file,
          wordCount: p.wordCount,
          title: p.title,
        })),
      },
      null,
      2
    )
  );

  console.log(`📁 Detailed report saved: ${outputPath}\n`);

  // Recommendations
  console.log('======================================================================');
  console.log('💡 RECOMMENDATIONS');
  console.log('======================================================================\n');

  if (thinContent.length > 0) {
    console.log(`1. Expand ${thinContent.length} thin content pages to at least 300 words`);
    console.log(
      `   Focus on: ${thinContent
        .slice(0, 5)
        .map((p) => p.file)
        .join(', ')}\n`
    );
  }

  if (highSimilarity.length > 0) {
    console.log(`2. Make ${highSimilarity.length} high-similarity page pairs more unique`);
    console.log(`   Add page-specific content, local details, unique examples\n`);
  }

  if (commonPhrases.length > 0) {
    console.log(`3. Review ${commonPhrases.length} common phrases that appear on multiple pages`);
    console.log(`   Consider customizing these sections for each page\n`);
  }

  console.log('✅ Analysis complete!\n');
}

main();
