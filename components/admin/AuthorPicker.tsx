'use client';

import { User, ChevronDown } from 'lucide-react';

interface AuthorOption {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  avatarUrl: string | null;
}

interface AuthorPickerProps {
  /** Current value (either name string or id string) */
  value: string;
  onChange: (val: string) => void;
  authors: AuthorOption[];
  label?: string;
  valueMode?: 'name' | 'id';
}

export default function AuthorPicker({ value, onChange, authors, label = 'Author', valueMode = 'name' }: AuthorPickerProps) {
  const selected = authors.find((a) => (valueMode === 'name' ? a.name === value : a.id === value));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2.5 pr-8 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white appearance-none"
        >
          <option value="">— No author assigned —</option>
          {authors.map((a) => (
            <option key={a.id} value={valueMode === 'name' ? a.name : a.id}>
              {a.name}{a.title ? ` (${a.title})` : ''}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {selected && (
        <div className="flex items-center gap-2 p-2 bg-[#FFFBF7] border border-[#E9D9CA] rounded-lg">
          {selected.avatarUrl ? (
            <img src={selected.avatarUrl} alt={selected.name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#E9D9CA] flex items-center justify-center">
              <User className="w-3 h-3 text-[#8B6E5C]" />
            </div>
          )}
          <span className="text-xs text-gray-600">
            <span className="font-medium">{selected.name}</span>
            {selected.title && <span className="text-gray-400"> · {selected.title}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
