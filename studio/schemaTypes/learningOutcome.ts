import {defineField, defineType} from 'sanity'
import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'

// Lucide icon names; the site maps each to its own icon set.
export const LEARNING_OUTCOME_ICONS = [
  'sparkles',
  'layers',
  'code',
  'rocket',
  'shield',
  'gauge',
  'puzzle',
  'workflow',
] as const

export const learningOutcome = defineType({
  name: 'learningOutcome',
  type: 'object',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'icon',
      type: 'string',
      options: {list: [...LEARNING_OUTCOME_ICONS]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', type: 'text', rows: 2}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'icon'},
  },
})
