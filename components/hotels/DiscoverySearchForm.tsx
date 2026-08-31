'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';

export function DiscoverySearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    
    // Convert to slug format roughly (lowercase, spaces to dashes)
    const slug = destination.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Route to destination where-to-stay guide if we match common ones, 
    // otherwise route to general destination page.
    const pilotDestinations = ['bali', 'tokyo', 'singapore'];
    if (pilotDestinations.includes(slug)) {
      router.push(`/guides/where-to-stay-in-${slug}`);
    } else {
      // In a real app we'd resolve the country/dest properly, 
      // but for discovery fallback we can go to guides search.
      router.push(`/guides?q=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="p-4 bg-white rounded-2xl flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where are you going?"
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean transition-all text-ink font-500 placeholder:text-mist/70"
          required
        />
      </div>
      
      <button
        type="submit"
        className="bg-ocean hover:bg-ocean-dark text-white font-display font-700 px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 md:w-auto w-full"
      >
        <Search size={18} />
        Find where to stay
      </button>
    </form>
  );
}
