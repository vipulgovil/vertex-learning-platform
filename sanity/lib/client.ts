import 'server-only'

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// A private dataset returns empty results, not an error, to unauthenticated
// reads, so a missing token would silently look like an empty catalog.
const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error('Missing environment variable: SANITY_API_READ_TOKEN')
}

// The dataset is private, so every read carries a Viewer token. Server only.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  token,
})
