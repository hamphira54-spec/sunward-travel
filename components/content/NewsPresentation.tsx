import NewsCard from '@/components/news/NewsCard';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Clock, Calendar, Globe, MapPin, Tag, ExternalLink } from 'lucide-react';
import ContentRenderer from '@/components/content/ContentRenderer';
import { NEWS_CATEGORY_LABELS } from '@/lib/content/news';
import { formatNewsDate } from '@/lib/news';


/** Returns a contextual affiliate CTA based on news category / destination */
function getAffiliateCTA(category: string, countrySlug?: string, destinationSlug?: string) {
  if (category === 'aviation') {
    return {
      href: 'https://wayaway.tp.st/QdO62C3W', // General flight search
      label: 'Compare Flight Prices',
    };
  }
  if (category === 'hotels') {
    return {
      href: 'https://hotellook.tp.st/aC7w6v4X',
      label: 'Search Hotel Deals',
    };
  }
  return {
    href: 'https://wayaway.tp.st/QdO62C3W',
    label: 'Book Your Next Trip',
  };
}

export default function NewsPresentation({

  article,
  countryEntry,
  destEntry,
  relatedNews,
  relatedGuides,
  previewMode = false,
}: {
  article: any;
  countryEntry: any;
  destEntry: any;
  relatedNews: any[];
  relatedGuides: any[];
  previewMode?: boolean;
}) {
  const publishedDate = new Date(article.publication.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const updatedDate = article.publication.updatedAt && article.publication.updatedAt > article.publication.publishedAt
    ? new Date(article.publication.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const baseUrl = 'https://sunwardtravel.com';
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage?.src,
    datePublished: new Date(article.publication.publishedAt).toISOString(),
    dateModified: new Date(article.publication.updatedAt || article.publication.publishedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: article.author?.name ?? 'Sunward News Desk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sunward Travel',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/news/${article.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${baseUrl}/news` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${baseUrl}/news/${article.slug}` },
    ],
  };

  

  const categoryLabel = NEWS_CATEGORY_LABELS[article.category as keyof typeof NEWS_CATEGORY_LABELS];
  const affiliateCTA  = getAffiliateCTA(
    article.category,
    article.countrySlug,
    article.destinationSlug
  );

  const crumbs = [

    { label: 'Home', href: '/' },
    { label: 'Travel News', href: '/news' },
    { label: categoryLabel, href: `/news?category=${article.category}` },
    { label: article.seo?.title || article.title }
  ];

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
                      {article.sourceReferences.map((src: any, i: number) => (
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
                      {relatedGuides.map((guide: any) => (
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
                {relatedNews.map((related: any) => (
                  <NewsCard key={related.slug} news={related} variant="standard" />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* JSON-LD */}
      {!previewMode && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />}
      {!previewMode && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />}
    </>
  );
}

