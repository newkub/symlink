import { resolve } from 'node:path';
import { rm, symlink } from 'node:fs/promises';
import type { CreateSymlinkOptions } from '../types';
import { checkPathType } from './validation';

export interface SymlinkResult {
  success: boolean;
  source: string;
  target: string;
  message: string;
  removed?: Array<{
    path: string;
    type: 'source' | 'target';
  }>;
}

/**
 * Create a symlink from source to target (pure function)
 */
export async function createSymlink(
  source: string,
  target: string,
  options: CreateSymlinkOptions = {}
): Promise<SymlinkResult> {
  const resolvedSource = resolve(source);
  const resolvedTarget = resolve(target);

  if (options.dryRun) {
    return {
      success: true,
      source: resolvedSource,
      target: resolvedTarget,
      message: `[DRY RUN] Would create symlink: ${resolvedSource} -> ${resolvedTarget}`,
    };
  }

  const removed: Array<{ path: string; type: 'source' | 'target' }> = [] as any;

  // Check if source is symlink
  const sourceType = await checkPathType(resolvedSource);
  if (sourceType === 'symlink') {
    await rm(resolvedSource, { force: true });
    removed.push({ path: resolvedSource, type: 'source' });
  } else if (sourceType === 'directory' || sourceType === 'file') {
    // Check if there's a symlink from target to source
    const targetType = await checkPathType(resolvedTarget);
    if (targetType === 'symlink') {
      await rm(resolvedTarget, { force: true });
      removed.push({ path: resolvedTarget, type: 'target' });
    } else {
      return {
        success: false,
        source: resolvedSource,
        target: resolvedTarget,
        message: `Path ${resolvedSource} already exists and is not a symlink. Remove it first or use a different path.`,
      };
    }
  }

  // Create the symlink
  await symlink(resolvedTarget, resolvedSource, 'junction');

  return {
    success: true,
    source: resolvedSource,
    target: resolvedTarget,
    message: `Successfully created symlink: ${resolvedSource} -> ${resolvedTarget}`,
    removed: removed.length > 0 ? removed : undefined,
  };
}
