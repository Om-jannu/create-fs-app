/**
 * Tests for presets system
 */

import { describe, it, expect, afterEach } from '@jest/globals';
import { 
  savePreset, 
  loadPreset, 
  listPresets, 
  deletePreset,
  hasPreset,
  getBuiltinPreset,
  BUILTIN_PRESETS 
} from '../src/core/presets.js';
import { ProjectConfig } from '../src/types/index.js';

describe('Presets', () => {
  const testConfig: ProjectConfig = {
    name: 'test-app',
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
  };

  afterEach(async () => {
    // Clean up test presets
    try {
      await deletePreset('test-preset');
    } catch {}
  });

  describe('savePreset', () => {
    it('should save a preset', async () => {
      await savePreset('test-preset', testConfig, 'Test preset');
      const exists = await hasPreset('test-preset');
      expect(exists).toBe(true);
    });
  });

  describe('loadPreset', () => {
    it('should load a saved preset', async () => {
      await savePreset('test-preset', testConfig, 'Test preset');
      const preset = await loadPreset('test-preset');
      
      expect(preset).not.toBeNull();
      expect(preset?.name).toBe('test-preset');
      expect(preset?.description).toBe('Test preset');
    });

    it('should return null for non-existent preset', async () => {
      const preset = await loadPreset('non-existent');
      expect(preset).toBeNull();
    });
  });

  describe('listPresets', () => {
    it('should list all presets', async () => {
      await savePreset('test-preset-1', testConfig);
      await savePreset('test-preset-2', testConfig);
      
      const presets = await listPresets();
      const testPresets = presets.filter(p => p.name.startsWith('test-preset'));
      
      expect(testPresets.length).toBeGreaterThanOrEqual(2);
      
      // Cleanup
      await deletePreset('test-preset-1');
      await deletePreset('test-preset-2');
    });
  });

  describe('deletePreset', () => {
    it('should delete a preset', async () => {
      await savePreset('test-preset', testConfig);
      const deleted = await deletePreset('test-preset');
      
      expect(deleted).toBe(true);
      
      const exists = await hasPreset('test-preset');
      expect(exists).toBe(false);
    });

    it('should return false for non-existent preset', async () => {
      const deleted = await deletePreset('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('Built-in presets', () => {
    it('should have built-in presets', () => {
      expect(Object.keys(BUILTIN_PRESETS).length).toBeGreaterThan(0);
    });

    it('should load built-in preset', () => {
      const preset = getBuiltinPreset('saas-starter');
      expect(preset).not.toBeNull();
      expect(preset?.name).toBe('saas-starter');
    });

    it('should return null for non-existent built-in preset', () => {
      const preset = getBuiltinPreset('non-existent');
      expect(preset).toBeNull();
    });
  });
});
