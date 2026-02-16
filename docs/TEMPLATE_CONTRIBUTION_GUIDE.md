# Template Contribution Guide

Learn how to create and contribute templates to create-fs-app.

## Templates Repository

All templates are hosted at: **https://github.com/Om-jannu/create-fs-app-templates**

## What is a Template?

A template is a pre-configured, production-ready full-stack monorepo application that users can clone and customize.

## Template Structure

```
template-name/
├── apps/
│   ├── frontend/          # Frontend application
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   └── backend/           # Backend application
│       ├── src/
│       ├── package.json
│       └── .env.example
├── packages/
│   └── shared/            # Shared code
│       ├── src/
│       └── package.json
├── package.json           # Root package.json
├── turbo.json            # Monorepo config
├── docker-compose.yml    # Docker setup (optional)
└── README.md
```

## Naming Convention

Templates must follow this naming pattern:

```
{monorepo}-{frontend}-{backend}-{database}-{orm}
```

**Examples:**
- `turborepo-nextjs-nestjs-postgresql-prisma`
- `nx-react-express-mongodb-mongoose`
- `turborepo-vue-fastify-mysql-drizzle`

## Using Placeholders

Templates use placeholders that are replaced during project creation:

### Available Placeholders

- `{{PROJECT_NAME}}` - User's project name
- `{{PACKAGE_MANAGER}}` - Package manager (npm/yarn/pnpm)

### Example Usage

**package.json:**
```json
{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "scripts": {
    "dev": "{{PACKAGE_MANAGER}} run dev"
  }
}
```

**README.md:**
```markdown
# {{PROJECT_NAME}}

Full-stack application built with create-fs-app.
```

**.env.example:**
```env
DATABASE_URL="postgresql://localhost:5432/{{PROJECT_NAME}}"
PORT=3000
```

## Template Requirements

### 1. Working Application

- ✅ All dependencies properly configured
- ✅ `npm install` works without errors
- ✅ `npm run dev` starts all apps
- ✅ `npm run build` builds successfully

### 2. Documentation

**README.md must include:**
- Project overview
- Tech stack
- Getting started instructions
- Available scripts
- Environment variables

**Example README:**
```markdown
# {{PROJECT_NAME}}

Full-stack monorepo built with modern technologies.

## Tech Stack

- **Monorepo**: Turborepo
- **Frontend**: Next.js
- **Backend**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment:
   \`\`\`bash
   cp apps/backend/.env.example apps/backend/.env
   \`\`\`

3. Start development:
   \`\`\`bash
   npm run dev
   \`\`\`

## Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build all apps
- `npm run lint` - Lint code
```

### 3. Environment Configuration

Include `.env.example` files with:
- All required environment variables
- Sensible defaults
- Comments explaining each variable

### 4. Code Quality

- ✅ TypeScript configured
- ✅ ESLint configured
- ✅ Prettier configured
- ✅ No TypeScript errors
- ✅ Code is well-formatted

## Creating a Template

### Step 1: Set Up Your Stack

Use official CLIs to initialize:

```bash
# Initialize Turborepo
npx create-turbo@latest

# Initialize Next.js
npx create-next-app@latest frontend

# Initialize NestJS
npx @nestjs/cli new backend

# Or use other framework CLIs
```

### Step 2: Configure Monorepo

Set up your monorepo structure:

```json
{
  "name": "{{PROJECT_NAME}}",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build"
  }
}
```

### Step 3: Add Placeholders

Replace project-specific values:

```bash
# Find and replace your project name with {{PROJECT_NAME}}
# Find and replace package manager commands with {{PACKAGE_MANAGER}}
```

### Step 4: Test Locally

```bash
# Test installation
npm install

# Test development
npm run dev

# Test build
npm run build
```

### Step 5: Create README

Document your template thoroughly.

### Step 6: Submit to Templates Repo

1. Fork: https://github.com/Om-jannu/create-fs-app-templates
2. Add your template to `templates/` folder
3. Test thoroughly
4. Submit a Pull Request

## Template Checklist

Before submitting:

- [ ] Template follows naming convention
- [ ] All dependencies in package.json
- [ ] `npm install` works
- [ ] `npm run dev` works
- [ ] `npm run build` works
- [ ] README.md is comprehensive
- [ ] .env.example includes all variables
- [ ] Placeholders used correctly
- [ ] No TypeScript errors
- [ ] Code is formatted
- [ ] No sensitive data or secrets
- [ ] Docker setup works (if included)

## Example: Complete Template

See reference templates at:
https://github.com/Om-jannu/create-fs-app-templates

Current templates:
- `turborepo-nextjs-nestjs-postgresql-prisma`
- `turborepo-react-express-mongodb-mongoose`

## Template Ideas

Popular combinations to create:

### Turborepo
- [ ] turborepo-vue-fastify-mysql-drizzle
- [ ] turborepo-nextjs-express-postgresql-prisma
- [ ] turborepo-react-nestjs-mongodb-mongoose
- [ ] turborepo-angular-nestjs-postgresql-typeorm

### Nx
- [ ] nx-nextjs-nestjs-postgresql-prisma
- [ ] nx-react-express-mongodb-mongoose
- [ ] nx-angular-nestjs-postgresql-typeorm

### Lerna
- [ ] lerna-react-express-postgresql-prisma
- [ ] lerna-vue-koa-mongodb-mongoose

## Best Practices

### 1. Use Official CLIs

Always start with official framework CLIs:
- `create-turbo` for Turborepo
- `create-next-app` for Next.js
- `@nestjs/cli` for NestJS
- `create-vite` for React/Vue

This ensures:
- Latest versions
- Proper configuration
- Best practices

### 2. Keep It Simple

- Don't over-configure
- Use sensible defaults
- Document customization options

### 3. Test Thoroughly

Test on:
- Fresh installation
- Different operating systems
- Different Node versions

### 4. Document Everything

- Clear README
- Commented code
- Environment variables explained

### 5. Security

- No hardcoded secrets
- Secure defaults
- .env.example (not .env)

## Getting Help

- **Issues**: https://github.com/Om-jannu/create-fs-app/issues
- **Discussions**: https://github.com/Om-jannu/create-fs-app/discussions
- **Templates Repo**: https://github.com/Om-jannu/create-fs-app-templates

## License

All templates should be MIT licensed unless otherwise specified.

---

**Ready to contribute?** Start by creating a template for your favorite stack! 🚀
