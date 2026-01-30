import { resolve } from 'node:path';
import { readdir } from 'node:fs/promises';
import { isSymlink } from '../utils/validation';
import { readlink } from 'node:fs/promises';

export async function listSymlinksFlow() {
  const resolvedPath = resolve(process.cwd());

  console.log(`\n📂 Listing symlinks in: ${resolvedPath}\n`);

  const entries = await readdir(resolvedPath, { withFileTypes: true });

  let symlinkCount = 0;
  const symlinks: Array<{ name: string; target: string }> = [];

  for (const entry of entries) {
    const entryPath = `${resolvedPath}\\${entry.name}`;

    if (await isSymlink(entryPath)) {
      try {
        const target = await readlink(entryPath);
        symlinks.push({ name: entry.name, target });
        symlinkCount++;
      } catch {
        symlinks.push({ name: entry.name, target: '(broken)' });
        symlinkCount++;
      }
    }
  }

  if (symlinkCount === 0) {
    console.log('🔍 No symlinks found in this directory');
  } else {
    console.log(`📋 Found ${symlinkCount} symlink(s):\n`);
    symlinks.forEach((symlink, index) => {
      const icon = symlink.target === '(broken)' ? '❌' : '🔗';
      console.log(`  ${index + 1}. ${icon} ${symlink.name}`);
      console.log(`     └─➤ ${symlink.target}\n`);
    });
  }
}
