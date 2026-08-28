import { Search, ExternalLink } from 'lucide-react';

interface BookingWidgetProps {
  origin?:      string;
  destination?: string;
  departDate?:  string;
  returnDate?:  string;
  adults?:      number;
}

/**
 * Renders a "Search more options" panel that deep-links into Aviasales
 * with the route pre-filled. The tpwdg.com search widget requires separate
 * Travelpayouts approval — until then this provides a reliable fallback.
 */
export default function BookingWidget({
  origin      = '',
  destination = '',
  departDate  = '',
  returnDate  = '',
  adults      = 1,
}: BookingWidgetProps) {
  // Build Aviasales deep-link for this specific route
  function toDDMM(date: string): string {
    const p = date.split('-');
    return p.length === 3 ? p[2] + p[1] : '';
  }

  const dep  = toDDMM(departDate);
  const ret  = toDDMM(returnDate);
  const path = origin && destination && dep
    ? `${origin}${dep}${destination}${ret}/${adults}`
    : '';

  const aviasalesUrl = path
    ? `https://www.aviasales.com/search/${path}?marker=769903&trs=566794`
    : `https://www.aviasales.com/?marker=769903&trs=566794`;

  // Alternative search links
  const googleFlightsUrl = origin && destination && departDate
    ? `https://www.google.com/flights?hl=en#flt=${origin}.${destination}.${departDate}${returnDate ? `*${destination}.${origin}.${returnDate}` : ''};c:USD;e:1;sd:1;t:f`
    : 'https://www.google.com/flights';

  const skyscannerUrl = origin && destination && departDate
    ? `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${departDate.replace(/-/g,'').slice(2)}/${returnDate ? returnDate.replace(/-/g,'').slice(2) : ''}/?adults=${adults}`
    : 'https://www.skyscanner.com';

  return (
    <div className="space-y-4">

      {/* Primary CTA */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-ocean/10 rounded-lg flex items-center justify-center">
            <Search size={16} className="text-ocean" />
          </div>
          <div>
            <p className="font-display font-700 text-ink text-sm">Search all available flights</p>
            <p className="text-xs text-mist">Compare prices across 1,000+ airlines</p>
          </div>
        </div>
        <a
          href={aviasalesUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="w-full flex items-center justify-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-display font-700 py-3 px-6 rounded-xl transition-colors text-sm"
        >
          Search on Aviasales <ExternalLink size={13} />
        </a>
        <p className="text-center text-[10px] text-mist mt-2">
          You&apos;ll see all airlines, prices & times — powered by Aviasales
        </p>
      </div>

      {/* Alternative search engines */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-600 text-mist uppercase tracking-widest mb-3">
          Also check on
        </p>
        <div className="grid grid-cols-2 gap-3">
          <a
            href={googleFlightsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-gray-200 hover:border-ocean/40 hover:bg-ocean/4 text-ink text-xs font-600 py-2.5 px-4 rounded-lg transition-colors"
          >
            Google Flights
          </a>
          <a
            href={skyscannerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-gray-200 hover:border-ocean/40 hover:bg-ocean/4 text-ink text-xs font-600 py-2.5 px-4 rounded-lg transition-colors"
          >
            Skyscanner
          </a>
        </div>
      </div>

      <p className="text-center text-[10px] text-mist/60 px-4">
        Sunward Travel earns a small commission when you book via our links — at no extra cost to you.
        <a href="/affiliate-disclosure" className="underline ml-1">Learn more</a>
      </p>

    </div>
  );
}
