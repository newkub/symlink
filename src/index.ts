#!/usr/bin/env bun
import { Command } from 'commander';
import { resolve } from 'node:path';
import { rm, symlink } from 'node:fs/promises';

interface CreateSymlinkOptions {
  dryRun?: boolean;
  verbose?: boolean;
}

/**
 * Create a symlink from source to target
 */
async function createSymlink(source: string, target: string, options: CreateSymlinkOptions = {}): Promise<void> {
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
  const sourceFile = Bun.file(resolvedSource);
  if (await sourceFile.exists()) {
    if (options.verbose) {
      console.log(`Removing existing symlink at ${resolvedSource}`);
    }
    await rm(resolvedSource, { recursive: true, force: true });
  }

  // Create the symlink
  console.log(`Creating symlink: ${resolvedSource} -> ${resolvedTarget}`);
  await symlink(resolvedTarget, resolvedSource, 'junction');
  console.log(`Successfully created symlink: ${resolvedSource} -> ${resolvedTarget}`);
}

/**
 * CLI setup and execution
 */
const program = new Command();

program
  .name('symlink')
  .description('CLI tool for creating symlinks')
  .version('0.0.1')
  .argument('[source]', 'Source path to link from')
  .option('-t, --target <path>', 'Target path to link to (default: current directory)')
  .option('-d, --dry-run', 'Show what would be done without making changes')
  .option('-v, --verbose', 'Show detailed output')
  .action(async (source, options) => {
    if (!source) {
      program.help();
      return;
    }

    const targetPath = options.target || process.cwd();

    try {
      await createSymlink(source, targetPath, {
        dryRun: options.dryRun,
        verbose: options.verbose,
      });
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program.parse();
