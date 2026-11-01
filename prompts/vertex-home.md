# Implementation prompt: Vertex Home Page

## Goal

Replace the Create Next App starter at `/` with the Vertex home page from `design/vertex-home.png`. The image is the source of truth (AGENTS.md section 3). It contains:

- a top bar with the logo, the Courses and My Learning links, a notifications bell and an avatar
- a hero with the "Intelligent Learning" eyebrow pill, the serif headline, the subcopy and an "Explore Courses" button
- a large search box with a `⌘ K` hint
- an "All Courses" section with three course cards and a "View all courses" link
- a "New courses and lessons added every week." divider row
- decorative orange gradient bars along the bottom edge

The page sits inside a bordered central frame with a hatched gutter outside it.

## Skills and docs read

- `AGENTS.md`: sections 2, 3, 5, 7 (presentational surfaces, search is a results page), 12, 13.
- `prompts/vertex-design-system.md`: the tokens and components this page builds on.
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/form.md`: `next/form` for a GET search form with client-side navigation.
- No Sanity, Clerk or PostHog skill applies yet. None of those are installed (see decision 2).

## Code inspected

- `app/page.tsx`: the starter page, to be replaced.
- `app/layout.tsx`: Inter and Playfair are already loaded as CSS variables.
- `app/globals.css`: the design-system tokens and type scale.
- `components/ui/*`:
  - `Logo`, `Navbar`, `buttonClasses`, `SearchInput`, `CourseCard`, `Icon`
  - The home course card differs from the design-system `CourseCard`. It has a large icon tile above a serif title, a divider, and the meta row at the bottom. It gets its own variant, and the existing card stays as it is.
- `package.json`: Next 16.4.3, `lucide-react`. No Sanity, Clerk or PostHog yet.

## Decisions and assumptions

1. **Scale.** I implement the image at 1:1 CSS pixels. The frame is up to 1440px wide (`max-w-360`) and centered; header and course-section padding grow at `xl`, and the hatched gutter fills the rest of the viewport. Sizes are read off the image:
   - headline ≈ 72px Playfair on two lines
   - button 60px tall
   - search box 84px tall
   - cards about 265px wide in a three-column grid
2. **Course data is static for now.** There is no Sanity workspace yet. The three courses (title, description, level, duration, module count, icon) live in one typed array in `lib/home-courses.ts`, shaped like the future Sanity projection so the catalog task can swap in a server fetch. This is the only placeholder content.
3. **Course icons.** I add three small SVGs in `public/courses/` (Next.js "N" tile, Docker whale, TypeScript "TS" tile), redrawn to match the image. Later these come from the course's Sanity image.
4. **Avatar.** Clerk is not installed, so there is no user or photo. I show a circular avatar placeholder: a neutral circle with the user icon, at the image's size. Clerk's user button replaces it in the auth task. The bell is a presentational icon button (section 7).
5. **Links point at routes that do not exist yet.**
   - "Explore Courses", "Courses" and "View all courses" go to `/courses`.
   - "My Learning" goes to `/my-learning`.
   - Search submits `GET /search?q=…` using `next/form`.

   Until those pages are built, these links return the default 404.
6. **⌘K.** A small client component focuses the search input on ⌘K or Ctrl+K. Everything else on the page stays a server component.
7. **New tokens.** The image's page background is a warm off-white, not `neutral-50`. I add `--color-cream` (≈ `#FBF8F5`) for it, plus a hatch line color. The TypeScript blue (`#3178C6`) lives only in its SVG. Everything else uses existing tokens.
8. **Display weight.** The headline, "All Courses" and the card titles use Playfair at regular or medium weight, matching the image. They do not use the Display 1 bold utility, because the image is visibly lighter and larger than that.
9. **Navbar.** I extend the existing `Navbar` with an optional right-side slot (bell and avatar), so both pages share one nav. On the home page no link is shown as active, matching the image, where neither link is orange.

## Files to touch

- `app/page.tsx`: the home page (server component)
- `app/globals.css`: the `cream` and hatch tokens
- `components/ui/navbar.tsx`: the optional `actions` slot
- `components/ui/card.tsx`: a `FeaturedCourseCard` (the home course card)
- `components/home/search-box.tsx`: the large search form plus the ⌘K handler (client component)
- `components/home/bottom-bars.tsx`: the decorative gradient bars
- `lib/home-courses.ts`: the static course data
- `public/courses/{nextjs,docker,typescript}.svg`

## Requirements

- **Layout, spacing, typography, color and states match the image at desktop width.** This covers:
  - the pill border and tracking
  - the button's orange with its arrow and soft shadow
  - the search box's white fill, border and shadow, and its `⌘ K` keycap
  - the horizontal rules between the header, the hero and All Courses
  - the cards' white fill, border, divider and meta icons (chart, clock, file)
  - the divider row with the orange star outline
  - the bottom bars as vertical orange gradients that fade upward, clustered left and right with a gap in the middle
- **Hover and focus:**
  - The button darkens to `primary-600` on hover.
  - Cards lift with `shadow-md` on hover.
  - Nav links turn orange on hover.
  - All interactive elements show a visible focus ring.
  - The search input's focus border is `primary-400`.
- **Responsive:**
  - At tablet width, the cards go to two columns.
  - At mobile width, they go to one column.
  - The headline scales down to about 40px.
  - The nav links hide below `sm` behind nothing extra. Only the logo, bell and avatar remain, because there is no mobile reference for a menu.
  - The gutter hatch hides on small screens.
  - The search box keeps full width and hides `⌘ K` on touch-sized screens.
  - There is no horizontal scroll at 375px.
- **Accessibility:**
  - a single `<h1>`
  - the search input has a label (visually hidden)
  - the bell and avatar buttons have `aria-label`
  - the decorative bars and icons are `aria-hidden`
  - each card is one link with the course title as its accessible name

## Security considerations

Static UI only: no tokens, env vars or server routes. The search form sends the query as a URL param to a page that does not exist yet. Nothing user-entered is rendered on this page.

## Acceptance criteria

- `/` visually matches `design/vertex-home.png` at desktop width.
- The starter content and its assets are no longer referenced by `/`.
- Typing a query and pressing Enter navigates to `/search?q=<query>`.
- ⌘K or Ctrl+K focuses the search input.
- Type check, lint and build pass.

## Checks to run (Node 22)

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. `npm run dev`, then compare `/` against the image at desktop width and at 375px.

## Manual test steps

1. `nvm use`, then `npm run dev`.
2. Open http://localhost:3000 and compare it side by side with `design/vertex-home.png`.
3. Hover the Explore Courses button, the nav links and each course card to see the hover states.
4. Press ⌘K (or Ctrl+K) and confirm the search box is focused. Type "caching" and press Enter. The URL becomes `/search?q=caching`. A 404 is expected until search is built.
5. Tab through the page and confirm that every link and button shows a focus ring.
6. Narrow the window to about 768px (two columns) and then 375px (one column, no horizontal scroll).
