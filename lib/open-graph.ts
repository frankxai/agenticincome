import type { Metadata } from 'next'
import { site } from '@/lib/site'

export const ogImage = '/opengraph-image'

// Next.js replaces a parent's openGraph object instead of merging it, so a page
// that sets its own openGraph silently drops the layout's image. Every page
// spreads this before its own title, description, and url.
export const baseOpenGraph = {
  type: 'website',
  siteName: site.name,
  images: [{ url: ogImage, width: 1200, height: 630, alt: 'Agentic Income revenue system implementation' }],
} satisfies NonNullable<Metadata['openGraph']>
