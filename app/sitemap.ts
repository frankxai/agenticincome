import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'
import { posts } from '@/lib/posts'
import { offers } from '@/lib/offers'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/start', '/proof', '/pack', '/waitlist', '/offers', '/trust', '/blog', '/tools', '/challenge', '/disclosure', '/design', '/privacy'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))
  const postRoutes = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  const offerRoutes = offers.map((offer) => ({
    url: `${site.url}/offers/${offer.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))
  return [...routes, ...postRoutes, ...offerRoutes]
}
