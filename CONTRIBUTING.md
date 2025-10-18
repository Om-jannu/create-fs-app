# Contributing to Create-FS-App

Thank you for your interest in contributing! 🎉

## Ways to Contribute

### 1. Create Templates (Most Valuable!)

The best way to contribute is by creating templates for popular stack combinations.

**Getting Started:**
1. Read [docs/TEMPLATE_GUIDE.md](./docs/TEMPLATE_GUIDE.md)
2. Build a working full-stack application with your chosen stack
3. Add placeholders (`{{PROJECT_NAME}}`, etc.)
4. Push to GitHub
5. Submit a PR to add it to the template registry

**Priority Templates Needed:**
- Turborepo + Next.js + NestJS + PostgreSQL + Prisma
- Turborepo + React + Express + MongoDB + Mongoose
- Nx + Next.js + NestJS + PostgreSQL + Prisma
- Turborepo + Vue + NestJS + PostgreSQL + TypeORM

### 2. Improve the CLI

- Report bugs
- Suggest features
- Fix issues
- Improve error messages
- Add tests

### 3. Improve Documentation

- Fix typos
- Add examples
- Clarify confusing sections
- Translate to other languages

## Development Setup

```bash
# Clone the repository
git clone https://github.com/Om-jannu/create-fs-app.git
cd create-fs-app

# Install dependencies
npm install

# Build
npm run build

# Link for local testing
npm link

# Test it
create-fs-app test-project
```

## Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
6. **Push** to your fork (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

## Code Standards

- Use TypeScript
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed
- Ensure `npm run build` succeeds

## Commit Messages

Use clear, descriptive commit messages:

```
✅ Good:
- "Add support for Fastify backend framework"
- "Fix template matching for Vue projects"
- "Update CLI usage documentation"

❌ Bad:
- "update"
- "fix stuff"
- "changes"
```

## Adding a Template to Registry

Edit `src/core/template-registry.ts`:

```typescript
'your-template-key': {
  url: 'https://github.com/your-username/template-name',
  branch: 'main',
  description: 'Brief description',
  features: ['Feature 1', 'Feature 2']
}
```

## Questions?

- **Issues:** https://github.com/Om-jannu/create-fs-app/issues
- **Discussions:** https://github.com/Om-jannu/create-fs-app/discussions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn
- Follow GitHub's Community Guidelines

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for making Create-FS-App better! 🚀

