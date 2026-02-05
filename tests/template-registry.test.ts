/**
 * Tests for template registry
 */

import { describe, it, expect } from '@jest/globals';
import { 
  getTemplateKey, 
  getTemplate, 
  listAllTemplates,
  createCustomTemplate 
} from '../src/core/template-registry.js';
import { ProjectConfig } from '../src/types/index.js';

describe('getTemplateKey', () => {
  it('should generate correct template key', () => {
    const config: ProjectConfig = {
      name: 'test-app',
      monorepo: 'turborepo' as any,
      packageManager: 'npm' as any,
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
    };

    const key = getTemplateKey(config);
    expect(key).toBe('turborepo-nextjs-nestjs-postgresql-prisma');
  });

  it('should handle missing ORM', () => {
    const config: ProjectConfig = {
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
          docker: true
        }
      }
    };

    const key = getTemplateKey(config);
    expect(key).toBe('turborepo-react-express-mongodb-none');
  });
});

describe('listAllTemplates', () => {
  it('should return array of templates', () => {
    const templates = listAllTemplates();
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(0);
  });

  it('should have correct structure', () => {
    const templates = listAllTemplates();
    templates.forEach(template => {
      expect(template).toHaveProperty('key');
      expect(template).toHaveProperty('metadata');
      expect(template.metadata).toHaveProperty('url');
      expect(template.metadata).toHaveProperty('description');
      expect(template.metadata).toHaveProperty('features');
    });
  });
});

describe('createCustomTemplate', () => {
  it('should create template metadata from URL', () => {
    const url = 'https://github.com/user/repo';
    const template = createCustomTemplate(url);
    
    expect(template.url).toBe(url);
    expect(template.branch).toBe('main');
    expect(template.description).toBe('Custom template from URL');
    expect(template.features).toContain('Custom');
  });

  it('should accept custom branch', () => {
    const url = 'https://github.com/user/repo';
    const template = createCustomTemplate(url, 'develop');
    
    expect(template.branch).toBe('develop');
  });

  it('should accept subfolder', () => {
    const url = 'https://github.com/user/repo';
    const template = createCustomTemplate(url, 'main', 'templates/my-template');
    
    expect(template.subfolder).toBe('templates/my-template');
  });
});
