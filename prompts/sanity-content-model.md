# Implementation prompt: Sanity content model, Studio, and server read layer

## Goal

Give the embedded Studio at `/studio` the Vertex content model (course, module, lesson, instructor, category) and add the server-only data layer the pages will use to read it. No pages, routes, video documents, Context document, or progress records in this task.

## Skills and docs read

- `AGENTS.md`: sections 5, 6, 7, 8, 12, 13.
- `sanity-best-practices`: `SKILL.md`, `references/schema.md`, `references/nextjs.md`, `references/typegen.md`.
- `next-sanity` 13.4 `defineLive` docs (`dist/live/conditions/react-server/index.d.ts`, `dist/live/cache-life.d.ts`): the Cache Components pattern (`strict: true`, one shared `'use cache'` wrapper, `cacheLife` set to `sanity`).

## Code and config inspected

- Studio scaffold (uncommitted): `sanity.config.ts` (structure + vision), `sanity.cli.ts`, `sanity/env.ts`, `sanity/structure.ts`, `sanity/schemaTypes/index.ts` (empty), `sanity/lib/{client,image,live}.ts`, `app/studio/[[...tool]]/page.tsx`.
- `sanity/lib/client.ts`: no token, `useCdn: true`, importable from client code. `sanity/lib/live.ts`: `defineLive({ client })`, no tokens, not wired anywhere.
- `next.config.ts`: `cacheComponents: true`, so every Sanity fetch needs a `'use cache'` boundary or a `<Suspense>`.
- Packages: `sanity` 5.31.2, `next-sanity` 13.4.0, `@sanity/image-url` 2.1.1. Top-level `@sanity/icons` is 3.8.0 (root export only); v5 is nested under `sanity`.
- Sanity CLI is logged in. Dataset `production` is **private** and **empty**. CORS already allows `http://localhost:3000` and `:3333`. No API tokens exist yet.
- `.env.example` has Clerk vars plus `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`. No read token var.
- `lib/home-courses.ts`: the home page's placeholder course shape (`slug, title, summary, icon, level, duration, moduleCount`). The catalog query below returns that shape so the home page can switch over in a later task.

## Decisions and assumptions

