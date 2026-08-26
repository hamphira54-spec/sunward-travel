import type { MetadataRoute } from 'next';
import { SAMPLE_GUIDES, FEATURED_DESTINATIONS } from '@/lib/destinations';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                        lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/flights`,           lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/hotels`,            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/cruises`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/guides`,            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/about`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE_URL}/affiliate-disclosure`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms-of-use`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.2 },
  ];

  const guideRoutes: MetadataRoute.Sitemap = SAMPLE_GUIDES.map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = FEATURED_DESTINATIONS.map((d) => ({
    url: `${BASE_URL}/guides/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...guideRoutes, ...destinationRoutes];
}
