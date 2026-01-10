/**
 * Change LocalBusiness schema to Organization on all pages
 * Since Moving Again covers all of Australia, not just local areas
 *
 * Usage: node scripts/change-localbusiness-to-organization.mjs [--dry-run]
 */

/* global process, console */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const pagesDir = join(projectRoot, 'src', 'pages');

const isDryRun = process.argv.includes('--dry-run');

// Files to skip
const SKIP_FILES = ['404.astro', 'robots.txt.ts'];

function findAllAstroFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.astro')) {
      if (!SKIP_FILES.includes(entry.name)) {
        files.push(join(dir, entry.name));
      }
    }
  }
  return files;
}

function changeLocalBusinessToOrganization(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Check if file uses LocalBusiness
  if (!content.includes('LocalBusiness')) {
    return { fixed: false, reason: 'No LocalBusiness found' };
  }

  // Change schemaType="LocalBusiness" to schemaType="Organization"
  content = content.replace(/schemaType="LocalBusiness"/g, 'schemaType="Organization"');

  // Update schemaData - remove address field, keep areaServed but update name
  // Pattern: schemaData={{ name: 'Moving Again - City', address: {...}, areaServed: '...', priceRange: '...' }}
  const schemaDataRegex = /schemaData=\{\{([^}]+)\}\}/s;
  const match = content.match(schemaDataRegex);

  if (match) {
    let schemaDataContent = match[1];

    // Remove address field (local-specific)
    schemaDataContent = schemaDataContent.replace(/address:\s*\{[^}]+\},?\s*/g, '');

    // Update name from "Moving Again - City" to just "Moving Again" or keep area-specific name
    // Actually, let's keep the name but remove the address since Organization can still have areaServed
    // Remove priceRange (not typically used in Organization)
    schemaDataContent = schemaDataContent.replace(/priceRange:\s*['"$]+,\s*/g, '');
    schemaDataContent = schemaDataContent.replace(/priceRange:\s*['"$]+/g, '');

    // Clean up extra commas
    schemaDataContent = schemaDataContent.replace(/,\s*,/g, ',');
    schemaDataContent = schemaDataContent.replace(/,\s*\}/g, '}');
    schemaDataContent = schemaDataContent.replace(/\{\s*,/g, '{');

    // Update areaServed to be more general if it's too specific
    // Keep areaServed as is - it's valid for Organization too

    content = content.replace(schemaDataRegex, `schemaData={{${schemaDataContent}}}`);
  }

  if (content !== originalContent) {
    if (!isDryRun) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
    return { fixed: true };
  }

  return { fixed: false, reason: 'No changes needed' };
}

async function main() {
  console.log('🔍 Finding pages with LocalBusiness schema...\n');
  const allFiles = findAllAstroFiles(pagesDir);
  console.log(`Found ${allFiles.length} pages\n`);
  if (isDryRun) {
    console.log('🔍 DRY RUN MODE\n');
  }

  const results = { fixed: [], skipped: [] };

  for (const filePath of allFiles) {
    const relativePath = filePath.replace(projectRoot + '/', '');
    console.log(`Processing: ${relativePath}`);

    try {
      const result = changeLocalBusinessToOrganization(filePath);
      if (result.fixed) {
        results.fixed.push(relativePath);
        console.log(`  ✅ ${isDryRun ? 'Would change' : 'Changed'} LocalBusiness to Organization`);
      } else {
        results.skipped.push({ file: relativePath, reason: result.reason });
        console.log(`  ⏭️  ${result.reason}`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }

  console.log(`\n✅ Fixed: ${results.fixed.length}`);
  console.log(`⏭️  Skipped: ${results.skipped.length}`);

  if (results.fixed.length > 0) {
    console.log('\n✅ Pages changed from LocalBusiness to Organization:');
    results.fixed.forEach((file) => {
      console.log(`   ${file}`);
    });
  }

  if (isDryRun) {
    console.log('\n💡 Run without --dry-run to apply changes');
  }
}

main().catch(console.error);
