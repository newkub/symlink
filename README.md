# 🔗 Symlink CLI

A simple command-line tool for creating symbolic links with interactive prompts.

## ✨ Features

- 🎯 Interactive prompts using @clack/prompts
- 🔗 Creates junction symlinks on Windows
- 🗑️ Automatically removes existing symlinks before creating new ones
- � List symlinks in directories
- ✅ Check if paths are symlinks
- �💻 Cross-platform support (Windows junctions, Unix symlinks)
- 🎨 Clear console output with emojis

## 📦 Installation

### Running directly

```bash
bun run src/index.ts
```

### Global Installation (Recommended)

```bash
bun install -g
```

## 🚀 Usage

### Display menu

```bash
symlink
```

### Create a symlink

Select "Create a symlink" from the menu, then provide:
- Source path to link from
- Target path to link to
- Dry run option
- Verbose output option

**Example:**

```
┌  🔗 Symlink CLI
│
◆  What would you like to do?
│  ● Create a symlink
│  ○ Remove a symlink
│  ○ Check if path is a symlink
│  ○ List symlinks in directory
└
```

### Remove a symlink

Select "Remove a symlink" from the menu, then provide:
- Symlink path to remove
- Verbose output option

### Check if path is a symlink

Select "Check if path is a symlink" from the menu, then provide:
- Path to check

**Output:**

```
Path: d:\symlink\a
Type: symlink
✅ This is a symlink
```

### List symlinks in directory

Select "List symlinks in directory" from the menu, then provide:
- Directory path

**Output:**

```
📂 Listing symlinks in: d:\symlink

🔗 symlink1
🔗 symlink2

Total: 2 symlink(s)
```

## 💡 Examples

### Example 1: Create a symlink to a local directory

```
1. Select "Create a symlink"
2. Source: test\real-test\source
3. Target: (current directory)
4. Dry run: No
5. Verbose: Yes
```

This creates a symlink from `test\real-test\source` to the current directory.

### Example 2: Check if a path is a symlink

```
1. Select "Check if path is a symlink"
2. Path: d:\symlink\a
```

## 🧪 Testing

Run the test suite:

```bash
bun test
```

## 📄 License

This project is licensed under the MIT License.
