import {defineArrayMember, defineField, defineType} from 'sanity'
import {FolderIcon} from '@sanity/icons/Folder'

// Embedded in a course. "Module 5" and "Lesson 5.1" come from array order.
export const courseModule = defineType({
  name: 'module',
  type: 'object',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'summary', type: 'text', rows: 3}),
    defineField({
      name: 'lessons',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'lesson'}]})],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: {title: 'title', lessons: 'lessons'},
    prepare: ({title, lessons}) => {
      const count = Array.isArray(lessons) ? lessons.length : 0
      return {title, subtitle: `${count} lesson${count === 1 ? '' : 's'}`}
    },
  },
})
