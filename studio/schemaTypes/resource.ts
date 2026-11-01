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
          {title: 'Article', value: 'article'},
          {title: 'Documentation', value: 'documentation'},
          {title: 'Repository', value: 'repository'},
          {title: 'Video', value: 'video'},
          {title: 'Download', value: 'download'},
          {title: 'Tool', value: 'tool'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'article',
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
