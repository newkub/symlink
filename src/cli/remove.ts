import { text, confirm, spinner as createSpinner } from '@clack/prompts';
import { resolve } from 'node:path';
import { rm } from 'node:fs/promises';
import { checkPathType } from '../utils/validation.js';

export async function removeSymlinkFlow() {
  const source = await text({
    message: 'Symlink path to remove',
    placeholder: './symlink',
    validate: (value) => {
      if (!value) return 'Path is required';
      return undefined;
    },
  });

  if (typeof source === 'symbol') {
    return;
  }

  const verbose = await confirm({
    message: 'Show detailed output?',
    initialValue: false,
  });

  if (typeof verbose === 'symbol') {
    return;
  }

  const s = createSpinner();
  s.start('Removing symlink...');

  try {
    const resolvedPath = resolve(source);
    const pathType = await checkPathType(resolvedPath);

    if (pathType === 'none') {
      throw new Error(`Path ${resolvedPath} does not exist`);
    }

    if (pathType !== 'symlink') {
      throw new Error(`Path ${resolvedPath} is not a symlink (type: ${pathType})`);
    }

    if (verbose) {
      console.log(`Removing symlink at ${resolvedPath}`);
    }

    await rm(resolvedPath, { force: true });
    console.log(`Successfully removed symlink: ${resolvedPath}`);

    s.stop('✅ Symlink removed successfully!');
  } catch (error) {
    s.stop('❌ Failed to remove symlink');
    throw error;
  }
}
