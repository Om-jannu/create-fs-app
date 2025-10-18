/**
 * Template listing and management utilities
 */
/**
 * Display all available templates in a formatted table
 */
export declare function displayAvailableTemplates(): void;
/**
 * Get template by name/key
 */
export declare function getTemplateByName(name: string): {
    key: string;
    metadata: import("./template-registry.js").TemplateMetadata;
} | undefined;
/**
 * Search templates by keyword
 */
export declare function searchTemplates(keyword: string): {
    key: string;
    metadata: import("./template-registry.js").TemplateMetadata;
}[];
/**
 * Get template statistics
 */
export declare function getTemplateStats(): {
    total: number;
    byMonorepo: Record<string, number>;
    byFrontend: Record<string, number>;
    byBackend: Record<string, number>;
};
/**
 * Display template statistics
 */
export declare function displayTemplateStats(): void;
