/**
 * Template Registry
 * Maps user configuration to template repository URLs
 *
 * Template Key Convention:
 *   {monorepo}-{frontend}-{backend}-{database}-{orm}
 *
 * Two separate registries:
 *   Official    — maintained by the repo owner; used by the interactive wizard,
 *                 --yes, and --frontend/--backend/etc. stack flags.
 *   Contributed — community-built variants; only reachable via --template <key>.
 *                 Full scaffold (git, install, customise) still runs.
 */

import { ProjectConfig } from '../types/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ── Shared types ──────────────────────────────────────────────────────────────

export interface TemplateSupports {
  eslint:     boolean;
  prettier:   boolean;
  docker:     boolean;
  turbopack:  boolean;
}

export interface ContributorMetadata {
  /** GitHub username, e.g. "johndoe" */
  github: string;
  /** GitHub profile URL, e.g. "https://github.com/johndoe" */
  url: string;
  /** The repo that contains the template, e.g. "https://github.com/johndoe/my-template" */
  repoUrl: string;
}

export interface TemplateMetadata {
  /** UUID v4 — stable internal identity. */
  id?: string;
  /**
   * Present only on contributed templates.
   * Official templates never have this field — the registry section defines their status.
   */
  contributor?: ContributorMetadata;
  url?: string;
  branch?: string;
  subfolder?: string;
  localPath?: string;
  description: string;
  features: string[];
  supports: TemplateSupports;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TEMPLATE_REPO_URL  = 'https://github.com/Om-jannu/create-fs-app-templates';
const TEMPLATE_BRANCH    = 'master';
const LOCAL_TEMPLATES_DIR = path.join(__dirname, '../../templates');

// ── Hardcoded official registry (offline fallback) ────────────────────────────

export const TEMPLATE_REGISTRY: Record<string, TemplateMetadata> = {

  'turborepo-nextjs-nestjs-postgresql-prisma': {
    id: 'e5f7cc74-816b-4b24-819b-b7478a917ac1',
    url: TEMPLATE_REPO_URL, branch: TEMPLATE_BRANCH,
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
    supports: { eslint: true, prettier: true, docker: true, turbopack: true },
  },

  'turborepo-nextjs-express-postgresql-prisma': {
    id: '76af68d4-de73-4859-bc6a-2023a0850f17',
    url: TEMPLATE_REPO_URL, branch: TEMPLATE_BRANCH,
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
    supports: { eslint: true, prettier: true, docker: true, turbopack: true },
  },

  'turborepo-react-express-mongodb-mongoose': {
    id: '42df82b4-6bba-45ee-85c4-92786438cc12',
    url: TEMPLATE_REPO_URL, branch: TEMPLATE_BRANCH,
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
    supports: { eslint: true, prettier: true, docker: true, turbopack: false },
  },

  'turborepo-nextjs-express-mongodb-mongoose': {
    id: '869feb63-68b9-491f-9811-c9f2294549e9',
    url: TEMPLATE_REPO_URL, branch: TEMPLATE_BRANCH,
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
    supports: { eslint: true, prettier: true, docker: true, turbopack: true },
  },

  'turborepo-nextjs-nestjs-mongodb-mongoose': {
    id: '5c739c25-6249-4415-808b-2dc305b8cc3a',
    url: TEMPLATE_REPO_URL, branch: TEMPLATE_BRANCH,
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
    supports: { eslint: true, prettier: true, docker: true, turbopack: true },
  },

  'turborepo-react-nestjs-postgresql-prisma': {
    id: '8cba60d4-463a-45ef-9bb0-acb0676e04a2',
    url: TEMPLATE_REPO_URL, branch: TEMPLATE_BRANCH,
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
    supports: { eslint: true, prettier: true, docker: true, turbopack: false },
  },

  'turborepo-react-express-postgresql-prisma': {
    id: '8aab7d8e-b969-4c88-87ee-48fd343d0af3',
    url: TEMPLATE_REPO_URL, branch: TEMPLATE_BRANCH,
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
    supports: { eslint: true, prettier: true, docker: true, turbopack: false },
  },

  'turborepo-react-nestjs-mongodb-mongoose': {
    id: '70ea0b03-bfec-45cf-a99b-a284368d9660',
    url: TEMPLATE_REPO_URL, branch: TEMPLATE_BRANCH,
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
    supports: { eslint: true, prettier: true, docker: true, turbopack: false },
  },

};

// ── Active registries ─────────────────────────────────────────────────────────

let _officialRegistry:    Record<string, TemplateMetadata> = { ...TEMPLATE_REGISTRY };
let _contributedRegistry: Record<string, TemplateMetadata> = {};

export interface RemoteRegistryPayload {
  official:    Record<string, TemplateMetadata>;
  contributed: Record<string, TemplateMetadata>;
}

/**
 * Replace both active registries with data fetched from GitHub.
 * Remote official entries are merged over the hardcoded fallback so that
 * hardcoded id values are preserved when the remote omits them.
 */
export function setActiveRegistry(remote: RemoteRegistryPayload): void {
  // Official: merge remote over hardcoded, preserve id when remote omits it
  const mergedOfficial: Record<string, TemplateMetadata> = { ...TEMPLATE_REGISTRY };
  for (const [key, remoteEntry] of Object.entries(remote.official)) {
    mergedOfficial[key] = {
      ...remoteEntry,
      id: remoteEntry.id ?? TEMPLATE_REGISTRY[key]?.id,
    };
  }
  _officialRegistry = mergedOfficial;

  // Contributed: remote is authoritative (no hardcoded fallback)
  _contributedRegistry = { ...remote.contributed };
}

export function getOfficialRegistry():     Record<string, TemplateMetadata> { return _officialRegistry; }
export function getContributedRegistry():  Record<string, TemplateMetadata> { return _contributedRegistry; }

// ── Key generation ────────────────────────────────────────────────────────────

export function getTemplateKey(config: ProjectConfig): string {
  const { monorepo, apps } = config;
  const frontend = apps.frontend.framework.replace('.', '');
  const backend  = apps.backend.framework.replace('.', '');
  const database = apps.backend.database;
  const orm      = apps.backend.orm || 'none';
  return `${monorepo}-${frontend}-${backend}-${database}-${orm}`.toLowerCase();
}

// ── Official template resolution (used by wizard / --yes / stack flags) ───────

/**
 * Resolve an official template for a given stack config.
 * Searches ONLY the official registry.
 *
 * Resolution order:
 *  1. Exact key, 2. Without ORM suffix, 3. Partial prefix match
 */
export function getTemplate(config: ProjectConfig): TemplateMetadata | null {
  const key = getTemplateKey(config);

  if (_officialRegistry[key]) return _officialRegistry[key]!;

  const keyWithoutOrm = key.replace(`-${config.apps.backend.orm}`, '');
  if (_officialRegistry[keyWithoutOrm]) return _officialRegistry[keyWithoutOrm]!;

  const partialKey = `${config.monorepo}-${config.apps.frontend.framework.replace('.', '')}-${config.apps.backend.framework.replace('.', '')}`.toLowerCase();
  const closest = Object.keys(_officialRegistry).find(k => k.startsWith(partialKey));
  return closest ? _officialRegistry[closest]! : null;
}

// ── Listing helpers ───────────────────────────────────────────────────────────

export function listOfficialTemplates(): Array<{ key: string; metadata: TemplateMetadata }> {
  return Object.entries(_officialRegistry).map(([key, metadata]) => ({ key, metadata }));
}

export function listContributedTemplates(): Array<{ key: string; metadata: TemplateMetadata }> {
  return Object.entries(_contributedRegistry).map(([key, metadata]) => ({ key, metadata }));
}

export function hasTemplate(config: ProjectConfig): boolean {
  return getTemplate(config) !== null;
}

export function getSuggestedTemplates(config: ProjectConfig): TemplateMetadata[] {
  const { monorepo } = config;
  return Object.entries(_officialRegistry)
    .filter(([key]) => key.startsWith(monorepo))
    .map(([, metadata]) => metadata)
    .slice(0, 3);
}

// ── Custom template (--template-url) ──────────────────────────────────────────

export function createCustomTemplate(
  url: string,
  branch: string = 'main',
  subfolder?: string,
): TemplateMetadata {
  return {
    url, branch, subfolder,
    description: 'Custom template from URL',
    features: ['Custom'],
    supports: { eslint: true, prettier: true, docker: true, turbopack: false },
  };
}

export function getLocalTemplatesDir(): string {
  return LOCAL_TEMPLATES_DIR;
}
