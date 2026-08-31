import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunward-travel.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/book',
          '/cars/book',
          '/hotels/book',
          '/flights/search',
          '/admin/',
          '/preview/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
