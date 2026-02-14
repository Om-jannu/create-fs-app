# Create Full-Stack App 🚀

A blazingly fast CLI tool for creating production-ready full-stack monorepo applications with your preferred tech stack.

**NEW**: Template-based architecture for lightning-fast project creation!

![License](https://img.shields.io/npm/l/create-fs-app)
![Version](https://img.shields.io/npm/v/create-fs-app)
![Downloads](https://img.shields.io/npm/dm/create-fs-app)

## 🎬 Demo

https://github.com/Om-jannu/create-fs-app/raw/master/assets/create-fs-app.mp4

> Watch create-fs-app in action - from zero to full-stack app in seconds!

## ✨ Features

### 🏗️ **Monorepo Frameworks**
- **Turborepo** - High-performance build system with intelligent caching
- **Nx** - Smart, extensible build framework with powerful dev tools
- **Lerna** - Time-tested monorepo management

### 🎨 **Frontend Frameworks**
- **React** (Vite) - Fast, modern React setup
- **Next.js** - Production-ready React with SSR/SSG
- **Vue** - Progressive JavaScript framework
- **Nuxt** - Vue with SSR and great DX
- **Angular** - Full-featured TypeScript framework

### 🛠️ **Backend Frameworks**
- **Express** - Minimal, flexible Node.js framework
- **NestJS** - Enterprise-grade Node.js framework
- **Fastify** - Lightning-fast web framework
- **Koa** - Modern, elegant middleware framework

### 💾 **Databases & ORMs**
- **PostgreSQL** + Prisma/TypeORM/Drizzle
- **MongoDB** + Mongoose
- **MySQL** + Prisma/TypeORM
- **SQLite** + Prisma

### 📦 **Package Managers**
- npm, yarn, pnpm

### 🔧 **Included Out of the Box**
- ✅ **TypeScript only** - All projects use TypeScript (no JavaScript)
- ✅ Styling solutions (Tailwind, CSS Modules, Styled Components)
- ✅ Testing frameworks (Jest, Vitest)
- ✅ Docker & Docker Compose
- ✅ ESLint + Prettier
- ✅ GitHub Actions CI/CD templates
- ✅ Shared packages support

## 🚀 Quick Start

### Interactive Mode (Recommended for First-Time Users)

```bash
npx create-fs-app my-app
```

Follow the interactive prompts to customize your application.

### CLI Options Mode (Fast & Scriptable)

Skip prompts by specifying your stack directly:

```bash
npx create-fs-app my-app \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma \
  --package-manager pnpm
```

✅ Perfect for CI/CD, scripts, and when you know exactly what you want!

### Direct Template Mode (Fastest)

Use a specific template by name:

```bash
# See all available templates
npx create-fs-app list

# Get info about a specific template
npx create-fs-app info turborepo-nextjs-nestjs-postgresql-prisma

# Use a specific template
npx create-fs-app my-app --template turborepo-nextjs-nestjs-postgresql-prisma
```

### Other Package Managers

```bash
# Using yarn
yarn create fs-app my-app

# Using pnpm
pnpm create fs-app my-app
```

### CLI Options Mode (Non-Interactive)

Skip prompts by providing options directly:

```bash
npx create-fs-app my-app \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma
```

**All Available Options:**

```bash
npx create-fs-app <project-name> [options]

Stack Options:
  --monorepo <framework>      Monorepo framework (turborepo, nx, lerna)
  --frontend <framework>      Frontend (react, next.js, vue, nuxt, angular)
  --backend <framework>       Backend (express, nest.js, fastify, koa)
  --database <db>            Database (postgresql, mongodb, mysql, sqlite)
  --orm <orm>                ORM (prisma, typeorm, mongoose, drizzle)
  --package-manager <pm>     Package manager (npm, yarn, pnpm)
  --styling <solution>       Styling (css, scss, tailwind, styled-components)
  --[no-]linting            Enable linting (default: true)
  --[no-]docker             Include Docker (default: true)
  
Note: All projects use TypeScript by default (no JavaScript option)

Template Options:
  -t, --template <name>      Use a specific template directly

Control Options:
  --no-git                   Skip git initialization
  --no-install               Skip dependency installation
  -h, --help                 Display help
  -V, --version              Display version

Commands:
  list, ls                   List all available templates
  info <template>            Show detailed template information
```

**See [docs/CLI_USAGE.md](./docs/CLI_USAGE.md) for complete usage guide and examples.**

## 💡 Usage Examples

### Example 1: SaaS Application

```bash
npx create-fs-app my-saas \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma \
  --package-manager pnpm
```

### Example 2: E-commerce Site

```bash
npx create-fs-app my-shop \
  --monorepo nx \
  --frontend react \
  --backend express \
  --database mongodb \
  --orm mongoose \
  --styling tailwind
```

### Example 3: Blog/CMS

```bash
npx create-fs-app my-blog \
  --monorepo turborepo \
  --frontend vue \
  --backend nest.js \
  --database postgresql \
  --orm prisma
```

### Example 4: CI/CD Pipeline

```bash
#!/bin/bash
# Automated project creation
npx create-fs-app $PROJECT_NAME \
  --monorepo turborepo \
  --frontend next.js \
  --backend nest.js \
  --database postgresql \
  --orm prisma \
  --no-git \
  --no-install
```

**See [docs/CLI_USAGE.md](./docs/CLI_USAGE.md) for more examples and advanced usage.**

## 🛠️ Local Development

To run the CLI locally for testing and development:

### Method 1: Using npm link (Recommended)

This creates a global symlink so you can use `create-fs-app` anywhere:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Create a global symlink
npm link

# Now you can use it anywhere!
create-fs-app my-app
# or
create-fs-app my-app --template turborepo-nextjs-nestjs-postgresql-prisma
```

To unlink later:
```bash
npm unlink -g create-fs-app
```

### Method 2: Direct Node Execution

Run the compiled CLI directly:

```bash
# Build the project
npm run build

# Run directly with node
node dist/index.js my-app

# Or with options
node dist/index.js my-app --template turborepo-nextjs-nestjs-postgresql-prisma

# List templates
node dist/index.js list
```

### Method 3: Watch Mode for Development

For active development with auto-rebuild:

```bash
# Terminal 1: Watch for changes and rebuild
npm run dev

# Terminal 2: Run the CLI (rebuilds automatically)
node dist/index.js my-app
```

### Method 4: Using npx with local path

```bash
# Build first
npm run build

# Run with npx pointing to local dist
npx ./dist/index.js my-app
```

### Testing Your Changes

1. Make changes to source files in `src/`
2. Run `npm run build` (or `npm run dev` for watch mode)
3. Test with one of the methods above
4. Test different scenarios:
   ```bash
   # Interactive mode
   create-fs-app test-app
   
   # CLI options mode
   create-fs-app test-app --monorepo turborepo --frontend next.js
   
   # Template mode
   create-fs-app test-app --template turborepo-nextjs-nestjs-postgresql-prisma
   
   # List templates
   create-fs-app list
   ```

## Requirements

- Node.js 16.0.0 or later
- npm 7+ or yarn 1.22+ or pnpm 7+

## Project Structure

The generated project will have the following structure:

```
my-app/
├── apps/
│   ├── frontend/          # Frontend application
│   │   ├── src/
│   │   └── package.json
│   └── backend/          # Backend application
│       ├── src/
│       └── package.json
├── packages/
│   └── shared/          # Shared utilities and components
├── package.json        # Root package.json
└── README.md
```

## Configuration Options

### Monorepo Frameworks

- **Turborepo**: High-performance build system with task caching
- **Nx**: Smart and extensible build framework
- **Lerna**: Original monorepo management tool

### Frontend Frameworks

- **React**: Popular UI library with Vite setup
- **Next.js**: Full-featured React framework with SSR
- **Vue**: Progressive JavaScript framework
- **Nuxt**: Vue.js framework with SSR support
- **Angular**: Full-featured TypeScript framework

### Backend Frameworks

- **Express**: Minimal Node.js web framework
- **NestJS**: Progressive Node.js framework
- **Fastify**: Fast and low overhead framework
- **Koa**: Modern middleware framework

### Database Options

- **MongoDB**: NoSQL database
- **PostgreSQL**: Advanced SQL database
- **MySQL**: Popular SQL database
- **SQLite**: Lightweight SQL database

### ORM Options

- **Prisma**: Modern database toolkit
- **TypeORM**: TypeScript ORM
- **Mongoose**: MongoDB ODM
- **Drizzle**: Lightweight SQL ORM

## Scripts

Common scripts available in generated projects:

```bash
# Development
npm run dev       # Start development servers

# Building
npm run build     # Build all applications

# Testing
npm run test      # Run tests across applications

# Linting
npm run lint      # Lint all applications
```

## Docker Support

If you choose Docker support, your project will include:

- `Dockerfile` for containerization
- `.dockerignore` for excluding files
- Docker Compose setup for development

## 🏗️ How It Works

`create-fs-app` uses a **template-based architecture** for lightning-fast project creation:

1. **Choose your stack** - Select frameworks via interactive prompts or CLI options
2. **Template matching** - CLI finds the perfect pre-built template
3. **Clone & customize** - Template is cloned from GitHub and customized with your project name
4. **Ready to code** - Complete, working application in seconds

### Why Template-Based?

- ⚡ **Fast** - Clone instead of generate (10x faster with caching)
- 🎯 **Tested** - Every template is a real, working project
- 🔄 **Up-to-date** - Templates maintained in separate repository
- 🤝 **Community** - Easy for anyone to contribute templates
- 📦 **Lightweight** - CLI stays tiny (39.5 KB compressed)

## 📚 Documentation

- **[CLI Usage Guide](./docs/CLI_USAGE.md)** - Complete CLI reference and examples
- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Quick command reference
- **[Template Contribution Guide](./docs/TEMPLATE_CONTRIBUTION_GUIDE.md)** - How to create templates
- **[Contributing](./CONTRIBUTING.md)** - Contribution guidelines
- **[Changelog](./CHANGELOG.md)** - Version history

## 🤝 Contributing

We welcome contributions! There are many ways to help:

### 1. Create New Templates

The fastest way to contribute! Create templates for popular stack combinations.

See the **[Template Creation Guide](./docs/TEMPLATE_CONTRIBUTION_GUIDE.md)** to get started.

### 2. Improve the CLI

- Report bugs
- Suggest features
- Submit PRs
- Improve documentation

### 3. Share & Star

- Star this repo ⭐
- Share with your network
- Write blog posts
- Create video tutorials

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://github.com/Om-jannu/create-fs-app/wiki)
- 🐛 [Issue Tracker](https://github.com/Om-jannu/create-fs-app/issues)
- 💬 [Discussions](https://github.com/Om-jannu/create-fs-app/discussions)

## 🗺️ Roadmap

### Phase 1 (Current - v0.1.0)
- [x] Template-based architecture
- [x] Interactive CLI with beautiful prompts
- [x] CLI options mode for automation
- [x] Template caching system (10x faster)
- [x] Configuration presets
- [x] Custom template URLs
- [x] Project health check
- [x] Comprehensive error handling
- [x] Replaced inquirer with prompts (lighter)
- [ ] Create 10+ core templates

### Phase 2 (Next)
- [ ] Separate templates repository
- [ ] Website for template browsing
- [ ] 25+ templates covering popular stacks
- [ ] Community template contributions
- [ ] Template versioning

### Phase 3 (Future)
- [ ] Template marketplace
- [ ] VS Code extension
- [ ] Project migration tool
- [ ] Interactive template builder

## 🌟 Showcase

Built something cool with `create-fs-app`? We'd love to feature it!

Open an issue with your project link.

## 📊 Stats

![GitHub Stars](https://img.shields.io/github/stars/Om-jannu/create-fs-app?style=social)
![NPM Downloads](https://img.shields.io/npm/dm/create-fs-app)
![GitHub Issues](https://img.shields.io/github/issues/Om-jannu/create-fs-app)

## 💖 Acknowledgments

Special thanks to all contributors and the open-source community!

Inspired by:
- [create-react-app](https://github.com/facebook/create-react-app)
- [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
- [create-t3-app](https://github.com/t3-oss/create-t3-app)

## 📄 License

ISC License - see [LICENSE](./LICENSE) file for details

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Om-jannu">Om Jannu</a>
</p>

<p align="center">
  <sub>If this tool helped you, please consider starring ⭐ the repo!</sub>
</p>
