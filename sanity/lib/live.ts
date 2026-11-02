import 'server-only'

import { defineLive, type StrictDefinedFetchType } from 'next-sanity/live'

import { client } from './client'

// No browserToken: the browser never holds a Sanity token. <SanityLive />
// only listens for published-content changes and revalidates cached pages.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  strict: true,
})

// The app's one shared 'use cache' boundary. sanityFetch tags the cache
// entry so <SanityLive /> can invalidate it when content changes.
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache'
  return sanityFetch(options)
}
