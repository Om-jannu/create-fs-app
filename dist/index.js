#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
import ora from 'ora';
import boxen from 'boxen';
import updateNotifier from 'update-notifier';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ProjectConfigSchema, MonorepoFramework, FrontendFramework, BackendFramework, Database, PackageManager } from './types/index.js';
import { scaffoldProject, validateProjectDirectory, checkTemplateAvailability, TemplateNotFoundError } from './core/scaffold.js';
import { displayAvailableTemplates, getTemplateByName } from './core/template-list.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Check for updates
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
updateNotifier({ pkg }).notify();
const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
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
    const welcomeMsg = boxen(chalk.white.bold('Create production-ready full-stack applications\n') +
        chalk.gray('Template-based • Fast • Customizable\n\n') +
        chalk.cyan('✓ TypeScript by default\n') +
        chalk.cyan('✓ Multiple monorepo frameworks\n') +
        chalk.cyan('✓ Customizable frontend & backend\n') +
        chalk.cyan('✓ Database & ORM selection\n') +
        chalk.cyan('✓ Docker & Testing setup'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        title: chalk.bold.cyan(`v${pkg.version}`),
        titleAlignment: 'center'
    });
    console.log(welcomeMsg);
    console.log();
}
/**
 * Build configuration from CLI options
 */
