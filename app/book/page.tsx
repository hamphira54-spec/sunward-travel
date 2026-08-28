import { Suspense }                       from 'react';
import { ArrowRight, ExternalLink, Info } from 'lucide-react';
import BookingWidget                       from '@/components/booking/BookingWidget';
import { findAirport }                     from '@/lib/data/airports';

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
  const p           = await searchParams;
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
  const hasContext    = origin && destination;

  return (
    <main className="min-h-screen bg-sand">

      {/* ── Banner — pt-16 clears the fixed h-16 navbar ── */}
      <div className="bg-gradient-to-r from-ocean to-ink text-white pt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {hasContext ? (
            <>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4 font-600">
                Complete your booking
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Origin */}
                <div>
                  <p className="font-display font-700 text-3xl sm:text-4xl leading-none">
                    {originAirport?.city ?? origin}
                  </p>
                  <p className="text-sm text-white/50 mt-1">{origin} · {originAirport?.name ?? ''}</p>
                </div>

                <ArrowRight size={22} className="text-horizon shrink-0" />

                {/* Destination */}
                <div>
                  <p className="font-display font-700 text-3xl sm:text-4xl leading-none">
                    {destAirport?.city ?? destination}
                  </p>
                  <p className="text-sm text-white/50 mt-1">{destination} · {destAirport?.name ?? ''}</p>
                </div>

                {/* Price */}
                {price && (
                  <div className="ml-auto text-right">
                    <p className="font-display font-700 text-2xl text-horizon">from ${price}</p>
                    {airline && <p className="text-xs text-white/50 mt-0.5">{airline}</p>}
                  </div>
                )}
              </div>

              {/* Date + pax row */}
              {depart && (
                <p className="text-sm text-white/40 mt-3">
                  {depart}{ret ? ` → ${ret}` : ''} · {adults} adult{adults > 1 ? 's' : ''}
                </p>
              )}
            </>
          ) : (
            <p className="font-display font-700 text-2xl">Find your flight</p>
          )}
        </div>
      </div>

      {/* ── Redirect notice banner ── */}
      <div className="bg-horizon/15 border-b border-horizon/30">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-2.5">
          <Info size={15} className="text-ocean shrink-0" />
          <p className="text-xs text-ink font-500">
            Booking links on this page open <strong>Aviasales.com</strong> in a new tab — a trusted partner where you complete payment securely.
            Sunward Travel earns a small commission at no extra cost to you.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">

        {/* Direct booking shortcut */}
        {bookingUrl && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-display font-700 text-ink">Book this exact flight</p>
                <p className="text-sm text-mist mt-0.5">
                  Opens Aviasales in a new tab — secure checkout, no hidden fees
                </p>
              </div>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 bg-horizon hover:bg-horizon-dark text-ink font-display font-700 text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0"
              >
                Book on Aviasales <ExternalLink size={14} />
              </a>
            </div>
            {/* Redirect warning strip */}
            <div className="bg-sand border-t border-gray-100 px-5 py-2.5 flex items-center gap-2">
              <ExternalLink size={11} className="text-mist shrink-0" />
              <p className="text-[11px] text-mist">
                You will be redirected to <span className="font-600 text-ink">aviasales.com</span> to complete your booking
              </p>
            </div>
          </div>
        )}

        {bookingUrl && (
          <p className="text-xs text-mist text-center font-500">
            Or search for more options below ↓
          </p>
        )}

        {/* Search widget (Aviasales + Google Flights + Skyscanner) */}
        <Suspense fallback={<div className="h-48 bg-surface rounded-2xl animate-pulse" />}>
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
