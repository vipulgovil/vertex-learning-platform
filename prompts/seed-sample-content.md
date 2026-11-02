# Implementation prompt: Seed the dataset with the course's sample content

## Goal

Load the course's sample catalog (6 categories, 5 instructors, 10 courses, 40 modules, 120 lessons, each with a real YouTube video) into the `production` dataset. Use the course's provided `seed.ndjson` and `videos.json` as is (course instruction: "Seed sanity using the provided files instead of generating new content. Use the Sanity CLI import, verify the document counts afterward and do not modify the files."). Align our schema with the files' field names so they import unchanged and later course code fits. No video documents or transcripts (that's the ingestion task), no pages.

## Source

- Public repo `github.com/jsmastery-pro/vertex-learning-platform`, folder `studio/scripts/seed/`: `README.md`, `content.mjs` (authored content), `videos.json` (cached YouTube lookups, 120 entries), `resolve-videos.mjs`, `build-ndjson.mjs`, `seed.ndjson` (generated output).
- Downloaded to the scratchpad for review, not yet in the project.

## Skills and docs read

- `sanity-migration` `SKILL.md`: deterministic ids and `dataset import --replace` so re-runs converge; validate after import.
- `sanity-best-practices` `references/schema.md` (safe renames: the dataset is empty, so no deprecation step is needed).
- `AGENTS.md` sections 7, 8, 12, 13.

## What I checked in the downloaded files

- **Scripts read in full.** `build-ndjson.mjs` reads only `content.mjs` and `videos.json`, re-checks the Studio rules (lengths, unique slugs and videos, no orphan lessons, refs resolve), and writes `seed.ndjson`. `resolve-videos.mjs` scrapes YouTube's public search page and verifies via oEmbed. We won't run it, because `videos.json` already covers all 120 lessons. `content.mjs` is plain data (no imports, network, or file access).
- **Data vs our schema.** All references resolve; no lesson appears twice in a course; all video URLs are `www.youtube.com` (accepted); notes use only normal/h2 blocks and bullet lists (accepted); bios are plain paragraphs (accepted).
- **Mismatches:** lesson `duration` (ours `durationSeconds`), lesson `thumbnail` (ours `poster`), outcome icons `workflow`/`sparkles`/`puzzle` (not in our list), resource type `link` (not in our list).
- **Images** use `_sanityAsset` URLs (Lorem Picsum covers, YouTube poster frames, randomuser.me portraits). The import CLI downloads and uploads them as real Sanity assets; nothing hotlinks at runtime.
- **Ids** are deterministic (`course.<slug>`, `lesson.<course>-<lesson>`, …). Fine on a private dataset read with a token.

## Decisions (you chose: match his schema)

1. **Copy only** `seed.ndjson` and `videos.json`, byte for byte, into `studio/scripts/seed/`, and confirm with a checksum that they match the downloads. No scripts, no `content.mjs`, no edits to either file. (`videos.json` isn't read by the import; it's kept as the lookup the later ingestion step uses.)
2. **Schema renames** (`studio/schemaTypes/lesson.ts`): `durationSeconds` → `duration`, `poster` → `thumbnail`. Validation and previews unchanged otherwise.
3. **Outcome icons** (`learningOutcome.ts`): use his list: sparkles, layers, code, rocket, shield, gauge, puzzle, workflow (drops my unused zap, database, server, globe, lock).
4. **Resource types** (`resource.ts`): use his list: pdf, link, repo, code, slides.
5. **Keep** the rest of our schema as is, including the optional course `icon` field (his data doesn't set it; search cards can fall back later) and the duplicate-lesson check.
6. **Web queries** (`sanity/lib/queries.ts`): read `duration` and `thumbnail`. Derived totals are renamed from `durationSeconds` to `duration` so the names line up. Then regenerate `sanity.types.ts`. `data.ts` needs no logic change.
7. **Import** with the Sanity CLI: `npx sanity dataset import scripts/seed/seed.ndjson --dataset production --replace`, run from `studio/`. It authenticates with your CLI login, so no write token. No package scripts added.
8. **Verify counts** afterwards against the file: 6 categories, 5 instructors, 10 courses, 120 lessons (141 documents), via `sanity documents query --dataset production`.
9. **No dry run exists** for Sanity's import. The dataset is empty, the build self-checks, and `--replace` makes it re-runnable, so I import directly and then validate. Rollback if needed: delete the seeded ids (all prefixed `category.`, `instructor.`, `course.`, `lesson.`).
10. **Deploy the updated schema** (`sanity schemas deploy`). It has no `--dataset` flag and deploys to the Studio workspace's dataset, so first confirm `SANITY_STUDIO_DATASET=production` in `studio/.env`.

## Files expected to touch

- New: `studio/scripts/seed/{seed.ndjson,videos.json}` (unmodified)
- Edited: `studio/schemaTypes/{lesson,learningOutcome,resource}.ts`, `studio/schema.json` (regenerated), `sanity/lib/queries.ts`, `sanity.types.ts` (regenerated)

## Requirements

- Every imported document passes `sanity documents validate --dataset production` with no errors.
- Catalog query returns 10 courses with non-zero durations and lesson counts of 12 each.

## Security considerations

- No new tokens. Import runs through your CLI login; the web app keeps its read-only token.
- No downloaded code is brought in or run; only the two data files.

## Acceptance criteria

- Studio at :3333 lists 10 courses, 120 lessons, 5 instructors, 6 categories, with cover images, thumbnails, and portraits.
- Opening a lesson shows its YouTube URL, duration, notes, key points, and resources with no validation errors.
- `COURSES_QUERY` against the live dataset returns 10 courses with `duration` > 0 and `lessonCount` = 12.

## Checks

- `studio/`: checksum the two files against the downloads, `npx sanity schemas validate`, `npm run typegen`, `npx tsc --noEmit`, the CLI import, document counts per type (`--dataset production`), `npx sanity documents validate --dataset production`, `npx sanity schemas deploy` (after confirming `SANITY_STUDIO_DATASET=production`).
- Root: `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Live queries: run `COURSES_QUERY`, `COURSE_QUERY`, `LESSON_QUERY`, `INSTRUCTOR_QUERY` against the dataset and check counts and fields.

## Manual test steps

1. Open http://localhost:3333 (Studio dev server is running).
2. Courses: confirm 10 entries with cover images; open "Next.js App Router in Depth" and check its 4 modules × 3 lessons.
3. Open a lesson: video URL, duration, thumbnail, notes, key points, and a resource are filled in, and no red validation badges appear.
4. Instructors: 5 with portraits; Categories: 6.
5. Vision tab: `count(*[_type == "lesson"])` returns `120`.
