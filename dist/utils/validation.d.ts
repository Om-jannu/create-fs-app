/**
 * Input validation utilities
 */
/**
 * Validate project name
 * - Must contain only letters, numbers, hyphens, and underscores
 * - Cannot start with . or _
 * - Must be less than 214 characters
 * - Cannot be a reserved name
 */
export declare function validateProjectName(name: string): {
    valid: boolean;
    error?: string;
};
/**
 * Validate and throw if invalid
 */
export declare function assertValidProjectName(name: string): void;
/**
 * Validate template URL
 */
export declare function validateTemplateUrl(url: string): {
    valid: boolean;
    error?: string;
};
