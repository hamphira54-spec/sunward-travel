import type { MetadataRoute } from 'next';
import { DESTINATIONS, COUNTRIES } from '@/lib/destinations-v2';
import { GUIDES } from '@/lib/guides';
import { getAllPublishedNews, getAllPublishedEvents } from '@/lib/content/repository';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                           lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/flights`,              lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/hotels`,               lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/activities`,           lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/airport-transfers`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/cars`,                 lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/cruises`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/destinations`,         lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/guides`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/news`,                 lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/events`,               lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/about`,                lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`,              lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE_URL}/affiliate-disclosure`, lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE_URL}/terms-of-use`,         lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ];

  // Country pages
  const countryRoutes: MetadataRoute.Sitemap = COUNTRIES.map((c) => ({
    url: `${BASE_URL}/destinations/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Destination pages
  const destinationRoutes: MetadataRoute.Sitemap = DESTINATIONS.map((d) => ({
    url: `${BASE_URL}/destinations/${d.countrySlug}/${d.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Guide articles
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((g) => ({
    url: `${BASE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // News articles - only published items, sorted by date descending
  const newsRoutes: MetadataRoute.Sitemap = getAllPublishedNews().map((n) => ({
    url: `${BASE_URL}/news/${n.slug}`,
    lastModified: n.publication.updatedAt
      ? new Date(n.publication.updatedAt)
      : n.publication.publishedAt
        ? new Date(n.publication.publishedAt)
        : now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Events articles
  const eventRoutes: MetadataRoute.Sitemap = getAllPublishedEvents().map((e) => ({
    url: `${BASE_URL}/events/${e.slug}`,
    lastModified: e.publication.updatedAt
      ? new Date(e.publication.updatedAt)
      : e.publication.publishedAt
        ? new Date(e.publication.publishedAt)
        : now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...countryRoutes, ...destinationRoutes, ...guideRoutes, ...newsRoutes, ...eventRoutes];
}
