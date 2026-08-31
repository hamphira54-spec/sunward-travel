import { Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import { providerRegistry, HotelSearchInput } from '@/lib/hotels';

export const metadata: Metadata = {
  title: 'Book Your Hotel - Sunward Travel',
  description: 'Search for hotels.',
  robots: { index: false },
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
                  {formatDate(ci)} - {formatDate(co)}   {nights} night{nights !== 1 ? 's' : ''}   {adults} guest{Number(adults) > 1 ? 's' : ''}   {rooms} room{Number(rooms) > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking options */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-700 text-ink mb-4">Live Booking is Currently Gated</h2>
        <p className="text-mist max-w-2xl mx-auto leading-relaxed">
          Our editorial team is currently establishing the foundational traffic required to activate live commercial integrations for this destination. Booking features will be unlocked once provider approvals are finalized.
        </p>
      </div>
    </main>
  );
}
