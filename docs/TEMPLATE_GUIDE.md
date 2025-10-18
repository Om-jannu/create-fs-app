# Template Creation Guide

This guide explains how to create and structure templates for `create-fs-app`.

## Overview

Templates are pre-configured, working full-stack applications that users can clone and customize. This approach keeps the CLI lightweight and makes templates independently maintainable.

## Template Repository Structure

### Option 1: Monorepo (Recommended)

Create a single repository with all templates:

```
create-fs-app-templates/
├── templates/
│   ├── turborepo-nextjs-nestjs-postgresql-prisma/
│   ├── turborepo-react-express-mongodb-mongoose/
│   ├── nx-nextjs-nestjs-postgresql-prisma/
│   └── ...
├── README.md
└── CONTRIBUTING.md
```

### Option 2: Individual Repositories

Create separate repositories for each template:

```
- template-turborepo-nextjs-nestjs-postgresql-prisma
- template-turborepo-react-express-mongodb-mongoose
- template-nx-nextjs-nestjs-postgresql-prisma
```

## Template Naming Convention

Format: `{monorepo}-{frontend}-{backend}-{database}-{orm}`

Examples:
- `turborepo-nextjs-nestjs-postgresql-prisma`
- `nx-react-express-mongodb-mongoose`
- `lerna-vue-fastify-mysql-drizzle`

## Template Structure

Each template should follow this structure:

```
template-name/
├── apps/
│   ├── frontend/           # Frontend application
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── ...
│   └── backend/            # Backend application
│       ├── src/
│       ├── .env.example
│       ├── package.json
│       └── ...
├── packages/
│   └── shared/             # Shared code between apps
│       ├── src/
│       └── package.json
├── package.json            # Root package.json
├── README.md               # Template documentation
├── docker-compose.yml      # (Optional) Docker setup
├── turbo.json              # (If using Turborepo)
├── nx.json                 # (If using Nx)
└── lerna.json              # (If using Lerna)
```

## Using Placeholders

Use placeholders that will be replaced during customization:

### Available Placeholders

- `{{PROJECT_NAME}}` - User's project name
- `{{FRONTEND_FRAMEWORK}}` - Frontend framework choice
- `{{BACKEND_FRAMEWORK}}` - Backend framework choice
- `{{DATABASE}}` - Database choice
- `{{ORM}}` - ORM choice
- `{{PACKAGE_MANAGER}}` - Package manager (npm/yarn/pnpm)
- `{{MONOREPO_FRAMEWORK}}` - Monorepo framework

### Example Usage

**package.json:**
```json
{
  "name": "{{PROJECT_NAME}}",
  "version": "0.1.0",
  "description": "{{PROJECT_NAME}} - Full-stack application",
  "scripts": {
    "dev": "{{PACKAGE_MANAGER}} run dev",
    "build": "{{PACKAGE_MANAGER}} run build"
  }
}
```

**README.md:**
```markdown
# {{PROJECT_NAME}}

A full-stack application built with:
- Frontend: {{FRONTEND_FRAMEWORK}}
- Backend: {{BACKEND_FRAMEWORK}}
- Database: {{DATABASE}}
- ORM: {{ORM}}
```

**.env.example:**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/{{PROJECT_NAME}}"

# App
PORT=3000
NODE_ENV=development
```

## Template Requirements

### 1. Working Application

Each template MUST be a fully functional application:
- All dependencies properly configured
- Development server can start with `npm run dev`
- Production build works with `npm run build`
- All packages are compatible versions

### 2. Documentation

Each template MUST include:

**README.md** with:
- Project overview
- Tech stack
- Getting started instructions
- Available scripts
- Project structure
- Environment variables documentation

**Example README Template:**
```markdown
# {{PROJECT_NAME}}

Full-stack monorepo application built with modern technologies.

## Tech Stack

- **Monorepo**: {{MONOREPO_FRAMEWORK}}
- **Frontend**: {{FRONTEND_FRAMEWORK}}
- **Backend**: {{BACKEND_FRAMEWORK}}
- **Database**: {{DATABASE}}
- **ORM**: {{ORM}}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   {{PACKAGE_MANAGER}} install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   cp apps/backend/.env.example apps/backend/.env
   \`\`\`

3. Start development servers:
   \`\`\`bash
   {{PACKAGE_MANAGER}} run dev
   \`\`\`

## Project Structure

\`\`\`
{{PROJECT_NAME}}/
├── apps/
│   ├── frontend/   # Frontend application
│   └── backend/    # Backend API
├── packages/
│   └── shared/     # Shared code
└── package.json
\`\`\`

## Scripts

- `dev` - Start development servers
- `build` - Build all applications
- `test` - Run tests
- `lint` - Lint all code
```

