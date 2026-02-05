/**
 * Configuration Presets System
 * Save and load favorite stack configurations
 */
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { Logger } from '../utils/logger.js';
const PRESETS_DIR = path.join(os.homedir(), '.create-fs-app', 'presets');
const PRESETS_FILE = path.join(PRESETS_DIR, 'presets.json');
/**
 * Ensure presets directory exists
 */
async function ensurePresetsDir() {
    try {
        await fs.mkdir(PRESETS_DIR, { recursive: true });
    }
    catch (error) {
        Logger.warn('Failed to create presets directory');
    }
}
/**
 * Load all presets
 */
async function loadPresets() {
    await ensurePresetsDir();
    try {
        const content = await fs.readFile(PRESETS_FILE, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return {
            version: '1',
            presets: {}
        };
    }
}
/**
 * Save presets
 */
async function savePresets(data) {
    await ensurePresetsDir();
    await fs.writeFile(PRESETS_FILE, JSON.stringify(data, null, 2));
}
/**
 * Save a preset
 */
export async function savePreset(name, config, description) {
    const data = await loadPresets();
    // Remove project name from config
    const { name: _, ...configWithoutName } = config;
    data.presets[name] = {
        name,
        description,
        config: configWithoutName,
        createdAt: new Date().toISOString()
    };
    await savePresets(data);
    Logger.success(`Preset "${name}" saved successfully`);
}
/**
 * Load a preset
 */
export async function loadPreset(name) {
    const data = await loadPresets();
    const preset = data.presets[name];
    if (preset) {
        // Update last used time
        preset.lastUsed = new Date().toISOString();
        data.presets[name] = preset;
        await savePresets(data);
    }
    return preset || null;
}
/**
 * List all presets
 */
export async function listPresets() {
    const data = await loadPresets();
    return Object.values(data.presets);
}
/**
 * Delete a preset
 */
export async function deletePreset(name) {
    const data = await loadPresets();
    if (data.presets[name]) {
        delete data.presets[name];
        await savePresets(data);
        Logger.success(`Preset "${name}" deleted successfully`);
        return true;
    }
    return false;
}
/**
 * Check if preset exists
 */
export async function hasPreset(name) {
    const data = await loadPresets();
    return name in data.presets;
}
/**
 * Get preset configuration merged with project name
 */
export async function getPresetConfig(presetName, projectName) {
    const preset = await loadPreset(presetName);
    if (!preset) {
        return null;
    }
    return {
        name: projectName,
        ...preset.config
    };
}
/**
 * Built-in presets
 */
export const BUILTIN_PRESETS = {
    'saas-starter': {
        name: 'saas-starter',
        description: 'Modern SaaS application with Next.js, NestJS, PostgreSQL, and Prisma',
        config: {
            monorepo: 'turborepo',
            packageManager: 'pnpm',
            apps: {
                frontend: {
                    framework: 'next.js',
                    styling: 'tailwind',
                    linting: true
                },
                backend: {
                    framework: 'nest.js',
                    database: 'postgresql',
                    orm: 'prisma',
                    docker: true
                }
            }
        }
    },
    'ecommerce': {
        name: 'ecommerce',
        description: 'E-commerce platform with React, Express, and MongoDB',
        config: {
            monorepo: 'turborepo',
            packageManager: 'npm',
            apps: {
                frontend: {
                    framework: 'react',
                    styling: 'tailwind',
                    linting: true
                },
                backend: {
                    framework: 'express',
                    database: 'mongodb',
                    orm: 'mongoose',
                    docker: true
                }
            }
        }
    },
    'minimal': {
        name: 'minimal',
        description: 'Minimal setup with React, Express, and PostgreSQL',
        config: {
            monorepo: 'turborepo',
            packageManager: 'npm',
            apps: {
                frontend: {
                    framework: 'react',
                    styling: 'css',
                    linting: false
                },
                backend: {
                    framework: 'express',
                    database: 'postgresql',
                    docker: false
                }
            }
        }
    }
};
/**
 * Get built-in preset
 */
export function getBuiltinPreset(name) {
    const builtin = BUILTIN_PRESETS[name];
    if (!builtin)
        return null;
    return {
        ...builtin,
        createdAt: new Date().toISOString()
    };
}
//# sourceMappingURL=presets.js.map