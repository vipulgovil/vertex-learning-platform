import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const instructor = defineType({
  name: 'instructor',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'expertise',
      description: 'Short topic tags, e.g. "React", "Performance".',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique(),
    }),
    defineField({name: 'bio', type: 'simpleBlockContent'}),
  ],
  preview: {
    select: {title: 'name', media: 'photo', expertise: 'expertise'},
    prepare: ({title, media, expertise}) => ({
      title,
      media,
      subtitle: Array.isArray(expertise) ? expertise.join(', ') : undefined,
    }),
  },
})
