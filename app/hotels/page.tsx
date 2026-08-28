import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import HotelSearchForm from '@/components/hotels/HotelSearchForm';
import TipsContent from '@/components/category/TipsContent';
import { Star, Clock, CreditCard, MapPin, Shield, Wifi } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Hotels Worldwide',
  description:
    'Search and compare hotels, resorts, and apartments worldwide. Find the best rates from top booking platforms — all in one place on Sunward Travel.',
};

const HOTEL_TIPS = [
  {
    icon: Clock,
    heading: 'Book 3–6 weeks before check-in for city hotels',
    body: 'Urban hotels often release unsold inventory at discounted rates closer to check-in. Booking too far ahead can mean missing last-minute deals.',
  },
  {
    icon: Star,
    heading: 'Read recent reviews, not the overall score',
    body: 'A hotel\'s rating from two years ago may not reflect recent management changes. Filter reviews to the last three months for the most accurate picture.',
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
    body: 'These "amenities" often cost extra even at upscale properties. Check what\'s included — hidden fees can make a bargain room more expensive than advertised.',
  },
];

export default function HotelsPage() {
  return (
    <>
      <CategoryHero
        title="Search & Compare Hotels"
        subtitle="From budget stays to luxury resorts — compare rates across all the top booking platforms."
        imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80"
        imageAlt="Luxury hotel pool overlooking tropical ocean at sunset"
        tab="hotels"
      />

      <section className="py-12 px-4 bg-sand">
        <HotelSearchForm />
      </section>

      <div className="pt-16">
        <TipsContent
          heading="How to book the best hotel for less"
          intro="Finding great accommodation isn't just about price — it's about value, location, and knowing when to book. Here's what our team recommends."
          tips={HOTEL_TIPS}
        />
      </div>
    </>
  );
}
