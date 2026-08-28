'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Search } from 'lucide-react';

function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
}

export default function CarSearchForm() {
  const router   = useRouter();
  const [pickup,  setPickup]  = useState('');
  const [dropoff, setDropoff] = useState('');
  const [sameLocation, setSameLocation] = useState(true);
  const [fromDate, setFromDate] = useState(daysFromNow(3));
  const [toDate,   setToDate]   = useState(daysFromNow(10));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pickup.trim()) return;
    const params = new URLSearchParams({
      pickup:  pickup.trim(),
      dropoff: sameLocation ? pickup.trim() : (dropoff.trim() || pickup.trim()),
      from:    fromDate,
      to:      toDate,
    });
    router.push(`/cars/book?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-6 max-w-4xl mx-auto space-y-4"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

        {/* Pick-up location */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-600 text-mist uppercase tracking-widest mb-1.5">
            <MapPin size={9} className="inline mr-1" />Pick-up Location
          </label>
          <input
            type="text"
            value={pickup}
            onChange={e => setPickup(e.target.value)}
            placeholder="City, airport or address"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-mist/50 focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean"
          />
        </div>

        {/* Drop-off location */}
        {!sameLocation && (
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] font-600 text-mist uppercase tracking-widest mb-1.5">
              Drop-off Location
            </label>
            <input
              type="text"
              value={dropoff}
              onChange={e => setDropoff(e.target.value)}
              placeholder="Different drop-off location"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-mist/50 focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean"
            />
          </div>
        )}

        {/* Pick-up date */}
        <div className="shrink-0">
          <label className="block text-[10px] font-600 text-mist uppercase tracking-widest mb-1.5">
            <Calendar size={9} className="inline mr-1" />Pick-up Date
          </label>
          <input
            type="date"
            value={fromDate}
            min={daysFromNow(0)}
            onChange={e => setFromDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean"
          />
        </div>

        {/* Drop-off date */}
        <div className="shrink-0">
          <label className="block text-[10px] font-600 text-mist uppercase tracking-widest mb-1.5">
            Drop-off Date
          </label>
          <input
            type="date"
            value={toDate}
            min={fromDate}
            onChange={e => setToDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean"
          />
        </div>

        {/* Search */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-ocean hover:bg-ocean-dark text-white font-display font-700 px-6 py-3 rounded-xl transition-colors whitespace-nowrap shrink-0"
        >
          <Search size={16} />Search Cars
        </button>

      </div>

      {/* Same location toggle */}
      <label className="flex items-center gap-2 text-xs text-mist cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={sameLocation}
          onChange={e => setSameLocation(e.target.checked)}
          className="rounded accent-ocean"
        />
        Return car to same location
      </label>
    </form>
  );
}
