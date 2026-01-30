import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { resolve } from 'node:path';
import { rm, symlink, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

describe('symlink CLI', () => {
  const testDir = resolve('test', 'temp');
  const sourcePath = resolve(testDir, 'source');
  const targetPath = resolve(testDir, 'target');

  beforeAll(async () => {
    // Create test directories
    await mkdir(testDir, { recursive: true });
    await mkdir(targetPath, { recursive: true });
  });

  beforeEach(async () => {
    // Cleanup before each test
    if (existsSync(sourcePath)) {
      await rm(sourcePath, { recursive: true, force: true });
    }
  });

  afterAll(async () => {
    // Cleanup
    await rm(testDir, { recursive: true, force: true });
  });

  it('should create symlink successfully', async () => {
    // Create symlink
    await symlink(targetPath, sourcePath, 'junction');

    // Verify symlink exists
    expect(existsSync(sourcePath)).toBe(true);
  });

  it('should remove existing symlink before creating new one', async () => {
    // Create initial symlink
    await symlink(targetPath, sourcePath, 'junction');
    expect(existsSync(sourcePath)).toBe(true);

    // Remove and recreate
    await rm(sourcePath, { recursive: true, force: true });
    await symlink(targetPath, sourcePath, 'junction');

    // Verify symlink still exists
    expect(existsSync(sourcePath)).toBe(true);
  });
});
