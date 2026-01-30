import { text, confirm, spinner as createSpinner } from '@clack/prompts';
import { createSymlink } from '../utils/symlink';

export async function createSymlinkFlow() {
  const source = await text({
    message: 'Source path to link from',
    placeholder: './source',
    validate: (value) => {
      if (!value) return 'Source path is required';
      return undefined;
    },
  });

  if (typeof source === 'symbol') {
    return;
  }

  const targetPath = await text({
    message: 'Target path to link to',
    placeholder: './target',
    defaultValue: process.cwd(),
    validate: (value) => {
      if (!value) return 'Target path is required';
      return undefined;
    },
  });

  if (typeof targetPath === 'symbol') {
    return;
  }

  const dryRun = await confirm({
    message: 'Dry run (show what would be done without making changes)?',
    initialValue: false,
  });

  if (typeof dryRun === 'symbol') {
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
  s.start('Creating symlink...');

  try {
    const result = await createSymlink(source, targetPath, {
      dryRun,
      verbose,
    });

    if (verbose && result.removed) {
      for (const removed of result.removed) {
        console.log(`Removed existing ${removed.type} at ${removed.path}`);
      }
    }

    if (verbose) {
      console.log(result.message);
    }

    s.stop('✅ Symlink created successfully!');
  } catch (error) {
    s.stop('❌ Failed to create symlink');
    throw error;
  }
}
