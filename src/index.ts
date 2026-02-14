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
  PackageManager
} from './types/index.js';
import { scaffoldProject, validateProjectDirectory, checkTemplateAvailability, TemplateNotFoundError } from './core/scaffold.js';
import { displayAvailableTemplates, getTemplateByName } from './core/template-list.js';
import { assertValidProjectName } from './utils/validation.js';
import { Logger } from './utils/logger.js';
import { formatError } from './utils/errors.js';
import { 
  savePreset, 
  loadPreset, 
  listPresets, 
  deletePreset, 
  getPresetConfig,
  getBuiltinPreset,
  BUILTIN_PRESETS 
} from './core/presets.js';
import { runHealthCheck, displayHealthCheckResults } from './core/health-check.js';
import { clearCache, getCacheStats } from './core/template-cache.js';
import { createCustomTemplate } from './core/template-registry.js';
import { validateTemplateUrl } from './utils/validation.js';

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

  // Validate enum values
  const validateEnum = (value: string, enumObj: any, name: string): any => {
    const validValues = Object.values(enumObj);
    const found = validValues.find((v: any) => v.toLowerCase() === value.toLowerCase());
    
    if (!found) {
      console.log(chalk.red(`\n❌ Invalid ${name}: "${value}"\n`));
      console.log(chalk.cyan(`Valid options: ${validValues.join(', ')}\n`));
      process.exit(1);
    }
    return found;
  };

  const config = {
    name,
    monorepo: validateEnum(options.monorepo, MonorepoFramework, 'monorepo framework'),
    packageManager: options.packageManager 
      ? validateEnum(options.packageManager, PackageManager, 'package manager')
      : PackageManager.NPM,
    apps: {
      frontend: {
        framework: validateEnum(options.frontend, FrontendFramework, 'frontend framework'),
        // TypeScript is always enabled
        styling: options.styling || 'tailwind',
        linting: options.linting !== false // default true
      },
      backend: {
        framework: validateEnum(options.backend, BackendFramework, 'backend framework'),
        database: validateEnum(options.database, Database, 'database'),
        orm: options.orm as any,
        docker: options.docker !== false // default true based on options
      }
    }
  };

  // Validate the config with Zod
  try {
    return ProjectConfigSchema.parse(config);
  } catch (error) {
    Logger.error('Invalid configuration:');
    console.error(error);
    process.exit(1);
  }
}

async function promptForConfiguration(projectName?: string): Promise<ProjectConfig> {
  const questions: prompts.PromptObject[] = [];
  
  if (!projectName) {
    questions.push({
      type: 'text',
      name: 'name',
      message: 'What is your project named?',
      initial: 'my-fs-app'
    });
  }
  
  questions.push(
    {
      type: 'select',
      name: 'monorepo',
      message: 'Select a monorepo framework:',
      choices: Object.values(MonorepoFramework).map(v => ({ title: v, value: v }))
    },
    {
      type: 'select',
      name: 'packageManager',
      message: 'Select a package manager:',
      choices: Object.values(PackageManager).map(v => ({ title: v, value: v }))
    },
    {
      type: 'select',
      name: 'frontendFramework',
      message: 'Select a frontend framework:',
      choices: Object.values(FrontendFramework).map(v => ({ title: v, value: v }))
    },
    {
      type: 'select',
      name: 'styling',
      message: 'Select a styling solution:',
      choices: [
        { title: 'css', value: 'css' },
        { title: 'scss', value: 'scss' },
        { title: 'tailwind', value: 'tailwind' },
        { title: 'styled-components', value: 'styled-components' }
      ]
    },
    {
      type: 'confirm',
      name: 'linting',
      message: 'Enable ESLint and Prettier?',
      initial: true
    },
    {
      type: 'select',
      name: 'backendFramework',
      message: 'Select a backend framework:',
      choices: Object.values(BackendFramework).map(v => ({ title: v, value: v }))
    },
    {
      type: 'select',
      name: 'database',
      message: 'Select a database:',
      choices: Object.values(Database).map(v => ({ title: v, value: v }))
    },
    {
      type: 'select',
      name: 'orm',
      message: 'Select an ORM:',
      choices: [
        { title: 'prisma', value: 'prisma' },
        { title: 'typeorm', value: 'typeorm' },
        { title: 'mongoose', value: 'mongoose' },
        { title: 'drizzle', value: 'drizzle' }
      ]
    },
    {
      type: 'confirm',
      name: 'docker',
      message: 'Include Docker configuration?',
      initial: true
    }
  );

  const answers = await prompts(questions, {
    onCancel: () => {
      console.log(chalk.yellow('\n\nOperation cancelled by user'));
      process.exit(0);
    }
  });

  // Build config from flat answers
  const config = {
    name: projectName || answers.name,
    monorepo: answers.monorepo,
    packageManager: answers.packageManager,
    apps: {
      frontend: {
        framework: answers.frontendFramework,
        styling: answers.styling,
        linting: answers.linting
      },
      backend: {
        framework: answers.backendFramework,
        database: answers.database,
        orm: answers.orm,
        docker: answers.docker
      }
    }
  };

  // Validate configuration using Zod
  return ProjectConfigSchema.parse(config);
}

