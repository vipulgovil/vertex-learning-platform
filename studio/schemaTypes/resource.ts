import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'

export const resource = defineType({
  name: 'resource',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'PDF', value: 'pdf'},
          {title: 'Link', value: 'link'},
          {title: 'Repository', value: 'repo'},
          {title: 'Code sample', value: 'code'},
          {title: 'Slides', value: 'slides'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', type: 'text', rows: 2}),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'type'},
  },
})
