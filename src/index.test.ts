import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock modules that will be used by index.ts
vi.mock('@clack/prompts');
vi.mock('node:fs/promises');

// Mock Bun global
const mockBunFile = {
  exists: vi.fn(),
};

global.Bun = {
  file: vi.fn(() => mockBunFile),
} as any;

describe('Symlink CLI', () => {
  let p: any;
  let fs: any;

  beforeEach(async () => {
    // Reset modules to ensure index.ts runs fresh each time.
    vi.resetModules();

    // Re-import mocked modules to get fresh mock functions for each test
    p = await import('@clack/prompts');
    fs = await import('node:fs/promises');

    // Default mock implementations
    Object.assign(p, {
      intro: vi.fn(),
      outro: vi.fn(),
      text: vi.fn(),
      isCancel: vi.fn((val) => val === Symbol.for('clack.cancel')),
      cancel: vi.fn(),
      log: {
        success: vi.fn(),
        error: vi.fn(),
      },
      spinner: vi.fn(() => ({
        start: vi.fn(),
        stop: vi.fn(),
      })),
    });

    Object.assign(fs, {
      rm: vi.fn(),
      symlink: vi.fn(),
    });

    // Mock process.cwd() to return predictable path
    vi.spyOn(process, 'cwd').mockReturnValue('D:\\symlink');

    // Mock process.exit to prevent tests from stopping
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as (code?: string | number | null | undefined) => never);
  });

  // Function to dynamically import and run the CLI script
  const runCli = () => import('./index.ts');

  it('should create a symlink on happy path', async () => {
    // Arrange
    p.text.mockResolvedValue('source-path');
    mockBunFile.exists.mockResolvedValue(false);

    // Act
    await runCli();

    // Assert
    expect(p.intro).toHaveBeenCalledWith('🔗 Symlink CLI');
    expect(fs.symlink).toHaveBeenCalledWith(
      expect.stringContaining('source-path'),
      'D:\\symlink',
      'junction'
    );
    expect(p.log.success).toHaveBeenCalled();
    expect(p.outro).toHaveBeenCalledWith('Done! ✨');
  });

  it('should overwrite existing target without confirmation', async () => {
    // Arrange
    p.text.mockResolvedValue('source-path');
    mockBunFile.exists.mockResolvedValue(true);

    // Act
    await runCli();

    // Assert
    expect(fs.rm).toHaveBeenCalledWith(
      'D:\\symlink',
      { recursive: true, force: true }
    );
    expect(fs.symlink).toHaveBeenCalled();
    expect(p.log.success).toHaveBeenCalled();
  });

  it('should cancel if user cancels source path input', async () => {
    // Arrange
    p.text.mockResolvedValue(Symbol.for('clack.cancel'));

    // Act
    await runCli();

    // Assert
    expect(p.cancel).toHaveBeenCalledWith('Operation cancelled');
    expect(process.exit).toHaveBeenCalledWith(0);
  });
});
