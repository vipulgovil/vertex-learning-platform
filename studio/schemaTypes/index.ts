import {type SchemaTypeDefinition} from 'sanity'

import {blockContent, simpleBlockContent} from './blockContent'
import {category} from './category'
import {course} from './course'
import {instructor} from './instructor'
import {learningOutcome} from './learningOutcome'
import {lesson} from './lesson'
import {courseModule} from './module'
import {resource} from './resource'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    course,
    lesson,
    instructor,
    category,
    courseModule,
    learningOutcome,
    resource,
    blockContent,
    simpleBlockContent,
  ],
}
