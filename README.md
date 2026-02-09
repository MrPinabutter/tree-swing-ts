# 🌳 Tree Swing

> **Interactive CLI tool for git branch management.** Create feature branches from origin branches with configurable prefixes — no more typing long git commands.

[![npm version](https://img.shields.io/npm/v/tree-swing)](https://www.npmjs.com/package/tree-swing)

---

## ✨ Features

- 🔀 **Quick branch creation** — Select an origin branch and get a prefixed feature branch in seconds
- 📋 **Configurable presets** — Define your own origin branches and prefixes
- ⌨️ **Interactive TUI** — Navigate with arrow keys, no flags or arguments needed
- 🛡️ **Safety checks** — Prevents duplicate prefixes and validates branch names
- 🎨 **Colorful output** — Clear step-by-step feedback in the terminal

## 📦 Prerequisites

- [Bun](https://bun.sh/) runtime installed

## 🚀 Install

```bash
npm install -g tree-swing
```

Or install from source:

```bash
git clone https://github.com/MrPinabutter/tree-swing-ts
cd tree-swing
npm install -g .
```

## 📖 Usage

```bash
tree-swing
```

An interactive menu will appear:

1. **Select an origin branch** (e.g., `develop`, `staging`)
2. The tool will:
   - Fetch the latest from origin
   - Create a new branch with the configured prefix (e.g., `for-dev/your-current-branch`)
   - Merge the origin branch into it

### Config Manager

Select **"other"** from the main menu to:

- ➕ **Create new config** — Add a new origin branch + prefix pair
- 🗑️ **Delete config** — Remove an existing configuration
- ← **Go back** — Return to the main menu

## ⚙️ Configuration

Configs are stored in a `config.txt` file using a simple `key=value` format:

```
develop=for-dev
staging=for-stag
```

Each line maps an **origin branch** (left) to a **prefix** (right). When you select `develop`, the tool creates a branch like `for-dev/your-current-branch`.

## 🗑️ Uninstall

```bash
npm uninstall -g tree-swing
```

## 📝 License

MIT
