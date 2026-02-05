/**
 * Tests for validation utilities
 */

import { describe, it, expect } from '@jest/globals';
import { validateProjectName, validateTemplateUrl } from '../src/utils/validation.js';

describe('validateProjectName', () => {
  it('should accept valid project names', () => {
    expect(validateProjectName('my-app').valid).toBe(true);
    expect(validateProjectName('my_app').valid).toBe(true);
    expect(validateProjectName('MyApp123').valid).toBe(true);
    expect(validateProjectName('app-123-test').valid).toBe(true);
  });

  it('should reject empty names', () => {
    expect(validateProjectName('').valid).toBe(false);
    expect(validateProjectName('   ').valid).toBe(false);
  });

  it('should reject names with invalid characters', () => {
    expect(validateProjectName('my app').valid).toBe(false);
    expect(validateProjectName('my/app').valid).toBe(false);
    expect(validateProjectName('my@app').valid).toBe(false);
    expect(validateProjectName('my.app').valid).toBe(false);
  });

  it('should reject names starting with . or _', () => {
    expect(validateProjectName('.myapp').valid).toBe(false);
    expect(validateProjectName('_myapp').valid).toBe(false);
  });

  it('should reject names that are too long', () => {
    const longName = 'a'.repeat(215);
    expect(validateProjectName(longName).valid).toBe(false);
  });

  it('should reject reserved names', () => {
    expect(validateProjectName('node_modules').valid).toBe(false);
    expect(validateProjectName('package.json').valid).toBe(false);
    expect(validateProjectName('npm').valid).toBe(false);
  });
});

describe('validateTemplateUrl', () => {
  it('should accept valid GitHub URLs', () => {
    expect(validateTemplateUrl('https://github.com/user/repo').valid).toBe(true);
    expect(validateTemplateUrl('https://github.com/user/repo.git').valid).toBe(true);
    expect(validateTemplateUrl('https://github.com/my-org/my-repo').valid).toBe(true);
  });

  it('should reject empty URLs', () => {
    expect(validateTemplateUrl('').valid).toBe(false);
    expect(validateTemplateUrl('   ').valid).toBe(false);
  });

  it('should reject non-GitHub URLs', () => {
    expect(validateTemplateUrl('https://gitlab.com/user/repo').valid).toBe(false);
    expect(validateTemplateUrl('http://github.com/user/repo').valid).toBe(false);
    expect(validateTemplateUrl('github.com/user/repo').valid).toBe(false);
  });

  it('should reject invalid GitHub URLs', () => {
    expect(validateTemplateUrl('https://github.com/user').valid).toBe(false);
    expect(validateTemplateUrl('https://github.com/').valid).toBe(false);
  });
});
