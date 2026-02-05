import { z } from 'zod';
export declare enum MonorepoFramework {
    Turborepo = "turborepo",
    Nx = "nx",
    Lerna = "lerna"
}
export declare enum FrontendFramework {
    React = "react",
    NextJs = "next.js",
    Vue = "vue",
    Nuxt = "nuxt",
    Angular = "angular"
}
export declare enum BackendFramework {
    Express = "express",
    NestJs = "nest.js",
    FastifyTs = "fastify-ts",
    Koa = "koa"
}
export declare enum Database {
    MongoDB = "mongodb",
    PostgreSQL = "postgresql",
    MySQL = "mysql",
    SQLite = "sqlite"
}
export declare enum PackageManager {
    NPM = "npm",
    Yarn = "yarn",
    PNPM = "pnpm"
}
export declare const ProjectConfigSchema: z.ZodObject<{
    name: z.ZodString;
    monorepo: z.ZodEnum<{
        turborepo: "turborepo";
        nx: "nx";
        lerna: "lerna";
    }>;
    packageManager: z.ZodEnum<{
        npm: "npm";
        yarn: "yarn";
        pnpm: "pnpm";
    }>;
    apps: z.ZodObject<{
        frontend: z.ZodObject<{
            framework: z.ZodEnum<{
                react: "react";
                "next.js": "next.js";
                vue: "vue";
                nuxt: "nuxt";
                angular: "angular";
            }>;
            styling: z.ZodEnum<{
                css: "css";
                scss: "scss";
                tailwind: "tailwind";
                "styled-components": "styled-components";
            }>;
            testing: z.ZodOptional<z.ZodEnum<{
                jest: "jest";
                vitest: "vitest";
                cypress: "cypress";
            }>>;
            linting: z.ZodBoolean;
        }, z.core.$strip>;
        backend: z.ZodObject<{
            framework: z.ZodEnum<{
                express: "express";
                "nest.js": "nest.js";
                "fastify-ts": "fastify-ts";
                koa: "koa";
            }>;
            database: z.ZodEnum<{
                mongodb: "mongodb";
                postgresql: "postgresql";
                mysql: "mysql";
                sqlite: "sqlite";
            }>;
            orm: z.ZodOptional<z.ZodEnum<{
                prisma: "prisma";
                typeorm: "typeorm";
                mongoose: "mongoose";
                drizzle: "drizzle";
            }>>;
            testing: z.ZodOptional<z.ZodEnum<{
                jest: "jest";
                mocha: "mocha";
            }>>;
            docker: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
export interface CLIOptions {
    template?: string;
    git?: boolean;
    install?: boolean;
    yes?: boolean;
}
export interface TemplateConfig {
    name: string;
    description: string;
    monorepo: MonorepoFramework;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
}
