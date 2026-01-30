# 🔗 Symlink CLI

A simple command-line tool for creating symbolic links using Commander.js.

## ✨ Features

- 📝 Simple command-line interface using Commander.js
- 🔗 Creates junction symlinks on Windows
- 🗑️ Automatically removes existing symlinks before creating new ones
- 💻 Cross-platform support (Windows junctions, Unix symlinks)
- � Clear console output showing source and target paths

## 📦 Installation

### Running directly

```bash
bun run src/index.ts <source-path>
```

### Global Installation (Recommended)

```bash
bun install -g
```

## 🚀 Usage

### Display help

```bash
symlink
# or
symlink --help
```

### Create a symlink

```bash
symlink <source-path>
```

The tool will create a symlink from `<source-path>` to the current working directory.

**Example:**

```bash
# Create a symlink from C:\Users\test\source to the current directory
symlink C:\Users\test\source
```

**Output:**

```
Source: C:\Users\test\source
Target: D:\symlink
Creating symlink: C:\Users\test\source -> D:\symlink
Successfully created symlink: C:\Users\test\source -> D:\symlink
```

### Specify target path

```bash
symlink <source-path> --target <target-path>
# or
symlink <source-path> -t <target-path>
```

**Example:**

```bash
# Create a symlink from test\real-test\source to D:\target
symlink test\real-test\source --target D:\target
```

### Dry run (preview without changes)

```bash
symlink <source-path> --dry-run
# or
symlink <source-path> -d
```

**Example:**

```bash
symlink test\real-test\source --dry-run
```

**Output:**

```
[DRY RUN] Would create symlink: D:\symlink\test\real-test\source -> D:\symlink
```

### Verbose mode

```bash
symlink <source-path> --verbose
# or
symlink <source-path> -v
```

Shows detailed output including source/target paths and removal of existing symlinks.

**Example:**

```bash
symlink test\real-test\source --verbose
```

**Output:**

```
Source: D:\symlink\test\real-test\source
Target: D:\symlink
Removing existing symlink at D:\symlink\test\real-test\source
Creating symlink: D:\symlink\test\real-test\source -> D:\symlink
Successfully created symlink: D:\symlink\test\real-test\source -> D:\symlink
```

## 📝 Options

| Option | Description |
|--------|-------------|
| `-t, --target <path>` | Target path to link to (default: current directory) |
| `-d, --dry-run` | Show what would be done without making changes |
| `-v, --verbose` | Show detailed output |
| `-V, --version` | Output the version number |
| `-h, --help` | Display help for command |

## 💡 Examples

### Example 1: Create a symlink to a local directory

```bash
symlink test\real-test\source
```

This creates a symlink from `test\real-test\source` to the current directory.

### Example 2: Create a symlink to an absolute path

```bash
symlink C:\Users\Veerapong\.codeium\windsurf\skills\refactor
```

This creates a symlink from the specified path to the current directory.

## 🧪 Testing

Run the test suite:

```bash
bun test
```

## 📄 License

This project is licensed under the MIT License.
