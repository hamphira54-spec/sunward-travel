'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Search } from 'lucide-react';

function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
}

export default function ActivitySearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(daysFromNow(3));
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!destination.trim()) {
      setError('Please enter a destination.');
      return;
    }
    // Simulate navigation to a generic search or external provider
    alert(`Searching activities in ${destination} for ${date}`);
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4" aria-label="Activity search form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Destination */}
        <div>
          <label className="block text-[10px] font-600 text-ink/50 uppercase tracking-widest mb-1.5">
            <span className="flex items-center gap-1"><MapPin size={10} /> Destination</span>
          </label>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="Where are you going? (e.g. Bangkok)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-mist/50 focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition-colors"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-[10px] font-600 text-ink/50 uppercase tracking-widest mb-1.5">
            <span className="flex items-center gap-1"><Calendar size={10} /> Date</span>
          </label>
          <input
            type="date"
            value={date}
            min={daysFromNow(0)}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition-colors"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-500 font-medium px-1">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-ocean hover:bg-ocean-dark text-white font-display font-700 text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
      >
        <Search size={16} /> Search Activities
      </button>
    </form>
  );
}
