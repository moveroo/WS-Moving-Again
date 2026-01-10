/**
 * File Date Utilities
 *
 * Gets file modification dates for content freshness meta tags.
 * Falls back to build time if Git/file dates unavailable.
 */

import { execSync } from 'child_process';
import { statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Get Git commit date for a file (most recent commit)
 * Returns ISO string or null if Git unavailable
 */
export function getGitCommitDate(filePath: string): string | null {
  try {
    // Resolve project root (where .git folder is)
    const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

    // Make path relative to project root for Git command
    // Git needs paths relative to repo root, or absolute paths
    const absolutePath = filePath.startsWith('/') ? filePath : join(projectRoot, filePath);

    // Get the most recent commit date for this file
    // Use --follow to track renames, and --diff-filter=A to get creation date if needed
    const gitDate = execSync(`git log -1 --format=%cI --follow -- "${absolutePath}"`, {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: projectRoot, // Ensure we're in the project root
      timeout: 5000, // 5 second timeout
    })
      .toString()
      .trim();

    return gitDate || null;
  } catch {
    // Git not available or file not in repo
    // Silently fail - this is expected in some build environments
    return null;
  }
}

/**
 * Get file system modification date
 * Returns ISO string or null if file doesn't exist
 */
export function getFileModificationDate(filePath: string): string | null {
  try {
    const stats = statSync(filePath);
    return stats.mtime.toISOString();
  } catch {
    // File doesn't exist or can't be accessed
    return null;
  }
}

/**
 * Get content date for a file (prefers Git, falls back to file system, then build time)
 * @param filePath - Path to the file (can be absolute or relative to project root)
 */
export function getContentDate(filePath: string): string {
  // Resolve project root for path resolution
  const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

  // Normalize path (handle both absolute and relative)
  const normalizedPath = filePath.startsWith('/') ? filePath : join(projectRoot, filePath);

  // Try Git commit date first (most accurate)
  const gitDate = getGitCommitDate(normalizedPath);
  if (gitDate) {
    return gitDate;
  }

  // Try file system modification date
  const fileDate = getFileModificationDate(normalizedPath);
  if (fileDate) {
    return fileDate;
  }

  // Fall back to build time
  return new Date().toISOString();
}

/**
 * Get content date for a content collection entry
 * @param collection - Collection name (e.g., 'routes')
 * @param slug - Slug or ID of the entry (e.g., 'routes/sydney-melbourne' or 'sydney-melbourne')
 */
export function getContentCollectionDate(collection: string, slug: string): string {
  // Resolve the actual file path
  const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

  // Extract filename from slug (route.id is 'routes/sydney-melbourne', we need just 'sydney-melbourne')
  // Handle both formats: 'routes/sydney-melbourne' or 'sydney-melbourne'
  const filename = slug.includes('/') ? slug.split('/').pop() || slug : slug;

  // Remove .md extension if present
  const baseFilename = filename.replace(/\.md$/, '');

  // Construct full path
  const fullPath = join(projectRoot, 'src', 'content', collection, `${baseFilename}.md`);

  return getContentDate(fullPath);
}
