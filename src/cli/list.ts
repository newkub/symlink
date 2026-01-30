import { text } from '@clack/prompts';
import { resolve } from 'node:path';
import { readdir } from 'node:fs/promises';
import { checkPathType } from '../utils/validation';

export async function listSymlinksFlow() {
  const dirPath = await text({
    message: 'Directory to list symlinks from',
    placeholder: './',
    defaultValue: process.cwd(),
    validate: (value) => {
      if (!value) return 'Path is required';
      return undefined;
    },
  });

  if (typeof dirPath === 'symbol') {
    return;
  }

  const resolvedPath = resolve(dirPath);
  const pathType = await checkPathType(resolvedPath);

  if (pathType !== 'directory') {
    throw new Error(`Path ${resolvedPath} is not a directory`);
  }

  console.log(`\n📂 Listing symlinks in: ${resolvedPath}\n`);

  const entries = await readdir(resolvedPath, { withFileTypes: true });

  let symlinkCount = 0;

  for (const entry of entries) {
    const entryPath = `${resolvedPath}\\${entry.name}`;
    const entryType = await checkPathType(entryPath);

    if (entryType === 'symlink') {
      console.log(`🔗 ${entry.name}`);
      symlinkCount++;
    }
  }

  if (symlinkCount === 0) {
    console.log('No symlinks found in this directory');
  } else {
    console.log(`\nTotal: ${symlinkCount} symlink(s)`);
  }
}
