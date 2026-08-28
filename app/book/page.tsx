import { Suspense }   from 'react';
import { ArrowRight } from 'lucide-react';
import BookingWidget   from '@/components/booking/BookingWidget';
import { findAirport } from '@/lib/data/airports';

interface BookPageProps {
  searchParams: Promise<{
    origin?:      string;
    destination?: string;
    depart?:      string;
    return?:      string;
    adults?:      string;
    price?:       string;
    airline?:     string;
    booking?:     string; // URI-encoded Aviasales deep-link
  }>;
}

export const metadata = {
  title: 'Book Your Flight — Sunward Travel',
  description: 'Search and book cheap flights with Sunward Travel.',
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const p        = await searchParams;
  const origin      = p.origin      ?? '';
  const destination = p.destination ?? '';
  const depart      = p.depart      ?? '';
  const ret         = p.return      ?? '';
  const adults      = parseInt(p.adults ?? '1');
  const price       = p.price   ? parseInt(p.price)   : null;
  const airline     = p.airline ?? '';
  const bookingUrl  = p.booking ? decodeURIComponent(p.booking) : '';

  const originAirport = findAirport(origin);
  const destAirport   = findAirport(destination);

  const hasContext = origin && destination;

  return (
    <main className="min-h-screen bg-sand">

      {/* ── Flight summary banner ── */}
      {hasContext && (
        <div className="bg-gradient-to-r from-ocean to-ink text-white">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <p className="text-xs text-white/60 uppercase tracking-widest mb-3 font-500">
              Complete your booking
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <p className="font-display font-700 text-3xl leading-none">
                  {originAirport?.city ?? origin}
                </p>
                <p className="text-sm text-white/60 mt-1">{origin}</p>
              </div>
              <ArrowRight size={24} className="text-horizon shrink-0" />
              <div>
                <p className="font-display font-700 text-3xl leading-none">
                  {destAirport?.city ?? destination}
                </p>
                <p className="text-sm text-white/60 mt-1">{destination}</p>
              </div>
              <div className="ml-auto text-right">
                {price && (
                  <p className="font-display font-700 text-2xl text-horizon">
                    from ${price}
                  </p>
                )}
                {airline && <p className="text-sm text-white/60">{airline}</p>}
              </div>
            </div>
            {depart && (
              <p className="text-sm text-white/50 mt-3">
                {depart}{ret ? ` → ${ret}` : ''} · {adults} adult{adults > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Direct booking shortcut ── */}
      {bookingUrl && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-600 text-ink text-sm">Book this exact flight</p>
              <p className="text-xs text-mist mt-0.5">Opens Aviasales to complete payment securely</p>
            </div>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 bg-horizon hover:bg-horizon-dark text-ink font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0"
            >
              Book on Aviasales <ArrowRight size={14} />
            </a>
          </div>
          <p className="text-xs text-mist mt-3 mb-1 font-500">Or search for more options below ↓</p>
        </div>
      )}

      {/* ── Travelpayouts search widget ── */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Suspense
          fallback={
            <div className="h-48 bg-surface rounded-2xl animate-pulse" />
          }
        >
          <BookingWidget
            origin={origin}
            destination={destination}
            departDate={depart}
            returnDate={ret}
            adults={adults}
          />
        </Suspense>
      </div>

    </main>
  );
}
