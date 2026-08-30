'use client';

import { useActionState, useState } from 'react';
import { upsertGuide } from '@/app/admin/(protected)/guides/actions';
import Link from 'next/link';
import ContentBlockEditor from '@/components/admin/ContentBlockEditor';
import AuthorPicker from '@/components/admin/AuthorPicker';
import TagPicker from '@/components/admin/TagPicker';
import MediaPicker from '@/components/admin/MediaPicker';

interface GuideFormProps {
  initialData?: any;
  countries: any[];
  destinations: any[];
  authors?: any[];
  tags?: any[];
}

export default function GuideForm({ initialData, countries, destinations, authors = [], tags = [] }: GuideFormProps) {
  const [state, formAction, isPending] = useActionState(upsertGuide, null);

  // Parse initial tags JSON array or fallback to empty array
  let defaultTagsArray: string[] = [];
  try {
    if (initialData?.tags) {
      const t = typeof initialData.tags === 'string' ? JSON.parse(initialData.tags) : initialData.tags;
      if (Array.isArray(t)) defaultTagsArray = t;
    }
  } catch (e) {}

  const [author, setAuthor] = useState<string>(initialData?.author || '');
  const [tagsVal, setTagsVal] = useState<string[]>(defaultTagsArray);
  const [heroImage, setHeroImage] = useState<any>(initialData?.heroImage || null);
  const [cardImage, setCardImage] = useState<any>(initialData?.cardImage || null);

  const defaultSeo = initialData?.seo ? JSON.stringify(initialData.seo, null, 2) : '{\n  "title": "",\n  "description": ""\n}';
  const defaultAffiliateCTAs = initialData?.affiliateCTAs ? JSON.stringify(initialData.affiliateCTAs, null, 2) : '[]';
  const defaultToc = initialData?.tocSections ? JSON.stringify(initialData.tocSections, null, 2) : '[]';

  const defaultPublishedAt = initialData?.publishedAt || new Date().toISOString().slice(0, 16);

  return (
    <form action={formAction} className="space-y-8 pb-24">
      {state?.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {state.error}
        </div>
      )}

      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      {initialData?.updatedAt && <input type="hidden" name="updatedAt" value={new Date().toISOString()} />}

      {/* Hidden inputs to send state values to form submission */}
      <input type="hidden" name="author" value={author} />
      <input type="hidden" name="tags" value={JSON.stringify(tagsVal)} />
      <input type="hidden" name="heroImage" value={heroImage ? JSON.stringify(heroImage) : ''} />
      <input type="hidden" name="cardImage" value={cardImage ? JSON.stringify(cardImage) : ''} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Basic Information</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Title</label>
                <input type="text" name="title" defaultValue={initialData?.title} required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Slug</label>
                <input type="text" name="slug" defaultValue={initialData?.slug} placeholder="Auto-generated if left empty"
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Excerpt</label>
                <textarea name="excerpt" defaultValue={initialData?.excerpt} required rows={3}
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Content</h2>
            <ContentBlockEditor initialBlocks={initialData?.body || []} />
          </div>

          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">SEO & Metadata</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">SEO (JSON)</label>
                <textarea name="seo" defaultValue={defaultSeo} required rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">TOC Sections (JSON Array)</label>
                <textarea name="tocSections" defaultValue={defaultToc} rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Publishing</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Status</label>
                <select name="status" defaultValue={initialData?.status || 'draft'} required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white">
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Published At</label>
                <input type="datetime-local" name="publishedAt" defaultValue={defaultPublishedAt} required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
              </div>

              <AuthorPicker value={author} onChange={setAuthor} authors={authors} label="Author" />

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" name="featured" id="featured" defaultChecked={initialData?.featured}
                  className="w-4 h-4 text-[#E8622C] border-[#E9D9CA] rounded focus:ring-[#E8622C]" />
                <label htmlFor="featured" className="text-sm font-medium text-[#2B221C]">Featured Guide</label>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Reading Time (Mins)</label>
                <input type="number" name="readingTimeMinutes" defaultValue={initialData?.readingTimeMinutes || 0}
                  placeholder="0 = auto-calculate"
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
                <p className="text-xs text-[#76675D]">Leave 0 to auto-calculate from content.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Taxonomy</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Category</label>
                <select name="category" defaultValue={initialData?.category || 'travel-guide'} required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white">
                  <option value="travel-guide">Travel Guide</option>
                  <option value="itinerary">Itinerary</option>
                  <option value="things-to-do">Things to Do</option>
                  <option value="where-to-stay">Where to Stay</option>
                  <option value="budget">Budget</option>
                  <option value="best-time-to-visit">Best Time to Visit</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Country</label>
                <select name="countrySlug" defaultValue={initialData?.countrySlug || ''}
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white">
                  <option value="">Global / None</option>
                  {countries.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Destination</label>
                <select name="destinationSlug" defaultValue={initialData?.destinationSlug || ''}
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white">
                  <option value="">None / Regional</option>
                  {destinations.map(d => <option key={d.slug} value={d.slug}>{d.name} ({d.country})</option>)}
                </select>
              </div>

              <TagPicker value={tagsVal} onChange={setTagsVal} tags={tags} label="Tags" />
            </div>
          </div>

          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Media & Affiliates</h2>
            <div className="space-y-4">
              <MediaPicker value={heroImage} onChange={setHeroImage} label="Hero Image (Required)" />
              <MediaPicker value={cardImage} onChange={setCardImage} label="Card Image (Required)" />

              <div className="space-y-1 pt-4">
                <label className="text-sm font-medium text-[#2B221C]">Affiliate CTAs (JSON Array)</label>
                <textarea name="affiliateCTAs" defaultValue={defaultAffiliateCTAs} rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-[#E9D9CA] flex items-center justify-between shadow-lg z-50">
        <div></div>
        <div className="flex items-center gap-4">
          <Link href="/admin/guides" className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">Cancel</Link>
          <button type="submit" disabled={isPending}
            className="bg-[#E8622C] text-white px-8 py-2 rounded-lg hover:bg-[#C94E1E] transition-colors font-medium disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save Guide'}
          </button>
        </div>
      </div>
    </form>
  );
}
