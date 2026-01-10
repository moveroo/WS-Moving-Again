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
    // Get the most recent commit date for this file
    const gitDate = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    })
      .toString()
      .trim();

    return gitDate || null;
  } catch {
    // Git not available or file not in repo
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
    return null;
  }
}

/**
 * Get content date for a file (prefers Git, falls back to file system, then build time)
 * @param filePath - Path to the file
 */
export function getContentDate(filePath: string): string {
  // Try Git commit date first (most accurate)
  const gitDate = getGitCommitDate(filePath);
  if (gitDate) {
    return gitDate;
  }

  // Try file system modification date
  const fileDate = getFileModificationDate(filePath);
  if (fileDate) {
    return fileDate;
  }

  // Fall back to build time
  return new Date().toISOString();
}

/**
 * Get content date for a content collection entry
 * @param collection - Collection name (e.g., 'routes')
 * @param slug - Slug or ID of the entry
 */
export function getContentCollectionDate(collection: string, slug: string): string {
  // Resolve the actual file path
  const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
  // Try with .md extension first
  let fullPath = join(projectRoot, 'src', 'content', collection, `${slug}.md`);

  // If file doesn't exist, try without extension (in case slug already has it)
  try {
    statSync(fullPath);
  } catch {
    // Try with slug as-is (might already include .md)
    fullPath = join(projectRoot, 'src', 'content', collection, slug);
  }

  return getContentDate(fullPath);
}
