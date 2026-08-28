import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TravelpayoutsWidget from '@/components/widgets/TravelpayoutsWidget';
import TipsContent from '@/components/category/TipsContent';
import { Car, Clock, Shield, CreditCard, MapPin, MessageCircle, ChevronDown, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Airport Transfers & Private Shuttles | Sunward Travel',
  description:
    'Book private airport transfers at fixed prices worldwide. No surge pricing, professional drivers, 24/7 support — powered by Kiwitaxi.',
};

// ── Kiwitaxi Full Transfer Search (brand colours) ────────────────────────────
// Ocean #0D6E7A → %230D6E7A  |  Horizon #F2C04A → %23F2C04A
// Sand  #FBF8F4 → %23FBF8F4  |  Ink #1A2631 → %231A2631
const KIWI_FULL_SRC =
  'https://tpwdg.com/content' +
  '?currency=USD&trs=566794&shmarker=769903' +
  '&locale=en&from=&to=&country=&powered_by=true' +
  '&transfers_limit=10' +
  '&bg_color=%23FBF8F4' +
  '&button_color=%230D6E7A' +
  '&button_font_color=%23ffffff' +
  '&button_hover_color=%23095663' +
  '&border_color=%23F2C04A' +
  '&input_font_color=%236B8A99' +
  '&input_bg_color=%23ffffff' +
  '&input_label_color=%236B8A99' +
  '&icon_bg_color=%23ffffff' +
  '&icon_arrow_color=%236c7c8c' +
  '&icon_bg_color_mobile=%23F2C04A' +
  '&icon_arrow_color_mobile=%23ffffff' +
  '&autocomplete_font_color=%231A2631' +
  '&autocomplete_bg_color=%23ffffff' +
  '&autocomplete_font_color_active=%23ffffff' +
  '&autocomplete_bg_color_active=%230D6E7A' +
  '&loader_color=%23F2C04A' +
  '&empty_color=%231A2631' +
  '&info_bg_color=%23FFF8E1' +
  '&info_icon_color=%231A2631' +
  '&info_caption_color=%231A2631' +
  '&class_background=%23ffffff' +
  '&class_font_color=%231A2631' +
  '&class_header_color=%236B8A99' +
  '&class_button_background=%230D6E7A' +
  '&class_button_font_color=%23ffffff' +
  '&class_button_background_hover=%23095663' +
  '&class_comment_background=%23E5E0DA' +
  '&class_comment_font=%236B8A99' +
  '&more_font_color=%230D6E7A' +
  '&notification_background=%23FFF8E1' +
  '&notification_border_color=%23F2C04A' +
  '&notification_color=%231A2631' +
  '&transfer_background=%23F0EDE8' +
  '&transfer_background_hover=%23E5E0DA' +
  '&transfer_font_color=%231A2631' +
  '&wtype=true' +
  '&campaign_id=1&promo_id=2949';

// ── Value features ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Car,
    title: 'Fixed-price transfers',
    desc: 'The price you see is the price you pay — no surge pricing, no meter running, no surprises at arrival.',
  },
  {
    icon: Clock,
    title: 'Flight tracking',
    desc: 'Your driver monitors your flight in real time. Delays are handled automatically — no need to call anyone.',
  },
  {
    icon: Shield,
    title: 'Free cancellation',
    desc: 'Plans change. Cancel up to 24 hours before your transfer for a full refund on most bookings.',
  },
  {
    icon: MessageCircle,
    title: '24/7 customer support',
    desc: 'Support is available around the clock via chat and phone in multiple languages.',
  },
  {
    icon: CreditCard,
    title: 'Pay securely online',
    desc: 'Book and pay in advance. No need to carry local cash or negotiate fares on arrival.',
  },
  {
    icon: MapPin,
    title: '50,000+ destinations',
    desc: 'Airports, ports, railway stations, hotels — transfers are available in over 130 countries.',
  },
];

