import { isSymlinkError } from './type-guards';

export function formatError(error: unknown, context?: string): string {
  if (isSymlinkError(error)) {
    return `${context ? context + ': ' : ''}${error.message}${error.code ? ` (code: ${error.code})` : ''}`;
  }
  if (error instanceof Error) {
    return `${context ? context + ': ' : ''}${error.message}`;
  }
  return `${context ? context + ': ' : ''}Unknown error`;
}
