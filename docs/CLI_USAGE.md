# CLI Usage Guide

Complete reference for using `create-fs-app`.

## Quick Start

```bash
npx create-fs-app@latest my-app
```

## Usage Modes

### 1. Interactive Mode (Recommended)

Answer a few questions to configure your stack:

```bash
npx create-fs-app@latest my-app
```

### 2. CLI Mode

Specify everything via flags:

```bash
npx create-fs-app@latest my-app \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma \
  --package-manager pnpm
```

### 3. Template Mode

Use a pre-built template:

```bash
npx create-fs-app@latest my-app --template turborepo-nextjs-nestjs-postgresql-prisma
```

### 4. Preset Mode

Use a saved configuration:

```bash
npx create-fs-app@latest my-app --preset saas-starter
```

## All Commands

### Project Creation

```bash
# Interactive mode
npx create-fs-app@latest my-app

# With options
npx create-fs-app@latest my-app [options]

# With template
npx create-fs-app@latest my-app --template <name>

# With preset
npx create-fs-app@latest my-app --preset <name>

# With custom template URL
npx create-fs-app@latest my-app --template-url https://github.com/user/repo
```

### Template Commands

```bash
# List all templates
npx create-fs-app@latest list

# Get template details
npx create-fs-app@latest info <template-name>
```

### Preset Commands

```bash
# List all presets
npx create-fs-app@latest preset list

# Delete a preset
npx create-fs-app@latest preset delete <name>
```

### Cache Commands

```bash
# View cache statistics
npx create-fs-app@latest cache stats

# Clear template cache
npx create-fs-app@latest cache clear
```

### Health Check

```bash
# Run inside a project
cd my-app
npx create-fs-app@latest health
```

### Help & Version

```bash
# Show help
npx create-fs-app@latest --help

# Show version
npx create-fs-app@latest --version
```

## CLI Options

### Stack Options

| Option | Description | Values |
|--------|-------------|--------|
| `--monorepo <framework>` | Monorepo framework | `turborepo`, `nx`, `lerna` |
| `--frontend <framework>` | Frontend framework | `react`, `next.js`, `vue`, `nuxt`, `angular` |
| `--backend <framework>` | Backend framework | `express`, `nest.js`, `fastify`, `koa` |
| `--database <db>` | Database | `postgresql`, `mongodb`, `mysql`, `sqlite` |
| `--orm <orm>` | ORM/ODM | `prisma`, `typeorm`, `mongoose`, `drizzle` |
| `--package-manager <pm>` | Package manager | `npm`, `yarn`, `pnpm` |
| `--styling <solution>` | Styling solution | `css`, `scss`, `tailwind`, `styled-components` |

### Template Options

| Option | Description |
|--------|-------------|
| `-t, --template <name>` | Use a specific template |
| `--template-url <url>` | Use custom GitHub template |
| `--preset <name>` | Use a configuration preset |

### Feature Flags

| Option | Description | Default |
|--------|-------------|---------|
| `--linting` | Enable linting | `true` |
| `--no-linting` | Disable linting | - |
| `--docker` | Include Docker | `true` |
| `--no-docker` | Skip Docker | - |
| `--no-git` | Skip git initialization | `false` |
| `--no-install` | Skip package installation | `false` |
| `--no-cache` | Skip template caching | `false` |

## Examples

### Example 1: SaaS Application

```bash
npx create-fs-app@latest my-saas \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma \
  --package-manager pnpm
```

### Example 2: E-commerce Site

```bash
npx create-fs-app@latest my-shop \
  --monorepo turborepo \
  --frontend react \
  --backend express \
  --database mongodb \
  --orm mongoose
```

### Example 3: Using a Template

```bash
npx create-fs-app@latest my-app --template turborepo-nextjs-nestjs-postgresql-prisma
```

### Example 4: Using a Preset

```bash
npx create-fs-app@latest my-app --preset saas-starter
```

