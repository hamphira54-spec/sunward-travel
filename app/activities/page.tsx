import type { Metadata } from 'next';
import Image from 'next/image';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';
import TipsContent from '@/components/category/TipsContent';
import { Star, MapPin, Clock, Users, Camera, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tours & Activities — Sunward Travel',
  description:
    'Book guided tours, day trips, and local experiences at top destinations worldwide. Compare prices from Klook, Viator, GetYourGuide and more.',
};

// ── Widget URLs ────────────────────────────────────────────────────────────────
// Klook — Bangkok (city_id=10), Activities (category=3)
const KLOOK_SRC =
  'https://tpwdg.com/content' +
  '?currency=USD&trs=566794&shmarker=769903' +
  '&locale=en&city_id=10&category=3&amount=3' +
  '&powered_by=true&campaign_id=137&promo_id=4497';

// ── Tips ──────────────────────────────────────────────────────────────────────
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

// ── Activity categories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Day Trips', emoji: '🚌', desc: 'Explore beyond the city' },
  { label: 'Food Tours', emoji: '🍜', desc: 'Taste local cuisine' },
  { label: 'Water Sports', emoji: '🤿', desc: 'Snorkel, dive & more' },
  { label: 'Cultural Tours', emoji: '🏯', desc: 'Temples & heritage' },
  { label: 'Sunset Cruises', emoji: '🚢', desc: 'Unforgettable evenings' },
  { label: 'Cooking Classes', emoji: '👨‍🍳', desc: 'Cook like a local' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ActivitiesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[340px] sm:h-[380px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=80"
          alt="Tourists exploring a vibrant night market in Bangkok"
          fill priority sizes="100vw" quality={80}
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/40 to-ink/90" />
        <div className="absolute bottom-10 left-0 right-0 z-10">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-xs text-horizon/80 uppercase tracking-[0.2em] font-600 mb-2">
              Sunward Travel
            </p>
            <h1 className="font-display font-700 text-4xl sm:text-5xl text-white leading-tight">
              Tours &amp; Activities
            </h1>
            <p className="mt-2 text-white/65 text-base max-w-lg">
              Guided tours, day trips, and local experiences — book the moments that make your trip unforgettable.
            </p>
          </div>
        </div>
      </section>

      {/* ── Activity categories ── */}
      <section className="py-10 bg-sand border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <div key={cat.label}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-ocean/40 hover:shadow transition-all cursor-default">
                <span className="text-2xl">{cat.emoji}</span>
                <p className="font-display font-700 text-ink text-xs text-center">{cat.label}</p>
                <p className="text-[10px] text-mist text-center leading-tight">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Klook widget ── */}
      <section className="py-14 bg-sand">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <h2 className="font-display font-700 text-2xl text-ink">Top Activities in Bangkok</h2>
            <p className="text-mist text-sm mt-1">Handpicked tours and experiences — book securely via Klook</p>
          </div>
          <TravelpayoutsWidget src={KLOOK_SRC} />
        </div>
      </section>

      {/* ── Tips ── */}
      <TipsContent
        heading="How to choose the best tours"
        intro="Booking activities and tours can be overwhelming — here's how to pick the right experience at the right price."
        tips={ACTIVITY_TIPS}
      />
    </>
  );
}
