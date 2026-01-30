import { resolve } from 'node:path';
import { rm, symlink } from 'node:fs/promises';
import type { CreateSymlinkOptions } from '../types/index.js';
import { checkPathType } from './validation.js';

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

  // Remove existing symlink at source or target if exists
  // Check if source is symlink
  const sourceType = await checkPathType(resolvedSource);
  if (sourceType === 'symlink') {
    if (options.verbose) {
      console.log(`Removing existing symlink at ${resolvedSource}`);
    }
    await rm(resolvedSource, { force: true });
  } else if (sourceType === 'directory' || sourceType === 'file') {
    // Check if there's a symlink from target to source
    const targetType = await checkPathType(resolvedTarget);
    if (targetType === 'symlink') {
      if (options.verbose) {
        console.log(`Removing existing symlink at ${resolvedTarget}`);
      }
      await rm(resolvedTarget, { force: true });
    } else {
      throw new Error(`Path ${resolvedSource} already exists and is not a symlink. Remove it first or use a different path.`);
    }
  }

  // Create the symlink
  console.log(`Creating symlink: ${resolvedSource} -> ${resolvedTarget}`);
  await symlink(resolvedTarget, resolvedSource, 'junction');
  console.log(`Successfully created symlink: ${resolvedSource} -> ${resolvedTarget}`);
}
