import { resolve } from 'node:path';
import { rm, symlink } from 'node:fs/promises';
import type { CreateSymlinkOptions } from '../types/index.js';
import { checkPathType } from './validation.js';
import { isNodeError } from './type-guards.js';

/**
 * Create a symlink from source to target
 */
export async function createSymlink(source: string, target: string, options: CreateSymlinkOptions = {}): Promise<void> {
  const resolvedSource = resolve(source);
  const resolvedTarget = resolve(target);

  if (options.verbose) {
    console.log(`Source: ${resolvedSource}`);
    console.log(`Target: ${resolvedTarget}`);
  }

  if (options.dryRun) {
    console.log(`[DRY RUN] Would create symlink: ${resolvedSource} -> ${resolvedTarget}`);
    return;
  }

  // Remove existing symlink at source if exists
  try {
    const pathType = await checkPathType(resolvedSource);
    if (pathType === 'symlink') {
      if (options.verbose) {
        console.log(`Removing existing symlink at ${resolvedSource}`);
      }
      await rm(resolvedSource, { force: true });
    } else if (pathType === 'directory' || pathType === 'file') {
      throw new Error(`Path ${resolvedSource} already exists and is not a symlink. Remove it first or use a different path.`);
    }
  } catch (error) {
    // ENOENT means file doesn't exist, which is fine
    if (isNodeError(error) && error.code !== 'ENOENT') {
      throw error;
    }
  }

  // Create the symlink
  console.log(`Creating symlink: ${resolvedSource} -> ${resolvedTarget}`);
  await symlink(resolvedTarget, resolvedSource, 'junction');
  console.log(`Successfully created symlink: ${resolvedSource} -> ${resolvedTarget}`);
}
