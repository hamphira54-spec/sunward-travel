import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HotelSearchForm from '@/components/hotels/HotelSearchForm';
import TipsContent from '@/components/category/TipsContent';
import { Star, Clock, CreditCard, MapPin, Shield, Wifi, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Hotels Worldwide — Sunward Travel',
  description:
    'Search and compare hotels, resorts, and apartments worldwide. Find the best rates from top booking platforms — all in one place on Sunward Travel.',
};

// ── Popular hotel destinations ─────────────────────────────────────────────────
const POPULAR_DESTINATIONS = [
  {
    city: 'Bangkok',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&q=70',
    tag: 'Most searched',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=70',
    tag: 'Trending',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=70',
    tag: 'Beach &amp; resort',
  },
  {
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=70',
    tag: 'Romantic',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=70',
    tag: 'City escape',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=70',
    tag: 'Luxury',
  },
];

// ── Tips ──────────────────────────────────────────────────────────────────────
const HOTEL_TIPS = [
  {
    icon: Clock,
    heading: 'Book 3–6 weeks before check-in for city hotels',
    body: 'Urban hotels often release unsold inventory at discounted rates closer to check-in. Booking too far ahead can mean missing last-minute deals.',
  },
  {
    icon: Star,
    heading: 'Read recent reviews, not the overall score',
    body: "A hotel's rating from two years ago may not reflect recent management changes. Filter reviews to the last three months for the most accurate picture.",
  },
  {
    icon: MapPin,
    heading: 'Location beats star rating in most cases',
    body: 'A 3-star hotel in a great neighbourhood beats a 5-star property that requires a 30-minute taxi to everything. Check walking distance to your key sights.',
  },
  {
    icon: CreditCard,
    heading: 'Book refundable rates when flexibility matters',
    body: 'Plans change. Non-refundable rates are cheaper but can be costly if your trip shifts. For uncertain bookings, the flexibility premium is usually worth it.',
  },
  {
    icon: Shield,
    heading: 'Always book direct or through a trusted OTA',
    body: 'Use major platforms (Booking.com, Hotels.com, Expedia) or book directly with the hotel. Avoid unknown third-party sites with no customer protection.',
  },
  {
    icon: Wifi,
    heading: 'Confirm Wi-Fi, parking, and breakfast inclusions',
    body: "These \"amenities\" often cost extra even at upscale properties. Check what's included — hidden fees can make a bargain room more expensive than advertised.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HotelsPage() {
  const checkin  = new Date(Date.now() + 1  * 86400000).toISOString().slice(0, 10);
  const checkout = new Date(Date.now() + 8  * 86400000).toISOString().slice(0, 10);

  return (
    <>
      {/* ── Hero — overflow-hidden scoped to image only ── */}
      <section className="relative h-[340px] sm:h-[380px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80"
          alt="Luxury hotel pool overlooking tropical ocean at sunset"
          fill priority sizes="100vw" quality={80}
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/40 to-ink/90" />

        <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 z-10">
          <div className="max-w-5xl mx-auto px-6">
            <p className="text-xs text-horizon/80 uppercase tracking-[0.2em] font-600 mb-2">
              Sunward Travel
            </p>
            <h1 className="font-display font-700 text-4xl sm:text-5xl text-white leading-tight">
              Search &amp; Compare Hotels
            </h1>
            <p className="mt-2 text-white/65 text-base max-w-lg">
              From budget stays to luxury resorts — compare rates across all top booking platforms.
            </p>
          </div>
        </div>
      </section>

      {/* ── Search card — outside hero, overlaps via -mt-14 ── */}
      <div className="relative z-20 -mt-14 pb-2">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(13,110,122,0.22),0_4px_16px_-4px_rgba(0,0,0,0.10)] border border-white/80">
            <div className="flex items-center gap-3 px-6 pt-5 pb-0 border-b border-gray-100">
              <div className="w-1.5 h-6 rounded-full bg-ocean" />
              <p className="font-display font-700 text-ink text-sm tracking-wide">
                Where are you staying?
              </p>
            </div>
            <HotelSearchForm />
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
            <span className="text-xs text-ink/55 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-ocean/80 flex items-center justify-center text-white text-[9px]">✓</span>
              Compare 500+ booking sites
            </span>
            <span className="text-xs text-ink/55 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-ocean/80 flex items-center justify-center text-white text-[9px]">✓</span>
              Free cancellation options
            </span>
            <span className="text-xs text-ink/55 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-ocean/80 flex items-center justify-center text-white text-[9px]">✓</span>
              No hidden fees
            </span>
          </div>
        </div>
      </div>

      <div className="h-10 bg-sand" />

      {/* ── Popular Destinations ── */}
      <section className="py-16 bg-sand">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-display font-700 text-2xl text-ink">Popular Destinations</h2>
            <p className="text-mist text-sm mt-1">Top hotel destinations — click to search</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_DESTINATIONS.map((dest) => {
              const href = `/hotels/book?destination=${encodeURIComponent(dest.city)}&checkin=${checkin}&checkout=${checkout}&adults=2&rooms=1`;
              return (
                <Link key={dest.city} href={href}
                  className="group relative rounded-2xl overflow-hidden h-48 flex items-end shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={dest.image}
                    alt={dest.city}
                    fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    quality={70}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
                  <div className="relative z-10 p-4 w-full flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-horizon font-600 uppercase tracking-widest"
                        dangerouslySetInnerHTML={{ __html: dest.tag }} />
                      <p className="font-display font-700 text-white text-xl leading-tight">{dest.city}</p>
                      <p className="text-white/60 text-xs mt-0.5">{dest.country}</p>
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
      <TipsContent
        heading="How to book the best hotel for less"
        intro="Finding great accommodation isn't just about price — it's about value, location, and knowing when to book. Here's what our team recommends."
        tips={HOTEL_TIPS}
      />
    </>
  );
}
