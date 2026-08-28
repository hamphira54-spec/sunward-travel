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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination.trim()) return;
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
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-6 max-w-4xl mx-auto"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

        {/* Destination */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-600 text-mist uppercase tracking-widest mb-1.5">
            <MapPin size={9} className="inline mr-1" />Destination / Hotel
          </label>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="City, region or hotel name"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-mist/50 focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean"
          />
        </div>

        {/* Check-in */}
        <div className="shrink-0">
          <label className="block text-[10px] font-600 text-mist uppercase tracking-widest mb-1.5">
            <Calendar size={9} className="inline mr-1" />Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            min={daysFromNow(0)}
            onChange={e => setCheckIn(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean"
          />
        </div>

        {/* Check-out */}
        <div className="shrink-0">
          <label className="block text-[10px] font-600 text-mist uppercase tracking-widest mb-1.5">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={e => setCheckOut(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean"
          />
        </div>

        {/* Guests */}
        <div className="shrink-0">
          <label className="block text-[10px] font-600 text-mist uppercase tracking-widest mb-1.5">
            <Users size={9} className="inline mr-1" />Guests
          </label>
          <select
            value={guests}
            onChange={e => setGuests(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean"
          >
            <option value="1-1">1 adult, 1 room</option>
            <option value="2-1">2 adults, 1 room</option>
            <option value="2-2">2 adults, 2 rooms</option>
            <option value="3-1">3 adults, 1 room</option>
            <option value="4-2">4 adults, 2 rooms</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-display font-700 px-6 py-3 rounded-xl transition-colors whitespace-nowrap shrink-0"
        >
          <Search size={16} />Search Hotels
        </button>

      </div>
    </form>
  );
}
