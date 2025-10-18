/**
 * Template Cloning and Customization
 * Handles downloading templates and customizing them for the user
 */
import { ProjectConfig } from '../types/index.js';
import { TemplateMetadata } from './template-registry.js';
export interface CloneOptions {
    targetDir: string;
    config: ProjectConfig;
    depth?: number;
}
/**
 * Clone a template repository
 */
export declare function cloneTemplate(template: TemplateMetadata, targetDir: string, branch?: string): Promise<void>;
/**
 * Customize the cloned template with user's configuration
 */
export declare function customizeTemplate(targetDir: string, config: ProjectConfig): Promise<void>;
/**
 * Initialize git repository
 */
export declare function initializeGit(targetDir: string, config: ProjectConfig): Promise<void>;
/**
 * Install dependencies
 */
export declare function installDependencies(targetDir: string, packageManager: string): Promise<void>;
