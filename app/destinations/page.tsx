import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_DESTINATIONS, type Destination } from '@/lib/destinations';
import { MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore Destinations Worldwide | Sunward Travel',
  description: 'Discover popular travel destinations across Asia, Europe, the Americas, and Africa. Find travel guides, tips, and compare travel deals.',
};

// Group destinations by continent
const byContinent = FEATURED_DESTINATIONS.reduce<Record<string, Destination[]>>((acc, d) => {
  (acc[d.continent] ||= []).push(d);
  return acc;
}, {});

const CONTINENT_ORDER = ['Asia', 'Europe', 'Americas', 'Africa'];

function DestCard({ dest }: { dest: Destination }) {
  return (
    <Link
      href={`/guides/${dest.slug}`}
      className="group relative rounded-2xl overflow-hidden h-64 flex items-end shadow-sm hover:shadow-md transition-shadow duration-300 block"
    >
      <Image
        src={dest.imageUrl}
        alt={dest.imageAlt}
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
          {dest.city}
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
      {/* Page header — no hero image, clean navy */}
      <section className="bg-ink pt-16">
        <div className="page-container py-16 sm:py-20">
          <p className="text-[11px] text-horizon/80 uppercase tracking-[0.2em] font-700 mb-3">
            Sunward Travel
          </p>
          <h1 className="font-display font-700 text-white leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Explore the World
          </h1>
          <p className="mt-4 text-white/60 max-w-xl leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)' }}>
            From ancient temples to modern cities, tropical islands to snow-capped mountains
            &mdash; discover destinations and start planning your next trip.
          </p>
        </div>
      </section>

      {/* Destination groups by continent */}
      <main className="bg-sand">
        {CONTINENT_ORDER.filter(c => byContinent[c]).map((continent) => (
          <section key={continent} className="section-md border-b border-gray-100 last:border-0">
            <div className="page-container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[11px] text-ocean font-700 uppercase tracking-[0.18em] mb-1">{continent}</p>
                  <h2 className="font-display font-700 text-ink" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
                    {continent === 'Asia' ? 'Asia &amp; Southeast Asia' : continent}
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {byContinent[continent].map((dest) => (
                  <DestCard key={dest.id} dest={dest} />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="section-md bg-white border-t border-gray-100">
          <div className="page-container text-center">
            <h2 className="font-display font-700 text-ink mb-3" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              Ready to start planning?
            </h2>
            <p className="text-mist text-sm mb-6 max-w-md mx-auto">
              Compare flights, book hotels, and find activities at your chosen destination.
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
