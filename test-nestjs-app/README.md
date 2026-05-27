# test-nestjs-app

Full-stack monorepo — Next.js · NestJS · PostgreSQL · Prisma · Turborepo.

## Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Monorepo | Turborepo 2 (TUI, remote cache ready)   |
| Frontend | Next.js 16 · App Router · Tailwind CSS  |
| Backend  | NestJS 11 · Class Validator · Swagger   |
| ORM      | Prisma 5                                |
| Database | PostgreSQL 16                           |
| Language | TypeScript (strict)                     |

## Getting Started

### Prerequisites
- Node.js 20+ · Docker & Docker Compose

### 1. Install
```bash
npm install   # also runs prisma generate automatically
```

### 2. Configure environment ⚠️
```bash
cp apps/backend/.env.example  apps/backend/.env
cp apps/frontend/.env.local.example  apps/frontend/.env.local
```

### 3. Start PostgreSQL
```bash
docker-compose up -d postgres
```

### 4. Run migrations
```bash
cd apps/backend && npm run prisma:migrate && cd ../..
```

### 5. Start dev
```bash
npm run dev
```

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:3000            |
| Backend  | http://localhost:3001            |
| Swagger  | http://localhost:3001/api        |
| Health   | http://localhost:3001/health     |

## Scripts

| Command               | Description            |
|-----------------------|------------------------|
| `npm run dev`         | Start all (watch)      |
| `npm run build`       | Build all              |
| `npm run check-types` | Type-check all         |
| `npm run lint`        | Lint all               |
| `npm run format`      | Prettier               |

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `apps/frontend`: Next.js 16 App Router frontend with Tailwind CSS
- `apps/backend`: NestJS 11 REST API with Prisma ORM
- `@repo/eslint-config`: Shared ESLint configurations
- `@repo/typescript-config`: Shared TypeScript configs

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
npm dlx turbo build
npm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
npm exec turbo build --filter=docs
npm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
npm exec turbo dev
npm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
npm exec turbo dev --filter=web
npm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
npm exec turbo login
npm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
npm exec turbo link
npm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
