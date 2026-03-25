import { MetadataRoute } from 'next'
import { opportunities } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://OppFetch.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/opportunities`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const dynamicRoutes: MetadataRoute.Sitemap = opportunities.map((opp) => ({
    url: `${base}/opportunities/${opp.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...dynamicRoutes]
}
