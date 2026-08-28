import { ExternalLink, Car } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Your Car Rental — Sunward Travel',
  description: 'Compare car rental prices from Rentalcars, Kayak, DiscoverCars and Expedia.',
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

  const rentalcarsUrl  = `https://www.rentalcars.com/SearchResults.do?location=${encodeURIComponent(pickup)}&dropoffLocation=${encodeURIComponent(dropoff)}&affiliateCode=avisales1`;
  const kayakUrl       = `https://www.kayak.com/cars/${encodeURIComponent(pickup)}/${from}/${to}`;
  const discoverUrl    = `https://www.discovercars.com/search?location=${encodeURIComponent(pickup)}&fromDate=${from}&toDate=${to}`;
  const expediaUrl     = `https://www.expedia.com/carsearch?locn=${encodeURIComponent(pickup)}&d1=${from}&d2=${to}`;

  return (
    <main className="min-h-screen bg-sand">

      {/* Banner */}
      <div className="bg-gradient-to-r from-ocean to-ink text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-xs text-white/60 uppercase tracking-widest mb-3">Car rental search</p>
          <div className="flex items-start gap-3">
            <Car size={28} className="text-horizon mt-1 shrink-0" />
            <div>
              <h1 className="font-display font-700 text-3xl">
                {pickup || 'Car Rental'}
                {!sameLocation && dropoff && <span className="text-white/50"> → {dropoff}</span>}
              </h1>
              {from && to && (
                <p className="text-white/70 text-sm mt-1">
                  {formatDate(from)} → {formatDate(to)} · {days} day{days !== 1 ? 's' : ''}
                  {sameLocation ? ' · Same pick-up & drop-off' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">

        {/* Rentalcars.com — primary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-horizon text-ink text-[10px] font-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Best Rates</span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink text-lg">Rentalcars.com</p>
              <p className="text-sm text-mist mt-0.5">World&apos;s #1 car rental platform — 900+ companies, 60,000+ locations</p>
            </div>
            <a href={rentalcarsUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search Cars <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Kayak */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink">Kayak</p>
              <p className="text-sm text-mist mt-0.5">Compare hundreds of car rental deals in seconds</p>
            </div>
            <a href={kayakUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 border border-ocean text-ocean hover:bg-ocean hover:text-white font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* DiscoverCars */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink">DiscoverCars</p>
              <p className="text-sm text-mist mt-0.5">Full-to-full fuel policy, free cancellation, no hidden fees</p>
            </div>
            <a href={discoverUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 border border-gray-200 hover:border-ocean text-ink font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Expedia */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-700 text-ink">Expedia Cars</p>
              <p className="text-sm text-mist mt-0.5">Bundle with your hotel or flight for extra savings</p>
            </div>
            <a href={expediaUrl} target="_blank" rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 border border-gray-200 hover:border-ocean text-ink font-display font-700 text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Search <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <p className="text-center text-[10px] text-mist/60 pt-2">
          Sunward Travel earns a small commission when you book via our links — at no extra cost to you.{' '}
          <a href="/affiliate-disclosure" className="underline">Learn more</a>
        </p>
      </div>
    </main>
  );
}
