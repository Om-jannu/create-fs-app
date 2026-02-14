# Development & Release Workflow

Complete guide for developing and releasing create-fs-app.

## 📋 Table of Contents

- [Development Workflow](#development-workflow)
- [Release Workflow](#release-workflow)
- [GitHub Actions](#github-actions)
- [Quick Commands](#quick-commands)

## Development Workflow

### 1. Create a Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feat/my-feature

# Or for bug fixes
git checkout -b fix/bug-name
```

### 2. Make Your Changes

```bash
# Start development server (auto-rebuild)
npm run dev

# In another terminal, test your changes
node dist/index.js my-test-app
```

### 3. Test Your Changes

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build
npm run build

# Test the CLI
node dist/index.js test-app
```

### 4. Bump Version (Before PR)

```bash
# For bug fixes (2.0.0 -> 2.0.1)
./scripts/bump-version.sh patch

# For new features (2.0.0 -> 2.1.0)
./scripts/bump-version.sh minor

# For breaking changes (2.0.0 -> 3.0.0)
./scripts/bump-version.sh major
```

This updates:
- `package.json` version
- `src/index.ts` version

### 5. Update CHANGELOG.md

Add your changes to `CHANGELOG.md`:

```markdown
## [2.1.0] - 2026-02-14

### Added
- New feature X
- New template Y

### Fixed
- Bug Z

### Changed
- Improved performance of A
```

### 6. Commit and Push

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: add new feature X"

# Push to your branch
git push origin feat/my-feature
```

### 7. Create Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR description
5. Create PR

**GitHub Actions will automatically:**
- ✅ Run tests
- ✅ Run linter
- ✅ Build the project
- ✅ Check package size

### 8. Merge PR

Once approved and tests pass:
1. Merge PR to master/main
2. **GitHub Actions will automatically:**
   - ✅ Check if version changed
   - ✅ Run tests
   - ✅ Build
   - ✅ Publish to npm (if version changed)
   - ✅ Create git tag
   - ✅ Create GitHub release

## Release Workflow

### Automated Release (Recommended)

**When you merge a PR with a version bump, GitHub Actions automatically publishes to npm.**

#### Steps:

1. **On your feature branch:**
   ```bash
   ./scripts/bump-version.sh minor
   # Update CHANGELOG.md
   git add .
   git commit -m "Bump version to 2.1.0"
   git push
   ```

2. **Create and merge PR**
   - GitHub Actions runs tests
   - Merge to master/main

3. **Automatic publish**
   - GitHub Actions detects version change
   - Publishes to npm
   - Creates git tag
   - Creates GitHub release

### Manual Release (Alternative)

If you prefer manual control:

```bash
# Make sure you're on master/main
git checkout master
git pull

# Use the release script
./scripts/release.sh minor

# Or use npm scripts
npm run release:minor
```

## GitHub Actions

### Workflows

#### 1. Test Workflow (`.github/workflows/test.yml`)

**Triggers:**
- Pull requests to master/main
- Pushes to feature branches

**Actions:**
- Runs tests on Node 18 and 20
- Runs linter
- Builds project
- Checks package size

#### 2. Publish Workflow (`.github/workflows/publish.yml`)

**Triggers:**
- Push to master/main (after PR merge)
- Ignores changes to docs, markdown files

**Actions:**
- Checks if version changed
- Runs tests
- Builds project
- Publishes to npm (if version changed)
- Creates git tag
- Creates GitHub release

### Setup Required

#### NPM Token

1. **Create npm token:**
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token"
   - Select "Automation" type
   - Copy the token

2. **Add to GitHub:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token
   - Click "Add secret"

#### GitHub Token

Already available as `GITHUB_TOKEN` (no setup needed)

## Quick Commands

### Development

```bash
npm run dev              # Watch mode (auto-rebuild)
npm run build            # Build once
npm test                 # Run tests
npm run lint             # Run linter
```

### Version Bumping

```bash
./scripts/bump-version.sh patch   # Bug fixes
./scripts/bump-version.sh minor   # New features
./scripts/bump-version.sh major   # Breaking changes
```

### Release (Manual)

```bash
./scripts/release.sh patch   # Bug fix release
./scripts/release.sh minor   # Feature release
./scripts/release.sh major   # Major release
```

### Package Info

```bash
npm run size             # Check package size
npm run analyze          # Detailed package analysis
npm pack                 # Create tarball for testing
```

## Commit Message Convention

Use conventional commits:

```bash
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## Branch Naming

```bash
feat/feature-name        # New features
fix/bug-name            # Bug fixes
docs/doc-name           # Documentation
refactor/refactor-name  # Refactoring
```

## Version Guidelines

### Patch (2.0.0 → 2.0.1)
- Bug fixes
- Documentation updates
- Performance improvements
- No new features

### Minor (2.0.0 → 2.1.0)
- New features
- New templates
- Backward compatible changes
- Deprecations (with warnings)

### Major (2.0.0 → 3.0.0)
- Breaking changes
- Removed features
- Changed APIs
- Major rewrites

## Example: Complete Feature Development

```bash
# 1. Create feature branch
git checkout -b feat/add-docker-support

# 2. Make changes
# ... edit files ...

# 3. Test
npm test
npm run build

# 4. Bump version (minor for new feature)
./scripts/bump-version.sh minor

# 5. Update CHANGELOG.md
# ... add changes ...

# 6. Commit
git add .
git commit -m "feat: add Docker support for all templates"

# 7. Push
git push origin feat/add-docker-support

# 8. Create PR on GitHub

# 9. After approval, merge PR

# 10. GitHub Actions automatically publishes to npm! 🎉
```

## Troubleshooting

### "Version not changed, skipping publish"

You need to bump the version:
```bash
./scripts/bump-version.sh patch
git add .
git commit -m "Bump version"
git push
```

### "NPM_TOKEN not found"

Add your npm token to GitHub secrets (see Setup Required section)

### "Tests failed"

Fix the tests before merging:
```bash
npm test
# Fix issues
git add .
git commit -m "fix: resolve test failures"
git push
```

### "Build failed"

Fix build errors:
```bash
npm run build
# Fix TypeScript errors
git add .
git commit -m "fix: resolve build errors"
git push
```

## Best Practices

1. **Always bump version before merging**
2. **Update CHANGELOG.md with every release**
3. **Test locally before pushing**
4. **Use descriptive commit messages**
5. **Keep PRs focused and small**
6. **Wait for CI to pass before merging**
7. **Review the GitHub Actions output**

## Links

- [npm package](https://www.npmjs.com/package/create-fs-app)
- [GitHub repo](https://github.com/Om-jannu/create-fs-app)
- [GitHub Actions](https://github.com/Om-jannu/create-fs-app/actions)
- [Releases](https://github.com/Om-jannu/create-fs-app/releases)
