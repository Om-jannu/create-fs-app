/**
 * Configuration Presets System
 * Save and load favorite stack configurations
 */
import { ProjectConfig } from '../types/index.js';
export interface Preset {
    name: string;
    description?: string;
    config: Omit<ProjectConfig, 'name'>;
    createdAt: string;
    lastUsed?: string;
}
/**
 * Save a preset
 */
export declare function savePreset(name: string, config: ProjectConfig, description?: string): Promise<void>;
/**
 * Load a preset
 */
export declare function loadPreset(name: string): Promise<Preset | null>;
/**
 * List all presets
 */
export declare function listPresets(): Promise<Preset[]>;
/**
 * Delete a preset
 */
export declare function deletePreset(name: string): Promise<boolean>;
/**
 * Check if preset exists
 */
export declare function hasPreset(name: string): Promise<boolean>;
/**
 * Get preset configuration merged with project name
 */
export declare function getPresetConfig(presetName: string, projectName: string): Promise<ProjectConfig | null>;
/**
 * Built-in presets
 */
export declare const BUILTIN_PRESETS: Record<string, Omit<Preset, 'createdAt'>>;
/**
 * Get built-in preset
 */
export declare function getBuiltinPreset(name: string): Preset | null;
