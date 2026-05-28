/**
 * Project Scaffolding
 * Main orchestrator for creating projects from templates
 */

import path from 'path';
import { ProjectConfig } from '../types/index.js';
import { TemplateMetadata, getTemplate, hasTemplate, getSuggestedTemplates } from './template-registry.js';
import {
  cloneTemplate,
  customizeTemplate,
  initializeGit,
  installDependencies
} from './template-clone.js';

export interface ScaffoldOptions {
  skipGit?: boolean;
  skipInstall?: boolean;
  /** Skip reading from and writing to the local template cache. Forces a fresh GitHub download. */
  skipCache?: boolean;
  /** Absolute path to a local templates repo (e.g. /home/you/create-fs-app-templates).
   *  When set the CLI skips GitHub and copies the template from localTemplatesDir/templates/<key>. */
  localTemplatesDir?: string;
  /** Provide a template directly (e.g. from --template-url) instead of looking one up in the registry. */
  customTemplate?: TemplateMetadata;
}

/**
 * Main scaffolding function - creates project from template
 */
export async function scaffoldProject(
  config: ProjectConfig,
  options: ScaffoldOptions = {}
): Promise<void> {
  const { name } = config;
  const targetDir = path.join(process.cwd(), name);

  try {
    // 1. Resolve template — custom (--template-url) takes priority over registry lookup
    let template: TemplateMetadata | null = options.customTemplate ?? getTemplate(config);

    if (!template) {
      throw new TemplateNotFoundError(config);
    }

    // Override with local path when --local-templates is set
    if (options.localTemplatesDir) {
      const { getTemplateKey } = await import('./template-registry.js');
      const key = getTemplateKey(config);
      const localPath = path.join(options.localTemplatesDir, 'templates', key);
      template = { ...template, localPath, url: undefined, subfolder: undefined };
      console.log(`\n🗂️  Local template: ${localPath}`);
    } else {
      console.log(`\n📦 Using template: ${template.description}`);
    }
    console.log(`Features: ${template.features.join(', ')}\n`);

    // 2. Clone the template
    console.log('⬇️  Downloading template...');
    await cloneTemplate(template, targetDir, template.branch ?? 'main', options.skipCache ?? false);
    console.log('✓ Template downloaded\n');

    // 3. Customize the template
    console.log('🔧 Customizing template...');
    await customizeTemplate(targetDir, config);
    console.log('✓ Template customized\n');

    // 4. Initialize git (if not skipped)
    if (!options.skipGit) {
      console.log('📝 Initializing git repository...');
      await initializeGit(targetDir, config);
    }

    // 5. Install dependencies (if not skipped)
    if (!options.skipInstall) {
      console.log('📦 Installing dependencies...');
      await installDependencies(targetDir, config.packageManager);
    }

    console.log('\n✨ Project created successfully!\n');
    
    // Ensure cursor is visible
    process.stdout.write('\x1B[?25h');

  } catch (error) {
    // Ensure cursor is visible on error
    process.stdout.write('\x1B[?25h');
    
    if (error instanceof TemplateNotFoundError) {
      throw error;
    }
    throw new Error(`Failed to scaffold project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Custom error for when a template doesn't exist
 */
export class TemplateNotFoundError extends Error {
  public suggestions: string[];

  constructor(config: ProjectConfig) {
    const message = `
❌ Template not found for your configuration:
   - Monorepo: ${config.monorepo}
   - Frontend: ${config.apps.frontend.framework}
   - Backend: ${config.apps.backend.framework}
   - Database: ${config.apps.backend.database}
   - ORM: ${config.apps.backend.orm || 'none'}

This combination doesn't have a pre-built template yet.
`;

    super(message);
    this.name = 'TemplateNotFoundError';
    
    // Get suggested alternatives
    const suggested = getSuggestedTemplates(config);
    this.suggestions = suggested.map(t => t.description);
  }
}

/**
 * Validate that a project directory doesn't already exist
 */
export async function validateProjectDirectory(name: string): Promise<void> {
  const targetDir = path.join(process.cwd(), name);
  const fs = await import('fs/promises');
  
  try {
    await fs.access(targetDir);
    throw new Error(`Directory "${name}" already exists. Please choose a different name or remove the existing directory.`);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Directory doesn't exist, which is what we want
      return;
    }
    throw error;
  }
}

/**
 * Check if template exists before starting
 */
export function checkTemplateAvailability(config: ProjectConfig): {
  available: boolean;
  template?: any;
  suggestions?: string[];
} {
  const template = getTemplate(config);
  
  if (template) {
    return { available: true, template };
  }

  const suggestions = getSuggestedTemplates(config)
    .map(t => t.description);

  return { available: false, suggestions };
}