### 3. Environment Configuration

Include `.env.example` files with:
- All required environment variables
- Sensible defaults for development
- Comments explaining each variable

### 4. Docker Support (Optional)

If Docker is supported, include:
- `Dockerfile` for each app
- `docker-compose.yml` for local development
- `.dockerignore` files

### 5. Testing Setup

Include basic testing configuration:
- Test framework configured
- Example tests
- Test scripts in package.json

### 6. Code Quality

Templates should include:
- ESLint configuration
- Prettier configuration
- TypeScript configuration (tsconfig.json)
- EditorConfig (.editorconfig)

## Template Checklist

Before submitting a template, ensure:

- [ ] Application runs without errors
- [ ] All dependencies are correctly specified
- [ ] README.md is comprehensive
- [ ] .env.example includes all variables
- [ ] Placeholders are used consistently
- [ ] Code is well-formatted
- [ ] TypeScript has no errors
- [ ] Tests are passing
- [ ] Monorepo commands work (build, dev, lint, test)
- [ ] Docker setup works (if included)
- [ ] No sensitive data or secrets in the code

## Adding a New Template

### 1. Create the Template

Build a working full-stack application with your chosen stack.

### 2. Add Placeholders

Replace project-specific values with placeholders.

### 3. Test Locally

Test the template creation process:
```bash
# Clone your template
git clone <your-template-repo> test-project

# Customize it (manually test placeholder replacement)
cd test-project

# Test that it works
npm install
npm run dev
```

### 4. Register the Template

Add your template to `src/core/template-registry.ts`:

```typescript
'your-template-key': {
  url: 'https://github.com/your-org/template-name',
  branch: 'main',
  description: 'Description of your template',
  features: ['Feature 1', 'Feature 2', 'Feature 3']
}
```

### 5. Document the Template

Add information about your template to the main repository's README.

## Template Categories

### Starter Templates (Minimal)

Minimal setup with:
- Basic monorepo structure
- Simple frontend and backend
- Minimal dependencies
- Good for learning

### Production Templates (Full-Featured)

Production-ready setup with:
- Complete authentication system
- Database migrations
- Docker configuration
- CI/CD setup
- Comprehensive testing
- Error handling
- Logging

### Specialized Templates

Templates for specific use cases:
- E-commerce
- Blog/CMS
- Dashboard/Admin
- Real-time apps
- API-first

## Best Practices

### 1. Keep Dependencies Updated

Regularly update dependencies to latest stable versions.

### 2. Follow Framework Conventions

Use official recommendations for each framework.

### 3. Include Examples

Add example components, routes, and API endpoints.

### 4. Security

- No hardcoded secrets
- Secure defaults
- Security headers configured
- Input validation examples

### 5. Performance

- Optimized builds
- Code splitting where appropriate
- Lazy loading examples
- Caching strategies

### 6. Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader friendly

## Template Maintenance

### Versioning

Use git tags for template versions:
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Branches

- `main` - Stable, production-ready
- `develop` - Latest features
- `v1.x` - Version-specific branches

### Changelog

Maintain a CHANGELOG.md documenting:
- New features
- Bug fixes
- Breaking changes
- Dependency updates

## Example: Complete Template

See the reference template repository:
https://github.com/create-fs-app-templates/template-turborepo-nextjs-nestjs-postgresql-prisma

## Contributing

To contribute a new template:

1. Fork the templates repository
2. Create your template following this guide
3. Test thoroughly
4. Submit a pull request
5. Provide documentation

## Quick Start

Want to create your first template? Follow these steps:

1. **Choose your stack** (e.g., Turborepo + Next.js + NestJS + PostgreSQL + Prisma)
2. **Build a working app** using official CLIs (create-turbo, create-next-app, nest new)
3. **Test it works** (npm install, npm run dev, npm run build)
4. **Add placeholders** (Replace project name with `{{PROJECT_NAME}}`, etc.)
5. **Create GitHub repo** and push
6. **Add to registry** in `src/core/template-registry.ts`
7. **Submit PR** to create-fs-app

**Template Structure:**
```
your-template/
├── apps/
│   ├── frontend/       # Frontend app
│   └── backend/        # Backend API
├── packages/
│   └── shared/         # Shared code
├── package.json        # With {{PROJECT_NAME}}
├── README.md           # With placeholders
└── .env.example        # Environment variables
```

## Questions?

- Open an issue: https://github.com/Om-jannu/create-fs-app/issues
- Discussions: https://github.com/Om-jannu/create-fs-app/discussions
- See [CONTRIBUTING.md](../CONTRIBUTING.md)

