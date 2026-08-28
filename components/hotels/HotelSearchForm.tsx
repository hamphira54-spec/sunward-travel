'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Search } from 'lucide-react';

function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
}

export default function HotelSearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [checkIn,     setCheckIn]     = useState(daysFromNow(1));
  const [checkOut,    setCheckOut]    = useState(daysFromNow(8));
  const [guests,      setGuests]      = useState('2-1'); // adults-rooms
  const [error,       setError]       = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!destination.trim()) {
      setError('Please enter a destination or hotel name.');
      return;
    }
    const [adults, rooms] = guests.split('-');
    const params = new URLSearchParams({
      destination: destination.trim(),
      checkin:  checkIn,
      checkout: checkOut,
      adults,
      rooms,
    });
    router.push(`/hotels/book?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4" aria-label="Hotel search form">

      {/* Destination */}
      <div>
        <label className="block text-[10px] font-600 text-ink/50 uppercase tracking-widest mb-1.5">
          <span className="flex items-center gap-1"><MapPin size={10} /> Destination / Hotel name</span>
        </label>
        <input
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          placeholder="City, region or hotel name — e.g. Bangkok, Bali, Marriott Tokyo"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-mist/50 focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition-colors"
        />
      </div>

      {/* Dates + Guests row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Check-in */}
        <div>
          <label className="block text-[10px] font-600 text-ink/50 uppercase tracking-widest mb-1.5">
            <span className="flex items-center gap-1"><Calendar size={10} /> Check-in</span>
          </label>
          <input
            type="date"
            value={checkIn}
            min={daysFromNow(0)}
            onChange={e => setCheckIn(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition-colors"
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-[10px] font-600 text-ink/50 uppercase tracking-widest mb-1.5">
            <span className="flex items-center gap-1"><Calendar size={10} /> Check-out</span>
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={e => setCheckOut(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition-colors"
          />
        </div>

        {/* Guests */}
        <div>
          <label className="block text-[10px] font-600 text-ink/50 uppercase tracking-widest mb-1.5">
            <span className="flex items-center gap-1"><Users size={10} /> Guests &amp; Rooms</span>
          </label>
          <select
            value={guests}
            onChange={e => setGuests(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition-colors bg-white"
          >
            <option value="1-1">1 adult · 1 room</option>
            <option value="2-1">2 adults · 1 room</option>
            <option value="2-2">2 adults · 2 rooms</option>
            <option value="3-1">3 adults · 1 room</option>
            <option value="4-2">4 adults · 2 rooms</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p role="alert" className="text-xs text-red-500 font-medium px-1">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-ocean hover:bg-ocean-dark text-white font-display font-700 text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
      >
        <Search size={16} /> Search Hotels
      </button>
    </form>
  );
}
