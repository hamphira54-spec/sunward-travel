'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import FlightResultCard from './FlightResultCard';
import type { FlightResult, FlightSearchResponse } from '@/lib/types/flights';
import { findAirport } from '@/lib/data/airports';

type SortKey = 'price' | 'duration' | 'stops';

interface FlightResultsListProps {
  data: FlightSearchResponse;
}

export default function FlightResultsList({ data }: FlightResultsListProps) {
  const [sortBy,    setSortBy]    = useState<SortKey>('price');
  const [maxStops,  setMaxStops]  = useState<number>(2);
  const [maxPrice,  setMaxPrice]  = useState<number>(99999);

  const { results, searchParams, isMockData } = data;
  const adults = searchParams.adults;

  const originAirport = findAirport(searchParams.origin);
  const destAirport   = findAirport(searchParams.destination);

  const priceRange = useMemo(() => ({
    min: Math.min(...results.map((r) => r.price)),
    max: Math.max(...results.map((r) => r.price)),
  }), [results]);

  const filtered = useMemo(() => {
    return results
      .filter((r) => r.transfers <= maxStops && r.price <= (maxPrice || 99999))
      .sort((a, b) => {
        if (sortBy === 'price')    return a.price    - b.price;
        if (sortBy === 'duration') return a.duration - b.duration;
        if (sortBy === 'stops')    return a.transfers - b.transfers;
        return 0;
      });
  }, [results, sortBy, maxStops, maxPrice]);

  return (
    <div>
      {/* Search summary */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-display font-700 text-xl text-ink">
            {originAirport?.city ?? searchParams.origin}
            {' → '}
            {destAirport?.city ?? searchParams.destination}
          </h2>
          <p className="text-xs text-mist mt-0.5">
            {searchParams.departDate}
            {searchParams.returnDate ? ` – ${searchParams.returnDate}` : ''}
            {' · '}
            {adults} {adults === 1 ? 'adult' : 'adults'}
            {' · '}
            <span className="font-medium">{filtered.length}</span> of {results.length} results
          </p>
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-mist" />
          {(['price', 'duration', 'stops'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortBy === key
                  ? 'bg-ocean text-white'
                  : 'bg-white text-mist border border-gray-200 hover:border-ocean hover:text-ocean'
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-4 mb-5 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <span className="text-mist font-medium">Max stops:</span>
          {[0, 1, 2].map((n) => (
            <button
              key={n}
              onClick={() => setMaxStops(n)}
              className={`px-2.5 py-1 rounded-full border transition-all ${
                maxStops === n
                  ? 'bg-ocean border-ocean text-white'
                  : 'border-gray-200 text-mist hover:border-ocean'
              }`}
            >
              {n === 0 ? 'Direct' : `${n}+`}
            </button>
          ))}
          {maxStops < 2 && (
            <button
              onClick={() => setMaxStops(2)}
              className="text-ocean underline text-[11px]"
            >
              Show all
            </button>
          )}
        </div>
        {priceRange.max > priceRange.min && (
          <div className="flex items-center gap-2">
            <span className="text-mist font-medium">Max price:</span>
            <span className="text-ink font-700">
              ${maxPrice >= priceRange.max ? 'Any' : maxPrice}
            </span>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={10}
              value={Math.min(maxPrice, priceRange.max)}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-ocean"
              aria-label="Maximum price filter"
            />
          </div>
        )}
      </div>

      {/* Mock data notice */}
      {isMockData && (
        <div className="mb-5 px-4 py-3 rounded-lg bg-horizon/12 border border-horizon/25 text-xs text-ink/70">
          {data.apiError === 'no_token' ? (
            <><strong>No API token:</strong> Set <code className="font-mono bg-white/60 px-1 rounded">TRAVELPAYOUTS_API_TOKEN</code> in Vercel environment variables.</>
          ) : (
            <><strong>API unavailable:</strong> Could not load live prices for this route — showing sample data.{data.apiError ? <> ({data.apiError})</> : null}</>
          )}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-4xl mb-3">✈️</p>
          <p className="font-display font-700 text-lg text-ink mb-1">No flights found</p>
          <p className="text-sm text-mist">Try adjusting your filters, or search a different date range.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((result: FlightResult) => (
            <FlightResultCard key={result.id} result={result} adults={adults} />
          ))}
        </div>
      )}

      {/* Affiliate note */}
      <p className="mt-6 text-[10px] text-mist/60 text-center">
        Prices shown are indicative. Clicking &quot;Book&quot; opens the partner&apos;s site — Sunward Travel earns a commission at no cost to you.{' '}
        <a href="/affiliate-disclosure" className="underline hover:text-mist transition-colors">Disclosure</a>
      </p>
    </div>
  );
}
