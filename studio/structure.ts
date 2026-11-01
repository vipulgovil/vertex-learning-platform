import {PlayIcon} from '@sanity/icons/Play'
import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('course').title('Courses'),
      S.listItem()
        .title('Lessons')
        .schemaType('lesson')
        .icon(PlayIcon)
        .child(
          S.documentTypeList('lesson')
            .title('Lessons')
            .defaultOrdering([{field: 'title', direction: 'asc'}]),
        ),
      S.divider(),
      S.documentTypeListItem('instructor').title('Instructors'),
      S.documentTypeListItem('category').title('Categories'),
    ])
