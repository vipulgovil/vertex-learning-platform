# Implementation prompt: Vertex Design System

## Goal

Implement the Vertex Design System from `design/vertex-designsystem.png` as Tailwind v4 tokens plus a set of reusable, presentational React components, and render all of it on a `/design-system` reference page. The reference image is the source of truth (AGENTS.md section 3). Later feature pages (catalog, course, lesson, search) will build on these components instead of restyling from scratch.

## Skills and docs read

- `AGENTS.md`: sections 2 (work loop), 3 (UI work), 5 (structure), 6 (stack), 13 (checks), 14.
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`: `next/font/google` with CSS variables in the root layout.
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`: Tailwind via `@import 'tailwindcss'` in global CSS.
- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`: `components/` outside `app/` has no routing significance.
- No Sanity, Clerk or PostHog skill applies. This task has no data, auth or analytics.

## Code inspected

- `package.json`: Next 16.4.3, React 19.3, Tailwind v4, TypeScript. No icon library.
- `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `tsconfig.json` (`@/*` path alias).
- A first pass of this work already exists. It was written before this prompt and skipped the approval step:
  - `app/globals.css` (tokens), `app/layout.tsx` (Inter + Playfair Display)
  - `components/ui/{button,badge,input,progress-bar}.tsx`
  - `app/design-system/page.tsx`
  - `tsconfig.json` now excludes `agent`, `.agents`, `.claude` (these hold skill reference code that broke the type check)
  - `.nvmrc` pins Node 22

  This prompt replaces that pass. Each of those files is reviewed against the image and corrected, not kept as-is.

## Decisions and assumptions

1. **Location.** Section 5 calls for separate `web/` and `studio/` workspaces, but the repo is currently a single Next.js app at the root. Restructuring the repo is a separate task. The design system goes into the current root app, which will become the `web` workspace, and moves with it unchanged.
2. **Tokens in Tailwind v4 `@theme`** in `app/globals.css`, so they become utilities (`bg-primary-500`, `rounded-md`, `shadow-lg`). The type scale is defined as `@utility` classes (`text-display-1` … `text-small`) that bundle size, line height, weight and family.
3. **Fonts** via `next/font/google`: Playfair Display (display) and Inter (everything else), exposed as `--font-playfair` and `--font-inter`.
4. **Icons:** `lucide-react`. The image's specs (24px grid, 2px stroke, rounded caps) match Lucide's defaults. Filled variants use the same icon with `fill="currentColor"`. This is the only new dependency.
5. **Colors not given as hex in the image** are approximated from it and kept in one place as tokens:
   - primary hover (darker orange) `#EA580C`
   - success (Completed) `#22A559`
   - lesson badge text `#5B5FC7` on `#E8EAFB`
   - popular badge text `#C2410C` on `primary-100`

   These are the only invented values.
6. **Components are presentational.** They take props and fetch nothing. Cards take plain props, not Sanity types, so they can be wired to real data later.
7. **Light mode only.** The image shows no dark theme, so the starter's dark-mode `prefers-color-scheme` block is removed.
8. **`app/page.tsx` is left alone.** The home page is out of scope.

## Files to touch

- `app/globals.css`: tokens and type scale
- `app/layout.tsx`: fonts and metadata
- `package.json` and `package-lock.json`: add `lucide-react`
- `components/ui/`:
  - `button.tsx`: Primary, Secondary, Tertiary and Text variants; default, hover and disabled states; optional trailing icon
  - `badge.tsx`: video, lesson, popular
  - `input.tsx`: search input with leading icon and `⌘K` hint; select with chevron
  - `progress-bar.tsx`
  - `status.tsx`: In Progress, Completed, Now Playing, Locked
  - `icon.tsx`: the icon set (bell, search, play, file, bookmark, chart, clock, user, chevron-right) in outline and filled styles
  - `card.tsx`: Course card, Lesson card (video), Lesson card (lesson), Resource card
  - `navbar.tsx`: logo and links with active state
  - `breadcrumbs.tsx`
  - `pagination.tsx`: current page, ellipsis, prev and next
  - `logo.tsx`: the Vertex mark and wordmark (inline SVG)
