// Shared metadata helpers for all pages
import type { Metadata } from 'next';

const SITE_NAME = 'Sunward Travel';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';
const SITE_DESCRIPTION =
  'Compare flights, hotels, car rentals, and cruises worldwide. Sunward Travel helps you find the best deals and plan unforgettable trips — wherever the sun takes you.';

export function buildMetadata({
  title,
  description,
  path = '/',
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Wherever the Sun Takes You`;
  const desc = description || SITE_DESCRIPTION;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-default.jpg`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export { SITE_NAME, SITE_URL, SITE_DESCRIPTION };
