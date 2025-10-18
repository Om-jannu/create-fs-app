/**
 * Project Scaffolding
 * Main orchestrator for creating projects from templates
 */
import path from 'path';
import { getTemplate, getSuggestedTemplates } from './template-registry.js';
import { cloneTemplate, customizeTemplate, initializeGit, installDependencies } from './template-clone.js';
/**
 * Main scaffolding function - creates project from template
 */
export async function scaffoldProject(config, options = {}) {
    const { name } = config;
    const targetDir = path.join(process.cwd(), name);
    try {
        // 1. Check if template exists
        const template = getTemplate(config);
        if (!template) {
            throw new TemplateNotFoundError(config);
        }
        console.log(`\n📦 Using template: ${template.description}`);
        console.log(`Features: ${template.features.join(', ')}\n`);
        // 2. Clone the template
        console.log('⬇️  Downloading template...');
        await cloneTemplate(template, targetDir, template.branch);
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
    }
    catch (error) {
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
    suggestions;
    constructor(config) {
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
export async function validateProjectDirectory(name) {
    const targetDir = path.join(process.cwd(), name);
    const fs = await import('fs/promises');
    try {
        await fs.access(targetDir);
        throw new Error(`Directory "${name}" already exists. Please choose a different name or remove the existing directory.`);
    }
    catch (error) {
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
export function checkTemplateAvailability(config) {
    const template = getTemplate(config);
    if (template) {
        return { available: true, template };
    }
    const suggestions = getSuggestedTemplates(config)
        .map(t => t.description);
    return { available: false, suggestions };
}
//# sourceMappingURL=scaffold.js.map