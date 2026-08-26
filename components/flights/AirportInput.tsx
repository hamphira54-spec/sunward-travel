'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import type { Airport } from '@/lib/types/flights';

interface AirportInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
}

export default function AirportInput({
  id,
  label,
  placeholder,
  value,
  onChange,
}: AirportInputProps) {
  const [query,       setQuery]       = useState(value ? `${value.city} (${value.iata})` : '');
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [open,        setOpen]        = useState(false);
  const [focused,     setFocused]     = useState(false);
  const containerRef  = useRef<HTMLDivElement>(null);
  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync display value when parent resets
  useEffect(() => {
    if (!focused) {
      setQuery(value ? `${value.city} (${value.iata})` : '');
    }
  }, [value, focused]);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res  = await fetch(`/api/airports/suggest?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as Airport[];
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    onChange(null); // clear selection when typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 200);
  };

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setQuery(`${airport.city} (${airport.iata})`);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="block text-xs font-semibold text-ink/60 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <MapPin
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-mist pointer-events-none"
        />
        <input
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onFocus={() => {
            setFocused(true);
            if (suggestions.length > 0) setOpen(true);
          }}
          onBlur={() => {
            setFocused(false);
            // Restore last valid value if input is unclear
            if (!value && query) {
              setTimeout(() => {
                if (!value) setQuery('');
              }, 150);
            }
          }}
          onChange={handleInputChange}
          className="w-full pl-9 pr-8 py-3 rounded-lg border border-gray-200 bg-white text-sm text-ink placeholder:text-mist/70 focus:outline-none focus:ring-2 focus:ring-ocean/40 focus:border-ocean transition-colors"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-suggestions`}
        />
        {loading && (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-mist animate-spin"
          />
        )}
      </div>

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-1 max-h-64 overflow-y-auto"
          aria-label="Airport suggestions"
        >
          {suggestions.map((airport) => (
            <li key={airport.iata} role="option" aria-selected={value?.iata === airport.iata}>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-ocean/5 transition-colors flex items-start gap-3"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(airport); }}
              >
                <span className="font-display font-700 text-sm text-ocean w-10 shrink-0 mt-0.5">
                  {airport.iata}
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{airport.city}</span>
                  <span className="block text-xs text-mist">{airport.name}, {airport.country}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
