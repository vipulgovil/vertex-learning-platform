import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {schema} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET

if (!projectId || !dataset) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET in studio/.env')
}

export default defineConfig({
  name: 'default',
  title: 'Vertex',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: '2026-11-01'}),
  ],
})
