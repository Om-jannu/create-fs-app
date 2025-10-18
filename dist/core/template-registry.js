/**
 * Template Registry
 * Maps user configuration to template repository URLs
 *
 * Template Naming Convention:
 * {monorepo}-{frontend}-{backend}-{database}-{orm}
 * Example: turborepo-nextjs-nestjs-postgres-prisma
 */
// Base URL for your template repositories
// You can host all templates in one monorepo or separate repos
const TEMPLATE_BASE_URL = 'https://github.com/create-fs-app-templates';
/**
 * Template registry - maps configuration to template URLs
 *
 * Strategy:
 * 1. Create template repos with naming: template-{stack}
 * 2. Each template is a complete, working project
 * 3. Templates include placeholder variables for customization
 */
export const TEMPLATE_REGISTRY = {
    // Turborepo Templates
    'turborepo-nextjs-nestjs-postgresql-prisma': {
        url: `${TEMPLATE_BASE_URL}/template-turborepo-nextjs-nestjs-postgresql-prisma`,
        branch: 'main',
        description: 'Turborepo with Next.js, NestJS, PostgreSQL, and Prisma',
        features: ['TypeScript', 'Tailwind CSS', 'Docker', 'ESLint', 'Prettier']
    },
    'turborepo-react-express-mongodb-mongoose': {
        url: `${TEMPLATE_BASE_URL}/template-turborepo-react-express-mongodb-mongoose`,
        branch: 'main',
        description: 'Turborepo with React (Vite), Express, MongoDB, and Mongoose',
        features: ['TypeScript', 'Tailwind CSS', 'Docker', 'Testing']
    },
    'turborepo-nextjs-express-mysql-prisma': {
        url: `${TEMPLATE_BASE_URL}/template-turborepo-nextjs-express-mysql-prisma`,
        branch: 'main',
        description: 'Turborepo with Next.js, Express, MySQL, and Prisma',
        features: ['TypeScript', 'Styled Components', 'Docker']
    },
    'turborepo-vue-nestjs-postgresql-typeorm': {
        url: `${TEMPLATE_BASE_URL}/template-turborepo-vue-nestjs-postgresql-typeorm`,
        branch: 'main',
        description: 'Turborepo with Vue, NestJS, PostgreSQL, and TypeORM',
        features: ['TypeScript', 'Tailwind CSS', 'Docker']
    },
    // Nx Templates
    'nx-nextjs-nestjs-postgresql-prisma': {
        url: `${TEMPLATE_BASE_URL}/template-nx-nextjs-nestjs-postgresql-prisma`,
        branch: 'main',
        description: 'Nx workspace with Next.js, NestJS, PostgreSQL, and Prisma',
        features: ['TypeScript', 'Tailwind CSS', 'Testing', 'Storybook']
    },
    'nx-react-express-mongodb-mongoose': {
        url: `${TEMPLATE_BASE_URL}/template-nx-react-express-mongodb-mongoose`,
        branch: 'main',
        description: 'Nx workspace with React, Express, MongoDB, and Mongoose',
        features: ['TypeScript', 'CSS Modules', 'Testing']
    },
    // Lerna Templates
    'lerna-react-express-postgresql-prisma': {
        url: `${TEMPLATE_BASE_URL}/template-lerna-react-express-postgresql-prisma`,
        branch: 'main',
        description: 'Lerna monorepo with React, Express, PostgreSQL, and Prisma',
        features: ['TypeScript', 'Tailwind CSS', 'Docker']
    },
    // Add more template combinations as you create them
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