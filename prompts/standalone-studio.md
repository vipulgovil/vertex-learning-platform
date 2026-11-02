# Implementation prompt: Move the embedded Studio to a standalone `studio/` app

## Goal

Take the Sanity Studio out of the Next.js app and run it as its own app in `studio/`, matching the course. The Next.js app stays at the repo root (no `web/` folder; the user decided it's cosmetic for this project). The web read layer (client, live, queries, data helpers, `<SanityLive />`, token) is untouched.

## Skills and docs read

- `sanity-best-practices`: `references/nextjs.md` §1 and §5 ("Migrating an Existing Embedded Studio"), `references/project-structure.md` (monorepo layout), `references/typegen.md` (TypeGen config pointing at the frontend).
- `AGENTS.md` sections 5, 12, 13.

## Code inspected

- Studio pieces at the root: `sanity.config.ts` (`'use client'`, `basePath: '/studio'`, imports `./sanity/env`), `sanity.cli.ts` (api + typegen), `sanity/schemaTypes/*` (9 files), `sanity/structure.ts`, `sanity/env.ts`, `app/studio/[[...tool]]/page.tsx`.
- `sanity/schemaTypes/lesson.ts` imports `formatClock` from `../../lib/format` (web code).
- Web-side Sanity code that stays: `sanity/env.ts`, `sanity/lib/{client,live,image,queries,data}.ts`, `sanity.types.ts`, `schema.json`.
- `sanity.types.ts` imports only `@sanity/client`; no `sanity` import.
- `next-sanity` 13.4 peer dependencies: `sanity` and `styled-components` (both required), so the web app keeps them.
- `eslint.config.mjs` and `tsconfig.json` would also scan a root-level `studio/`.
- Sanity CLI 6.7.2 is logged in. CORS already allows `http://localhost:3333`.

## Decisions and assumptions

1. **New `studio/` app** with its own `package.json` (`sanity`, `@sanity/vision`, `@sanity/icons`, `react`, `react-dom`, `styled-components`; dev: `typescript`, `@types/react`) and its own `tsconfig.json`. Scripts: `dev` (`sanity dev`, port 3333), `build`, `deploy`, `typegen`. Its own `.gitignore` for `node_modules`, `dist`, `.sanity`.
2. **Move, don't rewrite**: `git mv` `sanity/schemaTypes/` → `studio/schemaTypes/`, `sanity/structure.ts` → `studio/structure.ts`, `sanity.config.ts` and `sanity.cli.ts` → `studio/`. Schema contents unchanged except the one import below.
3. **Config cleanup**: `studio/sanity.config.ts` drops `'use client'` and `basePath: '/studio'`, reads `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` (the prefix Sanity's Vite build exposes). Values go in `studio/.env` (gitignored) and `studio/.env.example` (committed, empty). Project id and dataset aren't secrets, but they still come from env, not hardcoded.
4. **`formatClock`**: copy the small function into `studio/lib/format.ts` so the Studio doesn't import web code. Duplication of ~8 lines is better than coupling the two apps.
5. **TypeGen moves to the Studio**: `studio/sanity.cli.ts` typegen reads queries from `../{app,components,lib,sanity}/**/*.{ts,tsx}`, writes `schema.json` in `studio/` and `../sanity.types.ts` at the web root (where `data.ts` imports it). `npm run typegen` in `studio/`; `sanity dev` regenerates types automatically (`typegen.enabled: true`). The web `typegen` script is removed. Root `schema.json` moves to `studio/schema.json`.
6. **Web app cleanup**: delete `app/studio/`, root `sanity.config.ts`, root `sanity.cli.ts`. Remove `@sanity/vision` and `@sanity/icons` from the root `package.json`. Keep `sanity` and `styled-components` (peer deps of `next-sanity`). `sanity/env.ts` stays (the web client uses it).
7. **Keep the apps separate**: add `studio` to `tsconfig.json` `exclude` and to ESLint `globalIgnores`.
8. **Deploy**: run `sanity schemas deploy` from `studio/` to confirm the moved schema deploys the same. Hosted Studio (`sanity deploy`) needs you to choose a `*.sanity.studio` hostname, so I'll **ask before running it** (it's also needed later for the Context MCP). If you'd rather defer, local `sanity dev` is enough for now.
9. **AGENTS.md section 5**: replace the embedded-Studio paragraph with: the Studio is a standalone app in `studio/` (run with `sanity dev` on :3333, holds schema and TypeGen config), and the web app is the Next.js app at the repo root. Remove the `/studio` route mention.
10. Same branch `feat/sanity-studio`, one new commit, pushed. No PR unless you ask.

## Files expected to touch

- New: `studio/package.json`, `studio/package-lock.json`, `studio/tsconfig.json`, `studio/.gitignore`, `studio/.env.example`, `studio/.env` (not committed), `studio/lib/format.ts`
- Moved: `sanity.config.ts`, `sanity.cli.ts`, `sanity/schemaTypes/*`, `sanity/structure.ts`, `schema.json` → `studio/`
- Edited: `studio/schemaTypes/lesson.ts` (import path), `studio/sanity.config.ts`, `studio/sanity.cli.ts`, `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `AGENTS.md`, `sanity.types.ts` (regenerated)
- Deleted: `app/studio/[[...tool]]/page.tsx`

## Requirements

- Studio runs at http://localhost:3333 with the same four lists and the same schema.
- Web app builds and runs with no Studio code; `/studio` returns 404.
- TypeGen from `studio/` produces the same `sanity.types.ts` at the web root.
- No token in the Studio (it authenticates with your Sanity login).

## Security considerations

- `studio/.env` is gitignored; only an empty `studio/.env.example` is committed.
- The web read token and server-only client are unchanged.

## Acceptance criteria

- `cd studio && npm run dev` opens the Studio on :3333 showing Courses, Lessons, Instructors, Categories; the video URL validation still rejects `https://example.com`.
- `npm run build` at the root succeeds and lists no `/studio` route.
- `cd studio && npm run typegen` regenerates `../sanity.types.ts` with no diff in the query result types.

## Checks

- `studio/`: `npx sanity schemas validate`, `npm run typegen`, `npm run build`, `npx tsc --noEmit`, `npx sanity schemas deploy`, `npm run dev` (load :3333).
- Root: `npx tsc --noEmit`, `npm run lint`, `npm run build`, dev server (load `/`, confirm `/studio` is 404).
- I won't kill any dev server I didn't start. If your `next dev` is running, I'll leave it and check against it.

## Manual test steps

1. In a second terminal: `cd studio && npm run dev`, open http://localhost:3333, and log in.
2. Confirm the sidebar shows Courses, Lessons, Instructors, Categories, and the Vision tab is there.
3. Create a Lesson, enter `https://example.com` as the video URL, and confirm it's rejected; discard the draft.
4. Open http://localhost:3000/studio and confirm it's a 404; http://localhost:3000 still renders.
5. From now on, run both: `npm run dev` at the root (web, :3000) and `npm run dev` in `studio/` (:3333).
