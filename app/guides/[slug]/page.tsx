import GuidePresentation from '@/components/content/GuidePresentation';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock, MapPin, Calendar, ArrowRight, BookOpen,
} from 'lucide-react';
import { getGuideBySlug, getRelatedGuidesFor, getPublishedGuides } from '@/lib/content/repository';
import { CATEGORY_LABELS } from '@/lib/guides';
import { DESTINATION_BY_SLUG, COUNTRY_BY_SLUG } from '@/lib/destinations-v2';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';
import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';
import ContentRenderer from '@/components/content/ContentRenderer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';
const SITE_NAME = 'Sunward Travel';

export async function generateStaticParams() {
  const guides = await getPublishedGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
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
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedGuides = await getRelatedGuidesFor(slug, 3);

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
    ...(destEntry ? [{ label: destEntry.name, href: `/destinations/${countryEntry?.slug}/${destEntry.slug}` }] : []),
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

  const showUpdated = updatedDate && updatedDate !== publishedDate;

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.seo.title,
    description: guide.seo.description,
    image: [guide.heroImage.src],
    datePublished: new Date(guide.publishedAt).toISOString(),
    dateModified: guide.updatedAt ? new Date(guide.updatedAt).toISOString() : new Date(guide.publishedAt).toISOString(),
    author: [{
      '@type': 'Person',
      name: guide.author || 'Sunward Travel Editor',
      
    }],
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.label,
      item: crumb.href ? `${SITE_URL}${crumb.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="min-h-screen bg-sand pb-24">
        {/* Breadcrumb row */}
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-2">
          <DestinationBreadcrumb crumbs={crumbs} />
        </div>

        {/* Hero image and title block */}
        <header className="max-w-5xl mx-auto px-6 mb-12">
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-sm">
            <Image
              src={guide.heroImage.src}
              alt={guide.heroImage.alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block px-3 py-1 bg-horizon text-ink text-xs font-700 tracking-wider uppercase rounded-full mb-4 shadow-sm">
                {categoryLabel}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-display font-700 leading-tight mb-2">
                {guide.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-ink/10">
            <div className="flex items-center gap-4">
              <Image
                src={'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'}
                alt={guide.author || 'Sunward Travel Editor'}
                width={48}
                height={48}
                className="rounded-full bg-surface"
              />
              <div>
                <p className="font-700 text-ink">{guide.author || 'Sunward Travel Editor'}</p>
                <p className="text-sm text-mist">{'Travel Editor'}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mist font-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published {publishedDate}</span>
              </div>
              {showUpdated && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated {updatedDate}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{guide.readingTimeMinutes} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <article className="prose prose-lg prose-ink max-w-none">
              <p className="text-xl text-mist leading-relaxed mb-10 font-500">
                {guide.excerpt}
              </p>
              
              <ContentRenderer blocks={guide.body || []} />
              
            </article>

            {/* Affiliate Disclosure */}
            <div className="mt-12 pt-8 border-t border-ink/10">
              <AffiliateDisclosure />
            </div>

            {/* Tags */}
            {guide.tags && guide.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {guide.tags.map((tag: any) => { const tagLabel = typeof tag === 'string' ? tag : tag.label; return (<span key={tagLabel} className="px-3 py-1 bg-surface text-ink text-sm rounded-full">#{tagLabel}</span>); })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {destEntry && countryEntry && (
              <div className="bg-white p-6 rounded-2xl shadow-[var(--shadow-card)] border border-ink/5">
                <h3 className="font-display font-700 text-xl text-ink mb-4">
                  Planning a trip to {destEntry.name}?
                </h3>
                <p className="text-mist mb-6 text-sm">
                  Find more travel tips, where to stay, and things to do in our complete destination guide.
                </p>
                <Link
                  href={`/destinations/${countryEntry.slug}/${destEntry.slug}`}
                  className="flex items-center justify-between w-full bg-ocean hover:bg-ocean-dark text-white px-5 py-3 rounded-xl transition-colors font-500"
                >
                  <span>Explore {destEntry.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {relatedGuides.length > 0 && (
              <div className="bg-surface p-6 rounded-2xl">
                <h3 className="font-display font-700 text-lg text-ink mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-ocean" />
                  Related Reads
                </h3>
                <div className="space-y-6">
                  {relatedGuides.map((rg: any) => (
                    <Link
                      key={rg.id}
                      href={`/guides/${rg.slug}`}
                      className="group block"
                    >
                      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl mb-3 relative">
                        <Image
                          src={rg.cardImage?.src || rg.heroImage?.src}
                          alt={rg.cardImage?.alt || rg.heroImage?.alt || rg.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="font-700 text-ink group-hover:text-ocean transition-colors leading-snug line-clamp-2">
                        {rg.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
