import { lstat, readlink } from 'node:fs/promises';
import { isNodeError } from './type-guards';

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

export async function isSymlink(path: string): Promise<boolean> {
  try {
    await readlink(path);
    return true;
  } catch (error) {
    if (isNodeError(error) && (error.code === 'ENOENT' || error.code === 'EINVAL')) {
      return false;
    }
    throw error;
  }
}
