# Template Contribution Guide

## Overview

Templates are the heart of create-fs-app. They're pre-built, production-ready full-stack applications that users can clone and customize.

## Template Structure

Each template should be a complete, working monorepo application in the `templates/` directory:

```
templates/
└── {monorepo}-{frontend}-{backend}-{database}-{orm}/
    ├── package.json
    ├── turbo.json (or nx.json, lerna.json)
    ├── apps/
    │   ├── frontend/
    │   │   ├── package.json
    │   │   └── src/
    │   └── backend/
    │       ├── package.json
    │       ├── src/
    │       └── .env.example
    ├── packages/
    │   └── shared/
    ├── docker-compose.yml (optional)
    └── README.md
```

## Naming Convention

Template folder names must follow this pattern:
```
{monorepo}-{frontend}-{backend}-{database}-{orm}
```

Examples:
- `turborepo-nextjs-nestjs-postgresql-prisma`
- `nx-react-express-mongodb-mongoose`
- `turborepo-vue-fastify-mysql-drizzle`

## Required Files

### 1. Root package.json
```json
{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  },
  "packageManager": "{{PACKAGE_MANAGER}}@latest",
  "workspaces": ["apps/*", "packages/*"]
}
```

### 2. README.md
Must include:
- Project description
- Tech stack
- Getting started instructions
- Available scripts
- Environment variables

### 3. .env.example
```env
DATABASE_URL="postgresql://user:password@localhost:5432/{{PROJECT_NAME}}"
PORT=3001
NODE_ENV=development
```

### 4. .gitignore
Standard Node.js + framework-specific ignores

## Placeholders

Use these placeholders - they'll be replaced during project creation:

- `{{PROJECT_NAME}}` - User's project name
- `{{FRONTEND_FRAMEWORK}}` - Frontend framework choice
- `{{BACKEND_FRAMEWORK}}` - Backend framework choice
- `{{DATABASE}}` - Database choice
- `{{ORM}}` - ORM choice
- `{{PACKAGE_MANAGER}}` - Package manager (npm/yarn/pnpm)
- `{{MONOREPO_FRAMEWORK}}` - Monorepo framework

## Template Checklist

Before submitting a template:

- [ ] Template follows naming convention
- [ ] All dependencies are specified in package.json files
- [ ] `npm install` (or yarn/pnpm) works without errors
- [ ] `npm run dev` starts all apps successfully
- [ ] `npm run build` builds all apps successfully
- [ ] README.md is comprehensive
- [ ] .env.example includes all required variables
- [ ] Placeholders are used correctly
- [ ] Code is well-formatted and linted
- [ ] No sensitive data or secrets
- [ ] Docker setup works (if included)
- [ ] TypeScript has no errors

## Testing Your Template

1. **Build the CLI:**
   ```bash
   npm run build
   npm link
   ```

2. **Test template creation:**
   ```bash
   create-fs-app test-app --template your-template-name
   cd test-app
   npm install
   npm run dev
   ```

3. **Verify everything works:**
   - Frontend loads at http://localhost:3000
   - Backend responds at http://localhost:3001
   - Database connection works
   - All scripts run successfully

## Adding Your Template

1. **Create template folder:**
   ```bash
   mkdir -p templates/your-template-name
   ```

2. **Build your template:**
   - Set up complete monorepo structure
   - Add all necessary files
   - Use placeholders
   - Test thoroughly

3. **Register in template-registry.ts:**
   ```typescript
   'your-template-name': {
     url: TEMPLATE_REPO_URL,
     branch: TEMPLATE_BRANCH,
     subfolder: `${TEMPLATES_FOLDER}/your-template-name`,
     description: 'Your template description',
     features: ['TypeScript', 'Tailwind CSS', 'Docker']
   }
   ```

4. **Test:**
   ```bash
   npm run build
   create-fs-app test --template your-template-name
   ```

## Community Templates

### Sharing Your Template

1. **Fork the repository**
2. **Add your template** to `templates/` folder
3. **Update `template-registry.ts`**
4. **Submit a Pull Request** with:
   - Template name and description
   - Tech stack details
   - Screenshots (optional)
   - Testing evidence

### Template Quality Standards

Templates should be:
- **Production-ready** - Not just boilerplate
- **Well-documented** - Clear README and comments
- **Tested** - All features work
- **Maintained** - Dependencies up to date
- **Secure** - No vulnerabilities or secrets

## Example Templates

### Minimal Template
```
turborepo-react-express-postgresql-prisma/
├── package.json
├── turbo.json
├── apps/
│   ├── frontend/    # React with Vite
│   └── backend/     # Express API
└── packages/
    └── shared/      # Shared types
```

### Full-Featured Template
```
turborepo-nextjs-nestjs-postgresql-prisma/
├── package.json
├── turbo.json
├── docker-compose.yml
├── apps/
│   ├── frontend/    # Next.js 14
│   └── backend/     # NestJS
├── packages/
│   ├── shared/      # Shared utilities
│   ├── ui/          # UI components
│   └── config/      # Shared configs
└── .github/
    └── workflows/   # CI/CD
```

## Template Ideas

Popular combinations to create:

### Turborepo
- ✅ turborepo-nextjs-nestjs-postgresql-prisma
- ✅ turborepo-react-express-mongodb-mongoose
- [ ] turborepo-vue-fastify-mysql-drizzle
- [ ] turborepo-nextjs-express-postgresql-prisma
- [ ] turborepo-react-nestjs-mongodb-mongoose

### Nx
- [ ] nx-nextjs-nestjs-postgresql-prisma
- [ ] nx-react-express-mongodb-mongoose
- [ ] nx-angular-nestjs-postgresql-typeorm

### Lerna
- [ ] lerna-react-express-postgresql-prisma
- [ ] lerna-vue-koa-mongodb-mongoose

## Support

- **Issues:** Report bugs or request features
- **Discussions:** Ask questions or share ideas
- **Discord:** Join our community (coming soon)

## License

All templates are MIT licensed unless otherwise specified.

---

**Ready to contribute?** Start by creating a template for your favorite stack! 🚀
