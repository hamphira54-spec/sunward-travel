import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Globe, Banknote, Languages, CalendarDays, ArrowRight } from 'lucide-react';
import {
  DESTINATIONS, DESTINATION_BY_SLUG, COUNTRY_BY_SLUG,
  getRelatedDestinations,
} from '@/lib/destinations-v2';
import { CATEGORY_LABELS } from '@/lib/guides';
import { getEventsByDestination, getGuidesByDestination, getNewsByDestination } from '@/lib/content/repository';
import TravelHero from '@/components/travel/TravelHero';
import SectionHeading from '@/components/ui/SectionHeading';
import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';
import AffiliateWidgetShell from '@/components/affiliate/AffiliateWidgetShell';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';
import TravelServiceLinks from '@/components/travel/TravelServiceLinks';
import { EventCard } from '@/components/events/EventCard';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunward-travel.vercel.app';
const SITE_NAME = 'Sunward Travel';

const KLOOK_BANGKOK_SRC =
  'https://tpwdg.com/content'
  + '?currency=USD&trs=566794&shmarker=769903'
  + '&locale=en&city_id=10&category=3&amount=3'
  + '&powered_by=true&campaign_id=137&promo_id=4497';

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({
    country: d.countrySlug,
    destination: d.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; destination: string }>;
}): Promise<Metadata> {
  const { country: countrySlug, destination: destSlug } = await params;
  const dest = DESTINATION_BY_SLUG[destSlug];
  if (!dest || dest.countrySlug !== countrySlug) return { title: 'Destination Not Found' };

  const canonical = `${SITE_URL}/destinations/${countrySlug}/${destSlug}`;

  return {
    title: `${dest.name} Travel Guide: Trip Planning & Areas to Stay`,
    description: `Discover where to stay, what to do, and travel tips for ${dest.name}, ${dest.country}. Read our complete travel guide for a perfect trip.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${dest.name} Travel Guide & Itineraries`,
      description: dest.shortDescription,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: dest.heroImage.src,
          alt: dest.heroImage.alt,
        },
      ],
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ country: string; destination: string }>;
}) {
  const p = await params;
  const dest = DESTINATION_BY_SLUG[p.destination];
  if (!dest || dest.countrySlug !== p.country) notFound();

  const related = getRelatedDestinations(dest);
  const guides = await getGuidesByDestination(dest.slug);
  const events = await getEventsByDestination(dest.slug);
  const news = await getNewsByDestination(dest.slug);

  const country = COUNTRY_BY_SLUG[dest.countrySlug];
  const hasWhereToStay = guides.some(g => g.slug === `where-to-stay-in-${dest.slug}`);

  // JSON-LD
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '/destinations' },
    { label: country.name, href: `/destinations/${country.slug}` },
    { label: dest.name },
  ];

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: dest.name,
    description: dest.shortDescription,
    image: dest.heroImage.src,
    touristType: [
      'Sightseeing',
      'City Tour'
    ],
    containedInPlace: {
      '@type': 'Country',
      name: dest.country
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Breadcrumb row */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <DestinationBreadcrumb crumbs={crumbs} />
        </div>
      </div>

      <TravelHero
        heading={dest.name}
        eyebrow={dest.country}
        imageSrc={dest.heroImage.src}
        imageAlt={dest.heroImage.alt}
      />

      {/* Intro & Overview */}
      <section className="section-md bg-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display font-700 text-ink mb-6" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
              {dest.tagline}
            </h2>
            <p className="text-mist text-lg leading-relaxed font-500">
              {dest.overview}
            </p>
          </div>
        </div>
      </section>

      {/* Top Affiliate CTA (Activities/Tours) */}
      {dest.affiliate.activities.enabled && dest.slug === 'bangkok' && (
        <section className="section-md bg-sand border-t border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="Tours & Tickets"
              heading={`Top things to do in ${dest.name}`}
            />
            <AffiliateWidgetShell heading="Popular Experiences" attribution="Powered by Klook" className="mt-8">
              <iframe
                src={KLOOK_BANGKOK_SRC}
                width="100%"
                height="480"
                frameBorder="0"
                scrolling="no"
                title={`Klook widget for ${dest.name}`}
              />
            </AffiliateWidgetShell>
          </div>
        </section>
      )}

      {dest.affiliate.activities.enabled && dest.slug !== 'bangkok' && (
        <section className="section-md bg-sand border-t border-gray-100">
          <div className="page-container text-center">
            <SectionHeading
              eyebrow="Tours & Tickets"
              heading={`Top things to do in ${dest.name}`}
              subheading="Book guided tours, museum tickets, and memorable experiences."
            />
            <Link
              href="/activities"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean text-white font-700 hover:bg-ocean-dark transition-colors"
            >
              Explore Activities <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Where to Stay */}
      {dest.affiliate.hotels.enabled && (
        <section className="section-md bg-white border-t border-gray-100">
          <div className="page-container">
            <div className="max-w-2xl">
              <SectionHeading
                eyebrow="Where to Stay"
                heading={
                  hasWhereToStay
                    ? `Where to Stay in ${dest.name}`
                    : `Hotels in ${dest.name}`
                }
                subheading={
                  hasWhereToStay
                    ? `Read our detailed editorial guide to the best neighborhoods, accommodation styles, and traveler types for your stay in ${dest.name}.`
                    : `Whether you prefer a boutique hotel in the historic centre, a resort by the beach, or a budget guesthouse in a lively neighbourhood, ${dest.name} has options at every price point.`
                }
                align="left"
              />
              <Link
                href={
                  hasWhereToStay
                    ? `/guides/where-to-stay-in-${dest.slug}`
                    : `/hotels`
                }
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean text-white text-sm font-700 hover:bg-ocean-dark transition-colors"
              >
                {hasWhereToStay ? 'Explore where to stay' : 'Explore neighborhoods'} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Travel Guides */}
      {guides.length > 0 && (
        <section className="section-md bg-sand border-t border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="Travel Guides"
              heading={`${dest.name} Travel Guides`}
              align="left"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={guide.cardImage.src}
                      alt={guide.cardImage.alt}
                      fill
                      sizes="(max-width:640px) 100vw, 33vw"
                      quality={70}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[10px] text-coral font-700 uppercase tracking-wider mb-1.5">{CATEGORY_LABELS[guide.category as keyof typeof CATEGORY_LABELS]}</span>
                    <h3 className="font-display font-700 text-ink text-sm leading-snug group-hover:text-ocean transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-mist text-xs mt-1.5 flex items-center gap-1">
                      <Clock size={10} /> {guide.readingTimeMinutes} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Global Events */}
      {events.length > 0 && (
        <section className="section-md bg-white border-t border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="Events & Festivals"
              heading={`What's happening in ${dest.name}`}
              align="left"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {events.map((event) => (
                <div key={event.slug} className="h-full">
                  <EventCard event={event} variant="compact" />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center md:text-left">
              <Link href={`/events`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface text-ink text-sm font-700 hover:bg-gray-100 transition-colors">
                View All Events <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Related News */}
      {news.length > 0 && (
        <section className="section-md bg-sand border-t border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="Travel News"
              heading={`Latest updates from ${dest.name}`}
              align="left"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {news.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${item.slug}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[10px] text-ocean font-700 uppercase tracking-wider mb-1.5">{item.category}</span>
                    <h3 className="font-display font-700 text-ink text-sm leading-snug group-hover:text-ocean transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related destinations */}
      {related.length > 0 && (
        <section className="section-md bg-white border-t border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="Nearby"
              heading="You Might Also Like"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {related.slice(0, 3).map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/destinations/${rel.countrySlug}/${rel.slug}`}
                  className="group relative rounded-2xl overflow-hidden h-52 flex items-end shadow-sm hover:shadow-md transition-all duration-300 block"
                >
                  <Image
                    src={rel.cardImage.src}
                    alt={rel.cardImage.alt}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    quality={65}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  <div className="relative z-10 p-4">
                    <p className="font-display font-700 text-white text-lg leading-tight group-hover:text-horizon transition-colors">
                      {rel.name}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">{rel.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Affiliate Disclosure */}
      <section className="py-8 bg-sand border-t border-gray-100">
        <div className="page-container">
          <AffiliateDisclosure />
        </div>
      </section>
    </>
  );
}