// ── Popular transfer routes ───────────────────────────────────────────────────
const POPULAR_ROUTES = [
  { from: 'Suvarnabhumi Airport', to: 'Bangkok City Centre', country: 'Thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=70' },
  { from: 'Nguyen Van Troi Airport', to: 'Ho Chi Minh City', country: 'Vietnam', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=70' },
  { from: 'Ngurah Rai Airport', to: 'Seminyak / Kuta', country: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=70' },
  { from: 'Don Mueang Airport', to: 'Pattaya', country: 'Thailand', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=70' },
  { from: 'Changi Airport', to: 'Singapore City', country: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=70' },
  { from: 'Narita Airport', to: 'Tokyo City', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=70' },
];

// ── Tips ──────────────────────────────────────────────────────────────────────
const TIPS = [
  {
    icon: Clock,
    heading: 'Book before you land',
    body: 'Pre-booking your transfer eliminates the stress of negotiating with taxi drivers after a long flight, especially at unfamiliar airports.',
  },
  {
    icon: Car,
    heading: 'Choose the right vehicle class',
    body: 'Economy sedans suit solo travellers and couples. Minivans are essential for families with luggage. Business class offers extra comfort on long transfers.',
  },
  {
    icon: MapPin,
    heading: 'Verify your pickup point',
    body: 'Most airports have multiple terminals and exit gates. Always confirm the exact meeting point with your driver confirmation — not just "Arrivals".',
  },
  {
    icon: Shield,
    heading: 'Check for free waiting time',
    body: 'Most fixed-price transfers include 30–60 minutes of free waiting after your flight lands. Confirm this in your booking so you know your buffer.',
  },
  {
    icon: MessageCircle,
    heading: 'Save the driver contact number',
    body: "Download the confirmation with the driver's phone number before you lose Wi-Fi. A simple text on arrival is far less stressful than searching through emails.",
  },
  {
    icon: CreditCard,
    heading: 'Compare per-person vs flat rate',
    body: 'For groups of 3 or more, a flat-rate private transfer is almost always cheaper than per-person shuttle tickets when you factor in luggage and time.',
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: 'What is the difference between a private transfer and a shared shuttle?',
    a: 'A private transfer is exclusively for your group, goes directly to your destination with no stops, and departs when you are ready. A shared shuttle picks up multiple groups and makes several drop-off stops, which takes longer but costs less.',
  },
  {
    q: 'What happens if my flight is delayed?',
    a: 'Kiwitaxi monitors your flight in real time. If your flight is delayed, your driver adjusts automatically at no extra charge. You do not need to contact anyone.',
  },
  {
    q: 'Can I cancel my transfer?',
    a: 'Most transfers offer free cancellation up to 24 hours before departure. Check the specific cancellation policy shown on your booking confirmation.',
  },
  {
    q: 'Is Sunward Travel a transfer operator?',
    a: 'No. Sunward Travel is an affiliate travel platform. We connect you with Kiwitaxi, an established international transfer provider. Your booking is made directly with Kiwitaxi.',
  },
];

export default function AirportTransfersPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-[360px] sm:h-[420px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80"
          alt="Airport departure terminal at dusk"
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
              Airport Transfers
            </h1>
            <p className="mt-3 text-white/75 text-base max-w-xl leading-relaxed">
              Private airport transfers without the hassle — fixed prices, professional
              drivers, and flight tracking included.
            </p>
          </div>
        </div>
      </section>

      {/* ── Search card — overlaps hero ── */}
      <div className="relative z-20 -mt-14 pb-2">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(13,110,122,0.22),0_4px_16px_-4px_rgba(0,0,0,0.10)] border border-white/80">
            <div className="flex items-center gap-3 px-6 pt-5 pb-0 border-b border-gray-100">
              <div className="w-1.5 h-6 rounded-full bg-ocean" />
              <p className="font-display font-700 text-ink text-sm tracking-wide">
                Where are you travelling from?
              </p>
            </div>
            <div className="p-4">
              <TravelpayoutsWidget
                src={KIWI_FULL_SRC}
                skeletonHeight={260}
                timeout={14000}
              />
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-4 flex-wrap">
            {['Fixed prices — no meters', 'Flight tracking included', 'Free cancellation available'].map((label) => (
              <span key={label} className="text-xs text-ink/55 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-ocean/80 flex items-center justify-center text-white text-[9px]">✓</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="h-12 bg-sand" />

      {/* ── Value features grid ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-700 text-2xl sm:text-3xl text-ink">
              Why book a private transfer?
            </h2>
            <p className="text-mist text-sm mt-2 max-w-2xl mx-auto">
              Arriving in a new city should feel exciting, not stressful. Here&apos;s what
              separates a pre-booked transfer from a taxi queue.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-sand rounded-2xl p-5 border border-gray-100 hover:border-ocean/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center text-ocean mb-4">
                  <f.icon size={20} strokeWidth={1.8} />
                </div>
                <h3 className="font-display font-700 text-ink text-sm mb-1.5">{f.title}</h3>
                <p className="text-mist text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular routes ── */}
      <section className="py-16 bg-sand border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-10">
            <h2 className="font-display font-700 text-2xl text-ink">Popular Airport Routes</h2>
            <p className="text-mist text-sm mt-1">Frequently booked transfers across Southeast Asia and beyond</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_ROUTES.map((route) => (
              <div
                key={`${route.from}-${route.to}`}
                className="group relative rounded-2xl overflow-hidden h-40 flex items-end shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <Image
                  src={route.image}
                  alt={route.to}
                  fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  quality={70}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="relative z-10 p-4 w-full">
                  <span className="text-[10px] text-horizon font-600 uppercase tracking-widest">{route.country}</span>
                  <p className="font-display font-700 text-white text-sm leading-snug mt-0.5">{route.from}</p>
                  <p className="flex items-center gap-1 text-white/60 text-[11px] mt-0.5">
                    <ArrowRight size={10} /> {route.to}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tips ── */}
      <TipsContent
        heading="How to get the most from your airport transfer"
        intro="A pre-booked private transfer is one of the simplest travel upgrades available — but a few small steps ensure it goes perfectly."
        tips={TIPS}
      />

      {/* ── FAQ ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-700 text-2xl text-ink mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="bg-sand rounded-2xl p-5 border border-gray-100"
              >
                <p className="font-display font-700 text-ink text-sm mb-2 flex items-start gap-2">
                  <ChevronDown size={16} className="text-ocean mt-0.5 shrink-0" />
                  {item.q}
                </p>
                <p className="text-mist text-xs leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>

          {/* Affiliate disclosure */}
          <p className="mt-8 text-xs text-mist/70 border-t border-gray-100 pt-6">
            Sunward Travel may earn a commission when you book through partner links on this
            page, at no additional cost to you. Transfer services are operated by Kiwitaxi.{' '}
            <Link href="/affiliate-disclosure" className="underline hover:text-ocean transition-colors">
              Learn more about how we earn.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
