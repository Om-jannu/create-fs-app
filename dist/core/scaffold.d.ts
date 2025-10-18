/**
 * Project Scaffolding
 * Main orchestrator for creating projects from templates
 */
import { ProjectConfig } from '../types/index.js';
export interface ScaffoldOptions {
    skipGit?: boolean;
    skipInstall?: boolean;
}
/**
 * Main scaffolding function - creates project from template
 */
export declare function scaffoldProject(config: ProjectConfig, options?: ScaffoldOptions): Promise<void>;
/**
 * Custom error for when a template doesn't exist
 */
export declare class TemplateNotFoundError extends Error {
    suggestions: string[];
    constructor(config: ProjectConfig);
}
/**
 * Validate that a project directory doesn't already exist
 */
export declare function validateProjectDirectory(name: string): Promise<void>;
/**
 * Check if template exists before starting
 */
export declare function checkTemplateAvailability(config: ProjectConfig): {
    available: boolean;
    template?: any;
    suggestions?: string[];
};
