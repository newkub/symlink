export interface CreateSymlinkOptions {
  dryRun?: boolean;
  verbose?: boolean;
}

export interface SymlinkError extends Error {
  code?: string;
  path?: string;
}
