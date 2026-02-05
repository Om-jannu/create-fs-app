# Quick Reference Guide

## Installation & Basic Usage

```bash
# Create a new project (interactive)
npx create-fs-app my-app

# Create with CLI options
npx create-fs-app my-app --monorepo turborepo --frontend next.js --backend nest.js --database postgresql

# Use a template
npx create-fs-app my-app --template turborepo-nextjs-nestjs-postgresql-prisma

# Use a preset
npx create-fs-app my-app --preset saas-starter

# Use custom template URL
npx create-fs-app my-app --template-url https://github.com/user/repo
```

## Commands

### Project Creation
```bash
create-fs-app <name>                    # Interactive mode
create-fs-app <name> [options]          # CLI options mode
create-fs-app <name> --template <name>  # Use template
create-fs-app <name> --preset <name>    # Use preset
```

### Templates
```bash
create-fs-app list                      # List all templates
create-fs-app ls                        # Alias for list
create-fs-app info <template>           # Show template details
```

### Presets
```bash
create-fs-app preset list               # List all presets
create-fs-app preset save <name>        # Save preset (from project)
create-fs-app preset delete <name>      # Delete preset
```

### Cache
```bash
create-fs-app cache clear               # Clear template cache
create-fs-app cache stats               # Show cache statistics
```

### Health Check
```bash
create-fs-app health                    # Run health check on current project
```

## CLI Options

### Stack Options
```bash
--monorepo <framework>      # turborepo, nx, lerna
--frontend <framework>      # react, next.js, vue, nuxt, angular
--backend <framework>       # express, nest.js, fastify, koa
--database <db>            # postgresql, mongodb, mysql, sqlite
--orm <orm>                # prisma, typeorm, mongoose, drizzle
--package-manager <pm>     # npm, yarn, pnpm
--styling <solution>       # css, scss, tailwind, styled-components
```

### Feature Flags
```bash
--linting                  # Enable linting (default: true)
--no-linting              # Disable linting
--docker                  # Include Docker (default: true)
--no-docker               # Skip Docker
--no-git                  # Skip git initialization
--no-install              # Skip dependency installation
--no-cache                # Skip template caching
```

### Template Options
```bash
-t, --template <name>      # Use predefined template
--template-url <url>       # Use custom GitHub template
--preset <name>            # Use configuration preset
```

## Built-in Presets

### saas-starter
Modern SaaS application
- Turborepo + Next.js + NestJS
- PostgreSQL + Prisma
- Tailwind CSS + Docker

```bash
create-fs-app my-saas --preset saas-starter
```

### ecommerce
E-commerce platform
- Turborepo + React + Express
- MongoDB + Mongoose
- Tailwind CSS + Docker

```bash
create-fs-app my-shop --preset ecommerce
```

### minimal
Minimal setup
- Turborepo + React + Express
- PostgreSQL
- Plain CSS, no Docker

```bash
create-fs-app my-app --preset minimal
```

## Environment Variables

### Debug Mode
```bash
DEBUG=true create-fs-app my-app
```
Shows detailed debug information

### Verbose Mode
```bash
VERBOSE=true create-fs-app my-app
```
Shows verbose output

## Common Workflows

### Quick Start (Interactive)
```bash
npx create-fs-app my-app
cd my-app
npm run dev
```

### Fast Setup (Preset)
```bash
npx create-fs-app my-app --preset saas-starter
cd my-app
pnpm install  # if skipped
pnpm run dev
```

### Custom Template
```bash
npx create-fs-app my-app --template-url https://github.com/myorg/template
cd my-app
npm run dev
```

### CI/CD Pipeline
```bash
#!/bin/bash
npx create-fs-app $PROJECT_NAME \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma \
  --no-git \
  --no-install

cd $PROJECT_NAME
npm ci
npm run build
```

## Troubleshooting

### Check Project Health
```bash
cd my-project
create-fs-app health
```

### Clear Cache
```bash
create-fs-app cache clear
```

### Debug Mode
```bash
DEBUG=true create-fs-app my-app
```

### View Cache Stats
```bash
create-fs-app cache stats
```

## Tips & Tricks

### 1. Speed Up Creation
Use presets or templates for faster setup:
```bash
create-fs-app my-app --preset saas-starter
```

### 2. Skip Installation for Custom Setup
```bash
create-fs-app my-app --no-install
cd my-app
# Custom installation steps
npm install
```

### 3. Use Custom Templates
```bash
create-fs-app my-app --template-url https://github.com/myorg/template
```

### 4. Check Before Creating
```bash
create-fs-app list  # See available templates
create-fs-app info turborepo-nextjs-nestjs-postgresql-prisma
```

### 5. Save Your Favorite Stack
After creating a project, save it as a preset for future use.

## Error Messages

### "Project name is invalid"
- Use only letters, numbers, hyphens, and underscores
- Don't start with . or _
- Avoid reserved names (node_modules, npm, etc.)

### "Template not found"
- Check available templates: `create-fs-app list`
- Use a preset: `create-fs-app preset list`
- Use custom URL: `--template-url`

### "Permission denied"
- Check directory permissions
- Try running without sudo first
- Ensure you have write access

### "Network error"
- Check internet connection
- Verify GitHub is accessible
- Try again or use cached templates

## Performance

### First Run
- Downloads template: ~30s
- Customizes: ~3s
- Installs deps: ~25s
- **Total: ~60s**

### Cached Run
- Uses cache: ~1s
- Customizes: ~3s
- Installs deps: ~25s (if not skipped)
- **Total: ~30s** (or ~6s with --no-install)

## File Locations

### Cache
```
~/.create-fs-app/cache/
```

### Presets
```
~/.create-fs-app/presets/presets.json
```

## Version Info
```bash
create-fs-app --version
create-fs-app --help
```

## Links

- [Full Documentation](../README.md)
- [CLI Usage Guide](./CLI_USAGE.md)
- [Template Guide](./TEMPLATE_GUIDE.md)
- [Contributing](../CONTRIBUTING.md)
- [Changelog](../CHANGELOG.md)
