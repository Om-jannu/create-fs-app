/**
 * Template listing, search, and selection utilities.
 *
 * Official templates  → shown by default in `cfs list`; selected by wizard/--yes/stack flags
 * Contributed templates → shown with `cfs list --contributed`; selected only via `--template`
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import boxen from 'boxen';
import {
  listOfficialTemplates,
  listContributedTemplates,
  TemplateMetadata,
} from './template-registry.js';
import { isValidUUID } from '../utils/validation.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ListOptions {
  /** Show contributed templates (instead of official) */
  contributed?: boolean;
  /** Show both official and contributed */
  all?: boolean;
  /** Keyword filter — applied to key, description, features, contributor github */
  search?: string;
}

export interface TemplateMatch {
  key:      string;
  metadata: TemplateMetadata;
}

export interface TemplateResolution {
  match?:     TemplateMatch;
  ambiguous?: TemplateMatch[];
}

// ── Internal ──────────────────────────────────────────────────────────────────

function applySearch(
  templates: TemplateMatch[],
  search?: string,
): TemplateMatch[] {
  if (!search) return templates;
  const q = search.toLowerCase();
  return templates.filter(({ key, metadata }) =>
    key.toLowerCase().includes(q) ||
    metadata.description.toLowerCase().includes(q) ||
    metadata.features.some(f => f.toLowerCase().includes(q)) ||
    (metadata.contributor?.github.toLowerCase().includes(q) ?? false)
  );
}

function resolveFrom(
  templates: TemplateMatch[],
  name: string,
): TemplateResolution {
  const q = name.toLowerCase();

  const exactKey  = templates.find(t => t.key === name);
  if (exactKey) return { match: exactKey };

  const exactUUID = templates.find(t => t.metadata.id === name);
  if (exactUUID) return { match: exactUUID };

  const matches = templates.filter(t => t.key.toLowerCase().includes(q));
  if (matches.length === 0)  return {};
  if (matches.length === 1)  return { match: matches[0] };
  return { ambiguous: matches };
}

// ── displayAvailableTemplates ─────────────────────────────────────────────────

