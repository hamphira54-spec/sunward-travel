'use client';

import { useActionState } from 'react';
import { upsertGuide } from '@/app/admin/(protected)/guides/actions';
import Link from 'next/link';
import ContentBlockEditor from '@/components/admin/ContentBlockEditor';

interface GuideFormProps {
  initialData?: any;
  countries: any[];
  destinations: any[];
  authors?: any[];
}

export default function GuideForm({ initialData, countries, destinations, authors = [] }: GuideFormProps) {
  const [state, formAction, isPending] = useActionState(upsertGuide, null);

  const defaultHeroImage = initialData?.heroImage ? JSON.stringify(initialData.heroImage, null, 2) : '{\n  "src": "",\n  "alt": ""\n}';
  const defaultCardImage = initialData?.cardImage ? JSON.stringify(initialData.cardImage, null, 2) : '{\n  "src": "",\n  "alt": ""\n}';
  const defaultTags = initialData?.tags ? JSON.stringify(initialData.tags, null, 2) : '[\n  {\n    "slug": "tag-slug",\n    "label": "Tag Label"\n  }\n]';
  const defaultSeo = initialData?.seo ? JSON.stringify(initialData.seo, null, 2) : '{\n  "title": "",\n  "description": ""\n}';
  const defaultAffiliateCTAs = initialData?.affiliateCTAs ? JSON.stringify(initialData.affiliateCTAs, null, 2) : '[]';
  const defaultToc = initialData?.tocSections ? JSON.stringify(initialData.tocSections, null, 2) : '[]';

  const defaultPublishedAt = initialData?.publishedAt || new Date().toISOString().slice(0, 16);

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {state.error}
        </div>
      )}

      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      {initialData?.updatedAt && <input type="hidden" name="updatedAt" value={new Date().toISOString()} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Basic Information</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={initialData?.title}
                  required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Slug</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={initialData?.slug}
                  placeholder="Auto-generated if left empty"
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Excerpt</label>
                <textarea
                  name="excerpt"
                  defaultValue={initialData?.excerpt}
                  required
                  rows={3}
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
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
                <textarea
                  name="seo"
                  defaultValue={defaultSeo}
                  required
                  rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">TOC Sections (JSON Array)</label>
                <textarea
                  name="tocSections"
                  defaultValue={defaultToc}
                  rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
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
                <select
                  name="status"
                  defaultValue={initialData?.status || 'draft'}
                  required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="review">Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Published At</label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  defaultValue={defaultPublishedAt}
                  required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Author</label>
                <select
                  name="author"
                  defaultValue={initialData?.author || ''}
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white"
                >
                  <option value="">Default (Admin User)</option>
                  {authors.map((a, idx) => (
                    <option key={idx} value={a.name}>{a.name}</option>
                  ))}
                  {/* Preserve existing custom author if it's not in the authors table */}
                  {initialData?.author && !authors.find(a => a.name === initialData.author) && (
                    <option value={initialData.author}>{initialData.author} (Legacy)</option>
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  defaultChecked={initialData?.featured}
                  className="w-4 h-4 text-[#E8622C] border-[#E9D9CA] rounded focus:ring-[#E8622C]"
                />
                <label htmlFor="featured" className="text-sm font-medium text-[#2B221C]">Featured Guide</label>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Reading Time (Mins)</label>
                <input
                  type="number"
                  name="readingTimeMinutes"
                  defaultValue={initialData?.readingTimeMinutes || 0}
                  placeholder="0 = auto-calculate"
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
                <p className="text-xs text-[#76675D]">Leave 0 to auto-calculate from content.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Taxonomy</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Category</label>
                <select
                  name="category"
                  defaultValue={initialData?.category || 'travel-guide'}
                  required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white"
                >
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
                <select
                  name="countrySlug"
                  defaultValue={initialData?.countrySlug || ''}
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white"
                >
                  <option value="">Global / None</option>
                  {countries.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Destination</label>
                <select
                  name="destinationSlug"
                  defaultValue={initialData?.destinationSlug || ''}
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white"
                >
                  <option value="">None / Regional</option>
                  {destinations.map(d => (
                    <option key={d.slug} value={d.slug}>{d.name} ({d.country})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Tags (JSON Array)</label>
                <textarea
                  name="tags"
                  defaultValue={defaultTags}
                  rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Media & Affiliates</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Hero Image (JSON)</label>
                <textarea
                  name="heroImage"
                  defaultValue={defaultHeroImage}
                  required
                  rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Card Image (JSON)</label>
                <textarea
                  name="cardImage"
                  defaultValue={defaultCardImage}
                  required
                  rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Affiliate CTAs (JSON Array)</label>
                <textarea
                  name="affiliateCTAs"
                  defaultValue={defaultAffiliateCTAs}
                  rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-[#E9D9CA] pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#E8622C] text-white px-8 py-2.5 rounded-md font-medium hover:bg-[#C74A1E] transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Guide'}
        </button>
        <Link
          href="/admin/guides"
          className="text-[#76675D] hover:text-[#2B221C] font-medium transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
