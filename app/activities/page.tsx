import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';
import TipsContent from '@/components/category/TipsContent';
import {
  Star, MapPin, Clock, Users, Camera, ShieldCheck,
  Compass, Utensils, Waves, Landmark, Ship, ChefHat,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Tours & Activities Worldwide | Sunward Travel',
  description:
    'Discover guided tours, day trips, and local experiences at top destinations worldwide. Book securely through our partner Klook.',
};

// ── Widget URLs ─────────────────────────────────────────────────────────────
const KLOOK_SRC =
  'https://tpwdg.com/content' +
  '?currency=USD&trs=566794&shmarker=769903' +
  '&locale=en&city_id=10&category=3&amount=3' +
  '&powered_by=true&campaign_id=137&promo_id=4497';

// Kiwitaxi compact — cross-sell at bottom
const KIWI_SHORT_SRC =
  'https://tpwdg.com/content' +
  '?currency=USD&trs=566794&shmarker=769903' +
  '&language=en&theme=1&powered_by=true' +
  '&campaign_id=1&promo_id=1486';

// ── Activity categories ──────────────────────────────────────────────────────
const CATEGORIES = [
  { icon: Compass,  label: 'Day Trips',       desc: 'Explore beyond the city' },
  { icon: Utensils, label: 'Food Tours',       desc: 'Taste local cuisine' },
  { icon: Waves,    label: 'Water Sports',     desc: 'Snorkel, dive & more' },
  { icon: Landmark, label: 'Cultural Tours',   desc: 'Temples & heritage' },
  { icon: Ship,     label: 'Sunset Cruises',   desc: 'Unforgettable evenings' },
  { icon: ChefHat,  label: 'Cooking Classes',  desc: 'Cook like a local' },
];

// ── Popular destinations ─────────────────────────────────────────────────────
const DESTINATIONS = [
  { city: 'Bangkok',    country: 'Thailand',    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=70' },
  { city: 'Bali',       country: 'Indonesia',   image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=70' },
  { city: 'Tokyo',      country: 'Japan',       image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=70' },
  { city: 'Singapore',  country: 'Singapore',   image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=70' },
];

// ── Tips ─────────────────────────────────────────────────────────────────────
const ACTIVITY_TIPS = [
  {
    icon: Clock,
    heading: 'Book popular tours at least 48 hours in advance',
    body: 'Sunset cruises, cooking classes, and temple tours sell out fast — especially in peak season. Reserve early for guaranteed spots.',
  },
  {
    icon: Star,
    heading: 'Check reviews from the last 3 months',
    body: 'Tour quality can change with guides and operators. Recent reviews give a far more accurate picture than an overall rating from two years ago.',
  },
  {
    icon: MapPin,
    heading: 'Small group tours are worth the premium',
    body: 'A small group (under 12 people) offers better access to guides, more personalised attention, and a much richer experience than mass bus tours.',
  },
  {
    icon: Users,
    heading: 'Ask about private options for families',
    body: 'Many operators offer private versions of their tours at a surprisingly reasonable premium — great for families with young children or specific interests.',
  },
  {
    icon: Camera,
    heading: 'Morning tours beat afternoon for photography',
    body: 'Golden hour light and smaller crowds make morning tours far superior at most natural and historical sites. If given the choice, always go early.',
  },
  {
    icon: ShieldCheck,
    heading: 'Check the cancellation policy before booking',
    body: 'Travel plans change. Book tours with free cancellation up to 24 hours before if possible — especially for outdoor or weather-dependent activities.',
  },
];

export default function ActivitiesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[360px] sm:h-[420px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=80"
          alt="Tourists exploring a vibrant night market in Bangkok"
          fill priority sizes="100vw" quality={80}
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/50 to-ink/90" />
        <div className="absolute bottom-24 sm:bottom-28 left-0 right-0 z-10">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-xs text-horizon/90 uppercase tracking-[0.2em] font-600 mb-2">
              Sunward Travel
            </p>
            <h1 className="font-display font-700 text-4xl sm:text-5xl text-white leading-tight">
              Tours &amp; Activities
            </h1>
            <p className="mt-3 text-white/80 text-base max-w-lg leading-relaxed">
              Guided tours, day trips, and local experiences — book the moments
              that make your trip unforgettable.
            </p>
          </div>
        </div>
      </section>

      {/* ── Category strip — replaces fake search form ── */}
      <div className="relative z-20 -mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(13,110,122,0.22),0_4px_16px_-4px_rgba(0,0,0,0.10)] border border-white/80 px-6 py-5">
            <p className="text-[10px] font-700 text-ink/40 uppercase tracking-widest mb-4">
              Browse by category
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-sand hover:bg-ocean/5 border border-transparent hover:border-ocean/20 transition-all cursor-default"
                >
                  <cat.icon size={22} className="text-ocean" strokeWidth={1.6} />
                  <p className="font-display font-700 text-ink text-[11px] text-center leading-tight">{cat.label}</p>
                  <p className="text-[10px] text-mist text-center leading-tight hidden sm:block">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-12 bg-sand" />

      {/* ── Klook widget section ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <span className="inline-block bg-horizon/20 text-ink text-[10px] font-700 uppercase tracking-widest px-2.5 py-1 rounded-full mb-3">
              Via Klook
            </span>
            <h2 className="font-display font-700 text-2xl text-ink">Top Things to Do in Bangkok</h2>
            <p className="text-mist text-sm mt-1">
              Handpicked tours and experiences — book securely through our travel partner.
            </p>
          </div>
          <TravelpayoutsWidget
            src={KLOOK_SRC}
            skeletonHeight={380}
            timeout={14000}
          />
        </div>
      </section>

      {/* ── Popular destinations ── */}
      <section className="py-16 bg-sand border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-display font-700 text-2xl text-ink">Popular Destinations for Activities</h2>
            <p className="text-mist text-sm mt-1">Some of the world&apos;s best experiences are waiting</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.city}
                className="group relative rounded-2xl overflow-hidden h-52 flex items-end shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <Image
                  src={dest.image}
                  alt={dest.city}
                  fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                  quality={70}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="relative z-10 p-4 w-full">
                  <span className="text-[10px] text-horizon font-600 uppercase tracking-widest">{dest.country}</span>
                  <p className="font-display font-700 text-white text-lg leading-tight">{dest.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tips ── */}
      <TipsContent
        heading="How to choose the best tours"
        intro="Booking activities and tours can be overwhelming — here's how to pick the right experience at the right price."
        tips={ACTIVITY_TIPS}
      />

      {/* ── Airport Transfer Cross-sell ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-display font-700 text-2xl text-ink">Need an Airport Transfer?</h2>
            <p className="text-mist text-sm mt-1">
              Get to your hotel without the taxi queue — fixed prices, professional
              drivers, flight tracking included.
            </p>
          </div>
          <div className="bg-sand rounded-2xl border border-gray-100 p-6 sm:p-8">
            <TravelpayoutsWidget
              src={KIWI_SHORT_SRC}
              skeletonHeight={180}
              timeout={14000}
            />
            <p className="mt-4 text-center">
              <Link
                href="/airport-transfers"
                className="inline-flex items-center gap-2 text-ocean text-sm font-700 hover:underline"
              >
                Explore all transfer options <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
