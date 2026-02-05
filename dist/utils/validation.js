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
export function validateProjectName(name) {
    if (!name || name.trim() === '') {
        return { valid: false, error: 'Project name cannot be empty' };
    }
    // Check for valid characters
    if (!/^[a-z0-9-_]+$/i.test(name)) {
        return {
            valid: false,
            error: `Project name can only contain letters, numbers, hyphens, and underscores.\nInvalid name: "${name}"`
        };
    }
    // Check length (npm package name limit)
    if (name.length > 214) {
        return { valid: false, error: 'Project name must be less than 214 characters' };
    }
    // Check if starts with . or _
    if (/^[._]/.test(name)) {
        return { valid: false, error: 'Project name cannot start with . or _' };
    }
    // Check for reserved names
    const reserved = ['node_modules', 'package.json', 'package-lock.json', 'npm', 'node'];
    if (reserved.includes(name.toLowerCase())) {
        return { valid: false, error: `"${name}" is a reserved name` };
    }
    return { valid: true };
}
/**
 * Validate and throw if invalid
 */
export function assertValidProjectName(name) {
    const result = validateProjectName(name);
    if (!result.valid) {
        throw new Error(result.error);
    }
}
/**
 * Validate template URL
 */
export function validateTemplateUrl(url) {
    if (!url || url.trim() === '') {
        return { valid: false, error: 'Template URL cannot be empty' };
    }
    // Check if it's a valid GitHub URL
    const githubPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+(\.git)?$/;
    if (!githubPattern.test(url)) {
        return {
            valid: false,
            error: 'Template URL must be a valid GitHub repository URL (https://github.com/user/repo)'
        };
    }
    return { valid: true };
}
//# sourceMappingURL=validation.js.map