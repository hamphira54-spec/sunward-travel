import { ExternalLink, Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import { providerRegistry, HotelSearchInput } from '@/lib/hotels';

export const metadata: Metadata = {
  title: 'Book Your Hotel - Sunward Travel',
  description: 'Compare hotel prices across Hotellook, Booking.com, Hotels.com and Airbnb.', robots: { index: false },
};

interface BookHotelPageProps {
  searchParams: Promise<{
    destination?: string;
    checkin?:     string;
    checkout?:    string;
    adults?:      string;
    rooms?:       string;
  }>;
}

function formatDate(d: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function BookHotelPage({ searchParams }: BookHotelPageProps) {
  const p    = await searchParams;
  const dest = p.destination ?? '';
  const ci   = p.checkin     ?? '';
  const co   = p.checkout    ?? '';
  const adults = p.adults    ?? '2';
  const rooms  = p.rooms     ?? '1';

  const nights = ci && co
    ? Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86400000)
    : 0;

  // Utilize the new architecture boundary for building affiliate URLs
  const searchInput: HotelSearchInput = {
    destination: dest || 'Hotels',
    checkIn: ci ? new Date(ci) : undefined,
    checkOut: co ? new Date(co) : undefined,
    adults: parseInt(adults, 10) || 2,
    rooms: parseInt(rooms, 10) || 1,
  };

  const hotellookProvider = providerRegistry.getProvider('hotellook');
  const bookingProvider = providerRegistry.getProvider('booking');
  const hotelsComProvider = providerRegistry.getProvider('hotelscom');
  const airbnbProvider = providerRegistry.getProvider('airbnb');

  const hotellookUrl = hotellookProvider?.buildSearchUrl(searchInput) || '#';
  const bookingUrl = bookingProvider?.buildSearchUrl(searchInput) || '#';
  const hotelsComUrl = hotelsComProvider?.buildSearchUrl(searchInput) || '#';
  const airbnbUrl = airbnbProvider?.buildSearchUrl(searchInput) || '#';

  return (
    <main className="min-h-screen bg-sand">

      {/* Banner */}
      <div className="bg-gradient-to-r from-ocean to-ink text-white pt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-3">Hotel search</p>
          <div className="flex items-start gap-3">
            <Building2 size={28} className="text-horizon mt-1 shrink-0" />
            <div>
              <h1 className="font-display font-700 text-3xl">{dest || 'Hotels'}</h1>
              {ci && co && (
                <p className="text-white/70 text-sm mt-1">
                  {formatDate(ci)} — {formatDate(co)} • {nights} night{nights !== 1 ? 's' : ''} • {adults} guest{Number(adults) > 1 ? 's' : ''} • {rooms} room{Number(rooms) > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking options */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">

        {/* Hotellook - primary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-horizon text-ink text-[10px] font-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Best Rates</span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink text-lg">Hotellook</p>
              <p className="text-sm text-mist mt-0.5">Compares 50+ booking sites - lowest price guaranteed</p>
            </div>
            <a href={hotellookUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search Hotels <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Booking.com */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink">Booking.com</p>
              <p className="text-sm text-mist mt-0.5">World&apos;s largest hotel platform — free cancellation on most rooms</p>
            </div>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 border border-ocean text-ocean hover:bg-ocean hover:text-white font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Hotels.com */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink">Hotels.com</p>
              <p className="text-sm text-mist mt-0.5">Earn free nights - 1 free night for every 10 booked</p>
            </div>
            <a href={hotelsComUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 border border-gray-200 hover:border-ocean text-ink font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Airbnb */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink">Airbnb</p>
              <p className="text-sm text-mist mt-0.5">Apartments, villas & unique stays - great for groups and longer trips</p>
            </div>
            <a href={airbnbUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-200 hover:border-ocean text-ink font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <p className="text-center text-[10px] text-mist/60 pt-2">
          Sunward Travel earns a small commission when you book via our links - at no extra cost to you.{' '}
          <a href="/affiliate-disclosure" className="underline">Learn more</a>
        </p>
      </div>
    </main>
  );
}
