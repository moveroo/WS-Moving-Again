/**
 * Image Alt Text Analysis Script
 *
 * Analyzes all pages to find images with missing or generic alt text.
 * Generates suggestions for descriptive alt text.
 *
 * Usage: node scripts/analyze-image-alt-text.mjs
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

// Helper: Find all component files
function findComponentFiles() {
  const componentsDir = join(projectRoot, 'src', 'components');
  const files = fs.readdirSync(componentsDir, { recursive: true });
  return files.filter((file) => file.endsWith('.astro')).map((file) => join(componentsDir, file));
}

// Helper: Extract images from content
function extractImages(content, filePath) {
  const images = [];
  const fileName = filePath.replace(projectRoot + '/', '');

  // Pattern: <img ... /> or <OptimizedImage ... />
  const imgPattern = /<(img|OptimizedImage)[^>]*>/gi;
  let match;

  while ((match = imgPattern.exec(content)) !== null) {
    const imgTag = match[0];
    const image = {
      file: fileName,
      tag: imgTag,
      src: null,
      alt: null,
      hasAlt: false,
      altText: null,
      isGeneric: false,
      suggestion: null,
    };

    // Extract src
    const srcMatch =
      imgTag.match(/src\s*=\s*["']([^"']+)["']/i) || imgTag.match(/src\s*=\s*\{([^}]+)\}/i);
    if (srcMatch) {
      image.src = srcMatch[1] || srcMatch[2];
    }

    // Extract alt
    const altMatch =
      imgTag.match(/alt\s*=\s*["']([^"']+)["']/i) || imgTag.match(/alt\s*=\s*\{([^}]+)\}/i);
    if (altMatch) {
      image.alt = altMatch[1] || altMatch[2];
      image.hasAlt = true;
      image.altText = image.alt;

      // Check if generic
      const genericAlts = ['image', 'img', 'photo', 'picture', 'logo', 'icon', 'graphic', ''];
      image.isGeneric = genericAlts.some((generic) => image.alt.toLowerCase().trim() === generic);
    } else {
      image.hasAlt = false;
    }

    // Generate suggestion
    if (!image.hasAlt || image.isGeneric) {
      image.suggestion = generateAltSuggestion(image.src, image.alt, content);
    }

    images.push(image);
  }

  return images;
}

// Helper: Generate alt text suggestion
function generateAltSuggestion(src, currentAlt, content) {
  if (!src) return 'Add descriptive alt text';

  // Extract filename from src
  const filename = src
    .split('/')
    .pop()
    .replace(/\.(jpg|jpeg|png|gif|svg|webp)$/i, '');
  const cleanFilename = filename.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  // Context-based suggestions
  if (src.includes('logo')) {
    return 'Moving Again logo';
  }
  if (src.includes('icon')) {
    return cleanFilename || 'Icon';
  }
  if (src.includes('truck') || src.includes('vehicle')) {
    return 'Moving truck or vehicle';
  }
  if (src.includes('box') || src.includes('packing')) {
    return 'Moving boxes and packing supplies';
  }

  // Try to infer from surrounding content
  const imgIndex = content.indexOf(src);
  if (imgIndex > 0) {
    const beforeImg = content.substring(Math.max(0, imgIndex - 200), imgIndex);
    const afterImg = content.substring(imgIndex, Math.min(content.length, imgIndex + 200));

    // Look for headings or text near the image
    const headingMatch =
      beforeImg.match(/<h[23][^>]*>([^<]+)<\/h[23]>/i) ||
      afterImg.match(/<h[23][^>]*>([^<]+)<\/h[23]>/i);
    if (headingMatch) {
      return `${headingMatch[1].trim()} - visual representation`;
    }

    // Look for descriptive text
    const textMatch = beforeImg.match(/([A-Z][^.!?]{20,80})/);
    if (textMatch) {
      return `${textMatch[1].trim()} - illustration`;
    }
  }

  // Fallback: use filename
  return cleanFilename || 'Descriptive image related to content';
}

// Main execution
async function main() {
  console.log('\n🔍 Analyzing Image Alt Text Across All Pages\n');
  console.log('======================================================================\n');

  const pageFiles = findPageFiles();
  const componentFiles = findComponentFiles();
  const allFiles = [...pageFiles, ...componentFiles];

  console.log(
    `📋 Found ${allFiles.length} files (${pageFiles.length} pages, ${componentFiles.length} components)\n`
  );

  const allImages = [];
  for (let i = 0; i < allFiles.length; i++) {
    process.stdout.write(`⏳ Processing ${i + 1}/${allFiles.length}...\r`);
    const content = readFile(allFiles[i]);
    if (content) {
      const images = extractImages(content, allFiles[i]);
      allImages.push(...images);
    }
  }
  process.stdout.write(`✅ Processed ${allFiles.length} files\n\n`);

  // Categorize images
  const missingAlt = allImages.filter((img) => !img.hasAlt);
  const genericAlt = allImages.filter((img) => img.hasAlt && img.isGeneric);
  const goodAlt = allImages.filter((img) => img.hasAlt && !img.isGeneric);

  // Output results
  console.log('======================================================================');
  console.log('📊 ALT TEXT ANALYSIS RESULTS');
  console.log('======================================================================\n');

  console.log(`Total Images Found: ${allImages.length}`);
  console.log(
    `  ✅ Good Alt Text: ${goodAlt.length} (${Math.round((goodAlt.length / allImages.length) * 100)}%)`
  );
  console.log(
    `  ⚠️  Generic Alt Text: ${genericAlt.length} (${Math.round((genericAlt.length / allImages.length) * 100)}%)`
  );
  console.log(
    `  ❌ Missing Alt Text: ${missingAlt.length} (${Math.round((missingAlt.length / allImages.length) * 100)}%)\n`
  );

  if (missingAlt.length > 0) {
    console.log('======================================================================');
    console.log('❌ IMAGES WITH MISSING ALT TEXT');
    console.log('======================================================================\n');

    missingAlt.slice(0, 10).forEach((img) => {
      console.log(`📄 ${img.file}`);
      console.log(`   Source: ${img.src || 'N/A'}`);
      console.log(`   Suggestion: "${img.suggestion}"\n`);
    });

    if (missingAlt.length > 10) {
      console.log(`   ... and ${missingAlt.length - 10} more images with missing alt text\n`);
    }
  }

  if (genericAlt.length > 0) {
    console.log('======================================================================');
    console.log('⚠️  IMAGES WITH GENERIC ALT TEXT');
    console.log('======================================================================\n');

    genericAlt.slice(0, 10).forEach((img) => {
      console.log(`📄 ${img.file}`);
      console.log(`   Source: ${img.src || 'N/A'}`);
      console.log(`   Current Alt: "${img.altText}"`);
      console.log(`   Suggestion: "${img.suggestion}"\n`);
    });

    if (genericAlt.length > 10) {
      console.log(`   ... and ${genericAlt.length - 10} more images with generic alt text\n`);
    }
  }

  // Save detailed report
  const outputPath = join(projectRoot, 'analysis-image-alt-text.json');
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        analyzedAt: new Date().toISOString(),
        summary: {
          totalImages: allImages.length,
          goodAlt: goodAlt.length,
          genericAlt: genericAlt.length,
          missingAlt: missingAlt.length,
          needsImprovement: missingAlt.length + genericAlt.length,
        },
        missingAlt: missingAlt.map((img) => ({
          file: img.file,
          src: img.src,
          suggestion: img.suggestion,
        })),
        genericAlt: genericAlt.map((img) => ({
          file: img.file,
          src: img.src,
          currentAlt: img.altText,
          suggestion: img.suggestion,
        })),
        allImages: allImages,
      },
      null,
      2
    )
  );

  console.log(`📁 Detailed report saved: ${outputPath}\n`);

  // Summary
  if (missingAlt.length === 0 && genericAlt.length === 0) {
    console.log('🎉 Excellent! All images have descriptive alt text.\n');
  } else {
    console.log(
      `⚠️  Found ${missingAlt.length} images with missing alt text and ${genericAlt.length} with generic alt text.\n`
    );
    console.log(
      '💡 Recommendation: Add descriptive alt text to all images for better accessibility and SEO.\n'
    );
  }
}

main();
