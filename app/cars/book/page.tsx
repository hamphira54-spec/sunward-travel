import { Car } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Your Car Rental - Sunward Travel',
  description: 'Search for car rentals.',
};

interface BookCarPageProps {
  searchParams: Promise<{
    pickup?:  string;
    dropoff?: string;
    from?:    string;
    to?:      string;
  }>;
}

function formatDate(d: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function BookCarPage({ searchParams }: BookCarPageProps) {
  const p      = await searchParams;
  const pickup  = p.pickup  ?? '';
  const dropoff = p.dropoff ?? pickup;
  const from    = p.from    ?? '';
  const to      = p.to      ?? '';

  const days = from && to
    ? Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000)
    : 0;

  const sameLocation = pickup === dropoff;

  return (
    <main className="min-h-screen bg-sand">
      {/* Banner */}
      <div className="bg-gradient-to-r from-ocean to-ink text-white pt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-3">Car rental search</p>
          <div className="flex items-start gap-3">
            <Car size={28} className="text-horizon mt-1 shrink-0" />
            <div>
              <h1 className="font-display font-700 text-3xl">
                {pickup || 'Car Rental'}
                {!sameLocation && dropoff && <span className="text-white/50">   {dropoff}</span>}
              </h1>
              {from && to && (
                <p className="text-white/70 text-sm mt-1">
                  {formatDate(from)}   {formatDate(to)}  {days} day{days !== 1 ? 's' : ''}
                  {sameLocation ? '  Same pick-up & drop-off' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-700 text-ink mb-4">Live Booking is Currently Gated</h2>
        <p className="text-mist max-w-2xl mx-auto leading-relaxed">
          Our editorial team is currently establishing the foundational traffic required to activate live commercial integrations for car rentals. Booking features will be unlocked once provider approvals are finalized.
        </p>
      </div>
    </main>
  );
}
