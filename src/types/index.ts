import { z } from 'zod';

// Available monorepo frameworks
export enum MonorepoFramework {
  Turborepo = 'turborepo',
  Nx = 'nx',
  Lerna = 'lerna'
}

// Frontend frameworks
export enum FrontendFramework {
  React = 'react',
  NextJs = 'next.js',
  Vue = 'vue',
  Nuxt = 'nuxt',
  Angular = 'angular'
}

// Backend frameworks
export enum BackendFramework {
  Express = 'express',
  NestJs = 'nest.js',
  FastifyTs = 'fastify-ts',
  Koa = 'koa'
}

// Database options
export enum Database {
  MongoDB = 'mongodb',
  PostgreSQL = 'postgresql',
  MySQL = 'mysql',
  SQLite = 'sqlite'
}

// Package managers
export enum PackageManager {
  NPM = 'npm',
  Yarn = 'yarn',
  PNPM = 'pnpm'
}

// Zod enum schemas (replacing deprecated nativeEnum)
const MonorepoFrameworkSchema = z.enum(['turborepo', 'nx', 'lerna']);
const FrontendFrameworkSchema = z.enum(['react', 'next.js', 'vue', 'nuxt', 'angular']);
const BackendFrameworkSchema = z.enum(['express', 'nest.js', 'fastify-ts', 'koa']);
const DatabaseSchema = z.enum(['mongodb', 'postgresql', 'mysql', 'sqlite']);
const PackageManagerSchema = z.enum(['npm', 'yarn', 'pnpm']);

// Project configuration schema using Zod
export const ProjectConfigSchema = z.object({
  name: z.string().min(1),
  monorepo: MonorepoFrameworkSchema,
  packageManager: PackageManagerSchema,
  apps: z.object({
    frontend: z.object({
      framework: FrontendFrameworkSchema,
      // TypeScript is always enabled - no JavaScript projects
      styling: z.enum(['css', 'scss', 'tailwind', 'styled-components']),
      testing: z.enum(['jest', 'vitest', 'cypress']).optional(),
      linting: z.boolean()
    }),
    backend: z.object({
      framework: BackendFrameworkSchema,
      database: DatabaseSchema,
      orm: z.enum(['prisma', 'typeorm', 'mongoose', 'drizzle']).optional(),
      testing: z.enum(['jest', 'mocha']).optional(),
      docker: z.boolean()
    })
  })
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

// CLI Options type
export interface CLIOptions {
  template?: string;
  git?: boolean;
  install?: boolean;
  yes?: boolean;
}

// Template configuration type
export interface TemplateConfig {
  name: string;
  description: string;
  monorepo: MonorepoFramework;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
} 