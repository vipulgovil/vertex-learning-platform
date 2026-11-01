# Implementation prompt: Clerk authentication setup

## Goal

Add Clerk authentication to the Vertex web app, linked to the Clerk application the user picked in the Dashboard (`app_3LWAvWDwTIi5liVDE2t3m8lHqF2`). Browsing stays public. The nav's placeholder avatar becomes real sign-in / user controls. No routes are protected yet; later features (progress, My Learning) will mark their own routes private.

## Skills and docs read

- `AGENTS.md`: sections 5, 6, 7 (auth decisions), 12 (Clerk key rules), 13.
- Clerk setup instructions (pasted): `clerk init --app`, Suspense rules for `cacheComponents`, `ClerkProvider` inside `<body>`.
- `node_modules/next/dist/docs/.../proxy.md`: Next 16 renames `middleware.ts` to `proxy.ts`.

## Code inspected

- `package.json`: Next 16.4.3, React 19.3. No auth packages.
- No `middleware.ts` / `proxy.ts`, no auth routes, no sessions, no user records. No `.clerk/` claim files.
- `next.config.ts`: `cacheComponents: true`, so auth reads must sit inside `<Suspense>`.
- `app/layout.tsx`: plain `<html><body>`, no providers.
- `app/page.tsx`: `Navbar` `actions` slot holds a bell and a placeholder `User` avatar button.
- `.gitignore`: ignores `.env*`, which would also ignore the `.env.example` AGENTS.md wants committed.
- Node v22.23.4 (meets Clerk's 20.9.0 minimum).

## Decisions and assumptions

1. Run `npx -y clerk@latest init --app app_3LWAvWDwTIi5liVDE2t3m8lHqF2 --no-skills` from the repo root (Clerk skills are already installed). Let it detect Next.js and npm. If the CLI needs login, the user runs `npx -y clerk@latest auth login` in their own terminal first.
2. The web app currently lives at the repo root (no separate `web/` workspace yet), so Clerk is installed there.
3. `proxy.ts` uses `clerkMiddleware()` with no protected routes. Public browsing per section 7.
4. `ClerkProvider` goes inside `<body>` in `app/layout.tsx`.
5. Nav: replace the placeholder avatar with `<Show when="signed-in"><UserButton /></Show>` and a signed-out `SignInButton` (modal), wrapped in `<Suspense>` with the existing placeholder avatar as the fallback so the layout does not shift. The bell stays. The design has no sign-in button, so the signed-out state reuses the same avatar circle as the sign-in trigger rather than adding new visual elements.
6. Any sign-in / sign-up catch-all pages the CLI creates get wrapped in `<Suspense>`.
7. Add `.env.example` with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=` and `CLERK_SECRET_KEY=` (empty), and add `!.env.example` to `.gitignore`.
8. I never read or print `.env*` files or claim files.

## Files expected to touch

- `package.json`, `package-lock.json` (`@clerk/nextjs`)
- `proxy.ts` (new)
- `app/layout.tsx`
- `app/page.tsx` (nav actions)
- `components/ui/account-menu.tsx` (new, small wrapper for the Clerk controls) if it keeps the page tidy
- possibly `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx` (if CLI creates them)
- `.env.example` (new), `.gitignore`
- `.env.local` (written by the CLI, not committed)

## Requirements

- Browsing remains public; no route is gated.
- `CLERK_SECRET_KEY` server only; only the publishable key reaches the browser.
- Build passes with `cacheComponents: true`.

## Security considerations

- No secret in client code or committed files. `.env.local` stays gitignored.
- Route protection, when added later, happens in `proxy.ts`, not client code.

## Acceptance criteria

- Signed out: the avatar circle opens Clerk sign-in.
- Signed in: Clerk's `UserButton` appears in the avatar's spot.
- `npx clerk doctor` reports no blocking issues.

## Checks

- `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npx -y clerk@latest doctor`, `npm run dev`.

## Manual test steps

1. `npm run dev`, open http://localhost:3000.
2. Click the avatar in the top right; Clerk sign-in opens.
3. Sign up with your email; the avatar becomes your Clerk profile button.
4. Open the profile button and sign out; the placeholder avatar returns.
