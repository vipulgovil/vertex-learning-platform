import 'server-only'

import type { LESSON_QUERY_RESULT } from '../../sanity.types'
import { cachedSanity } from './live'
import {
  CATEGORIES_QUERY,
  COURSE_FOR_LESSON_QUERY,
  COURSE_QUERY,
  COURSE_SLUGS_QUERY,
  COURSES_QUERY,
  INSTRUCTOR_QUERY,
  INSTRUCTOR_SLUGS_QUERY,
  LESSON_PARAMS_QUERY,
  LESSON_QUERY,
} from './queries'

// Published content only; no Draft Mode or Visual Editing yet.
const published = { perspective: 'published', stega: false } as const

type Numbered = { moduleNumber: number; lessonNumber: number; label: string }

// "Module 5" and "Lesson 5.1" come from array order, never from stored
// fields. Unpublished or deleted lesson references resolve to null and are
// dropped before numbering.
type ModuleWithLessons = { lessons: Array<object | null> | null }
type LessonOf<M extends ModuleWithLessons> = NonNullable<
  NonNullable<M['lessons']>[number]
>

function numberModules<M extends ModuleWithLessons>(
  modules: M[] | null,
): Array<
  Omit<M, 'lessons'> & { number: number; lessons: Array<LessonOf<M> & Numbered> }
> {
  return (modules ?? []).map((module, m) => ({
    ...module,
    number: m + 1,
    lessons: (module.lessons ?? [])
      .filter((lesson): lesson is LessonOf<M> => lesson !== null)
      .map((lesson, l) => ({
        ...lesson,
        moduleNumber: m + 1,
        lessonNumber: l + 1,
        label: `${m + 1}.${l + 1}`,
      })),
  }))
}

export async function getCourses() {
  const { data } = await cachedSanity({ query: COURSES_QUERY, ...published })
  return data
}

export async function getCourse(slug: string) {
  const { data } = await cachedSanity({
    query: COURSE_QUERY,
    params: { slug },
    ...published,
  })
  if (!data) return null
  return { ...data, modules: numberModules(data.modules) }
}

export type Course = NonNullable<Awaited<ReturnType<typeof getCourse>>>

type OutlineLesson = NonNullable<
  NonNullable<NonNullable<LESSON_QUERY_RESULT>['modules']>[number]['lessons']
>[number] &
  Numbered & { moduleTitle: string }

// A lesson in the context of its course: the outline for the sidebar, its
// derived number, and the previous and next lessons across modules.
export async function getLesson(courseSlug: string, lessonSlug: string) {
  const { data } = await cachedSanity({
    query: LESSON_QUERY,
    params: { courseSlug, lessonSlug },
    ...published,
  })
  if (!data?.lesson) return null

  const { lesson, modules, ...course } = data
  const outline = numberModules(modules)
  const flat: OutlineLesson[] = outline.flatMap((module) =>
    module.lessons.map((l) => ({ ...l, moduleTitle: module.title })),
  )
  const index = flat.findIndex((l) => l._id === lesson._id)
  if (index === -1) return null
  const position = flat[index]

  return {
    course: { ...course, modules: outline },
    lesson: {
      ...lesson,
      moduleNumber: position.moduleNumber,
      lessonNumber: position.lessonNumber,
      label: position.label,
      moduleTitle: position.moduleTitle,
    },
    previous: flat[index - 1] ?? null,
    next: flat[index + 1] ?? null,
  }
}

export type LessonPage = NonNullable<Awaited<ReturnType<typeof getLesson>>>

export async function getInstructor(slug: string) {
  const { data } = await cachedSanity({
    query: INSTRUCTOR_QUERY,
    params: { slug },
    ...published,
  })
  return data
}

export async function getCategories() {
  const { data } = await cachedSanity({ query: CATEGORIES_QUERY, ...published })
  return data
}

// Reverse reference: the courses whose modules include this lesson.
export async function getCoursesForLesson(lessonId: string) {
  const { data } = await cachedSanity({
    query: COURSE_FOR_LESSON_QUERY,
    params: { lessonId },
    ...published,
  })
  return data
}

export async function getCourseSlugs() {
  const { data } = await cachedSanity({
    query: COURSE_SLUGS_QUERY,
    ...published,
  })
  return data
}

export async function getLessonParams() {
  const { data } = await cachedSanity({
    query: LESSON_PARAMS_QUERY,
    ...published,
  })
  return data.flatMap(({ courseSlug, lessonSlugs }) =>
    (lessonSlugs ?? [])
      .filter((lessonSlug): lessonSlug is string => Boolean(lessonSlug))
      .map((lessonSlug) => ({ courseSlug, lessonSlug })),
  )
}

export async function getInstructorSlugs() {
  const { data } = await cachedSanity({
    query: INSTRUCTOR_SLUGS_QUERY,
    ...published,
  })
  return data
}
