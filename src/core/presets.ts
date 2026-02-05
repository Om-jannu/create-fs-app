/**
 * Configuration Presets System
 * Save and load favorite stack configurations
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ProjectConfig } from '../types/index.js';
import { Logger } from '../utils/logger.js';

const PRESETS_DIR = path.join(os.homedir(), '.create-fs-app', 'presets');
const PRESETS_FILE = path.join(PRESETS_DIR, 'presets.json');

export interface Preset {
  name: string;
  description?: string;
  config: Omit<ProjectConfig, 'name'>; // Exclude name as it's project-specific
  createdAt: string;
  lastUsed?: string;
}

interface PresetsData {
  version: string;
  presets: Record<string, Preset>;
}

/**
 * Ensure presets directory exists
 */
async function ensurePresetsDir(): Promise<void> {
  try {
    await fs.mkdir(PRESETS_DIR, { recursive: true });
  } catch (error) {
    Logger.warn('Failed to create presets directory');
  }
}

/**
 * Load all presets
 */
async function loadPresets(): Promise<PresetsData> {
  await ensurePresetsDir();
  
  try {
    const content = await fs.readFile(PRESETS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {
      version: '1',
      presets: {}
    };
  }
}

/**
 * Save presets
 */
async function savePresets(data: PresetsData): Promise<void> {
  await ensurePresetsDir();
  await fs.writeFile(PRESETS_FILE, JSON.stringify(data, null, 2));
}

/**
 * Save a preset
 */
export async function savePreset(
  name: string,
  config: ProjectConfig,
  description?: string
): Promise<void> {
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
export async function loadPreset(name: string): Promise<Preset | null> {
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
export async function listPresets(): Promise<Preset[]> {
  const data = await loadPresets();
  return Object.values(data.presets);
}

/**
 * Delete a preset
 */
export async function deletePreset(name: string): Promise<boolean> {
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
export async function hasPreset(name: string): Promise<boolean> {
  const data = await loadPresets();
  return name in data.presets;
}

/**
 * Get preset configuration merged with project name
 */
export async function getPresetConfig(presetName: string, projectName: string): Promise<ProjectConfig | null> {
  const preset = await loadPreset(presetName);
  
  if (!preset) {
    return null;
  }
  
  return {
    name: projectName,
    ...preset.config
  } as ProjectConfig;
}

/**
 * Built-in presets
 */
export const BUILTIN_PRESETS: Record<string, Omit<Preset, 'createdAt'>> = {
  'saas-starter': {
    name: 'saas-starter',
    description: 'Modern SaaS application with Next.js, NestJS, PostgreSQL, and Prisma',
    config: {
      monorepo: 'turborepo' as any,
      packageManager: 'pnpm' as any,
      apps: {
        frontend: {
          framework: 'next.js' as any,
          styling: 'tailwind',
          linting: true
        },
        backend: {
          framework: 'nest.js' as any,
          database: 'postgresql' as any,
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
      monorepo: 'turborepo' as any,
      packageManager: 'npm' as any,
      apps: {
        frontend: {
          framework: 'react' as any,
          styling: 'tailwind',
          linting: true
        },
        backend: {
          framework: 'express' as any,
          database: 'mongodb' as any,
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
      monorepo: 'turborepo' as any,
      packageManager: 'npm' as any,
      apps: {
        frontend: {
          framework: 'react' as any,
          styling: 'css',
          linting: false
        },
        backend: {
          framework: 'express' as any,
          database: 'postgresql' as any,
          docker: false
        }
      }
    }
  }
};

/**
 * Get built-in preset
 */
export function getBuiltinPreset(name: string): Preset | null {
  const builtin = BUILTIN_PRESETS[name];
  if (!builtin) return null;
  
  return {
    ...builtin,
    createdAt: new Date().toISOString()
  };
}
