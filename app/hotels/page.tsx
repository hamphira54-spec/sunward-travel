import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import TravelHero from '@/components/travel/TravelHero';
import SectionHeading from '@/components/ui/SectionHeading';
import TipsContent from '@/components/category/TipsContent';
import AffiliateDisclosure from '@/components/travel/AffiliateDisclosure';
import { DiscoverySearchForm } from '@/components/hotels/DiscoverySearchForm';
import { WhereToStayExplorer } from '@/components/hotels/WhereToStayExplorer';
import { Star, MapPin, Map, Home, Shield, Lightbulb, ArrowRight, Compass, Calendar, Search } from 'lucide-react';
import prisma from '@/lib/db';
import { DESTINATION_BY_SLUG } from '@/lib/destinations-v2';
import { extractStayAreasFromGuide } from '@/lib/hotels/stay-areas';
import { GUIDE_BY_SLUG } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Where to Stay - Accommodation Discovery | Sunward Travel',
  description: 'Find the right area to stay before choosing your hotel. Explore neighborhoods, accommodation styles, and expert travel guides.', alternates: { canonical: 'https://sunward-travel.vercel.app/hotels' },
};

const POPULAR_DESTINATIONS = [
  { city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=70', tag: 'Beach & resort', slug: 'bali' },
  { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=70', tag: 'City exploration', slug: 'tokyo' },
  { city: 'Singapore', country: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=70', tag: 'Food & culture', slug: 'singapore' },
];

const HOTEL_TIPS = [
  { icon: MapPin, heading: 'Location is everything', body: 'A budget hotel in a great neighborhood often beats a luxury stay far from transport. Choose your area first, then find the hotel.' },
  { icon: Home, heading: 'Consider alternative styles', body: 'Resorts, boutique guesthouses, and serviced apartments can offer much better value depending on your travel style and group size.' },
  { icon: Map, heading: 'Check the transit connections', body: 'Ensure your chosen area is well-connected. Being near a central train station or metro stop can save hours of daily travel time.' },
  { icon: Lightbulb, heading: 'Match the vibe', body: 'Are you looking for nightlife, family-friendly quiet streets, or cultural immersion? Different neighborhoods cater to completely different trips.' },
  { icon: Shield, heading: 'Wait until you are ready', body: 'Learn about the destination before committing to a non-refundable rate. Understanding the layout prevents expensive mistakes.' },
  { icon: Star, heading: 'Read neighborhood guides', body: 'Our detailed where-to-stay guides break down destinations by traveler type to help you make an informed decision.' },
];

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const destinationQuery = typeof params.destination === 'string' ? params.destination : undefined;
  
  let guideData = null;
  let stayAreas: ReturnType<typeof extractStayAreasFromGuide> = [];
  let destinationName = destinationQuery || '';

  if (destinationQuery) {
    const slug = `where-to-stay-in-${destinationQuery}`;
    // check prisma first
    let dbGuide = await prisma.guide.findUnique({
      where: { slug, publishStatus: 'published' }
    });
    
    let guideToParse: any = dbGuide;
    
    // fallback to static
    if (!guideToParse) {
      guideToParse = GUIDE_BY_SLUG[slug];
    }

    if (guideToParse) {
      guideData = guideToParse;
      stayAreas = extractStayAreasFromGuide(guideToParse as any);
      destinationName = DESTINATION_BY_SLUG[destinationQuery]?.name || destinationQuery;
    }
  }

  const destObj = destinationQuery ? DESTINATION_BY_SLUG[destinationQuery] : null;

  return (
    <>
      <TravelHero
        imageSrc="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80"
        imageAlt="Luxury hotel pool surrounded by palm trees"
        eyebrow="Sunward Travel"
        heading="Find the Right Place to Stay"
        description="Discover the neighborhoods, accommodation styles and local context that fit your trip before you book."
        height="md"
      />

      <div className="relative z-20 -mt-14 pb-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(92,61,46,0.18),0_4px_16px_-4px_rgba(0,0,0,0.08)] border border-white/80 p-2">
            <DiscoverySearchForm />
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap opacity-80">
            <span className="text-xs text-ink flex items-center gap-1.5 font-500">
              <span className="w-4 h-4 rounded-full bg-ocean flex items-center justify-center text-white text-[9px]">V</span>
              Neighborhood insights
            </span>
            <span className="text-xs text-ink flex items-center gap-1.5 font-500">
              <span className="w-4 h-4 rounded-full bg-ocean flex items-center justify-center text-white text-[9px]">V</span>
              Independent editorial guides
            </span>
            <span className="text-xs text-ink flex items-center gap-1.5 font-500">
              <span className="w-4 h-4 rounded-full bg-ocean flex items-center justify-center text-white text-[9px]">V</span>
              Trip planning context
            </span>
          </div>
        </div>
      </div>

      <div className="h-10 bg-sand" />

      {destinationQuery && (
        <section className="py-12 bg-sand">
          <div className="max-w-5xl mx-auto px-4">
            {stayAreas.length > 0 ? (
              <>
                <div className="mb-10 text-center flex flex-col items-center">
                  <span className="px-3 py-1 bg-primary/10 text-primary-dark text-xs font-700 uppercase tracking-wider rounded-full mb-4">Discovery Results</span>
                  <h2 className="font-display text-3xl md:text-4xl font-700 text-ink">Accommodation in {destinationName}</h2>
                  <p className="text-mist mt-4 max-w-2xl text-balance">
                    We&apos;ve analyzed {stayAreas.length} distinct neighborhoods in {destinationName}. Compare areas below to find the perfect match for your travel intent and preferred accommodation style.
                  </p>
                </div>
                
                <WhereToStayExplorer areas={stayAreas} destinationName={destinationName} />
                
                <div className="mt-8 text-center flex justify-center">
                  <Link href={`/guides/where-to-stay-in-${destinationQuery}`} className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-700 rounded-xl hover:bg-primary-dark transition-all shadow-sm">
                    Read the full guide to {destinationName} <ArrowRight size={16} />
                  </Link>
                </div>
              </>
            ) : destObj ? (
              <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm border border-gray-100 max-w-3xl mx-auto">
                <Compass size={40} className="text-ocean mx-auto mb-4 opacity-50" />
                <h2 className="font-display text-2xl font-700 text-ink mb-3">Planning a trip to {destObj.name}?</h2>
                <p className="text-mist mb-6 leading-relaxed text-balance">
                  Our editors are currently researching the best neighborhoods and accommodation styles for {destObj.name}. In the meantime, explore our destination overview or check out local activities.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href={`/destinations/${destObj.countrySlug}/${destObj.slug}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ocean text-white font-700 rounded-xl hover:bg-ocean-dark transition-colors">
                    Explore {destObj.name}
                  </Link>
                  <Link href="/guides" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-sand text-ink font-700 rounded-xl hover:bg-gray-100 transition-colors">
                    Browse all guides
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm border border-gray-100 max-w-3xl mx-auto">
                <Search size={40} className="text-mist mx-auto mb-4 opacity-50" />
                <h2 className="font-display text-2xl font-700 text-ink mb-3">Destination not found</h2>
                <p className="text-mist mb-6 text-balance">
                  We couldn&apos;t find a destination matching &quot;{destinationQuery}&quot;. Try searching for one of our featured destinations below.
                </p>
                <Link href="/hotels" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ocean text-white font-700 rounded-xl hover:bg-ocean-dark transition-colors">
                  Clear search
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust & Transparency */}
      <section className="py-10 bg-surface">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-xl text-ink font-700">How we help you choose</h2>
          <p className="text-mist mt-3 text-sm leading-relaxed">
            Sunward Travel helps travelers understand destinations and choose where to stay.
            Live booking options will be provided through eligible travel partners where available.
            Sunward Travel may earn affiliate commissions from eligible partner bookings.
          </p>
        </div>
      </section>

      {/* Pilot Destinations */}
      <section className="py-16 bg-sand">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-10 text-center">
            <SectionHeading align="center" heading="Featured Accommodation Guides" eyebrow="Where to Stay" />
            <p className="text-mist mt-3 max-w-2xl mx-auto">Explore our detailed guides to find the perfect neighborhood and accommodation style for your trip.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {POPULAR_DESTINATIONS.map((dest) => (
              <Link key={dest.city} href={`/hotels?destination=${dest.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.city}
                    fill sizes="(max-width:768px) 100vw, 33vw"
                    quality={70}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-700 text-ink">
                    {dest.tag}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-700 text-ink">Where to stay in {dest.city}</h3>
                  <p className="text-mist text-sm mt-2 flex-1">
                    Discover the best neighborhoods in {dest.city} for first-timers, budget travelers, and luxury seekers.
                  </p>
                  <div className="mt-4 flex items-center text-primary font-700 text-sm gap-1 group-hover:gap-2 transition-all">
                    Explore areas <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TipsContent
        heading="Accommodation Planning Tips"
        intro="Choosing the right place to stay is the most important decision for your trip. Here is how our editors approach accommodation planning."
        tips={HOTEL_TIPS}
      />
      
      <section className="py-8 bg-sand border-t border-gray-100">
        <div className="page-container">
          <AffiliateDisclosure />
        </div>
      </section>
    </>
  );
}
