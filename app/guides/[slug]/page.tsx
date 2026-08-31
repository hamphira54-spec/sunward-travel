import GuidePresentation from '@/components/content/GuidePresentation';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock, MapPin, Calendar, ArrowRight, BookOpen,
} from 'lucide-react';
import {
  GUIDES, GUIDE_BY_SLUG, getRelatedGuides, CATEGORY_LABELS,
} from '@/lib/guides';
import { DESTINATION_BY_SLUG, COUNTRY_BY_SLUG } from '@/lib/destinations-v2';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';
import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';
import ContentRenderer from '@/components/content/ContentRenderer';

import prisma from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';
const SITE_NAME = 'Sunward Travel';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let guide: any = GUIDE_BY_SLUG[slug];
  if (!guide) {
    const dbGuide = await prisma.guide.findUnique({ where: { slug } });
    if (dbGuide) {
      guide = {
        ...dbGuide,
        seo: dbGuide.seo as any,
        heroImage: dbGuide.heroImage as any,
      };
    }
  }
  if (!guide) return { title: 'Guide Not Found' };
  const canonical = `${SITE_URL}/guides/${slug}`;
  return {
    title: guide.seo.title,
    description: guide.seo.description,
    alternates: { canonical },
    openGraph: {
      title: guide.seo.title,
      description: guide.seo.description,
      url: canonical,
      type: 'article',
      images: [{ url: guide.heroImage.src, alt: guide.heroImage.alt }],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let guide: any = GUIDE_BY_SLUG[slug];
  if (!guide) {
    const dbGuide = await prisma.guide.findUnique({ where: { slug, publishStatus: 'published' } });
    if (dbGuide) {
      guide = {
        ...dbGuide,
        seo: dbGuide.seo as any,
        heroImage: dbGuide.heroImage as any,
        cardImage: dbGuide.cardImage as any,
        body: dbGuide.body as any,
      };
    }
  }
  if (!guide) notFound();

  const relatedGuides = getRelatedGuides(slug, 3);

  // Destination back-link
  const destEntry =
    guide.destinationSlug ? DESTINATION_BY_SLUG[guide.destinationSlug] : null;
  const countryEntry =
    guide.countrySlug ? COUNTRY_BY_SLUG[guide.countrySlug] : null;

  // Breadcrumb items
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Travel Guides', href: '/guides' },
    ...(countryEntry ? [{ label: countryEntry.name, href: `/destinations/${countryEntry.slug}` }] : []),
    { label: guide.title },
  ];

  const categoryLabel = CATEGORY_LABELS[guide.category as keyof typeof CATEGORY_LABELS];

  const publishedDate = new Date(guide.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const updatedDate = guide.updatedAt
    ? new Date(guide.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;

  // Structured data
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.seo.title,
    description: guide.seo.description,
    image: guide.heroImage.src,
    datePublished: guide.publishedAt,
    ...(guide.updatedAt ? { dateModified: guide.updatedAt } : {}),
    author: {
      '@type': 'Organization',
      name: guide.author ?? 'Sunward Travel Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/guides/${slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
    })),
  };

  
  return (
    <GuidePresentation 
      guide={guide}
      countryEntry={countryEntry}
      destEntry={destEntry}
      relatedGuides={relatedGuides}
    />
  );
}
