'use client';

import { useActionState, useState, useEffect } from 'react';
import { upsertNews } from '@/app/admin/(protected)/news/actions';
import Link from 'next/link';
import ContentBlockEditor from '@/components/admin/ContentBlockEditor';
import TagPicker from '@/components/admin/TagPicker';
import MediaPicker from '@/components/admin/MediaPicker';
import AuthorPicker from '@/components/admin/AuthorPicker';

interface NewsFormProps {
  initialData?: any;
  countries: any[];
  destinations: any[];
  authors: any[];
}

export default function NewsForm({ initialData, countries, destinations, authors, tags = [] }: NewsFormProps & { tags?: any[] }) {
  const [state, formAction, isPending] = useActionState(upsertNews, null);
  const [isDirty, setIsDirty] = useState(false);
  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  


  const defaultHeroImage = initialData?.heroImage ? JSON.stringify(initialData.heroImage, null, 2) : '{\n  "src": "",\n  "alt": ""\n}';
  const defaultTags = initialData?.tags ? JSON.stringify(initialData.tags, null, 2) : '[]';

  const [tagsArr, setTagsArr] = useState<string[]>(Array.isArray(initialData?.tags) ? initialData.tags : []);
  const [heroImageObj, setHeroImageObj] = useState<any>(initialData?.heroImage || null);
  const [authorId, setAuthorId] = useState<string>(initialData?.author?.id || '');
  const defaultSeo = initialData?.seo ? JSON.stringify(initialData.seo, null, 2) : '{\n  "title": "",\n  "description": ""\n}';
  const defaultSourceReferences = initialData?.sourceReferences ? JSON.stringify(initialData.sourceReferences, null, 2) : '[]';

  const pub = initialData?.publication || {};
  const defaultPublishedAt = pub.publishedAt ? pub.publishedAt.slice(0, 16) : new Date().toISOString().slice(0, 16);
  const status = pub.status || 'draft';

  const author = initialData?.author || {};

  return (
    <form action={formAction} onChange={() => setIsDirty(true)} onSubmit={() => setIsDirty(false)} className="space-y-8">
      {state?.error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {state.error}
        </div>
      )}

      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

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
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Source References</h2>
            <p className="text-xs text-[#76675D]">Array of sources for journalistic integrity. e.g. [{`{"title":"CNN","url":"..."}`}]</p>
            <div className="space-y-4 pt-2">
              <textarea
                name="sourceReferences"
                defaultValue={defaultSourceReferences}
                rows={5}
                className="w-full font-mono text-xs border border-[#E9D9CA] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
              />
            </div>
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
                  defaultValue={status}
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

              <div className="space-y-1"><AuthorPicker authors={authors} value={authorId} onChange={setAuthorId} valueMode="id" label="Author" /></div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  defaultChecked={initialData?.featured}
                  className="w-4 h-4 text-[#E8622C] border-[#E9D9CA] rounded focus:ring-[#E8622C]"
                />
                <label htmlFor="featured" className="text-sm font-medium text-[#2B221C]">Featured News</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="trending"
                  id="trending"
                  defaultChecked={initialData?.trending}
                  className="w-4 h-4 text-[#E8622C] border-[#E9D9CA] rounded focus:ring-[#E8622C]"
                />
                <label htmlFor="trending" className="text-sm font-medium text-[#2B221C]">Trending Now</label>
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
                  defaultValue={initialData?.category || 'flight-news'}
                  required
                  className="w-full border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white"
                >
                  <option value="flight-news">Flight News</option>
                  <option value="destination-update">Destination Update</option>
                  <option value="travel-alert">Travel Alert</option>
                  <option value="industry-news">Industry News</option>
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

              <div className="space-y-1"><TagPicker value={tagsArr} onChange={setTagsArr} tags={tags} label="Tags" /></div>
            </div>
          </div>

          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Media</h2>
            
            <div className="space-y-4">
              <div className="space-y-1"><MediaPicker value={heroImageObj} onChange={setHeroImageObj} label="Hero Image" /></div>
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
          {isPending ? 'Saving...' : 'Save News Article'}
        </button>
        {initialData?.id && (
          <a
            href={`/admin/preview/news/${initialData.id}`}
            target="_blank"
            className="bg-[#F0EDE8] text-[#2B221C] px-6 py-2.5 rounded-md font-medium hover:bg-[#E9D9CA] transition-colors border border-[#E9D9CA]"
          >
            Preview
          </a>
        )}
        <Link
          href="/admin/news"
          className="text-[#76675D] hover:text-[#2B221C] font-medium transition-colors"
        >
          Cancel
        </Link>
        {isDirty && <span className="text-sm font-medium text-[#E8622C] ml-4">● Unsaved changes</span>}

      </div>
      <input type="hidden" name="tags" value={JSON.stringify(tagsArr)} />
        <input type="hidden" name="heroImage" value={heroImageObj ? JSON.stringify(heroImageObj) : ''} />
        <input type="hidden" name="authorId" value={authorId} />
      </form>
  );
}
