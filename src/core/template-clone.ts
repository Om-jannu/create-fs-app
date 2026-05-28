/**
 * Template Cloning and Customization
 * Handles downloading templates and customizing them for the user
 */

import { execa } from 'execa';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { ProjectConfig } from '../types/index.js';
import { getTemplate, TemplateMetadata } from './template-registry.js';
import { Logger } from '../utils/logger.js';
import {
  isTemplateCached,
  getCachedTemplatePath,
  cacheTemplate,
  copyCachedTemplate
} from './template-cache.js';

export interface CloneOptions {
  targetDir: string;
  config: ProjectConfig;
  depth?: number;
}

/**
 * Clone a template repository (with caching support)
 */
export async function cloneTemplate(
  template: TemplateMetadata,
  targetDir: string,
  branch: string = 'main',
  skipCache: boolean = false
): Promise<void> {
  const { url, subfolder, localPath } = template;

  try {
    // If it's a local template, just copy it
    if (localPath) {
      Logger.verbose(`Using local template from: ${localPath}`);

      // Check if local template exists
      try {
        await fs.access(localPath);
      } catch {
        throw new Error(`Local template not found at: ${localPath}`);
      }

      // Copy local template to target
      await fs.cp(localPath, targetDir, { recursive: true });
      return;
    }

    // Check if template is cached (skipped when --no-cache is passed)
    if (!skipCache) {
      const cachedPath = await getCachedTemplatePath(template);
      if (cachedPath) {
        Logger.verbose('Using cached template');
        await copyCachedTemplate(cachedPath, targetDir);
        return;
      }
    }

    Logger.verbose(skipCache ? 'Cache skipped, downloading fresh copy...' : 'Template not cached, downloading...');

    if (subfolder && url) {
      // Clone entire repo to temp directory, then copy specific subfolder
      // Use UUID to prevent race conditions with simultaneous runs
      const tempDir = path.join(process.cwd(), `.temp-${randomUUID()}`);

      try {
        // Clone with shallow depth for speed
        await execa('git', [
          'clone',
          '--depth',
          '1',
          '--branch',
          branch,
          '--single-branch',
          url,
          tempDir
        ]);

        // Copy the specific subfolder to target directory
        const templatePath = path.join(tempDir, subfolder);

        // Check if the subfolder exists
        try {
          await fs.access(templatePath);
        } catch {
          throw new Error(`Template subfolder "${subfolder}" not found in repository`);
        }

        // Copy the template folder contents to target
        await fs.cp(templatePath, targetDir, { recursive: true });

        // Cache the template for future use (skipped when --no-cache)
        if (!skipCache) {
          Logger.verbose('Caching template for future use...');
          await cacheTemplate(template, branch).catch(() => {
            Logger.warn('Failed to cache template, continuing anyway');
          });
        }

        // Clean up temp directory
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (error) {
        // Clean up temp directory on error
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch {}
        throw error;
      }
    } else if (url) {
      // Direct clone (for individual template repositories)
      await execa('git', [
        'clone',
        '--depth',
        '1',
        '--branch',
        branch,
        url,
        targetDir
      ]);

      // Remove .git directory to start fresh
      const gitDir = path.join(targetDir, '.git');
      await fs.rm(gitDir, { recursive: true, force: true });

      // Cache the template (skipped when --no-cache)
      if (!skipCache) {
        Logger.verbose('Caching template for future use...');
        await cacheTemplate(template, branch).catch(() => {
          Logger.warn('Failed to cache template, continuing anyway');
        });
      }
    }
  } catch (error) {
    throw new Error(`Failed to clone template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Customize the cloned template with user's configuration
 */
export async function customizeTemplate(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  // 1. Update package.json with project name + packageManager field
  await updatePackageJson(targetDir, config);

  // 2. Replace placeholders in files
  await replacePlaceholders(targetDir, config);

  // 3. Update README with project-specific info
  await updateReadme(targetDir, config);

  // 4. Handle optional features (remove if not selected)
  await handleOptionalFeatures(targetDir, config);

  // 5. Update environment variables template
  await updateEnvTemplate(targetDir, config);

  // 6. Fix workspace protocol for pnpm
  //    Templates ship with "@repo/*": "*" (npm-style).
  //    pnpm requires "workspace:*" — without it pnpm tries the npm registry → 404.
  if (config.packageManager === 'pnpm') {
    await fixWorkspaceProtocol(targetDir);
  }
}

/**
 * Detect the installed version of a package manager.
 * Returns e.g. "pnpm@9.15.0" or falls back to a safe default.
 */
async function detectPackageManagerVersion(pm: string): Promise<string> {
  try {
    const result = await execa(pm, ['--version']);
    const version = result.stdout.trim();
    return `${pm}@${version}`;
  } catch {
    // Fallback versions if detection fails
    const defaults: Record<string, string> = {
      pnpm: 'pnpm@9.0.0',
      yarn: 'yarn@1.22.22',
      npm:  'npm@10.0.0',
    };
    return defaults[pm] ?? `${pm}@latest`;
  }
}

/**
 * Update root and nested package.json files.
 * Also fixes the `packageManager` field in the root to match the user's choice.
 */
async function updatePackageJson(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  const pm = config.packageManager;
  const pmVersion = await detectPackageManagerVersion(pm);

  const packageJsonPaths = [
    path.join(targetDir, 'package.json'),
    path.join(targetDir, 'apps', 'frontend', 'package.json'),
    path.join(targetDir, 'apps', 'backend', 'package.json'),
  ];

  for (const pkgPath of packageJsonPaths) {
    try {
      const pkgContent = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(pkgContent);

      // Update name based on location
      if (pkgPath.includes('frontend')) {
        pkg.name = `${config.name}-frontend`;
      } else if (pkgPath.includes('backend')) {
        pkg.name = `${config.name}-backend`;
      } else {
        pkg.name = config.name;
        // Fix the packageManager field in root package.json only
        pkg.packageManager = pmVersion;

        // Write both formats so the project works across pnpm 9/10/11.
        // pnpm 9/10: onlyBuiltDependencies (array of names)
        // pnpm 11:   allowBuilds (object map name → true)
        if (pm === 'pnpm') {
          const allowed = buildAllowList(config);
          const allowBuildsMap = Object.fromEntries(allowed.map(n => [n, true]));
          pkg.pnpm = {
            ...(pkg.pnpm ?? {}),
            onlyBuiltDependencies: allowed,  // pnpm 9/10
            allowBuilds: allowBuildsMap,     // pnpm 11
          };
        }
      }

      // Update description
      pkg.description = `${config.name} - Full-stack application`;

      await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    } catch {
      // File might not exist, that's okay
      continue;
    }
  }

  // pnpm-workspace.yaml — workspace discovery + build-script allowlist.
  //
  // pnpm changed the config key across major versions:
  //   pnpm  9:  package.json  pnpm.onlyBuiltDependencies  (array of names)
  //   pnpm 10:  package.json  pnpm.onlyBuiltDependencies  (array of names)
  //             pnpm-workspace.yaml  onlyBuiltDependencies (array of names)
  //   pnpm 11:  pnpm-workspace.yaml  allowBuilds           (map name→true)
  //
  // We write BOTH formats so the project works on pnpm 9/10/11.
  if (pm === 'pnpm') {
    const workspaceFile = path.join(targetDir, 'pnpm-workspace.yaml');
    const allowed = buildAllowList(config);

    // pnpm 11 format: allowBuilds map (name → true)
    const allowBuildsMap = allowed.map(p => `  "${p}": true`).join('\n');
    // pnpm 9/10 format: onlyBuiltDependencies list
    const onlyBuiltList = allowed.map(p => `  - "${p}"`).join('\n');

    const content = [
      'packages:',
      '  - "apps/*"',
      '  - "packages/*"',
      '',
      '# pnpm 11+: allowBuilds map (package name → true/false)',
      'allowBuilds:',
      allowBuildsMap,
      '',
      '# pnpm 9/10: onlyBuiltDependencies list (kept for older pnpm compat)',
      'onlyBuiltDependencies:',
      onlyBuiltList,
      '',
    ].join('\n');
    await fs.writeFile(workspaceFile, content);
  }
}

/**
 * Packages that need to run postinstall/build scripts.
 * Listed in both package.json (pnpm <10) and pnpm-workspace.yaml (pnpm 10+).
 *
 * Discovery process: scaffold each template combination with --no-install,
 * run `pnpm install`, and collect ERR_PNPM_IGNORED_BUILDS output.
 *
 * Results per stack:
 *   All templates          → sharp, unrs-resolver, esbuild
 *   Prisma templates       → @prisma/engines, prisma
 *   NestJS templates       → @nestjs/core, @scarf/scarf
 *                            (@scarf/scarf is NestJS's telemetry runner)
 *   Express templates      → no additional packages
 */
function buildAllowList(config: ProjectConfig): string[] {
  const list = [
    'sharp',          // Next.js image optimisation (all templates)
    'unrs-resolver',  // Rust-based module resolver (all templates)
    'esbuild',        // Build tool used across the stack (all templates)
  ];

  if (config.apps.backend.orm === 'prisma') {
    list.push('@prisma/engines', 'prisma');
  }

  if (config.apps.backend.framework === 'nest.js') {
    list.push('@nestjs/core', '@scarf/scarf');
  }

  return list;
}

/**
 * Replace placeholder variables in all files
 * Placeholders: {{PROJECT_NAME}}, {{FRONTEND_FRAMEWORK}}, etc.
 */
async function replacePlaceholders(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  const placeholders: Record<string, string> = {
    '{{PROJECT_NAME}}': config.name,
    '{{FRONTEND_FRAMEWORK}}': config.apps.frontend.framework,
    '{{BACKEND_FRAMEWORK}}': config.apps.backend.framework,
    '{{DATABASE}}': config.apps.backend.database,
    '{{ORM}}': config.apps.backend.orm || 'none',
    '{{PACKAGE_MANAGER}}': config.packageManager,
    '{{MONOREPO_FRAMEWORK}}': config.monorepo,
    // Scoped package names use 'my-app' as safe placeholder ({{}} invalid in npm names)
    '@my-app/': `@${config.name}/`,
    '"name": "my-app"': `"name": "${config.name}"`,
  };

  // Only process text files with these extensions for performance
  const TEXT_EXTENSIONS = ['.md', '.json', '.ts', '.tsx', '.js', '.jsx', '.env', '.example', '.yml', '.yaml'];

  async function processFile(filePath: string): Promise<void> {
    try {
      // Skip non-text files for performance
      const hasTextExtension = TEXT_EXTENSIONS.some(ext => filePath.endsWith(ext));
      if (!hasTextExtension) return;

      let content = await fs.readFile(filePath, 'utf-8');
      let modified = false;

      // Use simple string replacement instead of regex to avoid issues with special characters
      for (const [placeholder, value] of Object.entries(placeholders)) {
        if (content.includes(placeholder)) {
          content = content.split(placeholder).join(value);
          modified = true;
        }
      }

      if (modified) {
        await fs.writeFile(filePath, content);
      }
    } catch (error) {
      // Skip files that can't be read as text
    }
  }

  async function walkDir(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip node_modules and .git
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
        continue;
      }

      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else if (entry.isFile()) {
        await processFile(fullPath);
      }
    }
  }

  await walkDir(targetDir);
}

/**
 * Update README with project-specific information
 */
async function updateReadme(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  const readmePath = path.join(targetDir, 'README.md');

  try {
    let readme = await fs.readFile(readmePath, 'utf-8');

    // Add project name as title if not already there
    if (!readme.startsWith(`# ${config.name}`)) {
      const techStack = `
## Tech Stack

| Layer           | Choice |
|-----------------|--------|
| Monorepo        | ${config.monorepo} |
| Frontend        | ${config.apps.frontend.framework} |
| Styling         | ${config.apps.frontend.styling} |
| Backend         | ${config.apps.backend.framework} |
| Database        | ${config.apps.backend.database} |
| ORM             | ${config.apps.backend.orm || 'none'} |
| API style       | ${config.apps.backend.apiStyle} |
| Auth            | ${config.apps.backend.auth} |
| Package manager | ${config.packageManager} |
| ESLint          | ${config.apps.frontend.eslint ? '✓' : '✗'} |
| Prettier        | ${config.apps.frontend.prettier ? '✓' : '✗'} |
| Turbopack       | ${config.apps.frontend.turbopack ? '✓' : '✗'} |
| Docker          | ${config.apps.backend.docker ? '✓' : '✗'} |
| GitHub Actions  | ${config.ci ? '✓' : '✗'} |

`;
      readme = `# ${config.name}\n\n${techStack}${readme}`;
    }

    await fs.writeFile(readmePath, readme);
  } catch (error) {
    // README might not exist
  }
}

/**
 * Handle optional features - remove config for unselected features,
 * patch files for enabled ones (Turbopack, CI, JWT auth).
 */
async function handleOptionalFeatures(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  // ── Docker ────────────────────────────────────────────────────────────────
  if (!config.apps.backend.docker) {
    const dockerFiles = [
      path.join(targetDir, 'Dockerfile'),
      path.join(targetDir, 'docker-compose.yml'),
      path.join(targetDir, '.dockerignore'),
      path.join(targetDir, 'apps', 'backend', 'Dockerfile'),
      path.join(targetDir, 'apps', 'frontend', 'Dockerfile'),
    ];
    for (const file of dockerFiles) {
      try { await fs.unlink(file); } catch { /* ok */ }
    }
  }

  // ── ESLint ────────────────────────────────────────────────────────────────
  if (!config.apps.frontend.eslint) {
    const eslintFiles = [
      path.join(targetDir, 'eslint.config.mjs'),
      path.join(targetDir, '.eslintrc.json'),
      path.join(targetDir, '.eslintrc.js'),
      path.join(targetDir, 'apps', 'frontend', 'eslint.config.mjs'),
      path.join(targetDir, 'apps', 'frontend', '.eslintrc.json'),
      path.join(targetDir, 'apps', 'backend', 'eslint.config.mjs'),
      path.join(targetDir, 'apps', 'backend', '.eslintrc.json'),
    ];
    for (const file of eslintFiles) {
      try { await fs.unlink(file); } catch { /* ok */ }
    }
  }

  // ── Prettier ──────────────────────────────────────────────────────────────
  if (!config.apps.frontend.prettier) {
    const prettierFiles = [
      path.join(targetDir, '.prettierrc'),
      path.join(targetDir, '.prettierrc.json'),
      path.join(targetDir, '.prettierignore'),
      path.join(targetDir, 'apps', 'frontend', '.prettierrc'),
      path.join(targetDir, 'apps', 'backend', '.prettierrc'),
    ];
    for (const file of prettierFiles) {
      try { await fs.unlink(file); } catch { /* ok */ }
    }
  }

  // ── Turbopack (Next.js) ───────────────────────────────────────────────────
  if (config.apps.frontend.turbopack && config.apps.frontend.framework === 'next.js') {
    const frontendPkgPath = path.join(targetDir, 'apps', 'frontend', 'package.json');
    try {
      const raw = await fs.readFile(frontendPkgPath, 'utf-8');
      const pkg = JSON.parse(raw);
      if (pkg.scripts?.dev && !pkg.scripts.dev.includes('--turbopack')) {
        pkg.scripts.dev = pkg.scripts.dev.replace('next dev', 'next dev --turbopack');
        await fs.writeFile(frontendPkgPath, JSON.stringify(pkg, null, 2) + '\n');
      }
    } catch { /* package.json missing — skip */ }
  }

  // ── GitHub Actions CI ─────────────────────────────────────────────────────
  if (config.ci) {
    await generateCiWorkflow(targetDir, config);
  }

  // ── JWT auth scaffolding ──────────────────────────────────────────────────
  if (config.apps.backend.auth === 'jwt') {
    await generateJwtAuth(targetDir, config);
  }
}

// ─── CI workflow generator ────────────────────────────────────────────────────

async function generateCiWorkflow(targetDir: string, config: ProjectConfig): Promise<void> {
  const workflowDir = path.join(targetDir, '.github', 'workflows');
  await fs.mkdir(workflowDir, { recursive: true });

  const pm = config.packageManager;
  const installCmd = pm === 'npm' ? 'npm ci' : pm === 'yarn' ? 'yarn install --frozen-lockfile' : 'pnpm install --frozen-lockfile';
  const lintCmd   = `${pm} run lint`;
  const buildCmd  = `${pm} run build`;

  const workflow = `name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: '${pm}'

      - name: Install dependencies
        run: ${installCmd}
${config.apps.frontend.eslint ? `
      - name: Lint
        run: ${lintCmd}
` : ''}
      - name: Build
        run: ${buildCmd}
`;

  await fs.writeFile(path.join(workflowDir, 'ci.yml'), workflow);
}

// ─── JWT auth scaffolding ─────────────────────────────────────────────────────

async function generateJwtAuth(targetDir: string, config: ProjectConfig): Promise<void> {
  const framework = config.apps.backend.framework;

  if (framework === 'nest.js') {
    await generateNestJwtAuth(targetDir);
  } else {
    // Express / Fastify / Koa — generic middleware approach
    await generateGenericJwtAuth(targetDir, framework);
  }
}

async function generateNestJwtAuth(targetDir: string): Promise<void> {
  const authDir = path.join(targetDir, 'apps', 'backend', 'src', 'auth');
  await fs.mkdir(authDir, { recursive: true });

  // auth.module.ts
  await fs.writeFile(path.join(authDir, 'auth.module.ts'), `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change-me',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
`);

  // auth.service.ts
  await fs.writeFile(path.join(authDir, 'auth.service.ts'), `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(userId: string, email: string): Promise<{ access_token: string }> {
    const payload: JwtPayload = { sub: userId, email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
`);

  // jwt.strategy.ts
  await fs.writeFile(path.join(authDir, 'jwt.strategy.ts'), `import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change-me',
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
`);

  // jwt-auth.guard.ts
  await fs.writeFile(path.join(authDir, 'jwt-auth.guard.ts'), `import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
`);

  // auth.controller.ts (login endpoint stub)
  await fs.writeFile(path.join(authDir, 'auth.controller.ts'), `import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/login — returns a signed JWT */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and receive a JWT' })
  async login(@Body() dto: LoginDto) {
    // TODO: validate credentials against DB, then:
    // return this.authService.login(user.id, user.email);
    return this.authService.login('placeholder-id', dto.email);
  }
}
`);

  // Append JWT_SECRET to .env.example if present
  const envExample = path.join(targetDir, 'apps', 'backend', '.env.example');
  try {
    let env = await fs.readFile(envExample, 'utf-8');
    if (!env.includes('JWT_SECRET')) {
      env += '\n# JWT\nJWT_SECRET=change-me-in-production\n';
      await fs.writeFile(envExample, env);
    }
  } catch { /* file missing — skip */ }
}

async function generateGenericJwtAuth(targetDir: string, framework: string): Promise<void> {
  const middlewareDir = path.join(targetDir, 'apps', 'backend', 'src', 'middleware');
  await fs.mkdir(middlewareDir, { recursive: true });

  await fs.writeFile(path.join(middlewareDir, 'jwt.middleware.ts'), `/**
 * Generic JWT middleware — works with Express, Fastify, Koa.
 * Install:  npm i jsonwebtoken @types/jsonwebtoken
 */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

/** Sign a payload — call after validating credentials */
export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/** Verify a token — throws if invalid or expired */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

/** Express/Koa-style auth middleware */
export function requireAuth(req: any, res: any, next: any) {
  const header = req.headers?.authorization ?? '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
`);

  // Append JWT_SECRET to .env.example if present
  const envExample = path.join(targetDir, 'apps', 'backend', '.env.example');
  try {
    let env = await fs.readFile(envExample, 'utf-8');
    if (!env.includes('JWT_SECRET')) {
      env += '\n# JWT\nJWT_SECRET=change-me-in-production\n';
      await fs.writeFile(envExample, env);
    }
  } catch { /* file missing — skip */ }
}

/**
 * Rewrite "@repo/*": "*" → "@repo/*": "workspace:*" in every package.json.
 *
 * Templates ship with npm-style "*" for local workspace packages.
 * pnpm requires the explicit "workspace:*" protocol — without it pnpm treats
 * the dependency as an npm package and fails with a 404.
 */
async function fixWorkspaceProtocol(targetDir: string): Promise<void> {
  async function walkDir(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else if (entry.name === 'package.json') {
        try {
          const raw = await fs.readFile(fullPath, 'utf-8');
          const pkg = JSON.parse(raw);
          let changed = false;

          for (const depField of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
            const deps = pkg[depField] as Record<string, string> | undefined;
            if (!deps) continue;
            for (const [name, version] of Object.entries(deps)) {
              if (name.startsWith('@repo/') && version === '*') {
                deps[name] = 'workspace:*';
                changed = true;
              }
            }
          }

          if (changed) {
            await fs.writeFile(fullPath, JSON.stringify(pkg, null, 2) + '\n');
          }
        } catch {
          // skip unreadable files
        }
      }
    }
  }
  await walkDir(targetDir);
}

