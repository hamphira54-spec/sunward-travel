import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import FlightSearchForm from '@/components/flights/FlightSearchForm';
import TipsContent from '@/components/category/TipsContent';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';
import { Calendar, Clock, CreditCard, AlertCircle, TrendingDown, Luggage, ArrowRight } from 'lucide-react';

// ── Widget URLs (brand colours, map widget removed — was showing blank) ────────
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

export const metadata: Metadata = {
  title: 'Compare Flights Worldwide — Sunward Travel',
  description:
    'Search and compare flights from hundreds of airlines. Find cheap flights, flexible fares, and the best routes for your next trip — powered by Sunward Travel.',
};

// ── Popular routes ────────────────────────────────────────────────────────────
const POPULAR_ROUTES = [
  {
    origin: 'BKK', originCity: 'Bangkok',
    dest:   'NRT', destCity:   'Tokyo',
    image:  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=70',
    tag:    'Most popular',
  },
  {
    origin: 'BKK', originCity: 'Bangkok',
    dest:   'SYD', destCity:   'Sydney',
    image:  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=70',
    tag:    'Trending',
  },
  {
    origin: 'BKK', originCity: 'Bangkok',
    dest:   'SIN', destCity:   'Singapore',
    image:  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=70',
    tag:    'Short haul',
  },
  {
    origin: 'BKK', originCity: 'Bangkok',
    dest:   'LHR', destCity:   'London',
    image:  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=70',
    tag:    'Long haul',
  },
  {
    origin: 'BKK', originCity: 'Bangkok',
    dest:   'DXB', destCity:   'Dubai',
    image:  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=70',
    tag:    'Middle East',
  },
  {
    origin: 'BKK', originCity: 'Bangkok',
    dest:   'DPS', destCity:   'Bali',
    image:  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=70',
    tag:    'Beach escape',
  },
];

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
    body: "Fares fluctuate daily. Set alerts for your route — prices often dip on Tuesday evenings as airlines adjust their inventory.",
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FlightsPage() {
  // Default depart = 30 days out, return = 37 days out
  const depart = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

  return (
    <>
      {/* ── Hero + embedded search ── */}
      <section className="relative min-h-[420px] flex flex-col justify-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80"
          alt="Airplane wing over clouds at golden hour"
          fill priority sizes="100vw" quality={80}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/45 to-ink/80" />

        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 pb-0 pt-24">
          <h1 className="font-display font-700 text-4xl sm:text-5xl text-white leading-tight">
            Search &amp; Compare Flights
          </h1>
          <p className="mt-2 text-white/70 text-base max-w-xl">
            Hundreds of airlines, every route — find the right flight at the right price.
          </p>
        </div>

        {/* Floating search card */}
        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 mt-6 translate-y-10">
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_-8px_rgba(26,38,49,0.25)]">
            <FlightSearchForm />
          </div>
        </div>
      </section>

      {/* Spacer for the floating card */}
      <div className="h-20 bg-sand" />

      {/* ── Popular Routes ── */}
      <section className="py-16 bg-sand">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display font-700 text-2xl text-ink">Popular Routes</h2>
              <p className="text-mist text-sm mt-1">Top-searched flights from Bangkok — click to search</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_ROUTES.map((route) => {
              const href = `/flights/search?origin=${route.origin}&destination=${route.dest}&departDate=${depart}&adults=1&tripType=roundtrip&currency=USD`;
              return (
                <Link key={`${route.origin}-${route.dest}`} href={href}
                  className="group relative rounded-2xl overflow-hidden h-48 flex items-end shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={route.image}
                    alt={route.destCity}
                    fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    quality={70}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
                  <div className="relative z-10 p-4 w-full flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-horizon font-600 uppercase tracking-widest">{route.tag}</span>
                      <p className="font-display font-700 text-white text-xl leading-tight">{route.destCity}</p>
                      <p className="text-white/60 text-xs mt-0.5">{route.originCity} → {route.destCity}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-horizon transition-colors">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tips ── */}
      {/* ── Pricing Calendar ── */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="font-display font-700 text-2xl text-ink">Best Time to Fly</h2>
            <p className="text-mist text-sm mt-1">See which dates have the lowest fares</p>
          </div>
          <TravelpayoutsWidget src={CALENDAR_SRC} />
        </div>
      </section>

      {/* ── Schedule ── */}
      <section className="py-12 bg-sand">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="font-display font-700 text-2xl text-ink">Flight Schedule</h2>
            <p className="text-mist text-sm mt-1">Browse available flights and departure times — Bangkok to Tokyo</p>
          </div>
          <TravelpayoutsWidget src={SCHEDULE_SRC} />
        </div>
      </section>

      {/* ── Tips ── */}
      <TipsContent
        heading="How to find cheaper flights"
        intro="Our editorial team shares the strategies frequent travellers use to consistently pay less for flights — from booking windows to hidden tricks."
        tips={FLIGHT_TIPS}
      />
    </>
  );
}
