/**
 * Template Registry
 * Maps user configuration to template repository URLs
 *
 * Template Naming Convention:
 * {monorepo}-{frontend}-{backend}-{database}-{orm}
 * Example: turborepo-nextjs-nestjs-postgres-prisma
 */
import { ProjectConfig } from '../types/index.js';
export interface TemplateMetadata {
    url: string;
    branch?: string;
    subfolder?: string;
    description: string;
    features: string[];
}
/**
 * Template registry - maps configuration to template URLs
 *
 * Strategy:
 * 1. Create template repos with naming: template-{stack}
 * 2. Each template is a complete, working project
 * 3. Templates include placeholder variables for customization
 */
export declare const TEMPLATE_REGISTRY: Record<string, TemplateMetadata>;
/**
 * Generate a template key from user configuration
 */
export declare function getTemplateKey(config: ProjectConfig): string;
/**
 * Get template metadata for a configuration
 */
export declare function getTemplate(config: ProjectConfig): TemplateMetadata | null;
/**
 * Create template metadata from custom URL
 */
export declare function createCustomTemplate(url: string, branch?: string, subfolder?: string): TemplateMetadata;
/**
 * List all available templates
 */
export declare function listAllTemplates(): Array<{
    key: string;
    metadata: TemplateMetadata;
}>;
/**
 * Check if a template exists for the given configuration
 */
export declare function hasTemplate(config: ProjectConfig): boolean;
/**
 * Get suggested alternatives if exact template doesn't exist
 */
export declare function getSuggestedTemplates(config: ProjectConfig): TemplateMetadata[];
