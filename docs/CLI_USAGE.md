# CLI Usage Guide

Complete guide to using `create-fs-app` CLI with all available options.

## Table of Contents

- [Interactive Mode](#interactive-mode)
- [CLI Options Mode](#cli-options-mode)
- [Direct Template Mode](#direct-template-mode)
- [Commands](#commands)
- [Examples](#examples)

## Interactive Mode

The default and recommended way for first-time users.

```bash
npx create-fs-app my-app
```

This will:
1. Show welcome screen
2. Ask you questions about your stack
3. Match your choices to a template
4. Clone and customize the template
5. Initialize git and install dependencies

## CLI Options Mode

Skip the interactive prompts by providing stack options directly.

### Basic Syntax

```bash
npx create-fs-app <project-name> \
  --monorepo <framework> \
  --frontend <framework> \
  --backend <framework> \
  --database <db> \
  [additional options]
```

### Required Options

When using CLI options mode, these are **required**:

| Option | Description | Valid Values |
|--------|-------------|--------------|
| `--monorepo` | Monorepo framework | `turborepo`, `nx`, `lerna` |
| `--frontend` | Frontend framework | `react`, `next.js`, `vue`, `nuxt`, `angular` |
| `--backend` | Backend framework | `express`, `nest.js`, `fastify`, `koa` |
| `--database` | Database | `postgresql`, `mongodb`, `mysql`, `sqlite` |

### Optional Options

| Option | Description | Default |
|--------|-------------|---------|
| `--orm <name>` | ORM/ODM | (none) |
| `--package-manager <pm>` | Package manager | `npm` |
| `--styling <solution>` | Styling solution | `tailwind` |
| `--typescript` | Enable TypeScript | `true` |
| `--no-typescript` | Disable TypeScript | - |
| `--linting` | Enable linting | `true` |
| `--no-linting` | Disable linting | - |
| `--docker` | Include Docker | `true` |
| `--no-docker` | Skip Docker | - |
| `--no-git` | Skip git init | - |
| `--no-install` | Skip npm install | - |

### Valid Values Reference

#### Monorepo Frameworks
- `turborepo`
- `nx`
- `lerna`

#### Frontend Frameworks
- `react` - React with Vite
- `next.js` - Next.js
- `vue` - Vue 3
- `nuxt` - Nuxt 3
- `angular` - Angular

#### Backend Frameworks
- `express` - Express.js
- `nest.js` - NestJS
- `fastify` - Fastify
- `koa` - Koa

#### Databases
- `postgresql` - PostgreSQL
- `mongodb` - MongoDB
- `mysql` - MySQL
- `sqlite` - SQLite

#### ORMs
- `prisma` - Prisma (SQL)
- `typeorm` - TypeORM (SQL)
- `mongoose` - Mongoose (MongoDB)
- `drizzle` - Drizzle ORM (SQL)

#### Package Managers
- `npm`
- `yarn`
- `pnpm`

#### Styling Solutions
- `css` - Plain CSS
- `scss` - SCSS/SASS
- `tailwind` - Tailwind CSS
- `styled-components` - Styled Components

## Direct Template Mode

Use a specific template by name.

```bash
npx create-fs-app my-app --template <template-name>
```

This mode:
- Skips stack selection
- Uses a pre-defined template
- Faster if you know exactly what you want

See available templates:
```bash
npx create-fs-app list
```

Get template info:
```bash
npx create-fs-app info <template-name>
```

## Commands

### Create Project (Default)

```bash
npx create-fs-app [project-name] [options]
```

Creates a new project. If `project-name` is omitted in interactive mode, you'll be prompted for it.

### List Templates

```bash
npx create-fs-app list
# or
npx create-fs-app ls
```

Shows all available templates with descriptions and features.

### Show Template Info

```bash
npx create-fs-app info <template-name>
```

Shows detailed information about a specific template.

### Help

```bash
npx create-fs-app --help
```

Shows help message with all available options.

### Version

```bash
npx create-fs-app --version
```

Shows the CLI version.

## Examples

### Example 1: Complete CLI Options

Create a Turborepo project with Next.js, NestJS, PostgreSQL, and Prisma:

```bash
npx create-fs-app my-saas-app \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma \
  --package-manager pnpm \
  --styling tailwind \
  --docker
```

**Output:**
```
📋 Configuration from CLI options:

  Project: my-saas-app
  Monorepo: turborepo
  Frontend: next.js
  Backend: nest.js
  Database: postgresql
  ORM: prisma
  Package Manager: pnpm

⬇️  Downloading template...
✓ Template downloaded

🔧 Customizing template...
✓ Template customized

📝 Initializing git repository...
✓ Initialized git repository

📦 Installing dependencies...
✓ Dependencies installed

✨ Project created successfully!
```

### Example 2: Minimal Options

Only required options (uses defaults for the rest):

```bash
npx create-fs-app my-blog \
  --monorepo nx \
  --frontend react \
  --backend express \
  --database mongodb
```

This will use:
- npm as package manager
- Tailwind for styling
- TypeScript enabled
- Linting enabled
- Docker included

### Example 3: Without Docker or Linting

```bash
npx create-fs-app my-api \
  --monorepo turborepo \
  --frontend vue \
  --backend fastify \
  --database postgresql \
  --orm drizzle \
  --no-docker \
  --no-linting
```

### Example 4: Skip Installation

Create project but skip dependency installation:

```bash
npx create-fs-app my-app \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --no-install
```

Then install later:
```bash
cd my-app
npm install
```

### Example 5: Direct Template Usage

If you know the exact template you want:

```bash
npx create-fs-app my-app --template turborepo-nextjs-nestjs-postgresql-prisma
```

### Example 6: Interactive Mode with Project Name

Provide project name, then answer questions interactively:

```bash
npx create-fs-app my-awesome-app
# Then answer the prompts
```

## Workflow Comparison

### Interactive Mode (Default)

**Best for:** First-time users, exploring options

```bash
npx create-fs-app my-app
# 1. Welcome screen
# 2. Answer ~8-10 questions
# 3. Template matched
# 4. Project created
```

⏱️ Time: ~2-3 minutes (with reading prompts)

### CLI Options Mode

**Best for:** Automation, scripts, repeated usage

```bash
npx create-fs-app my-app \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma
# Project created immediately
```

⏱️ Time: ~30-60 seconds

### Direct Template Mode

**Best for:** Known template, fastest setup

```bash
npx create-fs-app my-app --template turborepo-nextjs-nestjs-postgresql-prisma
# Project created immediately
```

⏱️ Time: ~20-30 seconds

## CI/CD Usage

Perfect for automated environments:

```bash
#!/bin/bash

# Example: Create project in CI/CD
npx create-fs-app $PROJECT_NAME \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma \
  --package-manager pnpm \
  --no-git \
  --no-install

# Custom setup
cd $PROJECT_NAME
pnpm install
pnpm run build
```

## Scripts and Automation

### Shell Script

```bash
#!/bin/bash

# create-my-stack.sh
PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: ./create-my-stack.sh <project-name>"
  exit 1
fi

npx create-fs-app "$PROJECT_NAME" \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma \
  --package-manager pnpm

echo "✅ Project $PROJECT_NAME created!"
echo "Next: cd $PROJECT_NAME && pnpm dev"
```

Usage:
```bash
chmod +x create-my-stack.sh
./create-my-stack.sh my-new-project
```

### NPM Script

In your `package.json`:

```json
{
  "scripts": {
    "create:project": "npx create-fs-app",
    "create:full": "npx create-fs-app --monorepo turborepo --frontend next.js --backend nest.js --database postgresql --orm prisma"
  }
}
```

## Error Handling

### Missing Required Options

```bash
npx create-fs-app my-app --monorepo turborepo --frontend next.js

# Error:
❌ When using CLI options, you must provide:
  --monorepo <framework>
  --frontend <framework>
  --backend <framework>
  --database <db>

💡 Or run without options for interactive mode.
```

### Invalid Values

```bash
npx create-fs-app my-app \
  --monorepo invalid-framework \
  --frontend next.js \
  --backend nest.js \
  --database postgresql

# Error:
❌ Invalid monorepo framework: "invalid-framework"

Valid options: turborepo, nx, lerna
```

### Template Not Found

```bash
npx create-fs-app my-app \
  --monorepo turborepo \
  --frontend angular \
  --backend koa \
  --database sqlite

# If this combination doesn't exist:
⚠️  No exact template match found for your configuration.

📋 Available similar templates:
   1. Turborepo with Next.js, NestJS, PostgreSQL, and Prisma
   2. Turborepo with React, Express, MongoDB, and Mongoose
   3. Nx workspace with Next.js, NestJS, PostgreSQL, and Prisma

💡 Tip: You can contribute this template combination to our repository!
   Visit: https://github.com/create-fs-app-templates
```

## Tips & Best Practices

### 1. Start Interactive, Then Use CLI

First time: Use interactive mode to explore options
```bash
npx create-fs-app my-first-app
# See all available options
```

Later: Use CLI options for speed
```bash
npx create-fs-app my-next-app --monorepo turborepo ...
```

### 2. Check Available Templates First

```bash
npx create-fs-app list
# See what's available before choosing
```

### 3. Use Template Mode for Exact Matches

If a template exists for your stack:
```bash
npx create-fs-app my-app --template <exact-template-name>
```

### 4. Skip Installation in CI/CD

```bash
npx create-fs-app my-app ... --no-install
# Install with your preferred method
```

### 5. Version Control

Always use `--no-git` if you're creating in an existing repo:
```bash
npx create-fs-app my-app ... --no-git
```

## Troubleshooting

### Problem: "Command not found"

**Solution:** Use `npx`:
```bash
npx create-fs-app my-app
```

### Problem: Slow template download

**Solution:** Check internet connection or use `--no-install` to skip deps:
```bash
npx create-fs-app my-app ... --no-install
```

### Problem: Template not found for your stack

**Solution:**
1. Check available templates: `npx create-fs-app list`
2. Use interactive mode to see suggestions
3. Contribute the template combination!

## Advanced Usage

### Custom Template URL (Future Feature)

Coming soon:
```bash
npx create-fs-app my-app --template-url https://github.com/me/my-template
```

### Template Caching (Future Feature)

Coming soon - templates will be cached locally for offline use.

## Getting Help

- **Help command:** `npx create-fs-app --help`
- **List templates:** `npx create-fs-app list`
- **Template info:** `npx create-fs-app info <name>`
- **Issues:** https://github.com/Om-jannu/create-fs-app/issues
- **Discussions:** https://github.com/Om-jannu/create-fs-app/discussions

## Error Handling

### Invalid Option Values

If you provide an invalid framework name:

```bash
npx create-fs-app my-app --monorepo invalid-name --frontend next.js --backend nest.js --database postgresql
```

**Output:**
```
❌ Invalid monorepo framework: "invalid-name"
Valid options: turborepo, nx, lerna
```

### Missing Required Options

```bash
npx create-fs-app my-app --monorepo turborepo
```

**Output:**
```
❌ When using CLI options, you must provide:
  --monorepo <framework>
  --frontend <framework>
  --backend <framework>
  --database <db>

💡 Or run without options for interactive mode.
```

### Template Not Found

Valid options but no template exists:

```bash
npx create-fs-app my-app --monorepo lerna --frontend angular --backend koa --database sqlite
```

**Output:**
```
⚠️  No exact template match found for your configuration.

📋 Available similar templates:
   1. Turborepo with Next.js, NestJS, PostgreSQL, and Prisma
   2. Turborepo with React, Express, MongoDB, and Mongoose

💡 Tip: You can contribute this template combination!
```

**Note:** The CLI is **case-insensitive** for framework names.

## Related Documentation

- [README.md](../README.md) - Main documentation
- [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) - Creating templates

