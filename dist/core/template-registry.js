/**
 * Template Registry
 * Maps user configuration to template repository URLs
 *
 * Template Naming Convention:
 * {monorepo}-{frontend}-{backend}-{database}-{orm}
 * Example: turborepo-nextjs-nestjs-postgres-prisma
 */
// Single monorepo containing all templates
const TEMPLATE_REPO_URL = 'https://github.com/Om-jannu/create-fs-app-templates';
const TEMPLATE_BRANCH = 'main';
const TEMPLATES_FOLDER = 'templates';
/**
 * Template registry - maps configuration to template URLs
 *
 * Strategy:
 * 1. Create template repos with naming: template-{stack}
 * 2. Each template is a complete, working project
 * 3. Templates include placeholder variables for customization
 */
export const TEMPLATE_REGISTRY = {
    // All templates are in a single repository under the 'templates' folder
    // Repository structure: create-fs-app-templates/templates/{template-name}/
    'turborepo-nextjs-nestjs-postgresql-prisma': {
        url: TEMPLATE_REPO_URL,
        branch: TEMPLATE_BRANCH,
        subfolder: `${TEMPLATES_FOLDER}/turborepo-nextjs-nestjs-postgresql-prisma`,
        description: 'Turborepo with Next.js, NestJS, PostgreSQL, and Prisma',
        features: ['TypeScript', 'Tailwind CSS', 'Docker', 'ESLint', 'Prettier']
    },
    'turborepo-react-express-mongodb-mongoose': {
        url: TEMPLATE_REPO_URL,
        branch: TEMPLATE_BRANCH,
        subfolder: `${TEMPLATES_FOLDER}/turborepo-react-express-mongodb-mongoose`,
        description: 'Turborepo with React (Vite), Express, MongoDB, and Mongoose',
        features: ['TypeScript', 'Tailwind CSS', 'Docker', 'Testing']
    },
    // Add more templates as you create them
    // All in the same repository under templates/ folder
};
/**
 * Generate a template key from user configuration
 */
export function getTemplateKey(config) {
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
export function getTemplate(config) {
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
    const closestMatch = Object.keys(TEMPLATE_REGISTRY).find(k => k.startsWith(partialKey.toLowerCase()));
    return closestMatch ? TEMPLATE_REGISTRY[closestMatch] : null;
}
/**
 * Create template metadata from custom URL
 */
export function createCustomTemplate(url, branch = 'main', subfolder) {
    return {
        url,
        branch,
        subfolder,
        description: 'Custom template from URL',
        features: ['Custom']
    };
}
/**
 * List all available templates
 */
export function listAllTemplates() {
    return Object.entries(TEMPLATE_REGISTRY).map(([key, metadata]) => ({
        key,
        metadata
    }));
}
/**
 * Check if a template exists for the given configuration
 */
export function hasTemplate(config) {
    return getTemplate(config) !== null;
}
/**
 * Get suggested alternatives if exact template doesn't exist
 */
export function getSuggestedTemplates(config) {
    const { monorepo, apps } = config;
    return Object.entries(TEMPLATE_REGISTRY)
        .filter(([key]) => key.startsWith(monorepo))
        .map(([_, metadata]) => metadata)
        .slice(0, 3);
}
//# sourceMappingURL=template-registry.js.map