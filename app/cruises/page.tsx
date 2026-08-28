import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import TipsContent from '@/components/category/TipsContent';
import { Calendar, Ship, Luggage, Utensils, CreditCard, MapPin, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Cruise Deals Worldwide',
  description:
    'Search and compare cruise itineraries from major cruise lines worldwide. Find Caribbean, Mediterranean, and world cruises at the best prices.',
};

const CRUISE_TIPS = [
  {
    icon: Calendar,
    heading: 'Book early or last-minute — avoid the middle',
    body: 'Cruise prices follow a U-curve: best deals are either 12+ months out (early booking discounts) or under 60 days (last-minute unsold cabins). The middle is most expensive.',
  },
  {
    icon: Ship,
    heading: 'Understand what\'s included before comparing prices',
    body: 'Some cruise lines are all-inclusive (drinks, dining, excursions); others are à la carte. Compare total costs, not just cabin prices.',
  },
  {
    icon: Luggage,
    heading: 'Choose your cabin category carefully',
    body: 'Interior cabins can be 40–60% cheaper than balconies and are ideal if you\'re rarely in your room. Obstructed-view cabins offer natural light at interior prices.',
  },
  {
    icon: Utensils,
    heading: 'Book shore excursions independently when possible',
    body: 'Ship-organised excursions are convenient but typically 30–50% more expensive than booking the same experience through local operators independently.',
  },
  {
    icon: CreditCard,
    heading: 'Watch for onboard credit deals',
    body: 'Promotional fares often include onboard credit — effectively free money to spend on the ship. Factor this into your price comparison.',
  },
  {
    icon: MapPin,
    heading: 'Repositioning cruises offer outstanding value',
    body: 'When cruise lines move ships between seasons (e.g. from Caribbean to Mediterranean), they sell these one-way repositioning cruises at steep discounts.',
  },
];

export default function CruisesPage() {
  return (
    <>
      <CategoryHero
        title="Search & Compare Cruises"
        subtitle="Caribbean, Mediterranean, world voyages — compare itineraries and find the best cabin rates."
        imageUrl="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1400&q=80"
        imageAlt="Large cruise ship sailing through calm blue ocean at sunset"
        tab="cruises"
      />

      <section className="py-16 px-4 bg-sand">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display font-700 text-3xl text-ink">Find Your Perfect Cruise</h2>
            <p className="text-mist mt-2">Compare itineraries from the world&apos;s top cruise lines</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: 'Cruises.com', desc: 'The largest online cruise agency — all major lines in one search', href: 'https://www.cruises.com/' },
              { name: 'Virgin Voyages', desc: 'Adults-only cruises with all-inclusive dining and entertainment', href: 'https://www.virginvoyages.com/book/search' },
              { name: 'Royal Caribbean', desc: 'Innovative megaships with record-breaking onboard experiences', href: 'https://www.royalcaribbean.com/cruises' },
              { name: 'MSC Cruises', desc: 'Award-winning Mediterranean and world cruise itineraries', href: 'https://www.msccruises.com/en-gl/cruise-search' },
            ].map(({ name, desc, href }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between gap-4">
                <div>
                  <p className="font-display font-700 text-ink">{name}</p>
                  <p className="text-sm text-mist mt-1">{desc}</p>
                </div>
                <a href={href} target="_blank" rel="noopener noreferrer sponsored"
                  className="self-start flex items-center gap-2 border border-ocean text-ocean hover:bg-ocean hover:text-white font-display font-700 text-sm px-4 py-2 rounded-lg transition-colors">
                  Explore <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-mist/60 mt-8">
            Sunward Travel may earn a commission on bookings made via our links — at no extra cost to you.{' '}
            <a href="/affiliate-disclosure" className="underline">Learn more</a>
          </p>
        </div>
      </section>

      <div className="pt-16">
        <TipsContent
          heading="How to find the best cruise deals"
          intro="Cruises look complex but follow predictable pricing patterns once you know what to look for. Here's our guide to booking smart."
          tips={CRUISE_TIPS}
        />
      </div>
    </>
  );
}
