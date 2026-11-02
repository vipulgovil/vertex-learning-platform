import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

import {formatClock} from '../lib/format'

// Playback is a provider embed (AGENTS.md section 7), so only these hosts.
const VIDEO_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'vimeo.com',
  'www.vimeo.com',
  'player.vimeo.com',
  'iframe.mediadelivery.net',
  'player.mediadelivery.net',
]

export const lesson = defineType({
  name: 'lesson',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'video', title: 'Video'},
    {name: 'notes', title: 'Notes'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      description: 'A YouTube, Vimeo, or Bunny video link.',
      type: 'url',
      group: 'video',
      validation: (rule) =>
        rule
          .required()
          .uri({scheme: ['https']})
          .custom((value) => {
            if (!value) return true
            try {
              const {hostname} = new URL(value)
              return VIDEO_HOSTS.includes(hostname)
                ? true
                : 'Use a YouTube, Vimeo, or Bunny video URL.'
            } catch {
              return 'Enter a valid URL.'
            }
          }),
    }),
    defineField({
      name: 'poster',
      description: 'Thumbnail shown on lesson cards and search results.',
      type: 'image',
      group: 'video',
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
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      description: 'Length of the video in seconds, e.g. 754 for 12:34.',
      type: 'number',
      group: 'video',
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'freePreview',
      description: 'Shows a "Free preview" badge. Not access control.',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'studentCount',
      type: 'number',
      group: 'content',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'keyPoints',
      title: 'In this lesson you will',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'notes',
      type: 'blockContent',
      group: 'notes',
    }),
    defineField({
      name: 'proTip',
      type: 'text',
      rows: 3,
      group: 'notes',
    }),
    defineField({
      name: 'resources',
      type: 'array',
      group: 'notes',
      of: [defineArrayMember({type: 'resource'})],
    }),
  ],
  orderings: [
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'poster',
      duration: 'durationSeconds',
      freePreview: 'freePreview',
    },
    prepare: ({title, media, duration, freePreview}) => ({
      title,
      media,
      subtitle: [
        typeof duration === 'number' ? formatClock(duration) : null,
        freePreview ? 'Free preview' : null,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
