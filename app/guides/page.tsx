import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { GUIDES, FEATURED_GUIDES, CATEGORY_LABELS, type TravelGuide } from '@/lib/guides';
import { DESTINATIONS } from '@/lib/destinations-v2';
import SectionHeading from '@/components/ui/SectionHeading';
import TravelHero from '@/components/travel/TravelHero';


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sunwardtravel.com';

export const metadata: Metadata = {
  title: 'Travel Guides: Destinations, Itineraries & Tips | Sunward Travel',
  description:
    'Expert travel guides for Southeast Asia and beyond — destination overviews, first-timer tips, best time to visit, itineraries, and money-saving flight strategies.',
  alternates: { canonical: `${SITE_URL}/guides` },
};

// Destinations that have at least one guide
const DESTINATION_SLUGS_WITH_GUIDES = [
  ...new Set(GUIDES.map((g) => g.destinationSlug).filter(Boolean)),
];

function GuideCard({ guide }: { guide: TravelGuide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={guide.cardImage.src}
          alt={guide.cardImage.alt}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          quality={70}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-coral text-white text-[10px] font-700 uppercase tracking-wider">
          {CATEGORY_LABELS[guide.category]}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="font-display font-700 text-ink text-base leading-snug line-clamp-2 group-hover:text-ocean transition-colors">
          {guide.title}
        </h2>
        <p className="mt-2 text-sm text-mist line-clamp-2 leading-relaxed">{guide.excerpt}</p>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-mist">
          <span>{guide.destinationLabel}</span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {guide.readingTimeMinutes} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function GuidesIndexPage() {
  // Destinations that have guides associated
  const linkedDestinations = DESTINATIONS.filter(
    (d) => DESTINATION_SLUGS_WITH_GUIDES.includes(d.slug)
  );

  return (
    <>
      <TravelHero
        imageSrc="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80"
        imageAlt="Travel writer with map and notebook in a European cafe"
        eyebrow="Travel Guides"
        heading="Plan Smarter, Travel Better"
        description="Expert guides, first-timer blueprints, and practical tips to help you get the most out of every destination."
        height="sm"
      />

      {/* Featured guides */}
      <section className="section-lg bg-sand">
        <div className="page-container">
          <SectionHeading
            eyebrow="Editor's Picks"
            heading="Featured Guides"
            subheading="Our most helpful and popular travel articles."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_GUIDES.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by destination */}
      {linkedDestinations.length > 0 && (
        <section className="section-md bg-white border-t border-gray-100">
          <div className="page-container">
            <SectionHeading
              eyebrow="By Destination"
              heading="Guides by Destination"
              subheading="Select a destination to find all related travel guides."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {linkedDestinations.map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.countrySlug}/${dest.slug}`}
                  className="group relative rounded-2xl overflow-hidden h-32 flex items-end shadow-sm hover:shadow-md transition-all duration-300 block"
                >
                  <Image
                    src={dest.cardImage.src}
                    alt={dest.cardImage.alt}
                    fill
                    sizes="(max-width:640px) 50vw, 25vw"
                    quality={65}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                  <div className="relative z-10 p-3">
                    <p className="font-display font-700 text-white text-sm leading-tight group-hover:text-horizon transition-colors">
                      {dest.name}
                    </p>
                    <p className="text-white/55 text-[10px]">{dest.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by category */}
      <section className="section-md bg-sand border-t border-gray-100">
        <div className="page-container">
          <SectionHeading
            eyebrow="By Topic"
            heading="Browse by Category"
          />
          <div className="flex flex-wrap gap-2.5">
            {(Object.entries(CATEGORY_LABELS) as [string, string][]).map(([key, label]) => {
              const count = GUIDES.filter((g) => g.category === key).length;
              if (count === 0) return null;
              return (
                <span
                  key={key}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-ink text-sm font-medium"
                >
                  {label}
                  <span className="ml-2 text-mist text-xs">({count})</span>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* All guides */}
      <section className="section-md bg-white border-t border-gray-100">
        <div className="page-container">
          <SectionHeading
            eyebrow="All Articles"
            heading="All Travel Guides"
            align="left"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GUIDES.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-md bg-ink">
        <div className="page-container text-center">
          <p className="text-[11px] text-horizon/80 uppercase tracking-[0.2em] font-700 mb-3">Sunward Travel</p>
          <h2 className="font-display font-700 text-white mb-3" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
            Ready to start planning?
          </h2>
          <p className="text-white/55 text-sm mb-6 max-w-md mx-auto">
            Compare flights, find hotels, and book airport transfers &mdash; all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/flights" className="px-6 py-3 rounded-xl bg-horizon text-ink text-sm font-700 hover:bg-horizon-dark transition-colors">
              Search Flights
            </Link>
            <Link href="/destinations" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white text-sm font-700 hover:bg-white/10 transition-colors">
              Explore Destinations <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
