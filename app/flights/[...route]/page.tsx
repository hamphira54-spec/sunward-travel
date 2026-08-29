import Link from 'next/link';
import { ArrowRight, ExternalLink, Plane } from 'lucide-react';
import { findAirport } from '@/lib/data/airports';
import type { Metadata } from 'next';

// ── URL parser ─────────────────────────────────────────────────────────────────
// Aviasales widget generates paths like: PNH0409SYD1109100
//   PNH  = origin IATA (3)
//   0409 = depart DD+MM (4)
//   SYD  = destination IATA (3)
//   1109 = return  DD+MM (4, optional)
//   1    = adults (1 char)
//   00   = children etc. (ignored)

function isoFromDDMM(dd: string, mm: string, ref: Date): string {
  const day   = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  let   year  = ref.getFullYear();
  const d = new Date(year, month - 1, day);
  if (d < ref) year++; // past date → bump to next year
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseCode(code: string): {
  origin: string; destination: string;
  departDate: string; returnDate?: string; adults: number;
} | null {
  // Need at least: 3 + 4 + 3 = 10 chars
  if (code.length < 10) return null;
  const now  = new Date();
  const orig = code.slice(0, 3).toUpperCase();
  const dest = code.slice(7, 10).toUpperCase();
  const departDate = isoFromDDMM(code.slice(3, 5), code.slice(5, 7), now);
  const depDate    = new Date(departDate);

  let returnDate: string | undefined;
  let adults = 1;
  const rest = code.slice(10); // e.g. "1109100"

  if (rest.length >= 4) {
    const retDay   = parseInt(rest.slice(0, 2), 10);
    const retMonth = parseInt(rest.slice(2, 4), 10);
    if (retDay >= 1 && retDay <= 31 && retMonth >= 1 && retMonth <= 12) {
      returnDate = isoFromDDMM(rest.slice(0, 2), rest.slice(2, 4), depDate);
    }
    if (rest.length > 4) {
      const a = parseInt(rest[4], 10);
      if (!isNaN(a) && a >= 1 && a <= 9) adults = a;
    }
  }

  return { origin: orig, destination: dest, departDate, returnDate, adults };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

// ── Booking URL builders ───────────────────────────────────────────────────────

function toAviasales(origin: string, dest: string, depart: string, ret?: string, adults = 1) {
  const toDDMM = (d: string) => d.slice(8, 10) + d.slice(5, 7);
  const path   = `${origin}${toDDMM(depart)}${dest}${ret ? toDDMM(ret) : ''}/${adults}`;
  return `https://www.aviasales.com/search/${path}?marker=769903&trs=566794`;
}

function toGoogleFlights(origin: string, dest: string, depart: string, ret?: string) {
  const base = `https://www.google.com/flights?hl=en#flt=${origin}.${dest}.${depart}`;
  return ret ? `${base}*${dest}.${origin}.${ret};c:USD;e:1;sd:1;t:f` : `${base};c:USD;e:1;sd:1;t:f`;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ route: string[] }>;
}): Promise<Metadata> {
  const { route } = await params;
  const code      = route.join('');
  const parsed    = parseCode(code);
  if (!parsed) return { title: 'Book Flight — Sunward Travel' };
  const { origin, destination, departDate } = parsed;
  return {
    title: `${origin} → ${destination} ${formatDate(departDate)} — Sunward Travel`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function FlightRouteBookingPage({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const { route } = await params;
  const code      = route.join('');
  const parsed    = parseCode(code);

  // Fallback if code cannot be parsed
  if (!parsed) {
    return (
      <main className="min-h-screen bg-sand flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-display font-700 text-ink text-2xl mb-2">Route not found</p>
          <p className="text-mist mb-6">We couldn&apos;t parse this flight route.</p>
          <Link href="/flights" className="inline-flex items-center gap-2 bg-interactive text-white font-display font-700 px-5 py-2.5 rounded-xl">
            ← Search Flights
          </Link>
        </div>
      </main>
    );
  }

  const { origin, destination, departDate, returnDate, adults } = parsed;
  const originAirport = findAirport(origin);
  const destAirport   = findAirport(destination);
  const aviasalesUrl  = toAviasales(origin, destination, departDate, returnDate, adults);
  const googleUrl     = toGoogleFlights(origin, destination, departDate, returnDate);
  const skyscannerUrl = `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${departDate.replace(/-/g, '').slice(2)}/${returnDate ? returnDate.replace(/-/g, '').slice(2) : ''}/?adults=${adults}`;

  const nights = returnDate
    ? Math.round((new Date(returnDate).getTime() - new Date(departDate).getTime()) / 86400000)
    : null;

  return (
    <main className="min-h-screen bg-sand">

      {/* Banner — pt-16 clears the fixed navbar */}
      <div className="bg-gradient-to-r from-ocean to-ink text-white pt-16">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-3">Complete your booking</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-3xl leading-none">
                {originAirport?.city ?? origin}
              </p>
              <p className="text-sm text-white/60 mt-1">{origin} · {originAirport?.name ?? ''}</p>
            </div>
            <ArrowRight size={24} className="text-horizon shrink-0" />
            <div>
              <p className="font-display font-700 text-3xl leading-none">
                {destAirport?.city ?? destination}
              </p>
              <p className="text-sm text-white/60 mt-1">{destination} · {destAirport?.name ?? ''}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-display font-700 text-lg text-white">{formatDate(departDate)}</p>
              {returnDate && <p className="text-sm text-white/70">↩ {formatDate(returnDate)}</p>}
            </div>
          </div>
          <p className="text-sm text-white/50 mt-3">
            {returnDate ? `${nights} nights · ` : 'One-way · '}{adults} adult{adults > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">

        {/* Aviasales — primary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-horizon text-ink text-[10px] font-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
              Best Prices
            </span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink text-lg">Aviasales</p>
              <p className="text-sm text-mist mt-0.5">Compare 1,000+ airlines — lowest guaranteed fare for this route</p>
            </div>
            <a href={aviasalesUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Book on Aviasales <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Google Flights */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink">Google Flights</p>
              <p className="text-sm text-mist mt-0.5">Compare all options and track price changes for this route</p>
            </div>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-ocean text-ocean hover:bg-ocean hover:text-white font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Skyscanner */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink">Skyscanner</p>
              <p className="text-sm text-mist mt-0.5">Flexible date search — find the cheapest day to fly</p>
            </div>
            <a href={skyscannerUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-200 hover:border-ocean text-ink font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Search again link */}
        <div className="text-center pt-2">
          <Link href="/flights" className="inline-flex items-center gap-2 text-sm text-ocean hover:underline">
            <Plane size={13} /> Search a different route
          </Link>
        </div>

        <p className="text-center text-[10px] text-mist/60">
          Sunward Travel earns a small commission on bookings via our links — at no extra cost to you.{' '}
          <a href="/affiliate-disclosure" className="underline">Learn more</a>
        </p>
      </div>
    </main>
  );
}
