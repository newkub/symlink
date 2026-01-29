#!/usr/bin/env bun
import * as p from '@clack/prompts';
import { resolve } from 'node:path';
import { rm, symlink } from 'node:fs/promises';

p.intro('🔗 Symlink CLI');

const sourcePath = await p.text({
  message: 'Source path:',
  placeholder: '/path/to/source',
});

if (p.isCancel(sourcePath)) {
  p.cancel('Operation cancelled');
  process.exit(0);
}

const targetPath = process.cwd();

try {
  const resolvedSource = resolve(sourcePath);
  const resolvedTarget = resolve(targetPath);

  // Remove existing target if exists
  const targetFile = Bun.file(resolvedTarget);
  if (await targetFile.exists()) {
    await rm(resolvedTarget, { recursive: true, force: true });
  }

  // Create the symlink
  const s = p.spinner();
  s.start(`Creating symlink from ${resolvedSource} to ${resolvedTarget}...`);
  await symlink(resolvedSource, resolvedTarget, 'junction');
  s.stop('Symlink created.');

  p.log.success(`Successfully created symlink: ${resolvedTarget} -> ${resolvedSource}`);

  p.outro('Done! ✨');
} catch (error) {
  p.log.error(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
