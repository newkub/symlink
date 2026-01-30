import type { SymlinkError } from '../core/types.js';

export function isSymlinkError(error: unknown): error is SymlinkError {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof error.code === 'string'
  );
}

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    'code' in error &&
    typeof error.code === 'string'
  );
}
