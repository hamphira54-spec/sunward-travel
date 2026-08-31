'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';
import { DESTINATIONS } from '@/lib/destinations-v2';

export function DiscoverySearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLFormElement>(null);

  const matches = DESTINATIONS.filter(d => 
    d.name.toLowerCase().includes(destination.toLowerCase()) || 
    d.country.toLowerCase().includes(destination.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < matches.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(matches[activeIndex].slug);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/hotels?destination=${slug}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    const slug = destination.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    handleSelect(slug);
  };

  return (
    <form onSubmit={handleSearch} className="p-3 bg-white rounded-2xl flex flex-col md:flex-row gap-3 relative" ref={wrapperRef}>
      <div className="flex-1 relative">
        <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" />
        <input
          type="text"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Where are you going?"
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-ink font-500 placeholder:text-mist/70"
          required
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="destination-listbox"
        />
        
        {isOpen && destination && matches.length > 0 && (
          <ul 
            id="destination-listbox"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {matches.map((match, index) => (
              <li
                key={match.slug}
                role="option"
                aria-selected={activeIndex === index}
                onClick={() => handleSelect(match.slug)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                  activeIndex === index ? 'bg-sand text-ink' : 'text-mist hover:bg-gray-50'
                }`}
              >
                <MapPin size={16} className={activeIndex === index ? 'text-primary' : 'text-mist'} />
                <div>
                  <div className="font-700 text-sm">{match.name}</div>
                  <div className="text-xs opacity-80">{match.country}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <button
        type="submit"
        className="bg-primary hover:bg-primary-dark text-white font-display font-700 px-8 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 md:w-auto w-full"
      >
        <Search size={18} />
        Find where to stay
      </button>
    </form>
  );
}