1. **Schema files** live in `sanity/schemaTypes/`, one file per type, using `defineType` / `defineField` / `defineArrayMember` and an icon on every type (imported by subpath, e.g. `@sanity/icons/Book`). I add `@sanity/icons@^5` as a direct dependency so subpath imports resolve.
2. **course** (document): `title`, `slug` (from title), `summary` (text), `icon` (image, the small course logo shown on cards and in search results; accepts SVG), `coverImage` (image with hotspot + `alt`), `level` (radio: beginner, intermediate, advanced), `price` (number, USD, 0 = free), `popular` (boolean), `studentCount` (number), `learningOutcomes` (array of `{ icon, title, description }`), `instructor` (reference), `category` (reference), `modules` (array of `module`). Field groups: Content, Marketing, Outcomes.
3. **learningOutcome icon** is a string picked from a fixed list of Lucide icon names (e.g. `code`, `rocket`, `shield`, `zap`, `database`, `layers`, `gauge`, `server`). It is a name, not an image, so the UI maps it to the project's Lucide icon set. The list is easy to extend later.
4. **module** (object, embedded in course): `title`, `summary` (text), `lessons` (array of references to lesson, unique). Numbers like Module 5 / Lesson 5.1 are derived from array order in the data layer, never stored.
5. **lesson** (document): `title`, `slug`, `videoUrl` (url, validated to YouTube, Vimeo, or Bunny hosts), `poster` (image + `alt`), `durationSeconds` (number, integer seconds, so search can compute clip lengths and courses can sum totals), `freePreview` (boolean, label only), `studentCount`, `notes` (Portable Text: normal, h2, h3, blockquote, bullet/number lists, strong/em/code marks, links, inline images with `alt`), `keyPoints` (array of strings), `proTip` (text, optional), `resources` (array of `{ type, title, description, url }`, `type` is a radio list: article, documentation, repository, video, download, tool). No parent course field; the course is found by reverse reference.
6. **instructor** (document): `name`, `slug`, `photo` (image + `alt`), `expertise` (array of short strings, shown as tags, e.g. "React", "Performance"), `bio` (simple Portable Text, paragraphs and links only).
7. **category** (document): `title`, `slug`, `description` (text).
8. **Validation**: required on titles, names, slugs, `videoUrl`, `durationSeconds`, course `instructor` / `category` / `level`; `durationSeconds` and counts are non-negative integers; `price` ≥ 0. Previews show useful subtitles (course: level + category; lesson: duration; instructor: photo).
9. **Studio structure**: Courses, Lessons, Instructors, Categories in that order. Lesson list default-ordered by title. No singletons.
10. **Read client** (`sanity/lib/client.ts`): marked `import "server-only"`, `useCdn: true`, `perspective: "published"`, token from `SANITY_API_READ_TOKEN`. The image URL builder stays client-safe (`sanity/lib/image.ts`, no token; image assets are public by URL even on a private dataset).
11. **Live + cache** (`sanity/lib/live.ts`, server only): `defineLive({ client, serverToken, strict: true })`, **no `browserToken`** (AGENTS rule: the browser holds no token). Export `cachedSanity`, the single shared `'use cache'` wrapper around `sanityFetch`. Set `cacheLife: { default: sanity }` from `next-sanity/live/cache-life` in `next.config.ts`. Render `<SanityLive />` in `app/layout.tsx` so published edits revalidate cached pages. Draft mode / Visual Editing are out of scope; every fetch uses `perspective: "published"`, `stega: false`.
    - Risk: if the Live event stream refuses connections without a browser token on a private dataset, I remove `<SanityLive />` and fall back to tag revalidation later. Pages still render either way. I will report which happened.
