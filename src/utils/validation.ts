import { lstat } from 'node:fs/promises';
import { isNodeError } from './type-guards.js';

export async function checkPathType(path: string): Promise<'symlink' | 'directory' | 'file' | 'none'> {
  try {
    const stats = await lstat(path);
    if (stats.isSymbolicLink()) return 'symlink';
    if (stats.isDirectory()) return 'directory';
    if (stats.isFile()) return 'file';
    return 'none';
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return 'none';
    }
    throw error;
  }
}