### Example 5: Custom Template from GitHub

```bash
npx create-fs-app@latest my-app --template-url https://github.com/Om-jannu/create-fs-app-templates
```

### Example 6: Skip Installation

```bash
npx create-fs-app@latest my-app --no-install
cd my-app
npm install
```

### Example 7: Minimal Setup

```bash
npx create-fs-app@latest my-app \
  --monorepo turborepo \
  --frontend react \
  --backend express \
  --database postgresql \
  --no-docker \
  --no-linting
```

## Built-in Presets

### saas-starter
Modern SaaS application stack
- Turborepo + Next.js + NestJS
- PostgreSQL + Prisma
- Tailwind CSS + Docker

```bash
npx create-fs-app@latest my-saas --preset saas-starter
```

### ecommerce
E-commerce platform stack
- Turborepo + React + Express
- MongoDB + Mongoose
- Tailwind CSS + Docker

```bash
npx create-fs-app@latest my-shop --preset ecommerce
```

### minimal
Minimal setup without extras
- Turborepo + React + Express
- PostgreSQL (no ORM)
- Plain CSS, no Docker

```bash
npx create-fs-app@latest my-app --preset minimal
```

## Templates

All templates are hosted at: https://github.com/Om-jannu/create-fs-app-templates

### Available Templates

```bash
# List all templates
npx create-fs-app@latest list
```

Current templates:
- `turborepo-nextjs-nestjs-postgresql-prisma`
- `turborepo-react-express-mongodb-mongoose`

### Using Templates

```bash
# Use by name
npx create-fs-app@latest my-app --template turborepo-nextjs-nestjs-postgresql-prisma

# Get template info
npx create-fs-app@latest info turborepo-nextjs-nestjs-postgresql-prisma
```

## After Creation

```bash
cd my-app
npm install        # If you used --no-install
npm run dev        # Start development servers
```

### Available Scripts

```bash
npm run dev        # Start all apps in development
npm run build      # Build all apps for production
npm run lint       # Lint all code
npm run format     # Format code with Prettier
```

### Project Structure

```
my-app/
├── apps/
│   ├── frontend/          # Frontend application
│   │   ├── src/
│   │   └── package.json
│   └── backend/           # Backend application
│       ├── src/
│       └── package.json
├── packages/
│   └── shared/            # Shared code
│       ├── src/
│       └── package.json
├── package.json           # Root package.json
├── turbo.json            # Turborepo config
└── README.md
```

## Cache Management

Templates are cached locally for faster subsequent usage.

### Cache Location

```
~/.create-fs-app/cache/
```

### Cache Commands

```bash
# View cache statistics
npx create-fs-app@latest cache stats

# Clear cache
npx create-fs-app@latest cache clear
```

### Performance

- First run: ~60 seconds (downloads template)
- Cached run: ~6 seconds (uses local cache)
- 10x faster with caching!

## Troubleshooting

### "Template not found"

```bash
# List available templates
npx create-fs-app@latest list

# Use a valid template name
npx create-fs-app@latest my-app --template turborepo-nextjs-nestjs-postgresql-prisma
```

### "Version already exists"

Make sure you're using `@latest`:

```bash
npx create-fs-app@latest my-app
```

### "Permission denied"

Check directory permissions or try a different location.

### Clear cache if issues

```bash
npx create-fs-app@latest cache clear
```

## Contributing Templates

Want to create your own template? Check out:
- [Template Contribution Guide](./TEMPLATE_CONTRIBUTION_GUIDE.md)
- [Templates Repository](https://github.com/Om-jannu/create-fs-app-templates)

## Links

- **npm**: https://www.npmjs.com/package/create-fs-app
- **GitHub**: https://github.com/Om-jannu/create-fs-app
- **Templates**: https://github.com/Om-jannu/create-fs-app-templates
- **Issues**: https://github.com/Om-jannu/create-fs-app/issues
