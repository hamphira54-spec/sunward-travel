'use client';

import { useActionState, useState } from 'react';
import { upsertNews } from '@/app/admin/(protected)/news/actions';
import Link from 'next/link';
import ContentBlockEditor from '@/components/admin/ContentBlockEditor';
import AuthorPicker from '@/components/admin/AuthorPicker';
import TagPicker from '@/components/admin/TagPicker';
import MediaPicker from '@/components/admin/MediaPicker';

interface NewsFormProps {
  initialData?: any;
  countries: any[];
  destinations: any[];
  authors: any[];
  tags?: any[];
}

export default function NewsForm({ initialData, countries, destinations, authors, tags = [] }: NewsFormProps) {
  const [state, formAction, isPending] = useActionState(upsertNews, null);

  let defaultTagsArray: string[] = [];
  try {
    if (initialData?.tags) {
      const t = typeof initialData.tags === 'string' ? JSON.parse(initialData.tags) : initialData.tags;
      if (Array.isArray(t)) defaultTagsArray = t;
    }
  } catch (e) {}

  const authorData = initialData?.author || {};
  const [authorId, setAuthorId] = useState<string>(authorData.id || '');
  const [tagsVal, setTagsVal] = useState<string[]>(defaultTagsArray);
  const [heroImage, setHeroImage] = useState<any>(initialData?.heroImage || null);

  const defaultSeo = initialData?.seo ? JSON.stringify(initialData.seo, null, 2) : '{\n  "title": "",\n  "description": ""\n}';
  const defaultSourceReferences = initialData?.sourceReferences ? JSON.stringify(initialData.sourceReferences, null, 2) : '[]';

  const pub = initialData?.publication || {};
  const defaultPublishedAt = pub.publishedAt ? pub.publishedAt.slice(0, 16) : new Date().toISOString().slice(0, 16);
  const status = pub.status || 'draft';

  return (
    <form action={formAction} className="space-y-8 pb-24">
      {state?.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {state.error}
        </div>
      )}

      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      <input type="hidden" name="authorId" value={authorId} />
      <input type="hidden" name="tags" value={JSON.stringify(tagsVal)} />
      <input type="hidden" name="heroImage" value={heroImage ? JSON.stringify(heroImage) : ''} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Sources & SEO</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Source References (JSON Array)</label>
                <textarea name="sourceReferences" defaultValue={defaultSourceReferences} required rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
                <p className="text-xs text-[#76675D]">Required. Must provide at least one source (name and url) to verify news authenticity.</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">SEO (JSON)</label>
                <textarea name="seo" defaultValue={defaultSeo} required rows={4}
                  className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Publishing</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2B221C]">Status</label>
                <select name="status" defaultValue={status} required
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

              <AuthorPicker value={authorId} onChange={setAuthorId} authors={authors} label="Author" valueMode="id" />

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" name="featured" id="featured" defaultChecked={initialData?.featured}
                  className="w-4 h-4 text-[#E8622C] border-[#E9D9CA] rounded focus:ring-[#E8622C]" />
                <label htmlFor="featured" className="text-sm font-medium text-[#2B221C]">Featured News</label>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="trending" id="trending" defaultChecked={initialData?.trending}
                  className="w-4 h-4 text-[#E8622C] border-[#E9D9CA] rounded focus:ring-[#E8622C]" />
                <label htmlFor="trending" className="text-sm font-medium text-[#2B221C]">Trending Now</label>
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
                <select name="category" defaultValue={initialData?.category || 'flight-news'} required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white">
                  <option value="flight-news">Flight News</option>
                  <option value="destination-update">Destination Update</option>
                  <option value="travel-alert">Travel Alert</option>
                  <option value="industry-news">Industry News</option>
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
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Media</h2>
            <div className="space-y-4">
              <MediaPicker value={heroImage} onChange={setHeroImage} label="Hero Image (Required)" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-[#E9D9CA] flex items-center justify-between shadow-lg z-50">
        <div></div>
        <div className="flex items-center gap-4">
          <Link href="/admin/news" className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">Cancel</Link>
          <button type="submit" disabled={isPending}
            className="bg-[#E8622C] text-white px-8 py-2 rounded-lg hover:bg-[#C94E1E] transition-colors font-medium disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save News Article'}
          </button>
        </div>
      </div>
    </form>
  );
}
