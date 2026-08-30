/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, X, Search } from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  alt: string | null;
  title: string | null;
  caption: string | null;
  credit: string | null;
}

interface SelectedImage {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}

interface MediaPickerProps {
  value: SelectedImage | null;
  onChange: (img: SelectedImage | null) => void;
  label?: string;
}

export default function MediaPicker({ value, onChange, label = 'Image' }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  async function loadMedia(q = '') {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media/list?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.items) setItems(data.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) loadMedia();
  }, [open]);

  function handleSelect(m: MediaItem) {
    onChange({ src: m.url, alt: m.alt || '', caption: m.caption || undefined, credit: m.credit || undefined });
    setOpen(false);
  }

  function handleClear() {
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="relative border border-[#E9D9CA] rounded-xl overflow-hidden">
          <img src={value.src} alt={value.alt} className="w-full max-h-48 object-cover" />
          <div className="p-3 bg-[#FFFBF7] border-t border-[#E9D9CA]">
            <p className="text-xs text-gray-600">{value.alt || <span className="text-amber-500">No alt text</span>}</p>
            {value.caption && <p className="text-xs text-gray-400 mt-0.5">{value.caption}</p>}
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <button type="button" onClick={() => setOpen(true)}
              className="bg-white text-[#0D6E7A] text-xs font-medium px-2 py-1 rounded-lg border border-[#E9D9CA] hover:bg-[#F5EDE5]">
              Change
            </button>
            <button type="button" onClick={handleClear}
              className="bg-white text-red-500 p-1 rounded-lg border border-[#E9D9CA] hover:bg-red-50">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)}
          className="w-full border-2 border-dashed border-[#E9D9CA] rounded-xl p-8 text-center hover:border-[#0D6E7A] transition-colors group">
          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2 group-hover:text-[#0D6E7A]" />
          <p className="text-sm text-gray-500 group-hover:text-[#0D6E7A]">Select from Media Library</p>
          <p className="text-xs text-gray-400 mt-0.5">Or upload a new image in the Media section</p>
        </button>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#E9D9CA]">
              <h2 className="font-bold text-[#2B221C]">Select Media</h2>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="p-4 border-b border-[#E9D9CA]">
              <div className="flex gap-2">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search alt text, title..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
                <button type="button" onClick={() => loadMedia(search)}
                  className="bg-[#0D6E7A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#095663]">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                  No media found. Upload images in the Media Library.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {items.map((m) => (
                    <button type="button" key={m.id} onClick={() => handleSelect(m)}
                      className="group rounded-xl border border-[#E9D9CA] overflow-hidden hover:border-[#0D6E7A] hover:shadow-md transition-all text-left">
                      <div className="aspect-square bg-gray-50 overflow-hidden">
                        <img src={m.url} alt={m.alt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] text-gray-600 truncate">{m.title || m.alt || 'Untitled'}</p>
                        {!m.alt && <p className="text-[10px] text-amber-500">No alt text</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
