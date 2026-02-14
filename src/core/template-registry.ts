/**
 * Template Registry
 * Maps user configuration to template repository URLs
 * 
 * Template Naming Convention:
 * {monorepo}-{frontend}-{backend}-{database}-{orm}
 * Example: turborepo-nextjs-nestjs-postgres-prisma
 */

import { ProjectConfig, MonorepoFramework, FrontendFramework, BackendFramework, Database } from '../types/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface TemplateMetadata {
  url?: string;
  branch?: string;
  subfolder?: string;
  localPath?: string; // Path to local template (for development only)
  description: string;
  features: string[];
}

// Templates repository (same repo, but templates/ folder is excluded from npm package)
const TEMPLATE_REPO_URL = 'https://github.com/Om-jannu/create-fs-app';
const TEMPLATE_BRANCH = 'master';

// Local templates directory (only used in development)
const LOCAL_TEMPLATES_DIR = path.join(__dirname, '../../templates');

/**
 * Template registry - maps configuration to template metadata
 * 
 * Templates are stored in a separate GitHub repository to keep the CLI package small.
 * Repository: https://github.com/Om-jannu/create-fs-app-templates
 * 
 * For local development, templates can be in the templates/ folder.
 */
export const TEMPLATE_REGISTRY: Record<string, TemplateMetadata> = {
  'turborepo-nextjs-nestjs-postgresql-prisma': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-nextjs-nestjs-postgresql-prisma',
    description: 'Turborepo with Next.js, NestJS, PostgreSQL, and Prisma',
    features: ['TypeScript', 'Tailwind CSS', 'Docker', 'ESLint', 'Prettier']
  },
  'turborepo-react-express-mongodb-mongoose': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-react-express-mongodb-mongoose',
    description: 'Turborepo with React (Vite), Express, MongoDB, and Mongoose',
    features: ['TypeScript', 'Tailwind CSS', 'Docker', 'Testing']
  },
};

/**
 * Generate a template key from user configuration
 */
export function getTemplateKey(config: ProjectConfig): string {
  const { monorepo, apps } = config;
  const frontend = apps.frontend.framework.replace('.', '');
  const backend = apps.backend.framework.replace('.', '');
  const database = apps.backend.database;
  const orm = apps.backend.orm || 'none';

  return `${monorepo}-${frontend}-${backend}-${database}-${orm}`.toLowerCase();
}

/**
 * Get template metadata for a configuration
 */
export function getTemplate(config: ProjectConfig): TemplateMetadata | null {
  const key = getTemplateKey(config);
  
  // Try exact match first
  if (TEMPLATE_REGISTRY[key]) {
    return TEMPLATE_REGISTRY[key];
  }

  // Try without ORM
  const keyWithoutOrm = key.replace(`-${config.apps.backend.orm}`, '');
  if (TEMPLATE_REGISTRY[keyWithoutOrm]) {
    return TEMPLATE_REGISTRY[keyWithoutOrm];
  }

  // Try to find closest match by framework combination
  const partialKey = `${config.monorepo}-${config.apps.frontend.framework.replace('.', '')}-${config.apps.backend.framework.replace('.', '')}`;
  
  const closestMatch = Object.keys(TEMPLATE_REGISTRY).find(k => 
    k.startsWith(partialKey.toLowerCase())
  );

  return closestMatch ? TEMPLATE_REGISTRY[closestMatch] : null;
}

/**
 * Create template metadata from custom URL
 */
export function createCustomTemplate(
  url: string,
  branch: string = 'main',
  subfolder?: string
): TemplateMetadata {
  return {
    url,
    branch,
    subfolder,
    description: 'Custom template from URL',
    features: ['Custom']
  };
}

/**
 * Get local templates directory
 */
export function getLocalTemplatesDir(): string {
  return LOCAL_TEMPLATES_DIR;
}

/**
 * List all available templates
 */
export function listAllTemplates(): Array<{ key: string; metadata: TemplateMetadata }> {
  return Object.entries(TEMPLATE_REGISTRY).map(([key, metadata]) => ({
    key,
    metadata
  }));
}

/**
 * Check if a template exists for the given configuration
 */
export function hasTemplate(config: ProjectConfig): boolean {
  return getTemplate(config) !== null;
}

/**
 * Get suggested alternatives if exact template doesn't exist
 */
export function getSuggestedTemplates(config: ProjectConfig): TemplateMetadata[] {
  const { monorepo, apps } = config;
  
  return Object.entries(TEMPLATE_REGISTRY)
    .filter(([key]) => key.startsWith(monorepo))
    .map(([_, metadata]) => metadata)
    .slice(0, 3);
}

