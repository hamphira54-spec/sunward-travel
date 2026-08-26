'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, ArrowLeftRight, Users, Calendar } from 'lucide-react';
import AirportInput from './AirportInput';
import type { Airport, TripType } from '@/lib/types/flights';

// Today + 30 days as default depart, +7 as default return
function defaultDates() {
  const today  = new Date();
  const depart = new Date(today);
  depart.setDate(today.getDate() + 30);
  const ret = new Date(depart);
  ret.setDate(depart.getDate() + 7);
  return {
    depart: depart.toISOString().slice(0, 10),
    ret:    ret.toISOString().slice(0, 10),
  };
}

export default function FlightSearchForm() {
  const router = useRouter();
  const dates  = defaultDates();

  const [origin,      setOrigin]      = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departDate,  setDepartDate]  = useState(dates.depart);
  const [returnDate,  setReturnDate]  = useState(dates.ret);
  const [tripType,    setTripType]    = useState<TripType>('roundtrip');
  const [adults,      setAdults]      = useState(1);
  const [error,       setError]       = useState('');

  const swapAirports = () => {
    const prev = origin;
    setOrigin(destination);
    setDestination(prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!origin)      { setError('Please select an origin airport.');      return; }
    if (!destination) { setError('Please select a destination airport.');  return; }
    if (origin.iata === destination.iata) {
      setError('Origin and destination cannot be the same.');
      return;
    }
    if (!departDate) { setError('Please select a departure date.'); return; }
    if (tripType === 'roundtrip' && !returnDate) {
      setError('Please select a return date.');
      return;
    }

    const params = new URLSearchParams({
      origin:      origin.iata,
      destination: destination.iata,
      departDate,
      adults:      String(adults),
      tripType,
      currency:    'USD',
    });
    if (tripType === 'roundtrip' && returnDate) {
      params.set('returnDate', returnDate);
    }

    router.push(`/flights/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4" aria-label="Flight search form">
      {/* Trip type toggle */}
      <div className="flex items-center gap-3">
        {(['roundtrip', 'oneway'] as TripType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTripType(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              tripType === type
                ? 'bg-ocean text-white'
                : 'bg-gray-100 text-mist hover:bg-gray-200'
            }`}
          >
            <Plane size={11} className={type === 'roundtrip' ? '' : 'rotate-45'} />
            {type === 'roundtrip' ? 'Round trip' : 'One way'}
          </button>
        ))}
        {/* Passengers */}
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-ink">
          <Users size={12} className="text-mist" />
          <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-4 h-4 flex items-center justify-center text-mist hover:text-ocean" aria-label="Decrease adults">−</button>
          <span>{adults} {adults === 1 ? 'adult' : 'adults'}</span>
          <button type="button" onClick={() => setAdults(Math.min(9, adults + 1))} className="w-4 h-4 flex items-center justify-center text-mist hover:text-ocean" aria-label="Increase adults">+</button>
        </div>
      </div>

      {/* Origin / Destination */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <AirportInput
          id="origin"
          label="From"
          placeholder="City or airport"
          value={origin}
          onChange={setOrigin}
        />
        {/* Swap button */}
        <button
          type="button"
          onClick={swapAirports}
          aria-label="Swap origin and destination"
          className="h-10 w-10 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center hover:border-ocean hover:text-ocean transition-colors self-end mb-0.5"
        >
          <ArrowLeftRight size={15} />
        </button>
        <AirportInput
          id="destination"
          label="To"
          placeholder="City or airport"
          value={destination}
          onChange={setDestination}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="departDate" className="block text-xs font-semibold text-ink/60 mb-1.5 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Calendar size={11} /> Departure</span>
          </label>
          <input
            id="departDate"
            type="date"
            value={departDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDepartDate(e.target.value)}
            className="w-full px-3 py-3 rounded-lg border border-gray-200 bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/40 focus:border-ocean transition-colors"
          />
        </div>
        {tripType === 'roundtrip' && (
          <div>
            <label htmlFor="returnDate" className="block text-xs font-semibold text-ink/60 mb-1.5 uppercase tracking-wider">
              <span className="flex items-center gap-1"><Calendar size={11} /> Return</span>
            </label>
            <input
              id="returnDate"
              type="date"
              value={returnDate}
              min={departDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-3 py-3 rounded-lg border border-gray-200 bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/40 focus:border-ocean transition-colors"
            />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="text-xs text-coral font-medium px-1">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 rounded-lg bg-ocean text-white font-700 text-sm hover:bg-ocean-dark active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <Plane size={16} />
        Search Flights
      </button>
    </form>
  );
}
