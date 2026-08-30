import NewsPresentation from '@/components/content/NewsPresentation';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import {
  getAllPublishedNews,
  getNewsBySlug,
  getRelatedNews,
  getGuidesByDestination,
  getGuidesByCountry,
} from '@/lib/content/repository';
import { NEWS_CATEGORY_LABELS } from '@/lib/content/news';
import { DESTINATION_BY_SLUG, COUNTRY_BY_SLUG } from '@/lib/destinations-v2';
import { formatNewsDate } from '@/lib/news';
import ContentRenderer from '@/components/content/ContentRenderer';
import NewsCard from '@/components/news/NewsCard';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';
const SITE_NAME = 'Sunward Travel';

export async function generateStaticParams() {
  const news = await getAllPublishedNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: 'Article Not Found' };
  const canonical = `${SITE_URL}/news/${slug}`;
  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: { canonical },
    openGraph: {
      title: article.seo.title,
      description: article.seo.description,
      url: canonical,
      type: 'article',
      images: [{ url: article.heroImage.src, alt: article.heroImage.alt }],
      ...(article.publication.publishedAt
        ? { publishedTime: article.publication.publishedAt }
        : {}),
    },
  };
}

/** Returns a contextual affiliate CTA based on news category / destination */
function getAffiliateCTA(
  category: string,
  countrySlug?: string,
  destinationSlug?: string
): { label: string; href: string } | null {
  if (destinationSlug && countrySlug) {
    if (category === 'destinations') {
      return {
        label: `Explore ${DESTINATION_BY_SLUG[destinationSlug]?.name ?? 'Destination'}`,
        href: `/destinations/${countrySlug}/${destinationSlug}`,
      };
    }
  }
  switch (category) {
    case 'aviation':        return { label: 'Compare Flight Options',  href: '/flights' };
    case 'transportation':  return { label: 'Book an Airport Transfer', href: '/airport-transfers' };
    case 'hotels':          return { label: 'Find Hotels',              href: '/hotels' };
    case 'attractions':     return { label: 'Explore Things to Do',    href: '/activities' };
    case 'cruises':         return { label: 'Explore Cruises',          href: '/cruises' };
    case 'destinations':    return { label: 'Explore Destinations',     href: '/destinations' };
    default:                return null;
  }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const relatedNews   = await getRelatedNews(slug, 3);
  const destEntry     = article.destinationSlug ? DESTINATION_BY_SLUG[article.destinationSlug] : null;
  const countryEntry  = article.countrySlug     ? COUNTRY_BY_SLUG[article.countrySlug]         : null;

  // Related guides via destination or country
  const relatedGuides = (
    article.destinationSlug
      ? await getGuidesByDestination(article.destinationSlug)
      : article.countrySlug
        ? await getGuidesByCountry(article.countrySlug)
        : []
  ).slice(0, 2);

  const publishedDate = article.publication.publishedAt
    ? formatNewsDate(article.publication.publishedAt)
    : null;
  const updatedDate = article.publication.updatedAt
    ? formatNewsDate(article.publication.updatedAt)
    : null;

  const categoryLabel = NEWS_CATEGORY_LABELS[article.category];
  const affiliateCTA  = getAffiliateCTA(
    article.category,
    article.countrySlug,
    article.destinationSlug
  );

  const crumbs = [
    { label: 'Home',         href: '/' },
    { label: 'Travel News',  href: '/news' },
    { label: categoryLabel,  href: `/news?category=${article.category}` },
    { label: article.title },
  ];

  // JSON-LD
  const newsArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.seo.title,
    description: article.seo.description,
    image: article.heroImage.src,
    ...(article.publication.publishedAt ? { datePublished: article.publication.publishedAt } : {}),
    ...(article.publication.updatedAt   ? { dateModified:  article.publication.updatedAt  } : {}),
    author: {
      '@type': 'Organization',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/news/${slug}`,
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
    <NewsPresentation 
      article={article}
      countryEntry={countryEntry}
      destEntry={destEntry}
      relatedNews={relatedNews}
      relatedGuides={relatedGuides}
    />
  );
}
