#!/usr/bin/env bun
import { intro, outro, select } from '@clack/prompts';
import { createSymlinkFlow, removeSymlinkFlow, checkSymlinkFlow, listSymlinksFlow } from './cli/index.js';

async function main() {
  intro('🔗 Symlink CLI');

  const action = await select({
    message: 'What would you like to do?',
    options: [
      { value: 'create', label: 'Create a symlink' },
      { value: 'remove', label: 'Remove a symlink' },
      { value: 'check', label: 'Check if path is a symlink' },
      { value: 'list', label: 'List symlinks in directory' },
    ],
  });

  if (typeof action === 'symbol') {
    outro('Cancelled');
    process.exit(0);
  }

  try {
    if (action === 'create') {
      await createSymlinkFlow();
    } else if (action === 'remove') {
      await removeSymlinkFlow();
    } else if (action === 'check') {
      await checkSymlinkFlow();
    } else if (action === 'list') {
      await listSymlinksFlow();
    }

    outro('✅ Done!');
  } catch (error) {
    outro(`❌ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