/**
 * Update environment variables template
 */
async function updateEnvTemplate(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  const envExamplePath = path.join(targetDir, 'apps', 'backend', '.env.example');

  try {
    let envContent = await fs.readFile(envExamplePath, 'utf-8');

    // Update database URL based on selected database
    const dbUrls: Record<string, string> = {
      postgresql: 'postgresql://user:password@localhost:5432/{{PROJECT_NAME}}',
      mysql: 'mysql://user:password@localhost:3306/{{PROJECT_NAME}}',
      mongodb: 'mongodb://localhost:27017/{{PROJECT_NAME}}',
      sqlite: 'file:./dev.db',
    };

    const dbUrl = dbUrls[config.apps.backend.database] || '';
    envContent = envContent.replace(/DATABASE_URL=.*/g, `DATABASE_URL="${dbUrl}"`);
    envContent = envContent.replace(/{{PROJECT_NAME}}/g, config.name);

    await fs.writeFile(envExamplePath, envContent);
  } catch (error) {
    // .env.example might not exist
  }
}

/**
 * Initialize git repository
 */
export async function initializeGit(targetDir: string, config: ProjectConfig): Promise<void> {
  try {
    process.chdir(targetDir);
    
    await execa('git', ['init']);
    await execa('git', ['add', '.']);
    await execa('git', ['commit', '-m', `Initial commit: ${config.name}`]);
    
    console.log('✓ Initialized git repository');
  } catch (error) {
    console.warn('Warning: Git initialization failed');
  }
}

/**
 * Install dependencies
 */
export async function installDependencies(
  targetDir: string,
  packageManager: string
): Promise<void> {
  try {
    process.chdir(targetDir);
    
    console.log(`Installing dependencies with ${packageManager}...`);
    
    await execa(packageManager, ['install'], {
      stdio: 'inherit',
    });
    
    console.log('✓ Dependencies installed');
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

