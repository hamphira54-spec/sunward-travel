import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Globe, Banknote, Languages, CalendarDays, ArrowRight } from 'lucide-react';
import {
  DESTINATIONS, DESTINATION_BY_SLUG, COUNTRY_BY_SLUG,
  getRelatedDestinations,
} from '@/lib/destinations-v2';
import { getGuidesForDestination, CATEGORY_LABELS } from '@/lib/guides';
import { getEventsByDestination } from '@/lib/content/repository';
import TravelHero from '@/components/travel/TravelHero';
import SectionHeading from '@/components/ui/SectionHeading';
import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';
import AffiliateWidgetShell from '@/components/affiliate/AffiliateWidgetShell';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';
import TravelServiceLinks from '@/components/travel/TravelServiceLinks';
import { EventCard } from '@/components/events/EventCard';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';

// Klook widget — ONLY for Bangkok (klookCityId=10, klookCategory=3)
// DO NOT change these affiliate params
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
    title: `${dest.name} Travel Guide: Things to Do & Trip Planning | Sunward Travel`,
    description: dest.shortDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${dest.name} Travel Guide | Sunward Travel`,
      description: dest.shortDescription,
      url: canonical,
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

  const country = COUNTRY_BY_SLUG[p.country];
  const guides = getGuidesForDestination(dest.slug).slice(0, 3);
  const events = getEventsByDestination(dest.slug).slice(0, 3);
  const related = getRelatedDestinations(dest);

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '/destinations' },
    { label: country?.name ?? p.country, href: `/destinations/${p.country}` },
    { label: dest.name },
  ];

  // Only show Klook widget if this destination has Klook activities enabled
  // AND has a klookCityId configured
  const showKlook =
    dest.affiliate.activities.enabled &&
    dest.affiliate.activities.provider === 'klook' &&
    dest.affiliate.activities.klookCityId != null;

  const jsonLd = {
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
      {/* Breadcrumb */}
      <div className="bg-ink pt-16">
        <div className="page-container py-3">
          <DestinationBreadcrumb crumbs={crumbs} light />
        </div>
      </div>

      {/* Hero */}
      <TravelHero
        imageSrc={dest.heroImage.src}
        imageAlt={dest.heroImage.alt}
        eyebrow={dest.region}
        heading={dest.name}
        description={dest.shortDescription}
        height="lg"
      />

      {/* Quick facts + service links */}
      <section className="bg-white border-b border-gray-100">
        <div className="page-container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Facts grid */}
            <div className="flex-1">
              <p className="text-[10px] text-ocean font-700 uppercase tracking-wider mb-4">{dest.name} at a Glance</p>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Banknote,     label: 'Currency',         value: dest.facts.currency },
                  { icon: Languages,    label: 'Language',         value: dest.facts.languages.join(', ') },
                  { icon: Globe,        label: 'Timezone',         value: dest.facts.timezone },
                  { icon: MapPin,       label: 'Airport',          value: dest.facts.mainAirportName ?? dest.facts.airportCodes.join(', ') },
                  { icon: CalendarDays, label: 'Best Time',        value: dest.facts.bestTimeToVisit },
                  { icon: Clock,        label: 'Suggested Stay',   value: dest.facts.averageStay },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 bg-sand rounded-xl p-3.5">
                    <Icon size={15} className="text-ocean mt-0.5 shrink-0" strokeWidth={1.8} />
                    <div>
                      <dt className="text-[10px] text-mist uppercase tracking-wider font-700">{label}</dt>
                      <dd className="text-ink text-sm font-medium mt-0.5">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
            {/* Service links */}
            <div className="lg:w-72">
              <p className="text-[10px] text-ocean font-700 uppercase tracking-wider mb-4">Plan Your Trip</p>
              <TravelServiceLinks destination={dest} size="sm" />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section-md bg-sand">
        <div className="page-container" style={{ maxWidth: '860px' }}>
          <SectionHeading
            eyebrow={dest.region}
            heading={`About ${dest.name}`}
            align="left"
          />
          <div className="prose-styles">
            <p className="text-ink/80 leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              {dest.overview}
            </p>
          </div>
        </div>
      </section>

      {/* Activities — Klook widget (Bangkok only) OR editorial CTA */}
      <section className="section-md bg-white border-t border-gray-100">
        <div className="page-container">
          {showKlook ? (
            <AffiliateWidgetShell
              eyebrow="Featured Experiences"
              heading={`Popular Experiences in ${dest.name}`}
              subheading="Handpicked tours, day trips, and activities — book securely through our travel partner."
              attribution="Experiences provided by our travel partner."
            >
              <TravelpayoutsWidget
                src={KLOOK_BANGKOK_SRC}
                skeletonHeight={380}
                timeout={14000}
              />
            </AffiliateWidgetShell>
          ) : (
            <div className="bg-sand rounded-3xl p-8 sm:p-10">
              <SectionHeading
                eyebrow="Things to Do"
                heading={`Experiences in ${dest.name}`}
                subheading={`Explore guided tours, cultural experiences, and activities in ${dest.name} through our trusted travel partner.`}
                align="left"
              />
              <Link
                href="/activities"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean text-white text-sm font-700 hover:bg-ocean-dark transition-colors"
              >
                Browse Activities <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Flights CTA */}
      {dest.affiliate.flights.enabled && (
        <section className="section-md bg-ink">
          <div className="page-container text-center">
            <p className="text-[11px] text-horizon/80 uppercase tracking-[0.2em] font-700 mb-3">
              Sunward Travel
            </p>
            <h2 className="font-display font-700 text-white mb-3" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              Compare Flights to {dest.name}
            </h2>
            <p className="text-white/55 text-sm mb-6 max-w-md mx-auto">
              Search hundreds of airlines and find the best fares to {dest.facts.airportCodes.join(' / ')}.
            </p>
            <Link
              href="/flights"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-horizon text-ink text-sm font-700 hover:bg-horizon-dark transition-colors"
            >
              Search Flights <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Airport Transfers CTA */}
      {dest.affiliate.transfers.enabled && (
        <section className="section-md bg-sand border-t border-gray-100">
          <div className="page-container">
            <div className="bg-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-gray-100 shadow-sm">
              <div>
                <p className="text-[10px] text-ocean font-700 uppercase tracking-wider mb-2">Private Transfers</p>
                <h2 className="font-display font-700 text-ink mb-2" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>
                  {dest.facts.mainAirportName ?? `${dest.name} Airport`} Transfer
                </h2>
                <p className="text-mist text-sm">
                  Fixed price, professional driver, free cancellation &mdash; no taxi queues.
                </p>
              </div>
              <Link
                href="/airport-transfers"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean text-white text-sm font-700 hover:bg-ocean-dark transition-colors"
              >
                Find Transfer <ArrowRight size={14} />
              </Link>
            </div>
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
                heading={`Hotels in ${dest.name}`}
                subheading={`Whether you prefer a boutique hotel in the historic centre, a resort by the beach, or a budget guesthouse in a lively neighbourhood, ${dest.name} has options at every price point.`}
                align="left"
              />
              <Link
                href="/hotels"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ocean text-white text-sm font-700 hover:bg-ocean-dark transition-colors"
              >
                Search Hotels <ArrowRight size={14} />
              </Link>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => (
                <div key={event.slug} className="h-full">
                  <EventCard event={event} variant="compact" />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center md:text-left">
              <Link href={`/events?category=all`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface text-ink text-sm font-700 hover:bg-gray-100 transition-colors">
                View All Events <ArrowRight size={14} />
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    <span className="text-[10px] text-coral font-700 uppercase tracking-wider mb-1.5">{CATEGORY_LABELS[guide.category]}</span>
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

      {/* Related destinations */}
      {related.length > 0 && (
        <section className="section-md bg-white border-t border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="Nearby"
              heading="You Might Also Like"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
