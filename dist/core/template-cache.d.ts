/**
 * Template Caching System
 * Caches templates locally for faster project creation
 */
import { TemplateMetadata } from './template-registry.js';
/**
 * Check if template is cached
 */
export declare function isTemplateCached(template: TemplateMetadata): Promise<boolean>;
/**
 * Get cached template path
 */
export declare function getCachedTemplatePath(template: TemplateMetadata): Promise<string | null>;
/**
 * Cache a template
 */
export declare function cacheTemplate(template: TemplateMetadata, branch?: string): Promise<string>;
/**
 * Copy cached template to target directory
 */
export declare function copyCachedTemplate(cachePath: string, targetDir: string): Promise<void>;
/**
 * Clear template cache
 */
export declare function clearCache(): Promise<void>;
/**
 * Get cache statistics
 */
export declare function getCacheStats(): Promise<{
    totalTemplates: number;
    cacheSize: string;
    templates: Array<{
        key: string;
        url: string;
        cachedAt: string;
        lastUsed: string;
    }>;
}>;
