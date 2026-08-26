import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import SearchPlaceholderZone from '@/components/category/SearchPlaceholderZone';
import TipsContent from '@/components/category/TipsContent';
import { Calendar, Clock, CreditCard, AlertCircle, TrendingDown, Luggage } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Flights Worldwide',
  description:
    'Search and compare flights from hundreds of airlines. Find cheap flights, flexible fares, and the best routes for your next trip — powered by Sunward Travel.',
};

const FLIGHT_TIPS = [
  {
    icon: Calendar,
    heading: 'Book 6–8 weeks ahead for domestic, 3–6 months for international',
    body: 'Studies consistently show this window catches prices before they spike. For peak season or popular routes, book even earlier.',
  },
  {
    icon: TrendingDown,
    heading: 'Fly mid-week to save up to 30%',
    body: 'Tuesday and Wednesday departures are typically 15–30% cheaper than weekend flights on the same route. Shifting by even one day can make a big difference.',
  },
  {
    icon: Clock,
    heading: 'Set price alerts and wait for drops',
    body: 'Fares fluctuate daily. Set alerts for your route and preferred dates — prices often dip on Tuesday evenings as airlines adjust their inventory.',
  },
  {
    icon: CreditCard,
    heading: 'Use a travel credit card for booking',
    body: 'Cards with travel rewards earn 2–5x points on flights. Combine with an affiliate booking link and you\'re stacking savings twice.',
  },
  {
    icon: AlertCircle,
    heading: 'Check nearby airports and alternate dates',
    body: 'Flying into or out of a secondary airport can cut costs dramatically. A ±3 day flexibility on dates can save hundreds on long-haul routes.',
  },
  {
    icon: Luggage,
    heading: 'Understand baggage rules before you book',
    body: 'Budget airlines often show low base fares that jump significantly with carry-on or checked bags. Always compare the total price including your luggage.',
  },
];

export default function FlightsPage() {
  return (
    <>
      <CategoryHero
        title="Search & Compare Flights"
        subtitle="Hundreds of airlines, every route — find the right flight at the right price."
        imageUrl="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80"
        imageAlt="Airplane wing over clouds at golden hour"
        tab="flights"
      />

      {/* ╔══ AFFILIATE WIDGET ZONE ══╗
          Travelpayouts flight widget goes here once approved.
          Adapter: components/booking/adapters/types.ts → BookingProvider
          ╚════════════════════════╝ */}
      <SearchPlaceholderZone defaultTab="flights" providerName="Travelpayouts" />

      <div className="pt-16">
        <TipsContent
          heading="How to find cheaper flights"
          intro="Our editorial team shares the strategies frequent travellers use to consistently pay less for flights — from booking windows to hidden tricks."
          tips={FLIGHT_TIPS}
        />
      </div>
    </>
  );
}