- `app/design-system/page.tsx`: all 14 sections of the image, in its order and layout

## Requirements (from the image)

- **Colors.**
  - Primary: 500 `#F97316`, 400 `#FB923C`, 300 `#FDBA74`, 200 `#FED7AA`, 100 `#FFEEE5`.
  - Neutral: 900 `#0F172A`, 700 `#334155`, 500 `#64748B`, 300 `#CBD5E1`, 200 `#E2E8F0`, 100 `#F1F5F9`, 50 `#FAFAFC`; White `#FFFFFF`.
- **Type scale** (size / line height, weight):

  | Style      | Font             | Size / line height | Weight   |
  | ---------- | ---------------- | ------------------ | -------- |
  | Display 1  | Playfair Display | 48 / 56            | Bold     |
  | Display 2  | Playfair Display | 36 / 44            | Bold     |
  | Heading 1  | Inter            | 28 / 36            | SemiBold |
  | Heading 2  | Inter            | 22 / 30            | SemiBold |
  | Heading 3  | Inter            | 18 / 26            | Medium   |
  | Body Large | Inter            | 16 / 24            | Regular  |
  | Body       | Inter            | 14 / 20            | Regular  |
  | Small      | Inter            | 12 / 16            | Regular  |

- **Spacing:** 4px base. The scale is 4, 8, 12, 16, 24, 32, 40, 48, 64.
- **Radius:** xs 4, sm 8, md 12, lg 16, xl 24, full.
- **Shadows** (all `rgba(15, 23, 42, a)`):
  - sm `0 1px 2px 0`, a = 0.05
  - md `0 4px 12px -2px`, a = 0.08
  - lg `0 12px 24px -4px`, a = 0.10
  - xl `0 20px 40px -8px`, a = 0.12
- **Buttons:** height 44px; padding 0 16px (lg) or 0 12px (md); radius 12px; Inter Medium 14–16px.
- **Inputs:** height 44px; radius 12px; border 1px `#E2E8F0`; padding 0 16px; focus border `#FB923C`.
- **Icons:** 24×24, 2px stroke, round caps.
- **Responsive:** desktop matches the image. Below that, sections stack to one column and swatch and card rows wrap, with no horizontal scroll at 375px.
- **Accessibility:**
  - visible focus states on all interactive elements
  - `aria-current` on the active nav link and current page
  - `role="progressbar"` with values
  - icon-only buttons have `aria-label`

## Security considerations

Static UI only: no data fetching, tokens, env vars, user input persistence or server routes. `lucide-react` is a widely used, MIT-licensed package, installed at a pinned version from npm.

## Acceptance criteria

- Every section 01–14 of the image appears on `/design-system` and visually matches it: layout, spacing, type, color and states.
- Every color, size, radius and shadow above comes from a token, not a one-off hex in a component. The only exceptions are the approximations listed in decision 5, which are also tokens.
- Components are importable from `@/components/ui/*` and typed.
- Type check, lint and build pass.

## Checks to run (Node 22 via `.nvmrc`)

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. `npm run dev`, then visually compare `/design-system` against the image at desktop width and at 375px.

## Manual test steps

1. `nvm use` (reads `.nvmrc` → 22), then `npm install` and `npm run dev`.
2. Open http://localhost:3000/design-system.
3. Compare each section side by side with `design/vertex-designsystem.png`.
4. Hover each button variant to confirm the hover state. Tab through the page to confirm focus rings on buttons, inputs, nav links and pagination.
5. Click into the search input to confirm the `#FB923C` focus border.
6. Narrow the window to about 375px to confirm sections stack and nothing scrolls horizontally.
