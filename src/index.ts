#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
import ora from 'ora';
import boxen from 'boxen';
import updateNotifier from 'update-notifier';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  ProjectConfig,
  ProjectConfigSchema,
  MonorepoFramework,
  FrontendFramework,
  BackendFramework,
  Database,
  PackageManager,
  ApiStyle,
  AuthStrategy,
} from './types/index.js';
import { scaffoldProject, validateProjectDirectory, checkTemplateAvailability, TemplateNotFoundError } from './core/scaffold.js';
import {
  displayAvailableTemplates,
  getContributedByName,
  getContributedByUUID,
  getOfficialByName,
  ListOptions,
} from './core/template-list.js';
import { assertValidProjectName, isValidUUID } from './utils/validation.js';
import { Logger } from './utils/logger.js';
import { formatError } from './utils/errors.js';
import {
  savePreset,
  loadPreset,
  listPresets,
  deletePreset,
  getBuiltinPreset,
  isBuiltinPresetName,
  userPresetExists,
  BUILTIN_PRESETS,
} from './core/presets.js';
import { runHealthCheck, displayHealthCheckResults } from './core/health-check.js';
import { clearCache, getCacheStats } from './core/template-cache.js';
import { createCustomTemplate } from './core/template-registry.js';
import { getRemoteRegistry, clearRegistryCache } from './core/registry-fetch.js';
import { setActiveRegistry } from './core/template-registry.js';
import { parseTemplateUrl } from './utils/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for updates
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
updateNotifier({ pkg }).notify();

