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
  const guide = GUIDE_BY_SLUG[slug];
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
  const guide = GUIDE_BY_SLUG[slug];
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

  const categoryLabel = CATEGORY_LABELS[guide.category];

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
    <>
      <article>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden pt-16">
          <Image
            src={guide.heroImage.src}
            alt={guide.heroImage.alt}
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/10" />
          {/* Breadcrumb on hero */}
          <div className="absolute bottom-0 left-0 right-0 page-container pb-5">
            <DestinationBreadcrumb crumbs={crumbs} light />
          </div>
        </div>

        {/* ── Article body wrapper ─────────────────────────────────────── */}
        <div className="bg-sand">
          <div className="page-container py-10">
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

              {/* ── Main article column ───────────────────────────────── */}
              <div className="flex-1 min-w-0" style={{ maxWidth: '720px' }}>

                {/* Article header */}
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-700 uppercase tracking-wider bg-coral/10 text-coral mb-4">
                    {categoryLabel}
                  </span>
                  <h1 className="font-display font-700 text-ink leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                    {guide.title}
                  </h1>
                  <p className="text-mist leading-relaxed mb-5"
                    style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)' }}>
                    {guide.excerpt}
                  </p>
                  {/* Meta row */}
                  <div className="flex flex-wrap gap-4 text-xs text-mist border-t border-gray-200 pt-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      {guide.destinationLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {guide.readingTimeMinutes} min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {updatedDate ? `Updated ${updatedDate}` : `Published ${publishedDate}`}
                    </span>
                  </div>
                </div>

                {/* TOC — mobile (visible on small screens, hidden on lg+) */}
                {guide.tocSections.length > 0 && (
                  <nav
                    aria-label="Table of contents"
                    className="lg:hidden mb-8 bg-white rounded-2xl border border-gray-100 p-5"
                  >
                    <p className="text-[11px] font-700 uppercase tracking-wider text-ocean mb-3">
                      Contents
                    </p>
                    <ol className="space-y-1.5">
                      {guide.tocSections.map((section, i) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className="flex items-start gap-2.5 text-sm text-ink hover:text-ocean transition-colors"
                          >
                            <span className="text-[11px] text-mist font-700 mt-0.5 shrink-0 w-4">
                              {i + 1}.
                            </span>
                            {section.heading}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                {/* Article body */}
                <div className="prose-styles">
                  {guide.body && guide.body.length > 0 ? (
                    <ContentRenderer blocks={guide.body} />
                  ) : (
                    <div className="bg-white rounded-xl p-8 text-center text-mist border border-gray-100">
                      <p className="font-medium">Full article content coming soon.</p>
                      <p className="text-sm mt-1">{guide.excerpt}</p>
                    </div>
                  )}
                </div>

                {/* Contextual affiliate CTAs */}
                {guide.affiliateCTAs.length > 0 && (
                  <div className="mt-10 p-6 rounded-2xl bg-ocean/6 border border-ocean/15">
                    <p className="text-sm font-700 text-ocean mb-1">Ready to plan your trip?</p>
                    <p className="text-xs text-mist mb-4">
                      Search flights, hotels, and transfers for {guide.destinationLabel}.
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {guide.affiliateCTAs.map((cta) => (
                        <Link
                          key={cta.type}
                          href={cta.href}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-interactive text-white text-xs font-700 hover:bg-interactive-dark transition-colors"
                        >
                          {cta.label} <ArrowRight size={11} />
                        </Link>
                      ))}
                    </div>
                    <AffiliateDisclosure className="mt-3" />
                  </div>
                )}

                {/* Destination back-link */}
                {destEntry && countryEntry && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <p className="text-[11px] font-700 text-mist uppercase tracking-wider mb-3">
                      Destination Guide
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
              </div>

              {/* ── Sidebar (desktop only) ───────────────────────────── */}
              <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
                <div className="sticky top-24 space-y-5">

                  {/* TOC */}
                  {guide.tocSections.length > 0 && (
                    <nav
                      aria-label="Table of contents"
                      className="bg-white rounded-2xl border border-gray-100 p-5"
                    >
                      <p className="text-[11px] font-700 uppercase tracking-wider text-ocean mb-3">
                        Contents
                      </p>
                      <ol className="space-y-1.5">
                        {guide.tocSections.map((section, i) => (
                          <li key={section.id}>
                            <a
                              href={`#${section.id}`}
                              className="flex items-start gap-2.5 text-sm text-ink hover:text-ocean transition-colors"
                            >
                              <span className="text-[11px] text-mist font-700 mt-0.5 shrink-0 w-4">
                                {i + 1}.
                              </span>
                              {section.heading}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}

                  {/* Affiliate CTA sidebar card */}
                  {guide.affiliateCTAs.length > 0 && (
                    <div className="bg-ink rounded-2xl p-5">
                      <p className="text-[11px] font-700 uppercase tracking-wider text-horizon/80 mb-2">
                        Plan Your Trip
                      </p>
                      <p className="text-white text-sm font-700 mb-4">{guide.destinationLabel}</p>
                      <div className="space-y-2">
                        {guide.affiliateCTAs.map((cta) => (
                          <Link
                            key={cta.type}
                            href={cta.href}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-700 hover:bg-white/20 transition-colors"
                          >
                            {cta.label} <ArrowRight size={11} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Article info */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 text-xs text-mist space-y-2">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={12} />
                      <span>{guide.readingTimeMinutes} min read</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>Published {publishedDate}</span>
                    </div>
                    {updatedDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>Updated {updatedDate}</span>
                      </div>
                    )}
                    <p className="pt-1 text-[11px]">
                      By {guide.author ?? 'Sunward Travel Editorial Team'}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* ── Related Guides ─────────────────────────────────────────── */}
        {relatedGuides.length > 0 && (
          <section className="section-md bg-white border-t border-gray-100">
            <div className="page-container">
              <p className="text-[11px] text-ocean font-700 uppercase tracking-wider mb-6">Related Articles</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedGuides.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/guides/${related.slug}`}
                    className="group flex flex-col bg-sand rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={related.cardImage.src}
                        alt={related.cardImage.alt}
                        fill
                        sizes="(max-width:640px) 100vw, 33vw"
                        quality={70}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-[10px] text-coral font-700 uppercase tracking-wider mb-1.5">
                        {CATEGORY_LABELS[related.category]}
                      </span>
                      <h3 className="font-display font-700 text-ink text-sm leading-snug group-hover:text-ocean transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-mist text-xs mt-auto pt-2 flex items-center gap-1">
                        <Clock size={10} /> {related.readingTimeMinutes} min read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}
