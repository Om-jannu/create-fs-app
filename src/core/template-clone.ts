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
  branch: string = 'main'
): Promise<void> {
  const { url, subfolder } = template;

  try {
    // Check if template is cached
    const cachedPath = await getCachedTemplatePath(template);
    
    if (cachedPath) {
      Logger.verbose('Using cached template');
      await copyCachedTemplate(cachedPath, targetDir);
      return;
    }
    
    Logger.verbose('Template not cached, downloading...');
    
    if (subfolder) {
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
        
        // Cache the template for future use
        Logger.verbose('Caching template for future use...');
        await cacheTemplate(template, branch).catch(err => {
          Logger.warn('Failed to cache template, continuing anyway');
        });
        
        // Clean up temp directory
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (error) {
        // Clean up temp directory on error
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch {}
        throw error;
      }
    } else {
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
      
      // Cache the template
      Logger.verbose('Caching template for future use...');
      await cacheTemplate(template, branch).catch(err => {
        Logger.warn('Failed to cache template, continuing anyway');
      });
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
  // 1. Update package.json with project name
  await updatePackageJson(targetDir, config);

  // 2. Replace placeholders in files
  await replacePlaceholders(targetDir, config);

  // 3. Update README with project-specific info
  await updateReadme(targetDir, config);

  // 4. Handle optional features (remove if not selected)
  await handleOptionalFeatures(targetDir, config);

  // 5. Update environment variables template
  await updateEnvTemplate(targetDir, config);
}

/**
 * Update root and nested package.json files
 */
async function updatePackageJson(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
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
      }

      // Update description
      pkg.description = `${config.name} - Full-stack application`;

      // Write back
      await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    } catch (error) {
      // File might not exist, that's okay
      continue;
    }
  }
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

- **Monorepo**: ${config.monorepo}
- **Frontend**: ${config.apps.frontend.framework} with ${config.apps.frontend.styling}
- **Backend**: ${config.apps.backend.framework}
- **Database**: ${config.apps.backend.database}
- **ORM**: ${config.apps.backend.orm || 'None'}
- **Package Manager**: ${config.packageManager}

`;
      readme = `# ${config.name}\n\n${techStack}${readme}`;
    }

    await fs.writeFile(readmePath, readme);
  } catch (error) {
    // README might not exist
  }
}

/**
 * Handle optional features - remove code/config for unselected features
 */
async function handleOptionalFeatures(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  // Remove Docker files if not selected
  if (!config.apps.backend.docker) {
    const dockerFiles = [
      path.join(targetDir, 'Dockerfile'),
      path.join(targetDir, 'docker-compose.yml'),
      path.join(targetDir, '.dockerignore'),
      path.join(targetDir, 'apps', 'backend', 'Dockerfile'),
      path.join(targetDir, 'apps', 'frontend', 'Dockerfile'),
    ];

    for (const file of dockerFiles) {
      try {
        await fs.unlink(file);
      } catch {
        // File doesn't exist, that's fine
      }
    }
  }

  // Remove linting config if not selected
  if (!config.apps.frontend.linting) {
    const lintFiles = [
      path.join(targetDir, '.eslintrc.json'),
      path.join(targetDir, '.prettierrc'),
      path.join(targetDir, 'apps', 'frontend', '.eslintrc.json'),
    ];

    for (const file of lintFiles) {
      try {
        await fs.unlink(file);
      } catch {
        // File doesn't exist
      }
    }
  }
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

