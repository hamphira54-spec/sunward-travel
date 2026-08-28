import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import {
  COUNTRIES, COUNTRY_BY_SLUG, DESTINATIONS_BY_COUNTRY,
  getGuidesForCountry,
} from '@/lib/destinations-v2';
import TravelHero from '@/components/travel/TravelHero';
import SectionHeading from '@/components/ui/SectionHeading';
import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = COUNTRY_BY_SLUG[countrySlug];
  if (!country) return { title: 'Country Not Found' };

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';
  const canonical = `${SITE_URL}/destinations/${countrySlug}`;

  return {
    title: `${country.name} Travel Guide: Destinations & Tips | Sunward Travel`,
    description: `Plan your trip to ${country.name}. Discover top destinations, travel tips, flights, and activities — your complete ${country.name} travel guide.`,
    alternates: { canonical },
    openGraph: {
      title: `${country.name} Travel Guide | Sunward Travel`,
      description: country.shortDescription,
      url: canonical,
      images: [{ url: country.heroImage.src, alt: country.heroImage.alt }],
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countrySlug } = await params;
  const country = COUNTRY_BY_SLUG[countrySlug];
  if (!country) notFound();

  const destinations = DESTINATIONS_BY_COUNTRY[countrySlug] ?? [];
  const guides = getGuidesForCountry(countrySlug);

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '/destinations' },
    { label: country.name },
  ];

  return (
    <>
      {/* Breadcrumb — above hero */}
      <div className="bg-ink pt-16">
        <div className="page-container py-3">
          <DestinationBreadcrumb crumbs={crumbs} light />
        </div>
      </div>

      {/* Hero */}
      <TravelHero
        imageSrc={country.heroImage.src}
        imageAlt={country.heroImage.alt}
        eyebrow={country.region}
        heading={country.name}
        description={country.shortDescription}
        height="md"
      />

      {/* Destinations in this country */}
      <section className="section-lg bg-sand">
        <div className="page-container">
          <SectionHeading
            eyebrow={`Explore ${country.name}`}
            heading={`Popular Destinations in ${country.name}`}
            subheading={`Discover the cities and regions that make ${country.name} one of Asia's most rewarding travel destinations.`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${countrySlug}/${dest.slug}`}
                className="group relative rounded-2xl overflow-hidden h-64 flex items-end shadow-sm hover:shadow-md transition-all duration-300 block"
              >
                <Image
                  src={dest.cardImage.src}
                  alt={dest.cardImage.alt}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  quality={70}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-700 uppercase tracking-wider border border-white/20">
                    {dest.badge}
                  </span>
                </div>
                <div className="relative z-10 p-5">
                  <p className="font-display font-700 text-white text-xl leading-tight group-hover:text-horizon transition-colors">
                    {dest.name}
                  </p>
                  <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                    <MapPin size={10} />{dest.country}
                  </p>
                  <p className="text-white/50 text-[11px] mt-2 leading-snug line-clamp-2">
                    {dest.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1 text-horizon text-xs font-600 mt-3 group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Facts */}
      <section className="section-md bg-white border-t border-gray-100">
        <div className="page-container">
          <SectionHeading
            eyebrow="Planning"
            heading={`${country.name} Travel Facts`}
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-sand rounded-2xl p-5">
              <p className="text-[10px] text-ocean font-700 uppercase tracking-wider mb-2">Region</p>
              <p className="text-ink font-medium">{country.region}</p>
            </div>
            <div className="bg-sand rounded-2xl p-5">
              <p className="text-[10px] text-ocean font-700 uppercase tracking-wider mb-2">Main Airports</p>
              <p className="text-ink font-medium">{country.airportCodes.join(', ')}</p>
            </div>
            <div className="bg-sand rounded-2xl p-5">
              <p className="text-[10px] text-ocean font-700 uppercase tracking-wider mb-2">Destinations Covered</p>
              <p className="text-ink font-medium">{destinations.length} destination{destinations.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service CTAs */}
      <section className="section-md bg-sand border-t border-gray-100">
        <div className="page-container">
          <SectionHeading
            eyebrow="Book Your Trip"
            heading={`Plan Your ${country.name} Trip`}
            subheading="Search flights, find hotels, and book transfers to get started."
          />
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/flights" className="px-6 py-3 rounded-xl bg-ocean text-white text-sm font-700 hover:bg-ocean-dark transition-colors">
              Search Flights to {country.name}
            </Link>
            <Link href="/hotels" className="px-6 py-3 rounded-xl border-2 border-ocean text-ocean text-sm font-700 hover:bg-ocean hover:text-white transition-colors">
              Find Hotels
            </Link>
            <Link href="/airport-transfers" className="px-6 py-3 rounded-xl bg-surface text-ink text-sm font-700 hover:bg-surface-dark border border-gray-200 transition-colors">
              Airport Transfers
            </Link>
          </div>
        </div>
      </section>

      {/* Related guides */}
      {guides.length > 0 && (
        <section className="section-md bg-white border-t border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="Travel Guides"
              heading={`${country.name} Travel Guides`}
              align="left"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group flex flex-col bg-sand rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={guide.imageUrl}
                      alt={guide.imageAlt}
                      fill
                      sizes="(max-width:640px) 100vw, 33vw"
                      quality={70}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[10px] text-coral font-700 uppercase tracking-wider mb-1.5">{guide.category}</span>
                    <h3 className="font-display font-700 text-ink text-sm leading-snug group-hover:text-ocean transition-colors">{guide.title}</h3>
                    <p className="text-mist text-xs mt-1.5 flex items-center gap-1">
                      <Clock size={10} /> {guide.readTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Affiliate disclosure */}
      <section className="py-8 bg-sand border-t border-gray-100">
        <div className="page-container">
          <AffiliateDisclosure />
        </div>
      </section>

      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: crumbs.map((crumb, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: crumb.label,
              ...(crumb.href ? { item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com'}${crumb.href}` } : {}),
            })),
          }),
        }}
      />
    </>
  );
}
