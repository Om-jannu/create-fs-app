/**
 * Custom error classes with helpful messages
 */
export declare class ProjectError extends Error {
    readonly code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
/**
 * Enhance error messages with helpful context
 */
export declare function enhanceError(error: any): Error;
/**
 * Format error for display
 */
export declare function formatError(error: any): string;