12. **Queries** (`sanity/lib/queries.ts`, `defineQuery`, unique names, `_key` included on arrays):
    - `COURSES_QUERY`: catalog cards, shaped like `HomeCourse` plus `popular`, `price`, `studentCount`, category, instructor name; `moduleCount` = `count(modules)`; `durationSeconds` = `math::sum(modules[].lessons[]->durationSeconds)`; `lessonCount`.
    - `COURSE_QUERY($slug)`: full course with instructor, category, outcomes, modules → lesson summaries (title, slug, duration, freePreview, poster).
    - `LESSON_QUERY($courseSlug, $lessonSlug)`: the lesson only if it belongs to that course (so a lesson URL can't be paired with an unrelated course), plus the course outline for the sidebar and the instructor.
    - `INSTRUCTOR_QUERY($slug)`: instructor plus their courses (reverse reference).
    - `CATEGORIES_QUERY`, and slug lists for `generateStaticParams` (`COURSE_SLUGS_QUERY`, `LESSON_PARAMS_QUERY`, `INSTRUCTOR_SLUGS_QUERY`).
    - `COURSE_FOR_LESSON_QUERY($lessonId)`: reverse lookup of the course(s) whose modules reference a lesson. Search will need this.
13. **Data helpers** (`sanity/lib/data.ts`, server only): `getCourses()`, `getCourse(slug)`, `getLesson(courseSlug, lessonSlug)`, `getInstructor(slug)`, `getCategories()`, and the param helpers. Each calls `cachedSanity` with `perspective: "published"`, `stega: false`. `getLesson` attaches derived numbering (`moduleNumber`, `lessonNumber`, label `"5.1"`) and previous/next lesson computed from the outline. A small `formatDuration(seconds)` → `"18h 24m"` goes in `lib/format.ts` (client-safe, no Sanity import).
14. **TypeGen**: configure `typegen` in `sanity.cli.ts` (scan `./{app,components,lib,sanity}/**/*.{ts,tsx}`, output `./sanity.types.ts`, `overloadClientMethods: true`). Add `"typegen": "sanity schemas extract --enforce-required-fields && sanity typegen generate"` to `package.json`. Commit `schema.json` and `sanity.types.ts` (generated). Queries return typed results with no hand-written types.
15. **Env**: add `SANITY_API_READ_TOKEN=` to `.env.example`. I create the token with the CLI (`sanity tokens add "vertex-web-read" --role viewer --json`) and append it to `.env.local` in one piped command so the value is never printed. If you'd rather create it yourself in sanity.io/manage, say so.
16. **Schema deploy**: run `sanity schemas deploy` so the schema is registered on the dataset (needed later by the MCP). Hosted Studio deploy (`sanity deploy`) is left for the search task, where the Context MCP needs it.
17. **Not doing**: seed content, video documents, Context document, progress, pages/routes, Draft Mode, Visual Editing, code blocks in notes (would need `@sanity/code-input`; can be added later if lessons need it).

## Files expected to touch

- `sanity/schemaTypes/{index,course,module,learningOutcome,lesson,resource,instructor,category,blockContent}.ts` (new or edited)
- `sanity/structure.ts`, `sanity/lib/client.ts`, `sanity/lib/live.ts`
- `sanity/lib/queries.ts`, `sanity/lib/data.ts` (new)
- `lib/format.ts` (new)
- `sanity.cli.ts`, `next.config.ts`, `app/layout.tsx`
- `package.json`, `package-lock.json` (`@sanity/icons`, `typegen` script)
- `schema.json`, `sanity.types.ts` (generated)
- `.env.example`; `.env.local` (token appended, not committed)
- Also commits the existing uncommitted Studio scaffold on `feat/sanity-studio`.

## Requirements

- Relationships and fields exactly as AGENTS.md section 8 lists them; module embedded, lesson has no course field.
- Read token server-only; `client.ts`, `live.ts`, `data.ts` import `server-only`; no `NEXT_PUBLIC_` token.
- All content fetched server side through `cachedSanity` with published perspective.
- Builds with `cacheComponents: true`.

## Security considerations

- Dataset stays private. Token is Viewer (read only), lives in `.env.local`, never logged or committed.
- `server-only` makes any accidental client import of the client/data layer a build error.
- `<SanityLive />` gets no token.
- `videoUrl` restricted to the three provider hosts so authors can't embed arbitrary origins.

## Acceptance criteria

- `/studio` shows Courses, Lessons, Instructors, Categories; you can create an instructor, a category, two lessons, and a course with one module referencing them; validation messages appear on empty required fields and on a non-YouTube/Vimeo/Bunny video URL.
- `npm run typegen` produces `sanity.types.ts` with result types for every query.
- Each data helper returns the created course/lesson/instructor when run against the dataset (verified with a throwaway script that I delete after, or via a `sanity documents query` of the same GROQ).

## Checks

- `npm run typegen`
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npx sanity schemas validate`, `npx sanity schemas deploy`
- `npm run dev`, load `/studio` and `/`.
- Run each query with `npx sanity documents query` against the live dataset (empty results expected until content exists; confirms GROQ validity).

## Manual test steps

1. `npm run dev`, open http://localhost:3000/studio and log in with your Sanity account.
2. Create a Category ("Web Development") and an Instructor (name, photo, two expertise tags, bio). Publish both.
3. Create a Lesson: title, generate slug, paste a YouTube URL, duration `754`, a key point, a resource. Try a `https://example.com` video URL first and confirm it's rejected. Publish. Make a second lesson.
4. Create a Course: title, slug, summary, icon, level, instructor, category, one learning outcome, and a module referencing both lessons. Publish.
5. Open the Vision tab, run `*[_type == "course"]{title, "modules": count(modules), "lessons": count(modules[].lessons[])}` and confirm `1` module and `2` lessons.
6. Open http://localhost:3000; the home page still renders unchanged (it still uses the placeholder data until the catalog task).
