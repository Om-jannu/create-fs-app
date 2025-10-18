/**
 * Template listing and management utilities
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import boxen from 'boxen';
import { TEMPLATE_REGISTRY, listAllTemplates } from './template-registry.js';

/**
 * Display all available templates in a formatted table
 */
export function displayAvailableTemplates(): void {
  const templates = listAllTemplates();

  if (templates.length === 0) {
    const noTemplatesMsg = boxen(
      chalk.yellow.bold('⚠️  No templates available yet\n\n') +
      chalk.white('Templates are currently being created.\n') +
      chalk.white('Check back soon or contribute your own!\n\n') +
      chalk.cyan('Visit: ') + chalk.underline.cyan('https://github.com/create-fs-app-templates'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'yellow'
      }
    );
    console.log(noTemplatesMsg);
    return;
  }

  console.log();
  console.log(chalk.bold.cyan('  📋 Available Templates'));
  console.log();

  // Group by monorepo framework
  const grouped = templates.reduce((acc, { key, metadata }) => {
    const monorepo = key.split('-')[0];
    if (!acc[monorepo]) {
      acc[monorepo] = [];
    }
    acc[monorepo].push({ key, metadata });
    return acc;
  }, {} as Record<string, Array<{ key: string; metadata: any }>>);

  Object.entries(grouped).forEach(([monorepo, items]) => {
    console.log(chalk.bold.green(`  ${monorepo.toUpperCase()}`));
    
    const table = new Table({
      head: [
        chalk.cyan.bold('Template Key'),
        chalk.cyan.bold('Description'),
        chalk.cyan.bold('Features')
      ],
      style: {
        head: [],
        border: ['gray']
      },
      colWidths: [35, 40, 30],
      wordWrap: true
    });

    items.forEach(({ key, metadata }) => {
      table.push([
        chalk.white(key),
        chalk.gray(metadata.description),
        chalk.yellow(metadata.features.slice(0, 3).join(', '))
      ]);
    });

    console.log(table.toString());
    console.log();
  });

  const usageBox = boxen(
    chalk.white.bold('Usage:\n\n') +
    chalk.cyan('npx create-fs-app <project-name> --template <key>\n\n') +
    chalk.gray('or run ') + chalk.white('npx create-fs-app') + chalk.gray(' for interactive mode'),
    {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'blue',
      title: chalk.bold.blue('💡 Tip'),
      titleAlignment: 'left'
    }
  );
  
  console.log(usageBox);
}

/**
 * Get template by name/key
 */
export function getTemplateByName(name: string) {
  const templates = listAllTemplates();
  return templates.find(
    t => t.key === name || t.key.includes(name)
  );
}

/**
 * Search templates by keyword
 */
export function searchTemplates(keyword: string) {
  const templates = listAllTemplates();
  const lowerKeyword = keyword.toLowerCase();

  return templates.filter(({ key, metadata }) =>
    key.includes(lowerKeyword) ||
    metadata.description.toLowerCase().includes(lowerKeyword) ||
    metadata.features.some(f => f.toLowerCase().includes(lowerKeyword))
  );
}

/**
 * Get template statistics
 */
export function getTemplateStats() {
  const templates = listAllTemplates();
  
  const stats = {
    total: templates.length,
    byMonorepo: {} as Record<string, number>,
    byFrontend: {} as Record<string, number>,
    byBackend: {} as Record<string, number>,
  };

  templates.forEach(({ key }) => {
    const [monorepo, frontend, backend] = key.split('-');
    
    stats.byMonorepo[monorepo] = (stats.byMonorepo[monorepo] || 0) + 1;
    stats.byFrontend[frontend] = (stats.byFrontend[frontend] || 0) + 1;
    stats.byBackend[backend] = (stats.byBackend[backend] || 0) + 1;
  });

  return stats;
}

/**
 * Display template statistics
 */
export function displayTemplateStats(): void {
  const stats = getTemplateStats();

  console.log(chalk.bold.cyan('\n📊 Template Statistics\n'));
  console.log(chalk.green(`Total templates: ${stats.total}`));

  console.log(chalk.bold('\nBy Monorepo Framework:'));
  Object.entries(stats.byMonorepo).forEach(([key, count]) => {
    console.log(chalk.gray(`  ${key}: ${count}`));
  });

  console.log(chalk.bold('\nBy Frontend Framework:'));
  Object.entries(stats.byFrontend).forEach(([key, count]) => {
    console.log(chalk.gray(`  ${key}: ${count}`));
  });

  console.log(chalk.bold('\nBy Backend Framework:'));
  Object.entries(stats.byBackend).forEach(([key, count]) => {
    console.log(chalk.gray(`  ${key}: ${count}`));
  });

  console.log();
}