async function main() {
  const program = new Command();

  program
    .name('create-fs-app')
    .description('Create a full-stack monorepo application')
    .version('2.0.0');

  // Main create command
  program
    .argument('[name]', 'The name of your application')
    .option('-t, --template <name>', 'Use a predefined template')
    .option('--template-url <url>', 'Use a custom template from GitHub URL')
    .option('--preset <name>', 'Use a configuration preset')
    .option('--monorepo <framework>', 'Monorepo framework (turborepo, nx, lerna)')
    .option('--frontend <framework>', 'Frontend framework (react, next.js, vue, nuxt, angular)')
    .option('--backend <framework>', 'Backend framework (express, nest.js, fastify, koa)')
    .option('--database <db>', 'Database (postgresql, mongodb, mysql, sqlite)')
    .option('--orm <orm>', 'ORM (prisma, typeorm, mongoose, drizzle)')
    .option('--package-manager <pm>', 'Package manager (npm, yarn, pnpm)')
    .option('--styling <style>', 'Styling solution (css, scss, tailwind, styled-components)')
    .option('--linting', 'Enable linting (default: true)')
    .option('--no-linting', 'Disable linting')
    .option('--docker', 'Include Docker configuration')
    .option('--no-docker', 'Skip Docker configuration')
    .option('--no-git', 'Skip git initialization')
    .option('--no-install', 'Skip package installation')
    .option('--no-cache', 'Skip template caching')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .action(async (name: string | undefined, options) => {
      await welcome();

      try {
        let projectConfig: ProjectConfig;
        let customTemplate: any = null;
        
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
          
          // Validate URL
          const validation = validateTemplateUrl(options.templateUrl);
          if (!validation.valid) {
            Logger.error(validation.error!);
            process.exit(1);
          }
          
          // Create minimal config for custom template
          customTemplate = createCustomTemplate(options.templateUrl);
          
          projectConfig = {
            name,
            monorepo: 'turborepo' as any,
            packageManager: 'npm' as any,
            apps: {
              frontend: {
                framework: 'react' as any,
                styling: 'tailwind',
                linting: true
              },
              backend: {
                framework: 'express' as any,
                database: 'postgresql' as any,
                docker: true
              }
            }
          };
          
          console.log();
          const infoBox = boxen(
            chalk.cyan.bold('🔗 Using Custom Template\n\n') +
            chalk.white(`URL: `) + chalk.green(options.templateUrl),
            {
              padding: 1,
              margin: 1,
              borderStyle: 'round',
              borderColor: 'cyan'
            }
          );
          console.log(infoBox);
        }
        // Check if using direct template
        else if (options.template) {
          const template = getTemplateByName(options.template);
          if (!template) {
            const errorBox = boxen(
              chalk.red.bold('❌ Template Not Found\n\n') +
              chalk.white(`Template "${options.template}" doesn't exist.\n\n`) +
              chalk.cyan('💡 Use ') + chalk.white.bold('create-fs-app list') + chalk.cyan(' to see available templates.'),
              {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'red'
              }
            );
            console.log(errorBox);
            process.exit(1);
          }
          
          // For direct template usage, we still need a project name
          if (!name) {
            console.log(chalk.red('\n❌ Project name is required when using --template.\n'));
            console.log(chalk.cyan('Usage: create-fs-app <project-name> --template <template-name>\n'));
            process.exit(1);
          }
          
          // Extract configuration from template key automatically
          const parts = template.key.split('-');
          projectConfig = {
            name,
            monorepo: parts[0] as any,
            packageManager: PackageManager.NPM,
            apps: {
              frontend: {
                framework: (parts[1] === 'nextjs' ? 'next.js' : parts[1]) as any,
                // TypeScript is always enabled
                styling: 'tailwind',
                linting: true
              },
              backend: {
                framework: (parts[2] === 'nestjs' ? 'nest.js' : parts[2]) as any,
                database: parts[3] as any,
                orm: parts[4] as any,
                docker: true
              }
            }
          };
          
          console.log();
          const infoBox = boxen(
            chalk.cyan.bold('🚀 Using Template\n\n') +
            chalk.white(`Template: `) + chalk.green(template.key) + '\n' +
            chalk.white(`Description: `) + chalk.gray(template.metadata.description),
            {
              padding: 1,
              margin: 1,
              borderStyle: 'round',
              borderColor: 'cyan'
            }
          );
          console.log(infoBox);
        }
        // Check if stack options provided via CLI
        else if (options.monorepo || options.frontend || options.backend) {
          projectConfig = buildConfigFromOptions(name, options);
          
          // Show detected configuration
          console.log(chalk.cyan('\n📋 Configuration from CLI options:\n'));
          console.log(chalk.gray('  Project:'), chalk.white(projectConfig.name));
          console.log(chalk.gray('  Monorepo:'), chalk.white(projectConfig.monorepo));
          console.log(chalk.gray('  Frontend:'), chalk.white(projectConfig.apps.frontend.framework));
          console.log(chalk.gray('  Backend:'), chalk.white(projectConfig.apps.backend.framework));
          console.log(chalk.gray('  Database:'), chalk.white(projectConfig.apps.backend.database));
          if (projectConfig.apps.backend.orm) {
            console.log(chalk.gray('  ORM:'), chalk.white(projectConfig.apps.backend.orm));
          }
          console.log(chalk.gray('  Package Manager:'), chalk.white(projectConfig.packageManager));
          console.log();
        }
        // Interactive mode
        else {
          projectConfig = await promptForConfiguration(name);
        }
        
        // Validate project directory
        await validateProjectDirectory(projectConfig.name);
        
        // Check if template exists
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

        const spinner = ora({
          text: 'Creating your full-stack app...',
          spinner: 'dots',
          color: 'cyan',
          hideCursor: true
        }).start();
        
        try {
          await scaffoldProject(projectConfig, {
            skipGit: options.git === false,
            skipInstall: options.install === false
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
          console.error(chalk.red('\n❌ Error creating project:'));
          console.error(error);
        }
        process.exit(1);
      }
    });

  // List templates command
  program
    .command('list')
    .description('List all available templates')
    .alias('ls')
    .action(() => {
      displayAvailableTemplates();
    });

  // Template info command
  program
    .command('info <template>')
    .description('Show detailed information about a template')
    .action((templateName: string) => {
      const template = getTemplateByName(templateName);
      if (!template) {
        const errorBox = boxen(
          chalk.red.bold('❌ Template Not Found\n\n') +
          chalk.white(`"${templateName}" doesn't exist.\n\n`) +
          chalk.gray('Use ') + chalk.cyan('create-fs-app list') + chalk.gray(' to see available templates.'),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'red'
          }
        );
        console.log(errorBox);
        return;
      }

      console.log();
      const infoBox = boxen(
        chalk.bold.white(`📦 ${template.key}\n\n`) +
        chalk.gray('Description:\n') +
        chalk.white(`${template.metadata.description}\n\n`) +
        chalk.gray('Features:\n') +
        template.metadata.features.map((f: string) => chalk.green(`✓ ${f}`)).join('\n') +
        '\n\n' +
        chalk.gray('Repository:\n') +
        chalk.cyan.underline(template.metadata.url),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'cyan',
          title: chalk.bold.cyan('Template Info'),
          titleAlignment: 'center'
        }
      );
      
      console.log(infoBox);
      
      const usageBox = boxen(
        chalk.cyan(`npx create-fs-app my-app --template ${template.key}`),
        {
          padding: 1,
          margin: { top: 0, bottom: 1, left: 1, right: 1 },
          borderStyle: 'round',
          borderColor: 'blue',
          title: chalk.bold.blue('💡 Usage'),
          titleAlignment: 'left'
        }
      );
      
      console.log(usageBox);
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
        console.error(error);
        process.exit(1);
      }
    });

  // Preset commands
  const presetCmd = program
    .command('preset')
    .description('Manage configuration presets');

  presetCmd
    .command('save <name>')
    .description('Save current configuration as a preset')
    .option('-d, --description <desc>', 'Preset description')
    .action(async (name: string, options) => {
      // This would need to be called from within a project
      Logger.error('This command must be run from within a create-fs-app project');
      process.exit(1);
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
        console.log(chalk.bold.green('Built-in Presets:'));
        builtinKeys.forEach(key => {
          const preset = BUILTIN_PRESETS[key];
          console.log(chalk.white(`  ${key}`));
          console.log(chalk.gray(`    ${preset.description}`));
        });
        
        // User presets
        if (presets.length > 0) {
          console.log(chalk.bold.green('\nYour Presets:'));
          presets.forEach(preset => {
            console.log(chalk.white(`  ${preset.name}`));
            if (preset.description) {
              console.log(chalk.gray(`    ${preset.description}`));
            }
          });
        }
        
        console.log(chalk.cyan('\n💡 Use: create-fs-app my-app --preset <name>\n'));
      } catch (error) {
        Logger.error('Failed to list presets');
        console.error(error);
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
          Logger.error(`Preset "${name}" not found`);
          process.exit(1);
        }
      } catch (error) {
        Logger.error('Failed to delete preset');
        console.error(error);
        process.exit(1);
      }
    });

  // Cache commands
  const cacheCmd = program
    .command('cache')
    .description('Manage template cache');

  cacheCmd
    .command('clear')
    .description('Clear template cache')
    .action(async () => {
      try {
        await clearCache();
      } catch (error) {
        Logger.error('Failed to clear cache');
        console.error(error);
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
        console.error(error);
        process.exit(1);
      }
    });

  program.parse();
}

main().catch(console.error); 