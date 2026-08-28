import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { DESTINATIONS, COUNTRIES, type DestinationEntry } from '@/lib/destinations-v2';
import SectionHeading from '@/components/ui/SectionHeading';

export const metadata: Metadata = {
  title: 'Explore Travel Destinations in Asia | Sunward Travel',
  description:
    'Discover top travel destinations across Southeast Asia and beyond. Compare flights, find hotels, book activities and transfers at Bangkok, Bali, Tokyo, Singapore, and more.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com'}/destinations`,
  },
};

const FEATURED = DESTINATIONS.filter((d) => d.featured);
const ALL = DESTINATIONS;

const REGION_ORDER = ['Southeast Asia', 'East Asia'];

const byRegion = ALL.reduce<Record<string, DestinationEntry[]>>((acc, d) => {
  (acc[d.region] ||= []).push(d);
  return acc;
}, {});

function DestCard({ dest }: { dest: DestinationEntry }) {
  return (
    <Link
      href={`/destinations/${dest.countrySlug}/${dest.slug}`}
      className="group relative rounded-2xl overflow-hidden h-64 flex items-end shadow-sm hover:shadow-md transition-shadow duration-300 block"
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
          <MapPin size={10} /> {dest.country}
        </p>
        <p className="text-white/50 text-[11px] mt-2 leading-snug line-clamp-2">
          {dest.tagline}
        </p>
        <span className="inline-flex items-center gap-1 text-horizon text-xs font-600 mt-3 group-hover:gap-2 transition-all">
          Explore <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}

export default function DestinationsPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-ink pt-16">
        <div className="page-container py-16 sm:py-20">
          <p className="text-[11px] text-horizon/80 uppercase tracking-[0.2em] font-700 mb-3">Sunward Travel</p>
          <h1
            className="font-display font-700 text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Explore the World
          </h1>
          <p
            className="mt-4 text-white/60 max-w-xl leading-relaxed"
            style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)' }}
          >
            From ancient temples to modern cities, tropical islands to mountain trails
            &mdash; discover destinations and start planning your next trip.
          </p>
        </div>
      </section>

      <main className="bg-sand">
        {/* Featured destinations */}
        <section className="section-lg border-b border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="Featured"
              heading="Popular Destinations"
              subheading="Our top picks for first-time visitors and seasoned travellers alike."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURED.map((dest) => (
                <DestCard key={dest.id} dest={dest} />
              ))}
            </div>
          </div>
        </section>

        {/* By region */}
        {REGION_ORDER.filter((r) => byRegion[r]).map((region) => (
          <section key={region} className="section-md border-b border-gray-100 last:border-0">
            <div className="page-container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[11px] text-ocean font-700 uppercase tracking-[0.18em] mb-1">Region</p>
                  <h2 className="font-display font-700 text-ink" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                    {region}
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {byRegion[region].map((dest) => (
                  <DestCard key={dest.id} dest={dest} />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Browse by country */}
        <section className="section-md bg-white border-t border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="By Country"
              heading="Browse by Country"
              subheading="Select a country to explore all available destinations and travel guides."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {COUNTRIES.map((country) => (
                <Link
                  key={country.slug}
                  href={`/destinations/${country.slug}`}
                  className="group relative rounded-2xl overflow-hidden h-36 flex items-end shadow-sm hover:shadow-md transition-all duration-300 block"
                >
                  <Image
                    src={country.cardImage.src}
                    alt={country.cardImage.alt}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    quality={65}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
                  <div className="relative z-10 p-4">
                    <p className="font-display font-700 text-white text-base leading-tight group-hover:text-horizon transition-colors">
                      {country.name}
                    </p>
                    <p className="text-white/55 text-[10px] mt-0.5">{country.region}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-md border-t border-gray-100">
          <div className="page-container text-center">
            <h2 className="font-display font-700 text-ink mb-3" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              Ready to start planning?
            </h2>
            <p className="text-mist text-sm mb-6 max-w-md mx-auto">
              Compare flights, find hotels, and book activities at your chosen destination.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/flights" className="px-6 py-3 rounded-xl bg-ocean text-white text-sm font-700 hover:bg-ocean-dark transition-colors">
                Search Flights
              </Link>
              <Link href="/hotels" className="px-6 py-3 rounded-xl border-2 border-ocean text-ocean text-sm font-700 hover:bg-ocean hover:text-white transition-colors">
                Find Hotels
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
