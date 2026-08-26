import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import SearchPlaceholderZone from '@/components/category/SearchPlaceholderZone';
import TipsContent from '@/components/category/TipsContent';
import { Calendar, Ship, Luggage, Utensils, CreditCard, MapPin } from 'lucide-react';

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

      {/* ╔══ AFFILIATE WIDGET ZONE ══╗
          Cruise comparison widget goes here (e.g. Cruises.com, ICruise affiliate).
          Adapter: components/booking/adapters/types.ts → BookingProvider
          ╚════════════════════════╝ */}
      <SearchPlaceholderZone defaultTab="cruises" providerName="Cruise affiliate" />

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
