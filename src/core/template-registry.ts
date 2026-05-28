/**
 * Template Registry
 * Maps user configuration to template repository URLs
 * 
 * Template Naming Convention:
 * {monorepo}-{frontend}-{backend}-{database}-{orm}
 * Example: turborepo-nextjs-nestjs-postgres-prisma
 */

import { ProjectConfig, MonorepoFramework, FrontendFramework, BackendFramework, Database } from '../types/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Machine-readable flags that declare which optional features a template ships with.
 * The CLI uses these to decide which yes/no prompts to show the user — if a template
 * doesn't include ESLint configs, we never ask about it and never try to delete them.
 */
export interface TemplateSupports {
  eslint: boolean;      // ships eslint.config.mjs / .eslintrc files
  prettier: boolean;    // ships .prettierrc / .prettierignore files
  docker: boolean;      // ships docker-compose.yml
  turbopack: boolean;   // Next.js dev script supports --turbopack flag
}

export interface TemplateMetadata {
  url?: string;
  branch?: string;
  subfolder?: string;
  localPath?: string; // Path to local template (for development only)
  description: string;
  features: string[];
  /** Declares which optional features this template ships with. */
  supports: TemplateSupports;
}

// Templates repository (separate repo with pre-built templates)
const TEMPLATE_REPO_URL = 'https://github.com/Om-jannu/create-fs-app-templates';
const TEMPLATE_BRANCH = 'master';

// Local templates directory (only used in development)
const LOCAL_TEMPLATES_DIR = path.join(__dirname, '../../templates');

/**
 * Hardcoded registry — shipped inside the CLI binary as an offline fallback.
 *
 * The CLI tries to fetch a fresher copy from the templates GitHub repo at
 * startup (see registry-fetch.ts).  If that fetch succeeds the remote registry
 * is merged over this one via `setActiveRegistry()`.  Either way the rest of
 * the codebase only calls `getActiveRegistry()` / `getTemplate()` and never
 * reads TEMPLATE_REGISTRY directly.
 */
