import { z } from 'zod';

// Available monorepo frameworks
export enum MonorepoFramework {
  Turborepo = 'turborepo',
  Nx = 'nx',
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

// API style options
export enum ApiStyle {
  REST = 'rest',
  GraphQL = 'graphql',
  Both = 'both'
}

// Auth strategy options
export enum AuthStrategy {
  None = 'none',
  JWT = 'jwt'
}

// Zod enum schemas
const MonorepoFrameworkSchema = z.enum(['turborepo', 'nx']);
const FrontendFrameworkSchema = z.enum(['react', 'next.js', 'vue', 'nuxt', 'angular']);
const BackendFrameworkSchema = z.enum(['express', 'nest.js', 'fastify-ts', 'koa']);
const DatabaseSchema = z.enum(['mongodb', 'postgresql', 'mysql', 'sqlite']);
const PackageManagerSchema = z.enum(['npm', 'yarn', 'pnpm']);
const ApiStyleSchema = z.enum(['rest', 'graphql', 'both']);
const AuthStrategySchema = z.enum(['none', 'jwt']);

// Project configuration schema using Zod
export const ProjectConfigSchema = z.object({
  name: z.string().min(1),
  monorepo: MonorepoFrameworkSchema,
  packageManager: PackageManagerSchema,
  ci: z.boolean().default(false),            // GitHub Actions CI workflow
  apps: z.object({
    frontend: z.object({
      framework: FrontendFrameworkSchema,
      styling: z.enum(['css', 'scss', 'tailwind', 'styled-components']),
      eslint: z.boolean().default(true),      // ESLint (separate from Prettier)
      prettier: z.boolean().default(true),    // Prettier (separate from ESLint)
      turbopack: z.boolean().default(false),  // Next.js only — faster dev bundler
    }),
    backend: z.object({
      framework: BackendFrameworkSchema,
      database: DatabaseSchema,
      orm: z.enum(['prisma', 'typeorm', 'mongoose', 'drizzle']).optional(),
      apiStyle: ApiStyleSchema.default('rest'),          // REST / GraphQL / Both
      auth: AuthStrategySchema.default('none'),          // JWT auth scaffolding
      docker: z.boolean().default(true),
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
