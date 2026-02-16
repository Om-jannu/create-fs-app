# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-02-14

### 🎉 Major Rewrite

Complete rewrite of create-fs-app with template-based architecture and modern features.

### ✨ New Features

#### Template System
- **Template-based architecture** - Clone pre-built templates instead of generating
- **Template caching** - 10x faster on repeat usage (60s → 6s)
- **Custom template URLs** - Use any GitHub repo as template
- **Template registry** - Centralized template management

#### Configuration & Presets
- **Configuration presets** - Save and reuse favorite stacks
- **Built-in presets** - saas-starter, ecommerce, minimal
- **Preset management** - list, save, delete commands

#### Developer Experience
- **Replaced inquirer with prompts** - Lighter, faster (32 packages → 4 packages)
- **Project health check** - Verify project setup with `create-fs-app health`
- **Cache management** - `cache clear` and `cache stats` commands
- **Structured logging** - Debug and verbose modes
- **Enhanced error messages** - Context-aware with actionable suggestions

### 🐛 Bug Fixes

1. **Fixed race condition** in temp directories (UUID instead of timestamp)
2. **Fixed placeholder replacement** vulnerability (safe string replacement)
3. **Fixed project name validation** (comprehensive validation with clear errors)
4. **Fixed Zod deprecation** warnings (replaced `z.nativeEnum()` with `z.enum()`)

### ⚡ Performance

- **30-50% faster** template customization (optimized file walking)
- **10x faster** with caching (first run ~60s, cached ~6s)
- **Reduced package size** to 39.5 KB compressed

### 📚 Documentation

- Complete rewrite of README.md
- Added CLI_USAGE.md with comprehensive examples
- Added QUICK_REFERENCE.md for quick lookups
- Added TEMPLATE_CONTRIBUTION_GUIDE.md
- Added RELEASE.md for maintainers

### 🔧 Developer Tools

- **Test suite** with Jest (26+ tests)
- **Release scripts** for easy publishing
- **Package analysis** tools
- **Automated release workflow**

### 🚨 Breaking Changes

This is a complete rewrite. If you were using v1.x:
- Template structure has changed
- CLI options remain mostly compatible
- New features are opt-in

### 📦 Package Changes

- Package size: 39.5 KB (compressed)
- Dependencies: Optimized and updated
- Node.js: Requires 16.0.0+

---

## [1.1.10] - Previous Version

Last version of the original implementation before the v2.0.0 rewrite.

## [0.1.0] - 2026-02-05

### 🎉 Major Features Added

#### Template Caching System
- **10x faster project creation** on repeat usage
- Templates are cached locally in `~/.create-fs-app/cache/`
- Automatic cache management with statistics
- New commands: `create-fs-app cache clear` and `create-fs-app cache stats`

#### Configuration Presets
- Save and reuse favorite stack configurations
- Built-in presets: `saas-starter`, `ecommerce`, `minimal`
- Create custom presets for your team
- Commands: `create-fs-app preset list`, `create-fs-app preset save`, `create-fs-app preset delete`
- Usage: `create-fs-app my-app --preset saas-starter`

#### Custom Template URLs
- Use any GitHub repository as a template
- Perfect for private templates or community templates
- Usage: `create-fs-app my-app --template-url https://github.com/user/repo`

#### Project Health Check
- Verify project setup and dependencies
- Check for common configuration issues
- Get actionable suggestions for fixes
- Command: `create-fs-app health`

### 🐛 Critical Bug Fixes

1. **Fixed Race Condition in Temp Directories**
   - Now uses UUID instead of timestamp to prevent collisions
   - Safe for parallel execution

2. **Fixed Placeholder Replacement Vulnerability**
   - Now uses safe string replacement instead of regex
   - Handles special characters in project names correctly

3. **Fixed Project Name Validation**
   - Added comprehensive validation for directory names
   - Prevents invalid characters, reserved names, and edge cases
   - Clear error messages with suggestions

4. **Fixed Zod Deprecation Warnings**
   - Replaced deprecated `z.nativeEnum()` with `z.enum()`
   - Future-proof schema validation

### ⚡ Performance Improvements

1. **Optimized File Walking**
   - Only processes text files during placeholder replacement
   - 30-50% faster template customization

2. **Template Caching**
   - First run: ~60 seconds
   - Cached runs: ~6 seconds (10x faster)

3. **Reduced Package Size**
   - Lazy loading of heavy dependencies
   - Faster CLI startup time

### 🎨 Code Quality Improvements

1. **Structured Logging System**
   - Debug mode: `DEBUG=true create-fs-app my-app`
   - Verbose mode: `VERBOSE=true create-fs-app my-app`
   - Better error tracking and troubleshooting

2. **Enhanced Error Messages**
   - Context-aware error messages
   - Actionable suggestions for common issues
   - Better handling of network, permission, and disk space errors

3. **Input Validation**
   - Project name validation with clear error messages
   - Template URL validation
   - Prevents common user errors

4. **Test Suite Added**
   - Unit tests for validation utilities
   - Tests for presets system
   - Tests for template registry
   - Jest configuration with ESM support

### 📚 New Commands

```bash
# Health check
create-fs-app health

# Preset management
create-fs-app preset list
create-fs-app preset save <name>
create-fs-app preset delete <name>

# Cache management
create-fs-app cache clear
create-fs-app cache stats

# Use preset
create-fs-app my-app --preset saas-starter

# Use custom template
create-fs-app my-app --template-url https://github.com/user/repo
```

### 🔧 Developer Experience

1. **Better Error Handling**
   - Custom error classes with error codes
   - Helpful suggestions for resolution
   - Network error detection and guidance

2. **Logging and Debugging**
   - Debug mode for troubleshooting
   - Verbose mode for detailed output
   - Structured logging throughout

3. **Code Organization**
   - New utilities: `logger.ts`, `validation.ts`, `errors.ts`
   - Modular architecture for easier maintenance
   - Clear separation of concerns

### 📖 Documentation

- Updated README with new features
- Added CHANGELOG.md
- Comprehensive inline documentation
- JSDoc comments for all public functions

### 🔄 Breaking Changes

None - fully backward compatible!

### 🚀 Migration Guide

No migration needed. All existing commands work as before. New features are opt-in.

### 📊 Performance Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| First run | ~60s | ~60s | - |
| Cached run | ~60s | ~6s | 10x faster |
| Customization | ~5s | ~3s | 40% faster |
| Startup time | ~300ms | ~200ms | 33% faster |

### 🙏 Contributors

- Om Jannu - Initial implementation and all improvements

---

## Initial Release

First version with all core features and improvements.