export function displayAvailableTemplates(opts: ListOptions = {}): void {
  const official    = listOfficialTemplates();
  const contributed = listContributedTemplates();

  // Decide which sets to display
  let showOfficial    = !opts.contributed;               // default: official
  let showContributed = opts.contributed || opts.all;

  if (opts.all) { showOfficial = true; showContributed = true; }

  let officialFiltered    = showOfficial    ? applySearch(official,    opts.search) : [];
  let contributedFiltered = showContributed ? applySearch(contributed, opts.search) : [];

  const totalShown = officialFiltered.length + contributedFiltered.length;
  const totalAll   = official.length + contributed.length;

  // ── Empty states ──────────────────────────────────────────────────────────
  if (totalAll === 0) {
    console.log(boxen(
      chalk.yellow.bold('⚠️  No templates available yet\n\n') +
      chalk.white('Templates are currently being created.\n') +
      chalk.cyan('Visit: ') + chalk.underline.cyan('https://github.com/Om-jannu/create-fs-app-templates'),
      { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'yellow' }
    ));
    return;
  }

  if (totalShown === 0) {
    const hint = opts.search
      ? `No templates match "${opts.search}".`
      : opts.contributed
        ? 'No contributed templates yet — be the first!'
        : 'No official templates found.';
    console.log(boxen(
      chalk.yellow(`⚠️  ${hint}\n\n`) +
      chalk.gray('Run ') + chalk.cyan('create-fs-app list --all') + chalk.gray(' to see everything.'),
      { padding: 1, margin: 1, borderStyle: 'round', borderColor: 'yellow' }
    ));
    return;
  }

  // ── Header ────────────────────────────────────────────────────────────────
  console.log();
  let heading = chalk.bold.cyan('  📋 Available Templates');
  if (opts.all)         heading += chalk.gray(' — all');
  if (opts.contributed) heading += chalk.gray(' — contributed');
  if (opts.search)      heading += chalk.gray(` — search: "${opts.search}"`);
  console.log(heading);
  console.log(chalk.dim(`  ${totalShown} of ${totalAll} template${totalAll === 1 ? '' : 's'}`));
  console.log();

  // ── Official section ──────────────────────────────────────────────────────
  if (officialFiltered.length > 0) {
    if (opts.all) console.log(chalk.bold.green('  ✦ OFFICIAL'));

    const grouped = officialFiltered.reduce((acc, item) => {
      const mono = item.key.split('-')[0];
      (acc[mono] = acc[mono] ?? []).push(item);
      return acc;
    }, {} as Record<string, TemplateMatch[]>);

    Object.entries(grouped).forEach(([mono, items]) => {
      if (!opts.all) console.log(chalk.bold.green(`  ${mono.toUpperCase()}`));

      const table = new Table({
        head: [chalk.cyan.bold('Template Key'), chalk.cyan.bold('Description'), chalk.cyan.bold('Features')],
        style: { head: [], border: ['gray'] },
        colWidths: [50, 38, 30],
        wordWrap: true,
      });

      items.forEach(({ key, metadata }) => {
        table.push([
          chalk.white(key) + '\n' + chalk.green('✦ official'),
          chalk.gray(metadata.description),
          chalk.yellow(metadata.features.slice(0, 3).join(', ')),
        ]);
      });

      console.log(table.toString());
      console.log();
    });
  }

  // ── Contributed section ───────────────────────────────────────────────────
  if (contributedFiltered.length > 0) {
    if (opts.all) console.log(chalk.bold.yellow('  ◆ CONTRIBUTED'));

    const table = new Table({
      head: [chalk.cyan.bold('Template Key'), chalk.cyan.bold('Description'), chalk.cyan.bold('Contributor')],
      style: { head: [], border: ['gray'] },
      colWidths: [50, 40, 26],
      wordWrap: true,
    });

    contributedFiltered.forEach(({ key, metadata }) => {
      const contrib = metadata.contributor;
      const byLine  = contrib
        ? chalk.cyan(`@${contrib.github}`) + '\n' + chalk.dim(contrib.repoUrl)
        : chalk.dim('unknown');
      table.push([
        chalk.white(key) + '\n' + chalk.dim(metadata.id ?? 'no-uuid'),
        chalk.gray(metadata.description),
        byLine,
      ]);
    });

    console.log(table.toString());
    console.log();
  }

  // ── Usage tip ─────────────────────────────────────────────────────────────
  console.log(boxen(
    chalk.white.bold('Official templates') + chalk.gray(' (wizard / stack flags):\n') +
    chalk.cyan('  npx create-fs-app my-app\n') +
    chalk.cyan('  npx create-fs-app my-app --frontend next.js --backend nest.js --database postgresql\n\n') +
    chalk.white.bold('Contributed templates') + chalk.gray(' (--template UUID):\n') +
    chalk.cyan('  npx create-fs-app my-app --template <uuid>\n') +
    chalk.cyan('  npx create-fs-app list --contributed   # browse & copy UUID\n\n') +
    chalk.white.bold('Filter & search:\n') +
    chalk.cyan('  npx create-fs-app list --contributed\n') +
    chalk.cyan('  npx create-fs-app list --all\n') +
    chalk.cyan('  npx create-fs-app list graphql'),
    {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round', borderColor: 'blue',
      title: chalk.bold.blue('💡 Tip'), titleAlignment: 'left',
    }
  ));
}

// ── Resolution functions ──────────────────────────────────────────────────────

/**
 * Resolve a user-supplied name within the CONTRIBUTED registry only.
 * Used by the --template flag.
 */
export function getContributedByName(name: string): TemplateResolution {
  return resolveFrom(listContributedTemplates(), name);
}

/**
 * Resolve a contributed template by its exact UUID v4.
 * Used by --template flag (UUID-only mode).
 */
export function getContributedByUUID(uuid: string): TemplateMatch | null {
  const all = listContributedTemplates();
  return all.find(t => t.metadata.id === uuid) ?? null;
}

/**
 * Resolve a user-supplied name within the OFFICIAL registry only.
 * Used by the `info` command when searching official templates.
 */
export function getOfficialByName(name: string): TemplateResolution {
  return resolveFrom(listOfficialTemplates(), name);
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export function getTemplateStats() {
  const official    = listOfficialTemplates();
  const contributed = listContributedTemplates();
  return {
    total:      official.length + contributed.length,
    official:   official.length,
    contributed: contributed.length,
  };
}

export function displayTemplateStats(): void {
  const s = getTemplateStats();
  console.log(chalk.bold.cyan('\n📊 Template Statistics\n'));
  console.log(chalk.green(`Total:       ${s.total}`));
  console.log(chalk.green(`Official:    ${s.official}`));
  console.log(chalk.green(`Contributed: ${s.contributed}`));
  console.log();
}
