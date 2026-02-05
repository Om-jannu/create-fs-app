import { z } from 'zod';
// Available monorepo frameworks
export var MonorepoFramework;
(function (MonorepoFramework) {
    MonorepoFramework["Turborepo"] = "turborepo";
    MonorepoFramework["Nx"] = "nx";
    MonorepoFramework["Lerna"] = "lerna";
})(MonorepoFramework || (MonorepoFramework = {}));
// Frontend frameworks
export var FrontendFramework;
(function (FrontendFramework) {
    FrontendFramework["React"] = "react";
    FrontendFramework["NextJs"] = "next.js";
    FrontendFramework["Vue"] = "vue";
    FrontendFramework["Nuxt"] = "nuxt";
    FrontendFramework["Angular"] = "angular";
})(FrontendFramework || (FrontendFramework = {}));
// Backend frameworks
export var BackendFramework;
(function (BackendFramework) {
    BackendFramework["Express"] = "express";
    BackendFramework["NestJs"] = "nest.js";
    BackendFramework["FastifyTs"] = "fastify-ts";
    BackendFramework["Koa"] = "koa";
})(BackendFramework || (BackendFramework = {}));
// Database options
export var Database;
(function (Database) {
    Database["MongoDB"] = "mongodb";
    Database["PostgreSQL"] = "postgresql";
    Database["MySQL"] = "mysql";
    Database["SQLite"] = "sqlite";
})(Database || (Database = {}));
// Package managers
export var PackageManager;
(function (PackageManager) {
    PackageManager["NPM"] = "npm";
    PackageManager["Yarn"] = "yarn";
    PackageManager["PNPM"] = "pnpm";
})(PackageManager || (PackageManager = {}));
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
//# sourceMappingURL=index.js.map