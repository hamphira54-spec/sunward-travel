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

export function generateStaticParams() {
  return getAllPublishedNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
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
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const relatedNews   = getRelatedNews(slug, 3);
  const destEntry     = article.destinationSlug ? DESTINATION_BY_SLUG[article.destinationSlug] : null;
  const countryEntry  = article.countrySlug     ? COUNTRY_BY_SLUG[article.countrySlug]         : null;

  // Related guides via destination or country
  const relatedGuides = (
    article.destinationSlug
      ? getGuidesByDestination(article.destinationSlug)
      : article.countrySlug
        ? getGuidesByCountry(article.countrySlug)
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
    <>
      <article>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden pt-16">
          <Image
            src={article.heroImage.src}
            alt={article.heroImage.alt}
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/10" />
          <div className="absolute bottom-0 left-0 right-0 page-container pb-5">
            <DestinationBreadcrumb crumbs={crumbs} light />
          </div>
        </div>

        {/* ── Article body ─────────────────────────────────────────────── */}
        <div className="bg-sand">
          <div className="page-container py-10">
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

              {/* ── Main column ───────────────────────────────────────── */}
              <div className="flex-1 min-w-0" style={{ maxWidth: '720px' }}>

                {/* Article header */}
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-700 uppercase tracking-wider bg-coral/10 text-coral mb-4">
                    {categoryLabel}
                  </span>
                  <h1
                    className="font-display font-700 text-ink leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}
                  >
                    {article.title}
                  </h1>
                  <p
                    className="text-mist leading-relaxed mb-5"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}
                  >
                    {article.excerpt}
                  </p>
                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-xs text-mist border-t border-gray-200 pt-4">
                    <span className="font-medium text-ink">
                      {article.author.name}
                    </span>
                    {publishedDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {updatedDate ? `Updated ${updatedDate}` : publishedDate}
                      </span>
                    )}
                    {article.readingTimeMinutes && (
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} />
                        {article.readingTimeMinutes} min read
                      </span>
                    )}
                  </div>
                </div>

                {/* Article body */}
                <div className="prose-styles">
                  {article.body && article.body.length > 0 ? (
                    <ContentRenderer blocks={article.body} />
                  ) : (
                    <div className="bg-white rounded-xl p-8 text-center text-mist border border-gray-100">
                      <p className="font-medium">Full article coming soon.</p>
                      <p className="text-sm mt-1">{article.excerpt}</p>
                    </div>
                  )}
                </div>

                {/* Affiliate CTA */}
                {affiliateCTA && (
                  <div className="mt-10 p-5 rounded-2xl bg-ocean/6 border border-ocean/15">
                    <p className="text-xs text-mist mb-3">
                      Planning a trip? Compare options through our trusted travel partners.
                    </p>
                    <Link
                      href={affiliateCTA.href}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-interactive text-white text-sm font-700 hover:bg-interactive-dark transition-colors"
                    >
                      {affiliateCTA.label} <ArrowRight size={13} />
                    </Link>
                  </div>
                )}

                {/* Source references */}
                {article.sourceReferences && article.sourceReferences.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-[11px] font-700 text-mist uppercase tracking-wider mb-3">
                      Sources
                    </p>
                    <ul className="space-y-2">
                      {article.sourceReferences.map((src, i) => (
                        <li key={i}>
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-ocean hover:underline"
                          >
                            {src.name}
                            <ExternalLink size={11} />
                          </a>
                          {src.publishedAt && (
                            <p className="text-xs text-mist mt-0.5">
                              {formatNewsDate(src.publishedAt)}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Destination back-link */}
                {destEntry && countryEntry && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-[11px] font-700 text-mist uppercase tracking-wider mb-3">
                      Destination
                    </p>
                    <Link
                      href={`/destinations/${countryEntry.slug}/${destEntry.slug}`}
                      className="inline-flex items-center gap-2 text-ocean font-700 text-sm hover:gap-3 transition-all"
                    >
                      {destEntry.name}, {destEntry.country} &mdash; {destEntry.tagline}
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                )}

                {/* Related guides */}
                {relatedGuides.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-[11px] font-700 text-mist uppercase tracking-wider mb-4">
                      Related Travel Guides
                    </p>
                    <div className="space-y-3">
                      {relatedGuides.map((guide) => (
                        <Link
                          key={guide.slug}
                          href={`/guides/${guide.slug}`}
                          className="flex items-center gap-2 text-sm text-ink hover:text-ocean font-medium transition-colors group"
                        >
                          <ArrowRight size={12} className="text-mist group-hover:text-ocean transition-colors shrink-0" />
                          {guide.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Sidebar ───────────────────────────────────────────── */}
              <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
                <div className="sticky top-24 space-y-5">

                  {/* Article info */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 text-xs text-mist space-y-2.5">
                    <p className="text-[10px] font-700 uppercase tracking-wider text-mist mb-3">
                      Article Info
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-ink">{article.author.name}</span>
                    </div>
                    {publishedDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        <span>Published {publishedDate}</span>
                      </div>
                    )}
                    {updatedDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        <span>Updated {updatedDate}</span>
                      </div>
                    )}
                    {article.readingTimeMinutes && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} />
                        <span>{article.readingTimeMinutes} min read</span>
                      </div>
                    )}
                    <div className="pt-1">
                      <span className="px-2 py-0.5 rounded-full bg-ocean/8 text-ocean text-[10px] font-700 uppercase tracking-wider">
                        {categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Affiliate CTA sidebar */}
                  {affiliateCTA && (
                    <div className="bg-ink rounded-2xl p-5">
                      <p className="text-[11px] font-700 uppercase tracking-wider text-horizon/80 mb-3">
                        Plan Your Trip
                      </p>
                      <Link
                        href={affiliateCTA.href}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-700 hover:bg-white/20 transition-colors"
                      >
                        {affiliateCTA.label} <ArrowRight size={11} />
                      </Link>
                    </div>
                  )}

                  {/* Back to news */}
                  <Link
                    href="/news"
                    className="flex items-center gap-2 text-sm text-mist hover:text-ocean transition-colors font-medium"
                  >
                    <ArrowRight size={13} className="rotate-180" />
                    All Travel News
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* ── Related News ─────────────────────────────────────────────── */}
        {relatedNews.length > 0 && (
          <section className="section-md bg-white border-t border-gray-100">
            <div className="page-container">
              <p className="text-[11px] text-ocean font-700 uppercase tracking-wider mb-6">
                Related Stories
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedNews.map((related) => (
                  <NewsCard key={related.slug} news={related} variant="standard" />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
