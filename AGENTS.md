# AGENTS.md

JualAntar customer app — React Router 7 (framework mode, SSR) + React 19 + TypeScript + Tailwind 4 + shadcn/ui. PWA. Docs/comments are in Indonesian.

## Commands

Package manager is **bun** (`bun.lock`; there is no `package-lock.json`).

- `bun install`
- `bun run dev` — Vite dev server, exposed on LAN (`host: true`)
- `bun run build` — `react-router build` then esbuild bundles the service worker
- `bun run typecheck` — **must run `react-router typegen` first** (script does this) to generate `.react-router/types` and the `./+types/*` imports
- `bun run test` / `bun run test:run` — Vitest
- Single test: `bunx vitest run app/modules/auth/schemas/login.schema.test.ts`
- `bun run format` — Prettier (4-space indent, no semicolons, double quotes, 120 cols, tailwind plugin)

There is **no ESLint/lint script**. Verification order: `bun run typecheck` then `bun run test:run`.

## Gotchas

- Import alias is `~/*` → `app/*` (see `tsconfig.json`). The README's `@/components/...` example is wrong; `@/` does not resolve.
- `app/modules/services/` is a **domain feature** (JAFood/JAMart/etc. catalog), not the API data layer. Each module's own `services/` folder holds its API/query/mutation code.
- Dev API calls go through the Vite proxy: `/api` → `API_PROXY_TARGET` (default `http://127.0.0.1:8001`). Copy `.env.example` to `.env`. A backend must be running for API features to work.
- The service worker (`app/pwa/sw.ts`) is excluded from `tsconfig.json` and typechecked separately via `tsconfig.sw.json`; it is bundled by esbuild to `build/client/sw.js` and only registers in production (`import.meta.env.PROD`).
- `Dockerfile` still uses `npm ci` + `package-lock.json` (missing). Treat Docker builds as stale/broken; verify before relying on them.

## Architecture

`docs/ARCHITECTURE.md` is the source of truth for conventions. Key points:

- Feature/domain code lives in self-contained `app/modules/<name>/` (`components/`, `hooks/`, `pages/`, `routes/`, `services/`, optional `schemas/`/`types/`/`utils/`, and `index.ts`). Cross-module imports go **only** through a module's `index.ts` — no deep imports into another module's internals.
- Shared layer `app/components`, `app/hooks`, `app/stores`, `app/lib` must not depend on modules and must not hold domain business logic.
- `app/routes.ts` is the single route registry; route files are thin and default-export, pages/components/hooks/services use named exports.
- Data fetching default is **TanStack Query** (`app/lib/query-client.ts`); `loader`/`action` are not the default pattern. `app/lib/api.ts` is the single Axios instance (auth token + 401 handling via registered accessors). Zustand (`app/stores`) is for global client/UI state only, never server state.
- Tests are co-located (`*.test.ts(x)`) next to source, Vitest + jsdom, `globals: true`.

## Routes

Public: `/`, `/offline`, `/onboarding`, `/login`, `/register`, `/verify-email`. Authenticated (guarded by `modules/auth/routes/protected-layout-route.tsx`) under `/app`: home, `orders`, `profile`, `services/{jafood,jamart,jasend,jatitip,jaride}`.
