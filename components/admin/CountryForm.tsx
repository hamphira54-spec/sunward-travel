'use client';

import { useActionState, useState } from 'react';
import { upsertCountry } from '@/app/admin/(protected)/countries/actions';
import Link from 'next/link';
import MediaPicker from '@/components/admin/MediaPicker';

interface CountryFormProps {
  initialData?: any;
}

export default function CountryForm({ initialData }: CountryFormProps) {
  const [state, formAction, isPending] = useActionState(upsertCountry, null);

  const [heroImage, setHeroImage] = useState<any>(initialData?.heroImage || null);
  const [cardImage, setCardImage] = useState<any>(initialData?.cardImage || null);

  const defaultAirportCodes = initialData?.airportCodes ? JSON.stringify(initialData.airportCodes, null, 2) : '[\n  "XXX"\n]';

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {state.error}
        </div>
      )}

      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="heroImage" value={heroImage ? JSON.stringify(heroImage) : ''} />
      <input type="hidden" name="cardImage" value={cardImage ? JSON.stringify(cardImage) : ''} />

      <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#2B221C]">Name</label>
            <input type="text" name="name" defaultValue={initialData?.name} required
              className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#2B221C]">Slug</label>
            <input type="text" name="slug" defaultValue={initialData?.slug} required
              className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#2B221C]">Continent</label>
            <input type="text" name="continent" defaultValue={initialData?.continent} required
              className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#2B221C]">Region</label>
            <input type="text" name="region" defaultValue={initialData?.region} required
              className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#2B221C]">Short Description</label>
          <textarea name="shortDescription" defaultValue={initialData?.shortDescription} required rows={3}
            className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="featured" id="featured" defaultChecked={initialData?.featured}
            className="w-4 h-4 text-[#E8622C] border-[#E9D9CA] rounded focus:ring-[#E8622C]" />
          <label htmlFor="featured" className="text-sm font-medium text-[#2B221C]">Featured Country</label>
        </div>
      </div>

      <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Media & JSON Data</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-[#E9D9CA]">
          <MediaPicker value={heroImage} onChange={setHeroImage} label="Hero Image (Required)" />
          <MediaPicker value={cardImage} onChange={setCardImage} label="Card Image (Required)" />
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-sm font-medium text-[#2B221C]">Airport Codes (JSON Array)</label>
          <textarea name="airportCodes" defaultValue={defaultAirportCodes} required rows={4}
            className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isPending}
          className="bg-[#E8622C] text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-[#C74A1E] transition-colors disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save Country'}
        </button>
        <Link href="/admin/countries" className="text-[#76675D] hover:text-[#2B221C] text-sm font-medium transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  );
}
