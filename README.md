# 🔗 Symlink CLI

A simple and interactive command-line tool for creating symbolic links.

## ✨ Features

- Interactive prompts for source and target paths.
- Checks for existing files or symlinks at the target path.
- Option to force overwrite existing targets.
- Cross-platform support for creating junctions on Windows.

## 📦 Installation

To use this tool, you can either run it directly using Bun or install it globally.

### Running directly

```bash
bun run src/index.ts
```

### Global Installation (Recommended)

```bash
bun link
```

## 🚀 Usage

After global installation, you can run the tool from anywhere:

```bash
symlink
```

The tool will guide you through the process with interactive prompts:

1.  **Source path:** Enter the absolute or relative path to the file/directory you want to link from.
2.  **Target path:** Enter the absolute or relative path where the symlink should be created.
3.  **Force overwrite:** Confirm if you want to overwrite the target path if it already exists.

## 📝 Options

The CLI currently operates through interactive prompts. The following option is available as a confirmation step:

-   **Force overwrite:** Allows the tool to replace an existing file or symlink at the target destination.

## 💡 Example

Here is an example of creating a symlink from `D:\wgit` to the current directory (`D:\symlink`):

```
$ symlink

┌  🔗 Symlink CLI
│
◇  Source path:
│  D:\wgit
│
◇  Target path:
│  .
│
◇  Force overwrite if target exists?
│  Yes
│
✔  Successfully created symlink: D:\symlink -> D:\wgit
│
└  Done! ✨
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
