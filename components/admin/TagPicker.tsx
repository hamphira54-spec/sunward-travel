'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface TagOption {
  id: string;
  name: string;
  slug: string;
}

interface TagPickerProps {
  /** Current tag slugs array */
  value: string[];
  onChange: (slugs: string[]) => void;
  tags: TagOption[];
  label?: string;
}

/**
 * TagPicker for Guide/News/Event forms.
 * Content stores tags as JSON arrays of strings (tag slugs).
 * This picker populates from Tag DB records but saves slug strings.
 * Architecture note: non-relational per current schema design.
 */
export default function TagPicker({ value, onChange, tags, label = 'Tags' }: TagPickerProps) {
  const [inputVal, setInputVal] = useState('');

  const availableTags = tags.filter((t) => !value.includes(t.slug));
  const filtered = inputVal
    ? availableTags.filter((t) => t.name.toLowerCase().includes(inputVal.toLowerCase()) || t.slug.includes(inputVal.toLowerCase()))
    : availableTags;

  function addTag(slug: string) {
    if (!value.includes(slug)) {
      onChange([...value, slug]);
    }
    setInputVal('');
  }

  function removeTag(slug: string) {
    onChange(value.filter((s) => s !== slug));
  }

  function getTagName(slug: string): string {
    return tags.find((t) => t.slug === slug)?.name || slug;
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((slug) => (
            <span key={slug} className="inline-flex items-center gap-1 bg-[#F5EDE5] border border-[#E9D9CA] text-[#2B221C] text-xs font-medium px-2.5 py-1 rounded-full">
              {getTagName(slug)}
              <button type="button" onClick={() => removeTag(slug)} className="text-gray-400 hover:text-red-500 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tag search/add */}
      <div className="relative">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Search tags to add..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
        />
        {inputVal && filtered.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 bg-white border border-[#E9D9CA] rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
            {filtered.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => addTag(t.slug)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-[#FFF8F0] flex items-center gap-2"
              >
                <Plus className="w-3 h-3 text-gray-400" />
                <span className="font-medium">{t.name}</span>
                <span className="text-gray-400 text-xs font-mono">{t.slug}</span>
              </button>
            ))}
          </div>
        )}
        {inputVal && filtered.length === 0 && (
          <div className="absolute z-20 top-full left-0 right-0 bg-white border border-[#E9D9CA] rounded-lg shadow-lg mt-1 p-3 text-sm text-gray-400">
            No tags found. Create tags in the{' '}
            <a href="/admin/tags" target="_blank" className="text-[#0D6E7A] hover:underline">Tags section</a>.
          </div>
        )}
      </div>

      {value.length === 0 && (
        <p className="text-xs text-gray-400">No tags selected. Tags are stored as slug strings for content scoring.</p>
      )}
    </div>
  );
}
