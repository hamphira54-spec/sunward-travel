import { ExternalLink, Plane, Clock, ArrowRight } from 'lucide-react';
import type { FlightResult } from '@/lib/types/flights';
import { findAirport } from '@/lib/data/airports';

interface FlightResultCardProps {
  result: FlightResult;
  adults: number;
}

function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '--:--';
  }
}

/** Shows time only if we have exact time info; otherwise shows the date */
function formatTimeOrDate(isoString: string, hasExactTime?: boolean): string {
  if (!hasExactTime) return formatDate(isoString);
  return formatTime(isoString);
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return '';
  }
}

function StopsLabel({ stops }: { stops: number }) {
  if (stops === 0) return (
    <span className="text-xs font-semibold text-ocean">Direct</span>
  );
  return (
    <span className="text-xs text-mist">
      {stops} stop{stops > 1 ? 's' : ''}
    </span>
  );
}

export default function FlightResultCard({ result, adults }: FlightResultCardProps) {
  const originAirport = findAirport(result.origin);
  const destAirport   = findAirport(result.destination);
  const totalPrice    = result.price * adults;

  return (
    <article className="bg-white rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Airline */}
          <div className="flex items-center gap-3 min-w-[140px]">
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
              {result.airline ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://pics.avs.io/40/40/${result.airline}.png`}
                  alt={result.airlineName}
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.style.display = 'none';
                    const parent = t.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-ocean text-xs font-700">${result.airline}</span>`;
                    }
                  }}
                />
              ) : (
                <Plane size={18} className="text-ocean" />
              )}
            </div>
            <div>
              <p className="font-display font-700 text-sm text-ink">{result.airlineName}</p>
              {result.airline && <p className="text-xs text-mist">{result.airline}</p>}
            </div>
          </div>


          {/* Outbound flight segment */}
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="text-center">
              <p className="font-display font-700 text-lg text-ink leading-none">
                {formatTimeOrDate(result.departureAt, result.hasExactTime)}
              </p>
              <p className="text-xs text-mist mt-0.5">{result.origin}</p>
              {result.hasExactTime && (
                <p className="text-[10px] text-mist/70">{formatDate(result.departureAt)}</p>
              )}
            </div>

            <div className="flex-1 flex flex-col items-center gap-0.5 min-w-[80px]">
              {result.duration > 0 && (
                <p className="text-[10px] text-mist flex items-center gap-1">
                  <Clock size={9} />{formatDuration(result.duration)}
                </p>
              )}
              <div className="w-full flex items-center gap-1">
                <div className="h-px flex-1 bg-gray-200" />
                <Plane size={10} className="text-mist rotate-45 shrink-0" />
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <StopsLabel stops={result.transfers} />
            </div>

            <div className="text-center">
              <p className="font-display font-700 text-lg text-ink leading-none">
                {result.returnAt ? formatTime(result.returnAt.replace(result.returnAt.slice(0,10), result.departureAt.slice(0,10))) : '--:--'}
              </p>
              <p className="text-xs text-mist mt-0.5">{result.destination}</p>
              <p className="text-[10px] text-mist/70">{formatDate(result.departureAt)}</p>
            </div>
          </div>

          {/* Return segment (if round-trip) */}
          {result.returnAt && (
            <>
              <div className="hidden sm:flex items-center text-mist/40">
                <ArrowRight size={14} />
              </div>
              <div className="hidden sm:flex items-center gap-2 min-w-[140px]">
                <div className="text-center">
                  <p className="font-display font-700 text-sm text-ink/70 leading-none">
                    {formatTime(result.returnAt)}
                  </p>
                  <p className="text-[10px] text-mist mt-0.5">{result.destination}→{result.origin}</p>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <p className="text-[10px] text-mist">{result.returnDuration ? formatDuration(result.returnDuration) : ''}</p>
                  <StopsLabel stops={result.returnTransfers ?? 0} />
                </div>
              </div>
            </>
          )}

          {/* Price + CTA */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <p className="font-display font-700 text-2xl text-ink leading-none">
                ${totalPrice.toLocaleString()}
              </p>
              {adults > 1 && (
                <p className="text-[10px] text-mist">${result.price}/person</p>
              )}
              <p className="text-[10px] text-mist capitalize">{result.currency}</p>
            </div>
            <a
              href={`/book?origin=${result.origin}&destination=${result.destination}&depart=${result.departureAt.slice(0,10)}${result.returnAt ? `&return=${result.returnAt.slice(0,10)}` : ''}&adults=${adults}&price=${result.price}&airline=${encodeURIComponent(result.airlineName)}&booking=${encodeURIComponent(result.bookingUrl)}`}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-horizon text-ink text-xs font-700 hover:bg-horizon-dark transition-colors shadow-sm whitespace-nowrap"
              aria-label={`Book ${result.airlineName} for $${totalPrice}`}
            >
              Book →
            </a>
            <p className="text-[9px] text-mist/60">Powered by Travelpayouts</p>
          </div>


        </div>
      </div>

      {/* Airport full names bar */}
      {(originAirport || destAirport) && (
        <div className="px-5 py-2 bg-surface/60 border-t border-gray-100 flex items-center gap-1 text-[10px] text-mist">
          <span>{originAirport?.name ?? result.origin}</span>
          <span className="mx-1 text-mist/40">→</span>
          <span>{destAirport?.name ?? result.destination}</span>
        </div>
      )}
    </article>
  );
}
