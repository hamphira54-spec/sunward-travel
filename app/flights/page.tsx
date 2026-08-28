import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import TipsContent from '@/components/category/TipsContent';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';
import { Calendar, Clock, CreditCard, AlertCircle, TrendingDown, Luggage } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Flights Worldwide',
  description:
    'Search and compare flights from hundreds of airlines. Find cheap flights, flexible fares, and the best routes for your next trip — powered by Sunward Travel.',
};

// ── Brand-coloured widget URLs ─────────────────────────────────────────────────
// Ocean  #0D6E7A → %230D6E7A
// Horizon #F2C04A → %23F2C04A
// Ink    #1A2631 → %231A2631
// Sand   #FBF8F4 → %23FBF8F4
// MistLight #A8C0CC → %23A8C0CC

const SEARCH_FORM_SRC =
  'https://tpwdg.com/content' +
  '?currency=usd&trs=566794&shmarker=769903' +
  '&show_hotels=true&powered_by=true&locale=en' +
  '&searchUrl=sunward-travel.vercel.app%2Fflights' +
  '&primary_override=%230D6E7A' +
  '&color_button=%23F2C04A' +
  '&color_icons=%230D6E7A' +
  '&dark=%231A2631' +
  '&light=%23FBF8F4' +
  '&secondary=%23FFFFFF' +
  '&special=%23A8C0CC' +
  '&color_focused=%23F2C04A' +
  '&border_radius=8&plain=true' +
  '&promo_id=7879&campaign_id=100';

const MAP_SRC =
  'https://tpwdg.com/content' +
  '?currency=usd&trs=566794&shmarker=769903' +
  '&lat=13.7563&lng=100.5018' +         // centred on Bangkok
  '&powered_by=true' +
  '&search_host=sunward-travel.vercel.app%2Fflights' +
  '&locale=en&origin=BKK' +
  '&value_min=0&value_max=1000000' +
  '&round_trip=true&only_direct=false' +
  '&radius=1&draggable=true&disable_zoom=false' +
  '&show_logo=false&scrollwheel=false' +
  '&primary=%230D6E7A&secondary=%23F2C04A&light=%23FBF8F4' +
  '&width=1500&height=500&zoom=2' +
  '&promo_id=4054&campaign_id=100';

const CALENDAR_SRC =
  'https://tpwdg.com/content' +
  '?currency=usd&trs=566794&shmarker=769903' +
  '&searchUrl=sunward-travel.vercel.app%2Fflights' +
  '&locale=en&powered_by=true' +
  '&one_way=false&only_direct=false&period=year&range=7%2C14' +
  '&primary=%230D6E7A' +
  '&color_background=%23FBF8F4' +
  '&dark=%231A2631&light=%23FBF8F4' +
  '&achieve=%23F2C04A' +
  '&promo_id=4041&campaign_id=100';

const SCHEDULE_SRC =
  'https://tpwdg.com/content' +
  '?currency=usd&trs=566794&shmarker=769903' +
  '&color_button=%23F2C04A' +
  '&target_host=sunward-travel.vercel.app%2Fflights' +
  '&locale=en&powered_by=true' +
  '&origin=BKK&destination=NRT' +
  '&with_fallback=true&non_direct_flights=false&min_lines=10' +
  '&border_radius=8' +
  '&color_background=%23FBF8F4' +
  '&color_text=%231A2631' +
  '&color_border=%23E5E0DA' +
  '&promo_id=2811&campaign_id=100';

// ── Tips ──────────────────────────────────────────────────────────────────────

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
    body: "Cards with travel rewards earn 2–5x points on flights. Combine with an affiliate booking link and you're stacking savings twice.",
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

// ── Section wrapper ────────────────────────────────────────────────────────────

function WidgetSection({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-12 bg-sand">
      <div className="max-w-6xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="mb-6">
            <h2 className="font-display font-700 text-2xl text-ink">{title}</h2>
            {subtitle && <p className="text-mist text-sm mt-1">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

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

      {/* Flight Search Form */}
      <WidgetSection title="Search Flights" subtitle="Search across hundreds of airlines at once">
        <TravelpayoutsWidget src={SEARCH_FORM_SRC} />
      </WidgetSection>

      {/* Prices on Map */}
      <WidgetSection title="Explore Destinations by Price" subtitle="Click any destination to see the cheapest fares">
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <TravelpayoutsWidget src={MAP_SRC} />
        </div>
      </WidgetSection>

      {/* Pricing Calendar */}
      <WidgetSection title="Best Time to Fly" subtitle="See which dates have the lowest fares">
        <TravelpayoutsWidget src={CALENDAR_SRC} />
      </WidgetSection>

      {/* Schedule */}
      <WidgetSection title="Flight Schedule" subtitle="Browse available flights and departure times">
        <TravelpayoutsWidget src={SCHEDULE_SRC} />
      </WidgetSection>

      {/* Tips */}
      <div className="pt-8">
        <TipsContent
          heading="How to find cheaper flights"
          intro="Our editorial team shares the strategies frequent travellers use to consistently pay less for flights — from booking windows to hidden tricks."
          tips={FLIGHT_TIPS}
        />
      </div>
    </>
  );
}
