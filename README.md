<div align="center">
  <img src="./assets/logo-no-bg.png" alt="create-fs-app" width="500"/>

  **Stop configuring. Start building.**

  Production-ready full-stack monorepo in 60 seconds.

  [![npm version](https://img.shields.io/npm/v/create-fs-app.svg)](https://www.npmjs.com/package/create-fs-app)
  [![npm downloads](https://img.shields.io/npm/dm/create-fs-app.svg)](https://www.npmjs.com/package/create-fs-app)
  [![License: ISC](https://img.shields.io/npm/l/create-fs-app.svg)](https://opensource.org/licenses/ISC)
  [![Node.js ≥18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
</div>

---

## Table of Contents

- [Quick Start](#quick-start)
- [Interactive Wizard](#interactive-wizard)
- [Stack Flags](#stack-flags)
- [Official Templates](#official-templates)
- [Contributed Templates](#contributed-templates)
- [All CLI Options](#all-cli-options)
- [Presets](#presets)
- [Commands Reference](#commands-reference)
- [Local Development](#local-development)
- [Requirements](#requirements)
- [Contributing](#contributing)

---

## Quick Start

```bash
# Interactive wizard — guides you through every choice
npx create-fs-app my-app

# Pick your stack and skip all prompts
npx create-fs-app my-app \
  --frontend next.js \
  --backend  nest.js \
  --database postgresql \
  --orm      prisma \
  --yes

# Use a saved preset
npx create-fs-app my-app --preset saas-starter
```

---

## Interactive Wizard

Running `npx create-fs-app <name>` without stack flags launches a guided wizard:

| Step | Options |
|------|---------|
| Monorepo tool | Turborepo, Nx |
| Frontend | Next.js, React (Vite), Vue, Nuxt, Angular |
| Backend | NestJS, Express, Fastify (TS), Koa |
| Database | PostgreSQL, MongoDB, MySQL, SQLite |
| ORM / ODM | Prisma, TypeORM, Mongoose, Drizzle |
| Package manager | npm, yarn, pnpm |
| Styling | Tailwind CSS, CSS, SCSS, styled-components |
| API style | REST, GraphQL, both |
| Auth scaffolding | None, JWT |
| Extras | ESLint, Prettier, Docker, Turbopack, GitHub Actions CI |

After selection the CLI:
1. Fetches the best-matching official template from GitHub
2. Renames every placeholder to your project name
3. Initialises a git repository
4. Installs dependencies with your chosen package manager

---

## Stack Flags

Bypass the wizard by passing flags directly. Any flag you omit is prompted for (or uses the `--yes` default).

```bash
npx create-fs-app my-app \
  --monorepo   turborepo \
  --frontend   next.js \
  --backend    nest.js \
  --database   postgresql \
  --orm        prisma \
  --styling    tailwind \
  --api-style  rest \
  --auth       jwt \
  --turbopack \
  --ci \
  --package-manager pnpm \
  --yes
```

### Available values

| Flag | Values |
|------|--------|
| `--monorepo` | `turborepo`, `nx` |
| `--frontend` | `next.js`, `react`, `vue`, `nuxt`, `angular` |
| `--backend` | `nest.js`, `express`, `fastify-ts`, `koa` |
| `--database` | `postgresql`, `mongodb`, `mysql`, `sqlite` |
| `--orm` | `prisma`, `typeorm`, `mongoose`, `drizzle` |
| `--package-manager` | `npm`, `yarn`, `pnpm` |
| `--styling` | `tailwind`, `css`, `scss`, `styled-components` |
| `--api-style` | `rest`, `graphql`, `both` |
| `--auth` | `none`, `jwt` |

---

## Official Templates

Official templates are built and maintained by the create-fs-app team. The wizard and stack flags select from this set automatically.

| Template | Stack |
|----------|-------|
| `turborepo-nextjs-nestjs-postgresql-prisma` | Next.js 16 + NestJS 11 + PostgreSQL 16 + Prisma 5 |
| `turborepo-nextjs-express-postgresql-prisma` | Next.js 15 + Express 4 + PostgreSQL 16 + Prisma 5 |
| `turborepo-nextjs-nestjs-mongodb-mongoose` | Next.js 16 + NestJS 11 + MongoDB 7 + Mongoose 8 |
| `turborepo-nextjs-express-mongodb-mongoose` | Next.js 15 + Express 4 + MongoDB 7 + Mongoose 8 |
| `turborepo-react-nestjs-postgresql-prisma` | React 19 (Vite) + NestJS 11 + PostgreSQL 16 + Prisma 5 |
| `turborepo-react-express-postgresql-prisma` | React 19 (Vite) + Express 4 + PostgreSQL 16 + Prisma 5 |
| `turborepo-react-nestjs-mongodb-mongoose` | React 19 (Vite) + NestJS 11 + MongoDB 7 + Mongoose 8 |
| `turborepo-react-express-mongodb-mongoose` | React 19 (Vite) + Express 4 + MongoDB 7 + Mongoose 8 |

Browse them:

```bash
npx create-fs-app list
npx create-fs-app list graphql   # keyword search
```

---

## Contributed Templates

Community-built variants extend the official stacks with additional tooling (GraphQL, tRPC, Redis, Sentry, etc.).  
Each contributed template is identified by a permanent **UUID v4**.

```bash
# Browse contributed templates — shows UUID and contributor
npx create-fs-app list --contributed

# Scaffold from a contributed template using its UUID
npx create-fs-app my-app --template bc75b4fb-3d42-4f6e-a8c1-0123456789ab
```

> **Why UUID?**  
> Keys can be renamed or refactored; UUIDs are permanent. A UUID you copy today will always resolve to the same template.

To add your own template to the contributed registry, see the [templates repo contributing guide](https://github.com/Om-jannu/create-fs-app-templates/blob/master/CONTRIBUTING.md).

---

## All CLI Options

```
npx create-fs-app <project-name> [options]

Stack selection
  --monorepo <framework>      turborepo | nx
  --frontend <framework>      next.js | react | vue | nuxt | angular
  --backend  <framework>      nest.js | express | fastify-ts | koa
  --database <db>             postgresql | mongodb | mysql | sqlite
  --orm      <orm>            prisma | typeorm | mongoose | drizzle

Customisation
  --styling  <style>          tailwind | css | scss | styled-components
  --api-style <style>         rest | graphql | both  (default: rest)
  --auth     <strategy>       none | jwt              (default: none)
  --turbopack                 Enable Turbopack dev server (Next.js only)
  --ci                        Add GitHub Actions CI workflow
  --no-eslint                 Disable ESLint
  --no-prettier               Disable Prettier
  --no-docker                 Skip Docker Compose

Template sources
  --template  <uuid>          Use a contributed template by UUID v4
  --template-url <url>        Use any GitHub repo as a template source
  --preset    <name>          Use a saved configuration preset

Behaviour
  --package-manager <pm>      npm | yarn | pnpm
  --no-git                    Skip git initialization
  --no-install                Skip dependency installation
  --no-cache                  Force fresh download, skip cache
  -y, --yes                   Accept all defaults, skip prompts

Development
  --local-templates <path>    Use a local templates repo instead of GitHub
```

---

## Presets

Save a flag combination as a named preset and re-use it with a single word.

```bash
# Save a preset
npx create-fs-app preset save my-stack \
  --description "NestJS + Next.js + PostgreSQL"

# List all presets (built-ins + yours)
npx create-fs-app preset list

# Use a preset
npx create-fs-app new-project --preset my-stack

# Overwrite a preset
npx create-fs-app preset save my-stack --force

# Delete a preset
npx create-fs-app preset delete my-stack
```

### Built-in presets (read-only)

| Name | Stack |
|------|-------|
| `saas-starter` | Next.js + NestJS + PostgreSQL + Prisma + JWT + Docker |
| `mern-stack` | React (Vite) + Express + MongoDB + Mongoose |
| `t3-inspired` | Next.js + NestJS + PostgreSQL + Prisma + GraphQL |

---

## Commands Reference

### `list [search]`

```bash
npx create-fs-app list                  # official templates
npx create-fs-app list --contributed    # community templates
npx create-fs-app list --all            # both sections
npx create-fs-app list graphql          # keyword search
```

### `info <template>`

Show full details for any template.

```bash
npx create-fs-app info turborepo-nextjs-nestjs-postgresql-prisma
npx create-fs-app info graphql
```

### `preset <subcommand>`

```bash
npx create-fs-app preset list
npx create-fs-app preset save  <name> [--description "..."] [--force]
npx create-fs-app preset delete <name>
```

### `health`

Verify your environment is ready.

```bash
npx create-fs-app health
```

Checks: **Node.js ≥ 18**, **Git**, **Docker** (binary + daemon), **npm**, **pnpm**, **yarn**.

### `cache <subcommand>`

```bash
npx create-fs-app cache stats   # show cache size and template count
npx create-fs-app cache clear   # wipe cached templates
```

Cache location: `~/.create-fs-app/`

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/Om-jannu/create-fs-app.git
cd create-fs-app

# 2. Install
npm install

# 3. Build (TypeScript → dist/)
npm run build

# 4. Link globally
npm link

# 5. Test
create-fs-app my-test-app

# 6. Unlink when done
npm unlink -g create-fs-app
```

### Point at a local templates repo

```bash
git clone https://github.com/Om-jannu/create-fs-app-templates.git ../create-fs-app-templates

create-fs-app my-app \
  --frontend next.js --backend nest.js --database postgresql --orm prisma \
  --local-templates ../create-fs-app-templates \
  --yes
```

This skips GitHub entirely and copies the template straight from your local clone.

---

## Requirements

| Tool | Minimum version |
|------|----------------|
| Node.js | **18.0.0** |
| npm | bundled with Node.js |
| Git | any recent |
| Docker | optional — used inside generated projects only |

---

## Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for:

- Reporting bugs and requesting features
- Development environment setup
- Pull request process and code standards
- How to contribute a template to the community registry

---

## License

ISC © [Om-jannu](https://github.com/Om-jannu)