function buildConfigFromOptions(name, options) {
    // Validate required fields
    if (!name) {
        console.log(chalk.red('\n❌ Project name is required.\n'));
        console.log(chalk.cyan('Usage: create-fs-app <project-name> [options]\n'));
        process.exit(1);
    }
    if (!options.monorepo || !options.frontend || !options.backend || !options.database) {
        console.log(chalk.red('\n❌ When using CLI options, you must provide:\n'));
        console.log(chalk.yellow('  --monorepo <framework>'));
        console.log(chalk.yellow('  --frontend <framework>'));
        console.log(chalk.yellow('  --backend <framework>'));
        console.log(chalk.yellow('  --database <db>\n'));
        console.log(chalk.cyan('💡 Or run without options for interactive mode.\n'));
        process.exit(1);
    }
    // Validate enum values
    const validateEnum = (value, enumObj, name) => {
        const validValues = Object.values(enumObj);
        const found = validValues.find((v) => v.toLowerCase() === value.toLowerCase());
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
                typescript: options.typescript !== false, // default true
                styling: options.styling || 'tailwind',
                linting: options.linting !== false // default true
            },
            backend: {
                framework: validateEnum(options.backend, BackendFramework, 'backend framework'),
                database: validateEnum(options.database, Database, 'database'),
                orm: options.orm,
                docker: options.docker !== false // default true based on options
            }
        }
    };
    // Validate the config with Zod
    try {
        return ProjectConfigSchema.parse(config);
    }
    catch (error) {
        console.log(chalk.red('\n❌ Invalid configuration:\n'));
        console.error(error);
        process.exit(1);
    }
}
async function promptForConfiguration(projectName) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is your project named?',
            default: projectName || 'my-fs-app',
            when: !projectName // Only ask if name not provided
        },
        {
            type: 'list',
            name: 'monorepo',
            message: 'Select a monorepo framework:',
            choices: Object.values(MonorepoFramework)
        },
        {
            type: 'list',
            name: 'packageManager',
            message: 'Select a package manager:',
            choices: Object.values(PackageManager)
        },
        {
            type: 'list',
            name: 'apps.frontend.framework',
            message: 'Select a frontend framework:',
            choices: Object.values(FrontendFramework)
        },
        {
            type: 'confirm',
            name: 'apps.frontend.typescript',
            message: 'Use TypeScript for frontend?',
            default: true
        },
        {
            type: 'list',
            name: 'apps.frontend.styling',
            message: 'Select a styling solution:',
            choices: ['css', 'scss', 'tailwind', 'styled-components']
        },
        {
            type: 'confirm',
            name: 'apps.frontend.linting',
            message: 'Enable ESLint and Prettier?',
            default: true
        },
        {
            type: 'list',
            name: 'apps.backend.framework',
            message: 'Select a backend framework:',
            choices: Object.values(BackendFramework)
        },
        {
            type: 'list',
            name: 'apps.backend.database',
            message: 'Select a database:',
            choices: Object.values(Database)
        },
        {
            type: 'list',
            name: 'apps.backend.orm',
            message: 'Select an ORM:',
            choices: ['prisma', 'typeorm', 'mongoose', 'drizzle']
        },
        {
            type: 'confirm',
            name: 'apps.backend.docker',
            message: 'Include Docker configuration?',
            default: true
        }
    ]);
    // Use provided name if available
    const config = {
        ...answers,
        name: projectName || answers.name
    };
    // Validate configuration using Zod
    return ProjectConfigSchema.parse(config);
}
async function main() {
    const program = new Command();
    program
        .name('create-fs-app')
        .description('Create a full-stack monorepo application')
        .version('1.2.0');
    // Main create command
    program
        .argument('[name]', 'The name of your application')
        .option('-t, --template <name>', 'Use a predefined template')
        .option('--monorepo <framework>', 'Monorepo framework (turborepo, nx, lerna)')
        .option('--frontend <framework>', 'Frontend framework (react, next.js, vue, nuxt, angular)')
        .option('--backend <framework>', 'Backend framework (express, nest.js, fastify, koa)')
        .option('--database <db>', 'Database (postgresql, mongodb, mysql, sqlite)')
        .option('--orm <orm>', 'ORM (prisma, typeorm, mongoose, drizzle)')
        .option('--package-manager <pm>', 'Package manager (npm, yarn, pnpm)')
        .option('--styling <style>', 'Styling solution (css, scss, tailwind, styled-components)')
        .option('--typescript', 'Use TypeScript (default: true)')
        .option('--no-typescript', 'Disable TypeScript')
        .option('--linting', 'Enable linting (default: true)')
        .option('--no-linting', 'Disable linting')
        .option('--docker', 'Include Docker configuration')
        .option('--no-docker', 'Skip Docker configuration')
        .option('--no-git', 'Skip git initialization')
        .option('--no-install', 'Skip package installation')
        .option('-y, --yes', 'Skip prompts and use defaults')
        .action(async (name, options) => {
        await welcome();
        try {
            let projectConfig;
            // Check if using direct template
            if (options.template) {
                const template = getTemplateByName(options.template);
                if (!template) {
                    console.log(chalk.red(`\n❌ Template "${options.template}" not found.\n`));
                    console.log(chalk.cyan('💡 Use "create-fs-app list" to see all available templates.\n'));
                    process.exit(1);
                }
                // For direct template usage, we still need a project name
                if (!name) {
                    console.log(chalk.red('\n❌ Project name is required when using --template.\n'));
                    console.log(chalk.cyan('Usage: create-fs-app <project-name> --template <template-name>\n'));
                    process.exit(1);
                }
                // Extract config from template key (this is a simplified approach)
                // You'll need to prompt for missing config or use defaults
                console.log(chalk.yellow('\n⚠️  Direct template mode: Using template defaults for configuration.\n'));
                projectConfig = await promptForConfiguration();
                projectConfig.name = name;
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
            }
            catch (error) {
                spinner.fail(chalk.red.bold('Project creation failed!'));
                throw error;
            }
            finally {
                // Ensure cursor is visible
                process.stdout.write('\x1B[?25h');
            }
            console.log();
            // Success box
            const successMsg = boxen(chalk.white.bold(`🎉 ${projectConfig.name} is ready!\n\n`) +
                chalk.cyan.bold('Next Steps:\n\n') +
                chalk.white(`${chalk.green('1.')} ${chalk.cyan(`cd ${projectConfig.name}`)}\n`) +
                chalk.white(`${chalk.green('2.')} ${chalk.cyan(options.install === false ? `${projectConfig.packageManager} install` : `${projectConfig.packageManager} run dev`)}\n`) +
                chalk.white(`${chalk.green('3.')} ${chalk.cyan('Start building! 🚀')}\n\n`) +
                chalk.gray('Documentation:\n') +
                chalk.gray('• README.md - Project overview\n') +
                chalk.gray('• .env.example - Environment setup'), {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'green',
                title: chalk.bold.green('✨ Success'),
                titleAlignment: 'center'
            });
            console.log(successMsg);
            console.log();
        }
        catch (error) {
            if (error instanceof TemplateNotFoundError) {
                console.log(error.message);
                if (error.suggestions.length > 0) {
                    console.log(chalk.cyan('\n📋 Similar templates you might like:'));
                    error.suggestions.forEach((s, i) => {
                        console.log(chalk.cyan(`   ${i + 1}. ${s}`));
                    });
                }
            }
            else {
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
        .action((templateName) => {
        const template = getTemplateByName(templateName);
        if (!template) {
            const errorBox = boxen(chalk.red.bold('❌ Template Not Found\n\n') +
                chalk.white(`"${templateName}" doesn't exist.\n\n`) +
                chalk.gray('Use ') + chalk.cyan('create-fs-app list') + chalk.gray(' to see available templates.'), {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'red'
            });
            console.log(errorBox);
            return;
        }
        console.log();
        const infoBox = boxen(chalk.bold.white(`📦 ${template.key}\n\n`) +
            chalk.gray('Description:\n') +
            chalk.white(`${template.metadata.description}\n\n`) +
            chalk.gray('Features:\n') +
            template.metadata.features.map((f) => chalk.green(`✓ ${f}`)).join('\n') +
            '\n\n' +
            chalk.gray('Repository:\n') +
            chalk.cyan.underline(template.metadata.url), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'cyan',
            title: chalk.bold.cyan('Template Info'),
            titleAlignment: 'center'
        });
        console.log(infoBox);
        const usageBox = boxen(chalk.cyan(`npx create-fs-app my-app --template ${template.key}`), {
            padding: 1,
            margin: { top: 0, bottom: 1, left: 1, right: 1 },
            borderStyle: 'round',
            borderColor: 'blue',
            title: chalk.bold.blue('💡 Usage'),
            titleAlignment: 'left'
        });
        console.log(usageBox);
    });
    program.parse();
}
main().catch(console.error);
//# sourceMappingURL=index.js.map