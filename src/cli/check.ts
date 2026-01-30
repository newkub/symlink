import { text } from '@clack/prompts';
import { resolve } from 'node:path';
import { checkPathType } from '../utils/validation';

export async function checkSymlinkFlow() {
  const path = await text({
    message: 'Path to check',
    placeholder: './path',
    validate: (value) => {
      if (!value) return 'Path is required';
      return undefined;
    },
  });

  if (typeof path === 'symbol') {
    return;
  }

  const resolvedPath = resolve(path);
  const pathType = await checkPathType(resolvedPath);

  console.log(`\nPath: ${resolvedPath}`);
  console.log(`Type: ${pathType}`);

  if (pathType === 'symlink') {
    console.log('✅ This is a symlink');
  } else if (pathType === 'directory') {
    console.log('📁 This is a directory');
  } else if (pathType === 'file') {
    console.log('📄 This is a file');
  } else {
    console.log('❌ Path does not exist');
  }
}
