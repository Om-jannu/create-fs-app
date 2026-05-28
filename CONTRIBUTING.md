# Contributing to create-fs-app

Thank you for helping improve create-fs-app! 🎉

---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Adding Features](#adding-features)
- [Questions](#questions)

---

## Ways to Contribute

### 🐛 Bug Reports

Open a [GitHub Issue](https://github.com/Om-jannu/create-fs-app/issues) with:

- Node.js version (`node --version`)
- OS and version
- The exact command you ran
- What you expected vs what happened
- Full terminal output (without sensitive info)

### 💡 Feature Requests

Open an issue labelled **enhancement** describing:

- The problem you want solved
- Your proposed solution
- Alternatives you considered

### 🔧 Code Contributions

Fix bugs, add features, improve error messages, add tests, or improve documentation.  
For significant changes, open an issue first so we can discuss the approach.

### 📝 Documentation

Fix typos, add examples, or clarify confusing sections — PRs for docs are always welcome.

### 🧩 Community Templates

If you want to contribute a new template (e.g. Next.js + NestJS + GraphQL variant), that lives in the **[templates repo](https://github.com/Om-jannu/create-fs-app-templates)**. See the [templates CONTRIBUTING.md](https://github.com/Om-jannu/create-fs-app-templates/blob/master/CONTRIBUTING.md).

---

## Development Setup

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/create-fs-app.git
cd create-fs-app

# 2. Install dependencies
npm install

# 3. Build (TypeScript → dist/)
npm run build

# 4. Link globally so you can run it anywhere
npm link

# 5. Verify
create-fs-app --version
create-fs-app health
```

### Watch mode (auto-rebuild on save)

```bash
npm run dev       # if available, or:
npx tsc --watch
```

### Point at a local templates repo

```bash
git clone https://github.com/Om-jannu/create-fs-app-templates.git ../create-fs-app-templates

create-fs-app my-test-app \
  --frontend next.js --backend nest.js --database postgresql --orm prisma \
  --local-templates ../create-fs-app-templates \
  --yes
```

---

## Project Structure

```
create-fs-app/
├── src/
│   ├── index.ts                  # CLI entry — commands, flags, orchestration
│   ├── core/
│   │   ├── template-registry.ts  # In-memory official + contributed registries
│   │   ├── registry-fetch.ts     # Fetches registry.json from GitHub, manages cache
│   │   ├── template-list.ts      # list / info display, UUID resolution helpers
│   │   ├── template-clone.ts     # Clone, customise, git init, install deps
│   │   ├── scaffold.ts           # Top-level scaffold orchestrator
│   │   ├── health-check.ts       # Environment checks (Node, Git, Docker, pm)
│   │   ├── template-cache.ts     # Local file cache (~/.create-fs-app/cache/)
│   │   └── preset-manager.ts     # Save / load / delete named presets
│   ├── prompts/
│   │   └── wizard.ts             # Interactive wizard (Inquirer questions)
│   ├── types/
│   │   └── index.ts              # Shared TypeScript types
│   └── utils/
│       ├── validation.ts         # Project name, UUID, flag validation
│       ├── logger.ts             # Chalk-based Logger utility
│       └── spinner.ts            # Ora spinner helpers
├── dist/                         # Compiled output (git-ignored)
├── package.json
└── tsconfig.json
```

### Registry architecture

Two separate in-memory registries exist after startup:

| Registry | Used by |
|---|---|
| **Official** | Interactive wizard, stack flags (`--frontend`, etc.), `list` (default), `info` |
| **Contributed** | `--template <uuid>` flag only, `list --contributed` |

The registry is fetched from [`create-fs-app-templates/registry.json`](https://github.com/Om-jannu/create-fs-app-templates/blob/master/registry.json) (v2 schema) on startup and cached at `~/.create-fs-app/registry.json`. The `list` and `info` commands wait up to 3 seconds for the fetch before displaying cached/fallback data.

---

## Making Changes

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make your changes in src/
# ...

# Rebuild
npm run build

# Test manually
create-fs-app my-test-app [flags]

# Commit
git add .
git commit -m "feat: add support for XYZ"
```

---

## Pull Request Process

1. **Fork** the repo and create a branch from `master`
2. **Make** your changes with tests if applicable
3. **Ensure** `npm run build` completes without errors
4. **Describe** what the PR does and why in the PR description
5. **Reference** any related issue numbers (`Closes #123`)
6. **Open** the PR — a maintainer will review it

---

## Code Standards

- **TypeScript** — all source files in `src/` must be `.ts`
- **No `any`** — avoid `any` types; use proper interfaces or `unknown`
- **Error messages** — print `error.message` only, never dump full stack traces to the terminal
- **Chalk for output** — use `chalk` for coloured terminal output, never raw ANSI codes
- **`execa` for subprocesses** — always pass `{ cwd }` explicitly; never call `process.chdir()`
- **`os.tmpdir()` for temp files** — never use `process.cwd()` for temporary scratch space
- **Existing style** — follow the patterns in nearby files; run `npm run build` to catch type errors

### Commit message format

```
type: short description

Types: feat | fix | docs | refactor | chore | test
```

Examples:
```
feat: add --ci flag for GitHub Actions workflow
fix: preset list no longer shows built-in presets in "Your Presets" section
docs: update README with UUID-based --template flag
refactor: replace process.chdir with execa cwd option
```

---

## Adding Features

### New CLI flag

1. Add `.option(...)` to the main command in `src/index.ts`
2. Pass the value through `ProjectConfig` or `ScaffoldOptions` as needed
3. Apply the flag in `src/core/template-clone.ts` (or wherever relevant)
4. Update `README.md` — add the flag to the "All CLI Options" table

### New command

1. Add `.command('name')` block in `src/index.ts`
2. Implement the logic in a new file under `src/core/` or `src/commands/`
3. Import and call it from `src/index.ts`
4. Update `README.md` — add the command to "Commands Reference"

### New official template

Official templates are managed in the [templates repo](https://github.com/Om-jannu/create-fs-app-templates) by maintainers.  
Open a discussion or issue on that repo to request a new official template.

### New contributed template

Contributed templates (community-built variants) are added via `scripts/add-template.mjs` in the templates repo.  
See the [templates CONTRIBUTING.md](https://github.com/Om-jannu/create-fs-app-templates/blob/master/CONTRIBUTING.md).

---

## Questions

- **Issues:** https://github.com/Om-jannu/create-fs-app/issues
- **Discussions:** https://github.com/Om-jannu/create-fs-app/discussions

---

## Code of Conduct

- Be respectful and constructive
- Provide actionable feedback
- Help others learn
- Follow [GitHub's Community Guidelines](https://docs.github.com/en/site-policy/github-terms/github-community-guidelines)

---

By contributing you agree your code will be released under the **ISC License**.
