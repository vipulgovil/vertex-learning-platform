import { defineQuery } from 'next-sanity'

// Shared course card fields. Totals are derived from the referenced lessons.
const courseCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  summary,
  "iconUrl": icon.asset->url,
  level,
  price,
  popular,
  studentCount,
  "moduleCount": count(modules),
  "lessonCount": count(*[_type == "lesson" && _id in ^.modules[].lessons[]._ref]),
  "duration": math::sum(modules[].lessons[]->duration)
`

export const COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(coalesce(popular, false) desc, title asc) {
    ${courseCardFields},
    "category": category->{ title, "slug": slug.current },
    "instructor": instructor->{ name, "slug": slug.current }
  }
`)

export const COURSE_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    ${courseCardFields},
    coverImage,
    learningOutcomes[]{ _key, icon, title, description },
    "category": category->{ title, "slug": slug.current, description },
    "instructor": instructor->{ name, "slug": slug.current, photo, expertise },
    "modules": modules[]{
      _key,
      title,
      summary,
      "duration": math::sum(lessons[]->duration),
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        duration,
        freePreview,
        thumbnail
      }
    }
  }
`)

// The lesson resolves only if this course's modules reference it, so a
// lesson slug can't be paired with an unrelated course in the URL.
export const LESSON_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $courseSlug][0] {
    _id,
    title,
    "slug": slug.current,
    "iconUrl": icon.asset->url,
    "instructor": instructor->{ name, "slug": slug.current, photo, expertise },
    "modules": modules[]{
      _key,
      title,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        duration,
        freePreview
      }
    },
    "lesson": *[
      _type == "lesson" &&
      slug.current == $lessonSlug &&
      _id in ^.modules[].lessons[]._ref
    ][0] {
      _id,
      title,
      "slug": slug.current,
      videoUrl,
      thumbnail,
      duration,
      freePreview,
      studentCount,
      notes,
      keyPoints,
      proTip,
      resources[]{ _key, type, title, description, url }
    }
  }
`)

export const INSTRUCTOR_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise,
    bio,
    "courses": *[
      _type == "course" &&
      instructor._ref == ^._id &&
      defined(slug.current)
    ] | order(title asc) {
      ${courseCardFields}
    }
  }
`)

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`)

// Reverse reference: lessons don't store their course.
export const COURSE_FOR_LESSON_QUERY = defineQuery(`
  *[
    _type == "course" &&
    defined(slug.current) &&
    $lessonId in modules[].lessons[]._ref
  ] {
    _id,
    title,
    "slug": slug.current
  }
`)

export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)]{ "slug": slug.current }
`)

export const LESSON_PARAMS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)]{
    "courseSlug": slug.current,
    "lessonSlugs": modules[].lessons[]->slug.current
  }
`)

export const INSTRUCTOR_SLUGS_QUERY = defineQuery(`
  *[_type == "instructor" && defined(slug.current)]{ "slug": slug.current }
`)