export const TEMPLATE_REGISTRY: Record<string, TemplateMetadata> = {

  // ── Next.js + NestJS + PostgreSQL + Prisma ────────────────────────────────
  'turborepo-nextjs-nestjs-postgresql-prisma': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-nextjs-nestjs-postgresql-prisma',
    description: 'Next.js 16 App Router + NestJS 11 REST API + PostgreSQL 16 + Prisma 5',
    features: [
      'Turborepo monorepo',
      'Next.js 16 (App Router, Tailwind CSS v4)',
      'NestJS 11 — modular, decorators, DI',
      'Swagger / OpenAPI docs at /api',
      'Prisma 5 ORM + migrations',
      'PostgreSQL 16 via Docker Compose',
      'TypeScript strict — ESLint + Prettier',
    ],
    supports: {
      eslint: true,
      prettier: true,
      docker: true,
      turbopack: true,
    },
  },

  // ── Next.js + Express + PostgreSQL + Prisma ───────────────────────────────
  'turborepo-nextjs-express-postgresql-prisma': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-nextjs-express-postgresql-prisma',
    description: 'Next.js 15 App Router + Express 4 REST API + PostgreSQL 16 + Prisma 5',
    features: [
      'Turborepo monorepo',
      'Next.js 15 (App Router, Tailwind CSS v4)',
      'Express 4 — lightweight, flexible',
      'Zod request validation',
      'Prisma 5 ORM + migrations',
      'PostgreSQL 16 via Docker Compose',
      'TypeScript strict — ESLint + Prettier',
    ],
    supports: {
      eslint: true,
      prettier: true,
      docker: true,
      turbopack: true,
    },
  },

  // ── React (Vite) + Express + MongoDB + Mongoose ───────────────────────────
  'turborepo-react-express-mongodb-mongoose': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-react-express-mongodb-mongoose',
    description: 'React 19 (Vite) SPA + Express 4 REST API + MongoDB 7 + Mongoose 8',
    features: [
      'Turborepo monorepo',
      'React 19 + Vite — fast HMR, SPA',
      'Tailwind CSS v4 via Vite plugin',
      'Express 4 — lightweight, flexible',
      'Zod request validation',
      'Mongoose 8 ODM + schema models',
      'MongoDB 7 via Docker Compose',
      'TypeScript strict — ESLint + Prettier',
    ],
    supports: {
      eslint: true,
      prettier: true,
      docker: true,
      turbopack: false,
    },
  },

  // ── Next.js + Express + MongoDB + Mongoose ────────────────────────────────
  'turborepo-nextjs-express-mongodb-mongoose': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-nextjs-express-mongodb-mongoose',
    description: 'Next.js 15 App Router + Express 4 REST API + MongoDB 7 + Mongoose 8',
    features: [
      'Turborepo monorepo',
      'Next.js 15 (App Router, Tailwind CSS v4)',
      'Express 4 — lightweight, flexible',
      'Zod request validation',
      'Mongoose 8 ODM + schema models',
      'MongoDB 7 via Docker Compose',
      'TypeScript strict — ESLint + Prettier',
    ],
    supports: {
      eslint: true,
      prettier: true,
      docker: true,
      turbopack: true,
    },
  },

  // ── Next.js + NestJS + MongoDB + Mongoose ─────────────────────────────────
  'turborepo-nextjs-nestjs-mongodb-mongoose': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-nextjs-nestjs-mongodb-mongoose',
    description: 'Next.js 16 App Router + NestJS 11 REST API + MongoDB 7 + Mongoose 8',
    features: [
      'Turborepo monorepo',
      'Next.js 16 (App Router, Tailwind CSS v4)',
      'NestJS 11 — modular, decorators, DI',
      'Swagger / OpenAPI docs at /api',
      '@nestjs/mongoose — schema decorators',
      'MongoDB 7 via Docker Compose',
      'TypeScript strict — ESLint + Prettier',
    ],
    supports: {
      eslint: true,
      prettier: true,
      docker: true,
      turbopack: true,
    },
  },

  // ── React (Vite) + NestJS + PostgreSQL + Prisma ───────────────────────────
  'turborepo-react-nestjs-postgresql-prisma': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-react-nestjs-postgresql-prisma',
    description: 'React 19 (Vite) SPA + NestJS 11 REST API + PostgreSQL 16 + Prisma 5',
    features: [
      'Turborepo monorepo',
      'React 19 + Vite — fast HMR, SPA',
      'Tailwind CSS v4 via Vite plugin',
      'NestJS 11 — modular, decorators, DI',
      'Swagger / OpenAPI docs at /api',
      'Prisma 5 ORM + migrations',
      'PostgreSQL 16 via Docker Compose',
      'TypeScript strict — ESLint + Prettier',
    ],
    supports: {
      eslint: true,
      prettier: true,
      docker: true,
      turbopack: false,
    },
  },

  // ── React (Vite) + Express + PostgreSQL + Prisma ──────────────────────────
  'turborepo-react-express-postgresql-prisma': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-react-express-postgresql-prisma',
    description: 'React 19 (Vite) SPA + Express 4 REST API + PostgreSQL 16 + Prisma 5',
    features: [
      'Turborepo monorepo',
      'React 19 + Vite — fast HMR, SPA',
      'Tailwind CSS v4 via Vite plugin',
      'Express 4 — lightweight, flexible',
      'Zod request validation',
      'Prisma 5 ORM + migrations',
      'PostgreSQL 16 via Docker Compose',
      'TypeScript strict — ESLint + Prettier',
    ],
    supports: {
      eslint: true,
      prettier: true,
      docker: true,
      turbopack: false,
    },
  },

  // ── React (Vite) + NestJS + MongoDB + Mongoose ────────────────────────────
  'turborepo-react-nestjs-mongodb-mongoose': {
    url: TEMPLATE_REPO_URL,
    branch: TEMPLATE_BRANCH,
    subfolder: 'templates/turborepo-react-nestjs-mongodb-mongoose',
    description: 'React 19 (Vite) SPA + NestJS 11 REST API + MongoDB 7 + Mongoose 8',
    features: [
      'Turborepo monorepo',
      'React 19 + Vite — fast HMR, SPA',
      'Tailwind CSS v4 via Vite plugin',
      'NestJS 11 — modular, decorators, DI',
      'Swagger / OpenAPI docs at /api',
      '@nestjs/mongoose — schema decorators',
      'MongoDB 7 via Docker Compose',
      'TypeScript strict — ESLint + Prettier',
    ],
    supports: {
      eslint: true,
      prettier: true,
      docker: true,
      turbopack: false,
    },
  },

};