const sleep = (ms: number = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcome() {
  // Add spacing to separate from previous commands without clearing history
  console.log('\n'.repeat(2));
  
  // ASCII art title with filled/solid characters
  const title = figlet.textSync('create-fs-app', {
    font: 'ANSI Shadow',
    horizontalLayout: 'fitted'
  });
  
  console.log(gradient.pastel.multiline(title));
  console.log();
  
  // Welcome box
  const welcomeMsg = boxen(
    chalk.white.bold('Create production-ready full-stack applications\n') +
    chalk.gray('Template-based • Fast • Customizable\n\n') +
    chalk.cyan('✓ TypeScript only (no JavaScript projects)\n') +
    chalk.cyan('✓ Multiple monorepo frameworks\n') +
    chalk.cyan('✓ Customizable frontend & backend\n') +
    chalk.cyan('✓ Database & ORM selection\n') +
    chalk.cyan('✓ Docker & Testing setup'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      title: chalk.bold.cyan(`v${pkg.version}`),
      titleAlignment: 'center'
    }
  );
  
  console.log(welcomeMsg);
  console.log();
}

/**
 * Build configuration from CLI options
 */
/**
 * Case-insensitive enum validator — shared by buildConfigFromOptions and --yes/--template paths.
 */
function validateEnum(value: string, enumObj: any, fieldName: string): any {
  const validValues = Object.values(enumObj);
  const found = validValues.find((v: any) => v.toLowerCase() === value.toLowerCase());
  if (!found) {
    console.log(chalk.red(`\n❌ Invalid ${fieldName}: "${value}"\n`));
    console.log(chalk.cyan(`Valid options: ${validValues.join(', ')}\n`));
    process.exit(1);
  }
  return found;
}

function buildConfigFromOptions(name: string | undefined, options: any): ProjectConfig {
  // Validate required fields
  if (!name) {
    Logger.error('Project name is required.');
    console.log(chalk.cyan('Usage: create-fs-app <project-name> [options]\n'));
    process.exit(1);
  }

  // Validate project name
  assertValidProjectName(name);

  if (!options.monorepo || !options.frontend || !options.backend || !options.database) {
    Logger.error('When using CLI options, you must provide:');
    console.log(chalk.yellow('  --monorepo <framework>'));
    console.log(chalk.yellow('  --frontend <framework>'));
    console.log(chalk.yellow('  --backend <framework>'));
    console.log(chalk.yellow('  --database <db>\n'));
    console.log(chalk.cyan('💡 Or run without options for interactive mode.\n'));
    process.exit(1);
  }

  const frontendFramework = validateEnum(options.frontend, FrontendFramework, 'frontend framework');

  const config = {
    name,
    monorepo: validateEnum(options.monorepo, MonorepoFramework, 'monorepo framework'),
    packageManager: options.packageManager
      ? validateEnum(options.packageManager, PackageManager, 'package manager')
      : PackageManager.NPM,
    ci: options.ci === true,
    apps: {
      frontend: {
        framework: frontendFramework,
        styling: options.styling || 'tailwind',
        eslint: options.eslint !== false,      // default true
        prettier: options.prettier !== false,  // default true
        // Turbopack only valid for Next.js
        turbopack: frontendFramework === 'next.js' && options.turbopack === true,
      },
      backend: {
        framework: validateEnum(options.backend, BackendFramework, 'backend framework'),
        database: validateEnum(options.database, Database, 'database'),
        orm: options.orm as any,
        apiStyle: options.apiStyle
          ? validateEnum(options.apiStyle, ApiStyle, 'API style')
          : ApiStyle.REST,
        auth: options.auth
          ? validateEnum(options.auth, AuthStrategy, 'auth strategy')
          : AuthStrategy.None,
        docker: options.docker !== false,  // default true
      }
    }
  };

  // Validate the config with Zod
  try {
    return ProjectConfigSchema.parse(config);
  } catch (error) {
    Logger.error('Invalid configuration: ' + (error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

async function promptForConfiguration(projectName?: string): Promise<ProjectConfig> {
  const onCancel = () => {
    console.log(chalk.yellow('\n\nOperation cancelled by user'));
    process.exit(0);
  };

  // ── Step 1: Project name ────────────────────────────────────────────────
  let name = projectName;
  if (!name) {
    const { projectName: n } = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-fs-app',
      validate: (v: string) => v.trim().length > 0 || 'Name required'
    }, { onCancel });
    name = n;
  }

  // ── Step 2: Monorepo + package manager ─────────────────────────────────
  const { monorepo, packageManager } = await prompts([
    {
      type: 'select',
      name: 'monorepo',
      message: 'Monorepo tool:',
      choices: [
        { title: 'Turborepo  — fast build caching, simple config', value: 'turborepo' },
        { title: 'Nx         — powerful task graph, generators',   value: 'nx'        },
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'packageManager',
      message: 'Package manager:',
      choices: [
        { title: 'npm',  value: 'npm'  },
        { title: 'pnpm — faster installs, disk efficient', value: 'pnpm' },
        { title: 'yarn', value: 'yarn' },
      ],
      initial: 0
    },
  ], { onCancel });

  // ── Step 3: Frontend ────────────────────────────────────────────────────
  const { frontendFramework, styling } = await prompts([
    {
      type: 'select',
      name: 'frontendFramework',
      message: 'Frontend framework:',
      choices: [
        { title: 'Next.js  — App Router, SSR, RSC', value: 'next.js' },
        { title: 'React    — Vite, SPA/CSR',        value: 'react'   },
        { title: 'Vue      — Vite, Options/Composition API', value: 'vue' },
        { title: 'Nuxt     — SSR for Vue',           value: 'nuxt'   },
        { title: 'Angular  — full framework',        value: 'angular' },
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'styling',
      message: 'Styling solution:',
      choices: [
        { title: 'Tailwind CSS        — utility-first',  value: 'tailwind'          },
        { title: 'CSS                 — plain stylesheets', value: 'css'            },
        { title: 'SCSS/Sass           — CSS with superpowers', value: 'scss'        },
        { title: 'Styled Components   — CSS-in-JS',      value: 'styled-components' },
      ],
      initial: 0
    },
  ], { onCancel });

  // Turbopack — only relevant for Next.js
  let turbopack = false;
  if (frontendFramework === 'next.js') {
    const { tp } = await prompts({
      type: 'confirm',
      name: 'tp',
      message: 'Enable Turbopack? (faster dev server for Next.js)',
      initial: true
    }, { onCancel });
    turbopack = tp;
  }

  // ── Step 4: Code quality ────────────────────────────────────────────────
  const { eslint, prettier } = await prompts([
    {
      type: 'confirm',
      name: 'eslint',
      message: 'Add ESLint?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'prettier',
      message: 'Add Prettier?',
      initial: true
    },
  ], { onCancel });

  // ── Step 5: Backend ─────────────────────────────────────────────────────
  const { backendFramework, database, orm } = await prompts([
    {
      type: 'select',
      name: 'backendFramework',
      message: 'Backend framework:',
      choices: [
        { title: 'NestJS      — TypeScript-first, modular, decorators', value: 'nest.js'    },
        { title: 'Express     — minimal, flexible, battle-tested',       value: 'express'    },
        { title: 'Fastify     — high performance, schema validation',    value: 'fastify-ts' },
        { title: 'Koa         — lightweight, async middleware',          value: 'koa'        },
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'database',
      message: 'Database:',
      choices: [
        { title: 'PostgreSQL  — relational, ACID, powerful',   value: 'postgresql' },
        { title: 'MongoDB     — document, flexible schema',     value: 'mongodb'    },
        { title: 'MySQL       — relational, widely supported',  value: 'mysql'      },
        { title: 'SQLite      — file-based, zero setup',        value: 'sqlite'     },
      ],
      initial: 0
    },
    {
      type: 'select',
      name: 'orm',
      message: 'ORM / ODM:',
      choices: [
        { title: 'Prisma     — type-safe, migrations, Studio',  value: 'prisma'   },
        { title: 'TypeORM    — decorators, ActiveRecord/DataMapper', value: 'typeorm' },
        { title: 'Mongoose   — MongoDB ODM, schemas',           value: 'mongoose' },
        { title: 'Drizzle    — lightweight, SQL-like',          value: 'drizzle'  },
      ],
      initial: 0
    },
  ], { onCancel });

  // ── Step 6: API style ───────────────────────────────────────────────────
  const { apiStyle } = await prompts({
    type: 'select',
    name: 'apiStyle',
    message: 'API style:',
    choices: [
      { title: 'REST        — standard HTTP endpoints (recommended)', value: 'rest'    },
      { title: 'GraphQL     — flexible queries with Apollo/Mercurius', value: 'graphql' },
      { title: 'Both        — REST + GraphQL side by side',           value: 'both'    },
    ],
    initial: 0
  }, { onCancel });

  // ── Step 7: Auth ────────────────────────────────────────────────────────
  const { auth } = await prompts({
    type: 'select',
    name: 'auth',
    message: 'Authentication scaffolding:',
    choices: [
      { title: 'None — skip auth, add manually later',  value: 'none' },
      { title: 'JWT  — login/register endpoints + guards/middleware', value: 'jwt' },
    ],
    initial: 0
  }, { onCancel });

  // ── Step 8: Docker + CI ────────────────────────────────────────────────
  const { docker, ci } = await prompts([
    {
      type: 'confirm',
      name: 'docker',
      message: 'Include Docker / Docker Compose?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'ci',
      message: 'Add GitHub Actions CI? (lint → build on push/PR)',
      initial: false
    },
  ], { onCancel });

  // ── Build + validate config ─────────────────────────────────────────────
  const config = {
    name: name!,
    monorepo,
    packageManager,
    ci,
    apps: {
      frontend: {
        framework: frontendFramework,
        styling,
        eslint,
        prettier,
        turbopack,
      },
      backend: {
        framework: backendFramework,
        database,
        orm,
        apiStyle,
        auth,
        docker,
      }
    }
  };

  return ProjectConfigSchema.parse(config);
}

async function main() {
  // ── Hydrate registry from GitHub (non-blocking, 5 s timeout) ────────────
  // Silently falls back to the hardcoded registry on any failure so the CLI
  // always works offline.  New templates published to the templates repo are
  // picked up automatically without a CLI release.
  // Store promise so list/info commands can await it (max 3 s)
  const registryReady = getRemoteRegistry()
    .then((remote) => { if (remote) setActiveRegistry(remote); })
    .catch(() => { /* hardcoded fallback stays active */ });

  const program = new Command();

  program
    .name('create-fs-app')
    .description('Create a full-stack monorepo application')
    .version(pkg.version as string);

  // Main create command
  program
    .argument('[name]', 'The name of your application')
    .option('-t, --template <name>', 'Use a predefined template')
    .option('--template-url <url>', 'Use a custom template from GitHub URL')
    .option('--preset <name>', 'Use a configuration preset')
    .option('--monorepo <framework>', 'Monorepo framework (turborepo, nx)')
    .option('--frontend <framework>', 'Frontend framework (react, next.js, vue, nuxt, angular)')
    .option('--backend <framework>', 'Backend framework (express, nest.js, fastify-ts, koa)')
    .option('--database <db>', 'Database (postgresql, mongodb, mysql, sqlite)')
    .option('--orm <orm>', 'ORM (prisma, typeorm, mongoose, drizzle)')
    .option('--package-manager <pm>', 'Package manager (npm, yarn, pnpm)')
    .option('--styling <style>', 'Styling solution (css, scss, tailwind, styled-components)')
    .option('--eslint', 'Enable ESLint (default: true)')
    .option('--no-eslint', 'Disable ESLint')
    .option('--prettier', 'Enable Prettier (default: true)')
    .option('--no-prettier', 'Disable Prettier')
    .option('--turbopack', 'Enable Turbopack dev server (Next.js only)')
    .option('--api-style <style>', 'API style: rest | graphql | both (default: rest)')
    .option('--auth <strategy>', 'Auth scaffolding: none | jwt (default: none)')
    .option('--docker', 'Include Docker / Docker Compose (default: true)')
    .option('--no-docker', 'Skip Docker configuration')
    .option('--ci', 'Add GitHub Actions CI workflow')
    .option('--no-ci', 'Skip GitHub Actions CI')
    .option('--no-git', 'Skip git initialization')
    .option('--no-install', 'Skip package installation')
    .option('--no-cache', 'Skip template caching')
    .option('--local-templates <path>', 'Use local templates repo instead of GitHub (for development)')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .action(async (name: string | undefined, options) => {
      await welcome();

      try {
        let projectConfig: ProjectConfig;
        let customTemplate: import('./core/template-registry.js').TemplateMetadata | null = null;
        // When true the availability check against the registry is skipped (custom URL supplies its own template)
        let skipAvailabilityCheck = false;

        // Check if using preset
        if (options.preset) {
          if (!name) {
            Logger.error('Project name is required when using --preset.');
            console.log(chalk.cyan('Usage: create-fs-app <project-name> --preset <preset-name>\n'));
            process.exit(1);
          }
          
          // Try built-in preset first
          let preset = getBuiltinPreset(options.preset);
          
          // If not built-in, try user preset
          if (!preset) {
            preset = await loadPreset(options.preset);
          }
          
          if (!preset) {
            Logger.error(`Preset "${options.preset}" not found`);
            console.log(chalk.cyan('\n💡 Use ') + chalk.white.bold('create-fs-app preset list') + chalk.cyan(' to see available presets.\n'));
            process.exit(1);
          }
          
          projectConfig = {
            name,
            ...preset.config
          } as ProjectConfig;
          
          console.log();
          const infoBox = boxen(
            chalk.cyan.bold('🎯 Using Preset\n\n') +
            chalk.white(`Preset: `) + chalk.green(preset.name) + '\n' +
            (preset.description ? chalk.white(`Description: `) + chalk.gray(preset.description) : ''),
            {
              padding: 1,
              margin: 1,
              borderStyle: 'round',
              borderColor: 'cyan'
            }
          );
          console.log(infoBox);
        }
        // Check if using custom template URL
        else if (options.templateUrl) {
          if (!name) {
            Logger.error('Project name is required when using --template-url.');
            console.log(chalk.cyan('Usage: create-fs-app <project-name> --template-url <url>\n'));
            process.exit(1);
          }

          // Parse URL — extracts repoUrl, branch, and optional subfolder
          const parsed = parseTemplateUrl(options.templateUrl);
          if (!parsed.valid) {
            Logger.error(parsed.error!);
            process.exit(1);
          }

          const { repoUrl, branch, subfolder } = parsed.parsed!;

          // Build the TemplateMetadata directly from the parsed URL
          customTemplate = createCustomTemplate(repoUrl, branch, subfolder);

          // Minimal projectConfig — only name and pm matter here; the registry is not used
          projectConfig = {
            name,
            monorepo: 'turborepo' as any,
            packageManager: options.packageManager
              ? validateEnum(options.packageManager, PackageManager, 'package manager')
              : PackageManager.NPM,
            ci: options.ci === true,
            apps: {
              frontend: {
                framework: 'react' as any,
                styling: 'tailwind',
                eslint: true,
                prettier: true,
                turbopack: false,
              },
              backend: {
                framework: 'express' as any,
                database: 'postgresql' as any,
                apiStyle: 'rest' as any,
                auth: 'none' as any,
                docker: options.docker !== false,
              }
            }
          };

          // Custom template bypasses the registry — skip availability check
          skipAvailabilityCheck = true;

          console.log();
          const infoBox = boxen(
            chalk.cyan.bold('🔗 Using Custom Template\n\n') +
            chalk.white('Repo:   ') + chalk.green(repoUrl) + '\n' +
            chalk.white('Branch: ') + chalk.green(branch) +
            (subfolder ? '\n' + chalk.white('Folder: ') + chalk.green(subfolder) : ''),
            {
              padding: 1,
              margin: 1,
              borderStyle: 'round',
              borderColor: 'cyan'
            }
          );
          console.log(infoBox);
        }
        // --template: contributed templates only (UUID-only mode)
        else if (options.template) {
          // --template only accepts UUID v4
          if (!isValidUUID(options.template)) {
            console.log(boxen(
              chalk.red.bold('❌ Invalid --template value\n\n') +
              chalk.white('--template only accepts a UUID v4 (the unique ID of a contributed template).\n\n') +
              chalk.gray('Find the UUID with:\n') +
              chalk.cyan('  create-fs-app list --contributed\n\n') +
              chalk.gray('Then use it:\n') +
              chalk.cyan(`  create-fs-app my-app --template <uuid>`),
              { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'red' }
            ));
            process.exit(1);
          }

          // Find in contributed registry only
          const match = getContributedByUUID(options.template);

          if (!match) {
            console.log(boxen(
              chalk.red.bold('❌ Contributed Template Not Found\n\n') +
              chalk.white(`No contributed template has UUID "${options.template}".\n\n`) +
              chalk.cyan('💡 Browse contributed templates and copy a UUID:\n') +
              chalk.cyan('   create-fs-app list --contributed'),
              { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'red' }
            ));
            process.exit(1);
          }

          if (!name) {
            console.log(chalk.red('\n❌ Project name is required when using --template.\n'));
            console.log(chalk.cyan('Usage: create-fs-app <project-name> --template <uuid>\n'));
            process.exit(1);
          }

          // Extract stack config from the base 5 segments of the key
          const FRAMEWORK_MAP: Record<string, string> = {
            nextjs:    'next.js',
            nestjs:    'nest.js',
            fastifyts: 'fastify-ts',
            react:     'react',
            express:   'express',
            koa:       'koa',
          };
          const parts = match.key.split('-');
          const tplFrontend = (FRAMEWORK_MAP[parts[1]] ?? parts[1]) as any;
          const tplBackend  = (FRAMEWORK_MAP[parts[2]] ?? parts[2]) as any;

          projectConfig = {
            name,
            monorepo: parts[0] as any,
            packageManager: options.packageManager
              ? validateEnum(options.packageManager, PackageManager, 'package manager')
              : PackageManager.NPM,
            ci: options.ci === true,
            apps: {
              frontend: {
                framework: tplFrontend,
                styling: 'tailwind',
                eslint: true,
                prettier: true,
                turbopack: false,
              },
              backend: {
                framework: tplBackend,
                database: parts[3] as any,
                orm: parts[4] as any,
                apiStyle: 'rest' as any,
                auth: 'none' as any,
                docker: true,
              }
            }
          };

          customTemplate = match.metadata;
          skipAvailabilityCheck = true;

          const contrib = match.metadata.contributor;
          console.log();
          console.log(boxen(
            chalk.yellow.bold('◆ Using Contributed Template\n\n') +
            chalk.white('Template:    ') + chalk.yellow(match.key) + '\n' +
            chalk.white('UUID:        ') + chalk.dim(match.metadata.id ?? options.template) + '\n' +
            (contrib
              ? chalk.white('By:          ') + chalk.cyan(`@${contrib.github}`) + chalk.dim(`  ${contrib.url}`) + '\n' +
                chalk.white('Repo:        ') + chalk.dim(contrib.repoUrl) + '\n'
              : '') +
            chalk.white('Description: ') + chalk.gray(match.metadata.description),
            { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'yellow' }
          ));
        }
        // --yes: fill missing flags with saas-starter defaults, skip all prompts
        else if (options.yes) {
          if (!name) {
            Logger.error('Project name is required when using --yes.');
            console.log(chalk.cyan('Usage: create-fs-app <project-name> [options] --yes\n'));
            process.exit(1);
          }

          // Merge any explicit flags with defaults — explicit always wins
          const withDefaults = {
            ...options,
            monorepo:  options.monorepo  ?? 'turborepo',
            frontend:  options.frontend  ?? 'next.js',
            backend:   options.backend   ?? 'nest.js',
            database:  options.database  ?? 'postgresql',
            orm:       options.orm       ?? 'prisma',
          };

          projectConfig = buildConfigFromOptions(name, withDefaults);

          // Show resolved configuration
          console.log(chalk.cyan('\n⚡ Using defaults (--yes)\n'));
          console.log(chalk.gray('  Project:'),     chalk.white(projectConfig.name));
          console.log(chalk.gray('  Monorepo:'),    chalk.white(projectConfig.monorepo));
          console.log(chalk.gray('  Pkg manager:'), chalk.white(projectConfig.packageManager));
          console.log(chalk.gray('  Frontend:'),    chalk.white(projectConfig.apps.frontend.framework));
          console.log(chalk.gray('  Styling:'),     chalk.white(projectConfig.apps.frontend.styling));
          console.log(chalk.gray('  Backend:'),     chalk.white(projectConfig.apps.backend.framework));
          console.log(chalk.gray('  Database:'),    chalk.white(projectConfig.apps.backend.database));
          console.log(chalk.gray('  ORM:'),         chalk.white(projectConfig.apps.backend.orm ?? 'none'));
          console.log(chalk.gray('  Docker:'),      chalk.white(projectConfig.apps.backend.docker ? 'yes' : 'no'));
          console.log(chalk.gray('  CI:'),          chalk.white(projectConfig.ci ? 'yes' : 'no'));
          console.log();
        }

        // Check if stack options provided via CLI
        else if (options.monorepo || options.frontend || options.backend) {
          projectConfig = buildConfigFromOptions(name, options);

          // Show detected configuration
          console.log(chalk.cyan('\n📋 Configuration from CLI options:\n'));
          console.log(chalk.gray('  Project:'),        chalk.white(projectConfig.name));
          console.log(chalk.gray('  Monorepo:'),       chalk.white(projectConfig.monorepo));
          console.log(chalk.gray('  Pkg manager:'),    chalk.white(projectConfig.packageManager));
          console.log(chalk.gray('  Frontend:'),       chalk.white(projectConfig.apps.frontend.framework));
          console.log(chalk.gray('  Styling:'),        chalk.white(projectConfig.apps.frontend.styling));
          console.log(chalk.gray('  ESLint:'),         chalk.white(projectConfig.apps.frontend.eslint ? 'yes' : 'no'));
          console.log(chalk.gray('  Prettier:'),       chalk.white(projectConfig.apps.frontend.prettier ? 'yes' : 'no'));
          if (projectConfig.apps.frontend.turbopack) {
            console.log(chalk.gray('  Turbopack:'),    chalk.white('yes'));
          }
          console.log(chalk.gray('  Backend:'),        chalk.white(projectConfig.apps.backend.framework));
          console.log(chalk.gray('  Database:'),       chalk.white(projectConfig.apps.backend.database));
          if (projectConfig.apps.backend.orm) {
            console.log(chalk.gray('  ORM:'),          chalk.white(projectConfig.apps.backend.orm));
          }
          console.log(chalk.gray('  API style:'),      chalk.white(projectConfig.apps.backend.apiStyle));
          console.log(chalk.gray('  Auth:'),           chalk.white(projectConfig.apps.backend.auth));
          console.log(chalk.gray('  Docker:'),         chalk.white(projectConfig.apps.backend.docker ? 'yes' : 'no'));
          console.log(chalk.gray('  CI:'),             chalk.white(projectConfig.ci ? 'yes' : 'no'));
          console.log();
        }
        // Interactive mode
        else {
          projectConfig = await promptForConfiguration(name);
        }
        
        // Validate project directory
        await validateProjectDirectory(projectConfig.name);

        // Check if a registry template exists (skipped for --template-url which supplies its own)
        if (!skipAvailabilityCheck) {
          const availability = checkTemplateAvailability(projectConfig);

          if (!availability.available) {
            console.log(chalk.yellow('\n⚠️  No exact template match found for your configuration.'));
            console.log(chalk.cyan('\n📋 Available similar templates:'));
            availability.suggestions?.forEach((s, i) => {
              console.log(chalk.cyan(`   ${i + 1}. ${s}`));
            });
            console.log(chalk.yellow('\n💡 Tip: You can contribute this template combination to our repository!'));
            console.log(chalk.blue('   Visit: https://github.com/create-fs-app-templates\n'));
            process.exit(0);
          }
        }

        const spinner = ora({
          text: 'Creating your full-stack app...',
          spinner: 'dots',
          color: 'cyan',
          hideCursor: true
        }).start();
        
        try {
          await scaffoldProject(projectConfig, {
            skipGit: options.git === false,
            skipInstall: options.install === false,
            skipCache: options.cache === false,
            localTemplatesDir: options.localTemplates,
            customTemplate: customTemplate ?? undefined,
          });
          
          spinner.succeed(chalk.green.bold('Project created successfully!'));
        } catch (error) {
          spinner.fail(chalk.red.bold('Project creation failed!'));
          throw error;
        } finally {
          // Ensure cursor is visible
          process.stdout.write('\x1B[?25h');
        }
        console.log();
        
        // Success box
        const successMsg = boxen(
          chalk.white.bold(`🎉 ${projectConfig.name} is ready!\n\n`) +
          chalk.cyan.bold('Next Steps:\n\n') +
          chalk.white(`${chalk.green('1.')} ${chalk.cyan(`cd ${projectConfig.name}`)}\n`) +
          chalk.white(`${chalk.green('2.')} ${chalk.cyan(options.install === false ? `${projectConfig.packageManager} install` : `${projectConfig.packageManager} run dev`)}\n`) +
          chalk.white(`${chalk.green('3.')} ${chalk.cyan('Start building! 🚀')}\n\n`) +
          chalk.gray('Documentation:\n') +
          chalk.gray('• README.md - Project overview\n') +
          chalk.gray('• .env.example - Environment setup'),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green',
            title: chalk.bold.green('✨ Success'),
            titleAlignment: 'center'
          }
        );
        
        console.log(successMsg);
        console.log();
      } catch (error) {
        if (error instanceof TemplateNotFoundError) {
          console.log(error.message);
          if (error.suggestions.length > 0) {
            console.log(chalk.cyan('\n📋 Similar templates you might like:'));
            error.suggestions.forEach((s, i) => {
              console.log(chalk.cyan(`   ${i + 1}. ${s}`));
            });
          }
        } else {
          console.error(chalk.red('\n❌ Error: ') + chalk.red(error instanceof Error ? error.message : String(error)));
        }
        process.exit(1);
      }
    });

  // List templates command
  program
    .command('list [search]')
    .description('List templates. Default: official only. Use --contributed or --all to see community templates.')
    .alias('ls')
    .option('--contributed', 'Show only contributed (community) templates')
    .option('--all',         'Show official and contributed templates')
    .action(async (search: string | undefined, cmdOpts: { contributed?: boolean; all?: boolean }) => {
      // Await registry hydration (max 3 s) before displaying
      await Promise.race([registryReady, new Promise<void>(r => setTimeout(r, 3000))]);
      displayAvailableTemplates({
        search:      search?.trim() || undefined,
        contributed: cmdOpts.contributed,
        all:         cmdOpts.all,
      });
    });

  // Template info command
  program
    .command('info <template>')
    .description('Show detailed information about a specific template')
    .action(async (templateName: string) => {
      await Promise.race([registryReady, new Promise<void>(r => setTimeout(r, 3000))]);
      // Search official first, then contributed
      const officialRes    = getOfficialByName(templateName);
      const contributedRes = getContributedByName(templateName);

      // Collect all ambiguous across both registries
      const allAmbiguous = [
        ...(officialRes.ambiguous ?? []),
        ...(contributedRes.ambiguous ?? []),
      ];

      if (!officialRes.match && !contributedRes.match) {
        if (allAmbiguous.length > 0) {
          const lines = allAmbiguous.map(t =>
            `  ${chalk.cyan(t.key)}  ${t.metadata.contributor ? chalk.dim('community') : chalk.green('✦ official')}`
          ).join('\n');
          console.log(boxen(
            chalk.yellow.bold('⚠️  Ambiguous — multiple templates match\n\n') + lines + '\n\n' +
            chalk.gray('Use the full key: ') + chalk.cyan('create-fs-app info <full-key>'),
            { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'yellow' }
          ));
        } else {
          console.log(boxen(
            chalk.red.bold('❌ Template Not Found\n\n') +
            chalk.white(`"${templateName}" doesn't match any template.\n\n`) +
            chalk.gray('Run ') + chalk.cyan('create-fs-app list --all') + chalk.gray(' to browse everything.'),
            { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'red' }
          ));
        }
        return;
      }

      const isOfficial   = !!officialRes.match;
      const { key, metadata } = (officialRes.match ?? contributedRes.match)!;
      const borderColor  = isOfficial ? 'cyan' : 'yellow';
      const badge        = isOfficial
        ? chalk.green('✦ official')
        : (() => {
            const c = metadata.contributor;
            return chalk.yellow('◆ contributed') +
              (c ? chalk.dim(`  by @${c.github}  ${c.url}`) : '');
          })();

      let body = chalk.bold.white(`📦 ${key}\n`) + badge + '\n\n';
      if (!isOfficial && metadata.contributor) {
        body += chalk.gray('Contributor repo: ') + chalk.dim(metadata.contributor.repoUrl) + '\n\n';
      }
      body +=
        chalk.gray('Description:\n') + chalk.white(`${metadata.description}\n\n`) +
        chalk.gray('Features:\n') +
        metadata.features.map((f: string) => chalk.green(`✓ ${f}`)).join('\n') + '\n\n' +
        chalk.gray('Supports: ') +
        Object.entries(metadata.supports ?? {}).filter(([, v]) => v).map(([k]) => chalk.yellow(k)).join(', ') +
        '\n\n' +
        chalk.gray('Repository: ') + chalk.cyan.underline(metadata.url ?? '');

      console.log();
      console.log(boxen(body, {
        padding: 1, margin: 1, borderStyle: 'round', borderColor,
        title: chalk.bold('Template Info'), titleAlignment: 'center',
      }));

      const usageCmd = isOfficial
        ? `npx create-fs-app my-app  # wizard auto-selects for this stack`
        : `npx create-fs-app my-app --template ${key}`;
      console.log(boxen(chalk.cyan(usageCmd), {
        padding: 1,
        margin: { top: 0, bottom: 1, left: 1, right: 1 },
        borderStyle: 'round', borderColor: 'blue',
        title: chalk.bold.blue('💡 Usage'), titleAlignment: 'left',
      }));
    });

  // Health check command
  program
    .command('health')
    .description('Run health check on current project')
    .action(async () => {
      try {
        const result = await runHealthCheck();
        displayHealthCheckResults(result);
        process.exit(result.passed ? 0 : 1);
      } catch (error) {
        Logger.error('Failed to run health check');
        if (error instanceof Error) console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  // Preset commands
  const presetCmd = program
    .command('preset')
    .description('Manage configuration presets');

  presetCmd
    .command('save <name>')
    .description(
      'Save a stack configuration as a reusable preset.\n' +
      '  Pass the same stack flags as the main command (--frontend, --backend,\n' +
      '  --database, --orm, --package-manager, etc.).\n' +
      '  Unspecified flags default to the saas-starter stack.'
    )
    .option('-d, --description <desc>', 'Preset description')
    .option('-f, --force',              'Overwrite an existing preset without prompting')
    .action(async (presetName: string, cmdOptions) => {
      try {
        // ── Guard: block built-in names ─────────────────────────────────────
        if (isBuiltinPresetName(presetName)) {
          Logger.error(`"${presetName}" is a built-in preset and cannot be overwritten.`);
          console.log(chalk.cyan('Built-in presets: ' + Object.keys(BUILTIN_PRESETS).join(', ') + '\n'));
          process.exit(1);
        }

        // ── Guard: warn on duplicate user preset ────────────────────────────
        const exists = await userPresetExists(presetName);
        if (exists && !cmdOptions.force) {
          Logger.error(`Preset "${presetName}" already exists.`);
          console.log(chalk.cyan(`  Use --force to overwrite: create-fs-app preset save ${presetName} --force\n`));
          process.exit(1);
        }

        // Stack flags are defined on the root program and consumed there —
        // read them back via program.opts().
        const rootOpts = program.opts();

        // Merge with saas-starter defaults for anything not specified
        const withDefaults = {
          monorepo:       rootOpts.monorepo       ?? 'turborepo',
          frontend:       rootOpts.frontend       ?? 'next.js',
          backend:        rootOpts.backend        ?? 'nest.js',
          database:       rootOpts.database       ?? 'postgresql',
          orm:            rootOpts.orm            ?? 'prisma',
          packageManager: rootOpts.packageManager,
          styling:        rootOpts.styling,
          apiStyle:       rootOpts.apiStyle,
          auth:           rootOpts.auth,
          docker:         rootOpts.docker,
          ci:             rootOpts.ci,
        };

        // Build and validate the config (dummy project name — stripped by savePreset)
        const config = buildConfigFromOptions('preset-placeholder', withDefaults);

        await savePreset(presetName, config, cmdOptions.description);

        const verb = exists ? chalk.yellow('updated') : chalk.green('saved');
        console.log(`\n✓ Preset "${presetName}" ${verb}\n`);
        console.log(chalk.gray('  Monorepo:'),    chalk.white(config.monorepo));
        console.log(chalk.gray('  Pkg manager:'), chalk.white(config.packageManager));
        console.log(chalk.gray('  Frontend:'),    chalk.white(config.apps.frontend.framework));
        console.log(chalk.gray('  Backend:'),     chalk.white(config.apps.backend.framework));
        console.log(chalk.gray('  Database:'),    chalk.white(config.apps.backend.database));
        console.log(chalk.gray('  ORM:'),         chalk.white(config.apps.backend.orm ?? 'none'));
        console.log(chalk.gray('  Docker:'),      chalk.white(config.apps.backend.docker ? 'yes' : 'no'));
        console.log();
        console.log(chalk.cyan(`💡 Use it: create-fs-app my-app --preset ${presetName}\n`));
      } catch (error) {
        Logger.error('Failed to save preset');
        if (error instanceof Error) console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  presetCmd
    .command('list')
    .description('List all saved presets')
    .action(async () => {
      try {
        const presets = await listPresets();
        const builtinKeys = Object.keys(BUILTIN_PRESETS);
        
        console.log(chalk.cyan.bold('\n📚 Available Presets\n'));
        
        // Built-in presets
        console.log(chalk.bold.green('Built-in Presets:') + chalk.dim('  (read-only — cannot be saved over or deleted)'));
        builtinKeys.forEach(key => {
          const preset = BUILTIN_PRESETS[key];
          const cfg = preset.config;
          console.log(chalk.white(`  ${key}`));
          console.log(chalk.gray(`    ${preset.description}`));
          console.log(chalk.dim(`    Stack:   ${cfg.apps.frontend.framework} + ${cfg.apps.backend.framework} + ${cfg.apps.backend.database}`));
        });
        
        // User presets — exclude any builtin names that may have leaked into the file
        const userPresets = presets.filter(p => !isBuiltinPresetName(p.name));
        if (userPresets.length > 0) {
          console.log(chalk.bold.green('\nYour Presets:'));
          userPresets.forEach(preset => {
            console.log(chalk.white(`  ${preset.name}`));
            if (preset.description) {
              console.log(chalk.gray(`    ${preset.description}`));
            }
            console.log(chalk.dim(`    Created:   ${new Date(preset.createdAt).toLocaleString()}`));
            if (preset.lastUsed) {
              console.log(chalk.dim(`    Last used: ${new Date(preset.lastUsed).toLocaleString()}`));
            }
            const cfg = preset.config;
            console.log(chalk.dim(`    Stack:     ${cfg.apps.frontend.framework} + ${cfg.apps.backend.framework} + ${cfg.apps.backend.database}`));
          });
        }
        
        console.log(chalk.cyan('\n💡 Use: create-fs-app my-app --preset <name>\n'));
      } catch (error) {
        Logger.error('Failed to list presets');
        if (error instanceof Error) console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  presetCmd
    .command('delete <name>')
    .description('Delete a saved preset')
    .action(async (name: string) => {
      try {
        const deleted = await deletePreset(name);

        if (!deleted) {
          // Not in user file — check if it's a builtin to give a better message
          if (isBuiltinPresetName(name)) {
            Logger.error(`"${name}" is a built-in preset and cannot be deleted.`);
            console.log(chalk.cyan('Built-in presets: ' + Object.keys(BUILTIN_PRESETS).join(', ') + '\n'));
          } else {
            Logger.error(`Preset "${name}" not found.`);
            console.log(chalk.cyan('\nRun create-fs-app preset list to see available presets.\n'));
          }
          process.exit(1);
        }
        // deletePreset already logs success
      } catch (error) {
        Logger.error('Failed to delete preset');
        if (error instanceof Error) console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  // Cache commands
  const cacheCmd = program
    .command('cache')
    .description('Manage template cache');

  cacheCmd
    .command('clear')
    .description('Clear template cache and registry cache')
    .action(async () => {
      try {
        await clearCache();
        await clearRegistryCache();
        console.log(chalk.green('✓ Template cache and registry cache cleared'));
      } catch (error) {
        Logger.error('Failed to clear cache');
        if (error instanceof Error) console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  cacheCmd
    .command('stats')
    .description('Show cache statistics')
    .action(async () => {
      try {
        const stats = await getCacheStats();
        console.log(chalk.cyan.bold('\n📊 Cache Statistics\n'));
        console.log(chalk.white(`Total templates: ${stats.totalTemplates}`));
        console.log(chalk.white(`Cache size: ${stats.cacheSize}`));
        
        if (stats.templates.length > 0) {
          console.log(chalk.bold('\nCached Templates:'));
          stats.templates.forEach(t => {
            console.log(chalk.gray(`  ${t.key}`));
            console.log(chalk.gray(`    Last used: ${new Date(t.lastUsed).toLocaleDateString()}`));
          });
        }
        console.log();
      } catch (error) {
        Logger.error('Failed to get cache stats');
        if (error instanceof Error) console.error(chalk.red(error.message));
        process.exit(1);
      }
    });

  program.parse();
}

main().catch(console.error); 