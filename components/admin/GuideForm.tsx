'use client';

import { PublishingPanel } from './PublishingPanel';
import { useRouter } from 'next/navigation';

import { useActionState, useState, useEffect, useRef } from 'react';
import { upsertGuide } from '@/app/admin/(protected)/guides/actions';
import Link from 'next/link';
import ContentBlockEditor from '@/components/admin/ContentBlockEditor';
import TagPicker from '@/components/admin/TagPicker';
import MediaPicker from '@/components/admin/MediaPicker';
import AuthorPicker from '@/components/admin/AuthorPicker';
import AccommodationChecklist from '@/components/admin/AccommodationChecklist';

interface GuideFormProps {
  initialData?: any;
  countries: any[];
  destinations: any[];
  authors?: any[];
}

export default function GuideForm({ initialData, countries, destinations, authors = [], tags = [], adminRole = 'EDITOR' }: GuideFormProps & { tags?: any[], adminRole?: string }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
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

  

  const [tagsArr, setTagsArr] = useState<string[]>(Array.isArray(initialData?.tags) ? initialData.tags : []);
  const [heroImageObj, setHeroImageObj] = useState<any>(initialData?.heroImage || null);
  const [cardImageObj, setCardImageObj] = useState<any>(initialData?.cardImage || null);
  const [authorName, setAuthorName] = useState<string>(initialData?.author || '');

  const defaultHeroImage = initialData?.heroImage ? JSON.stringify(initialData.heroImage, null, 2) : '{\n  "src": "",\n  "alt": ""\n}';
  const defaultCardImage = initialData?.cardImage ? JSON.stringify(initialData.cardImage, null, 2) : '{\n  "src": "",\n  "alt": ""\n}';
  const defaultTags = initialData?.tags ? JSON.stringify(initialData.tags, null, 2) : '[\n  {\n    "slug": "tag-slug",\n    "label": "Tag Label"\n  }\n]';
  const defaultSeo = initialData?.seo ? JSON.stringify(initialData.seo, null, 2) : '{\n  "title": "",\n  "description": ""\n}';
  const defaultAffiliateCTAs = initialData?.affiliateCTAs ? JSON.stringify(initialData.affiliateCTAs, null, 2) : '[]';
  const defaultToc = initialData?.tocSections ? JSON.stringify(initialData.tocSections, null, 2) : '[]';

  
  

  const defaultPublishedAt = initialData?.publishedAt || new Date().toISOString().slice(0, 16);

  async function handleSave(): Promise<boolean> {
    if (!formRef.current) return false;
    const formData = new FormData(formRef.current);
    // Since useActionState actions take (prevState, formData)
    const result = await upsertGuide(null, formData);
    if (result?.error) {
      setError(result.error);
      return false;
    }
    setIsDirty(false);
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const success = await handleSave();
    if (success) {
      router.push('/admin/guides');
    }
    setIsPending(false);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} onChange={() => setIsDirty(true)} className="space-y-8 max-w-4xl pb-24">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {error}
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
          <AccommodationChecklist formRef={formRef} />
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
                  <option value="in_review">Review</option>
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

              <div className="space-y-1"><AuthorPicker authors={authors} value={authorName} onChange={setAuthorName} valueMode="name" label="Author" /></div>

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

              <div className="space-y-1"><TagPicker value={tagsArr} onChange={setTagsArr} tags={tags} label="Tags" /></div>
            </div>
          </div>

          <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Media & Affiliates</h2>
            
            <div className="space-y-4">
              <div className="space-y-1"><MediaPicker value={heroImageObj} onChange={setHeroImageObj} label="Hero Image" /></div>

              <div className="space-y-1"><MediaPicker value={cardImageObj} onChange={setCardImageObj} label="Card Image" /></div>

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

      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-[#E9D9CA] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between">
    <button type="button" onClick={() => router.push('/admin/guides')} className="text-gray-600 hover:text-black font-medium">Cancel</button>
    <PublishingPanel 
      contentType="guide" 
      contentId={initialData?.id || 'new'} 
      currentStatus={initialData?.publishStatus || 'draft'} 
      publishDate={initialData?.publishDate} 
      scheduleDate={initialData?.scheduleDate} 
      role={adminRole || 'EDITOR'} 
      isDirty={isDirty} 
      onSaveRequested={handleSave} 
    />
  </div>
  <input type="hidden" name="tags" value={JSON.stringify(tagsArr)} />
        <input type="hidden" name="heroImage" value={heroImageObj ? JSON.stringify(heroImageObj) : ''} />
        <input type="hidden" name="cardImage" value={cardImageObj ? JSON.stringify(cardImageObj) : ''} />
        <input type="hidden" name="author" value={authorName} />
      </form>
  );
}