// ── Active registry (starts as the hardcoded fallback) ────────────────────

let _activeRegistry: Record<string, TemplateMetadata> = { ...TEMPLATE_REGISTRY };

/**
 * Replace the active registry with data fetched from GitHub.
 * Remote entries are merged over the hardcoded ones — remote wins on conflict.
 * Call this once at startup after `getRemoteRegistry()` returns.
 */
export function setActiveRegistry(remote: Record<string, TemplateMetadata>): void {
  _activeRegistry = { ...TEMPLATE_REGISTRY, ...remote };
}

/** Returns the currently active registry (remote or hardcoded fallback). */
export function getActiveRegistry(): Record<string, TemplateMetadata> {
  return _activeRegistry;
}

// ── Key generation ──────────────────────────────────────────────────────────

/**
 * Generate a template key from user configuration
 */
export function getTemplateKey(config: ProjectConfig): string {
  const { monorepo, apps } = config;
  const frontend = apps.frontend.framework.replace('.', '');
  const backend = apps.backend.framework.replace('.', '');
  const database = apps.backend.database;
  const orm = apps.backend.orm || 'none';

  return `${monorepo}-${frontend}-${backend}-${database}-${orm}`.toLowerCase();
}

/**
 * Get template metadata for a configuration.
 * Always reads from _activeRegistry so remote entries are visible.
 */
export function getTemplate(config: ProjectConfig): TemplateMetadata | null {
  const key = getTemplateKey(config);

  // Exact match
  if (_activeRegistry[key]) return _activeRegistry[key]!;

  // Without ORM suffix
  const keyWithoutOrm = key.replace(`-${config.apps.backend.orm}`, '');
  if (_activeRegistry[keyWithoutOrm]) return _activeRegistry[keyWithoutOrm]!;

  // Closest match by monorepo-frontend-backend prefix
  const partialKey = `${config.monorepo}-${config.apps.frontend.framework.replace('.', '')}-${config.apps.backend.framework.replace('.', '')}`.toLowerCase();
  const closest = Object.keys(_activeRegistry).find(k => k.startsWith(partialKey));

  return closest ? _activeRegistry[closest]! : null;
}

/**
 * Create template metadata from custom URL
 */
export function createCustomTemplate(
  url: string,
  branch: string = 'main',
  subfolder?: string
): TemplateMetadata {
  return {
    url,
    branch,
    subfolder,
    description: 'Custom template from URL',
    features: ['Custom'],
    // Assume custom templates ship everything; user can disable via flags
    supports: { eslint: true, prettier: true, docker: true, turbopack: false },
  };
}

/**
 * Get local templates directory
 */
export function getLocalTemplatesDir(): string {
  return LOCAL_TEMPLATES_DIR;
}

/**
 * List all available templates (from the active registry).
 */
export function listAllTemplates(): Array<{ key: string; metadata: TemplateMetadata }> {
  return Object.entries(_activeRegistry).map(([key, metadata]) => ({ key, metadata }));
}

/**
 * Check if a template exists for the given configuration
 */
export function hasTemplate(config: ProjectConfig): boolean {
  return getTemplate(config) !== null;
}

/**
 * Get suggested alternatives if exact template doesn't exist
 */
export function getSuggestedTemplates(config: ProjectConfig): TemplateMetadata[] {
  const { monorepo } = config;
  return Object.entries(_activeRegistry)
    .filter(([key]) => key.startsWith(monorepo))
    .map(([, metadata]) => metadata)
    .slice(0, 3);
}

