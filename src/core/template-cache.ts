/**
 * Template Caching System
 * Caches templates locally for faster project creation
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { execa } from 'execa';
import { Logger } from '../utils/logger.js';
import { TemplateMetadata } from './template-registry.js';

const CACHE_DIR = path.join(os.homedir(), '.create-fs-app', 'cache');
const CACHE_VERSION = '1';
const CACHE_METADATA_FILE = 'cache-metadata.json';

interface CacheMetadata {
  version: string;
  templates: Record<string, {
    url: string;
    branch: string;
    cachedAt: string;
    lastUsed: string;
  }>;
}

/**
 * Initialize cache directory
 */
async function ensureCacheDir(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    Logger.debug(`Cache directory: ${CACHE_DIR}`);
  } catch (error) {
    Logger.warn('Failed to create cache directory');
  }
}

/**
 * Get cache metadata
 */
async function getCacheMetadata(): Promise<CacheMetadata> {
  const metadataPath = path.join(CACHE_DIR, CACHE_METADATA_FILE);
  
  try {
    const content = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {
      version: CACHE_VERSION,
      templates: {}
    };
  }
}

/**
 * Save cache metadata
 */
async function saveCacheMetadata(metadata: CacheMetadata): Promise<void> {
  const metadataPath = path.join(CACHE_DIR, CACHE_METADATA_FILE);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Generate cache key for a template
 */
function getCacheKey(template: TemplateMetadata): string {
  const url = template.url.replace(/https?:\/\//, '').replace(/\.git$/, '');
  const branch = template.branch || 'main';
  const subfolder = template.subfolder || '';
  return `${url}-${branch}-${subfolder}`.replace(/[^a-z0-9-]/gi, '_');
}

/**
 * Check if template is cached
 */
export async function isTemplateCached(template: TemplateMetadata): Promise<boolean> {
  await ensureCacheDir();
  const cacheKey = getCacheKey(template);
  const cachePath = path.join(CACHE_DIR, cacheKey);
  
  try {
    await fs.access(cachePath);
    Logger.debug(`Template found in cache: ${cacheKey}`);
    return true;
  } catch {
    Logger.debug(`Template not in cache: ${cacheKey}`);
    return false;
  }
}

/**
 * Get cached template path
 */
export async function getCachedTemplatePath(template: TemplateMetadata): Promise<string | null> {
  const isCached = await isTemplateCached(template);
  if (!isCached) return null;
  
  const cacheKey = getCacheKey(template);
  const cachePath = path.join(CACHE_DIR, cacheKey);
  
  // Update last used time
  const metadata = await getCacheMetadata();
  if (metadata.templates[cacheKey]) {
    metadata.templates[cacheKey].lastUsed = new Date().toISOString();
    await saveCacheMetadata(metadata);
  }
  
  return cachePath;
}

/**
 * Cache a template
 */
export async function cacheTemplate(
  template: TemplateMetadata,
  branch: string = 'main'
): Promise<string> {
  await ensureCacheDir();
  
  const cacheKey = getCacheKey(template);
  const cachePath = path.join(CACHE_DIR, cacheKey);
  
  Logger.verbose(`Caching template: ${cacheKey}`);
  
  try {
    // Remove existing cache if present
    try {
      await fs.rm(cachePath, { recursive: true, force: true });
    } catch {}
    
    // Clone to cache
    if (template.subfolder) {
      // Clone entire repo to temp, then copy subfolder
      const tempPath = path.join(CACHE_DIR, `temp-${cacheKey}`);
      
      try {
        await execa('git', [
          'clone',
          '--depth', '1',
          '--branch', branch,
          '--single-branch',
          template.url,
          tempPath
        ]);
        
        const templatePath = path.join(tempPath, template.subfolder);
        await fs.cp(templatePath, cachePath, { recursive: true });
        await fs.rm(tempPath, { recursive: true, force: true });
      } catch (error) {
        await fs.rm(tempPath, { recursive: true, force: true }).catch(() => {});
        throw error;
      }
    } else {
      // Direct clone
      await execa('git', [
        'clone',
        '--depth', '1',
        '--branch', branch,
        template.url,
        cachePath
      ]);
      
      // Remove .git directory
      const gitDir = path.join(cachePath, '.git');
      await fs.rm(gitDir, { recursive: true, force: true });
    }
    
    // Update metadata
    const metadata = await getCacheMetadata();
    metadata.templates[cacheKey] = {
      url: template.url,
      branch,
      cachedAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
    await saveCacheMetadata(metadata);
    
    Logger.debug(`Template cached successfully: ${cacheKey}`);
    return cachePath;
  } catch (error) {
    Logger.warn(`Failed to cache template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Copy cached template to target directory
 */
export async function copyCachedTemplate(
  cachePath: string,
  targetDir: string
): Promise<void> {
  Logger.verbose(`Copying from cache to ${targetDir}`);
  await fs.cp(cachePath, targetDir, { recursive: true });
}

/**
 * Clear template cache
 */
export async function clearCache(): Promise<void> {
  try {
    await fs.rm(CACHE_DIR, { recursive: true, force: true });
    Logger.success('Cache cleared successfully');
  } catch (error) {
    Logger.error('Failed to clear cache');
    throw error;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalTemplates: number;
  cacheSize: string;
  templates: Array<{ key: string; url: string; cachedAt: string; lastUsed: string }>;
}> {
  await ensureCacheDir();
  const metadata = await getCacheMetadata();
  
  // Calculate cache size
  let totalSize = 0;
  for (const key of Object.keys(metadata.templates)) {
    const cachePath = path.join(CACHE_DIR, key);
    try {
      const stats = await fs.stat(cachePath);
      totalSize += stats.size;
    } catch {}
  }
  
  const cacheSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  return {
    totalTemplates: Object.keys(metadata.templates).length,
    cacheSize: `${cacheSizeMB} MB`,
    templates: Object.entries(metadata.templates).map(([key, data]) => ({
      key,
      ...data
    }))
  };
}
