'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@prisma/client';
import { upsertEvent, deleteEvent } from '@/app/admin/(protected)/events/actions';
import ContentBlockEditor from '@/components/admin/ContentBlockEditor';
import TagPicker from '@/components/admin/TagPicker';
import MediaPicker from '@/components/admin/MediaPicker';

interface EventFormProps {
  event: Event | null;
  countries: any[];
  destinations: any[];
  tags?: any[];
}

export default function EventForm({ event, countries, destinations, tags = [] }: EventFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const existingPubStatus = event?.publication ? (event.publication as any).status : 'draft';
  const [pubStatus, setPubStatus] = useState(existingPubStatus);

  const existingSources = event ? (event.sourceReferences as any[]) || [] : [];
  let existingTags = event ? (event.tags as string[]) || [] : [];
  if (typeof existingTags === 'string') {
    try { existingTags = JSON.parse(existingTags); } catch(e) {}
  }

  const [sourceReferences, setSourceReferences] = useState(existingSources.length > 0 ? JSON.stringify(existingSources, null, 2) : '[]');
  const [tagsVal, setTagsVal] = useState<string[]>(Array.isArray(existingTags) ? existingTags : []);
  const [heroImage, setHeroImage] = useState<any>(event?.heroImage || null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await upsertEvent(formData);
    if (result?.error) { setError(result.error); setIsPending(false); }
    else { router.push('/admin/events'); }
  }

  async function handleDelete() {
    if (!event) return;
    const confirmed = window.confirm(`Are you sure you want to permanently delete "${event.title}"?`);
    if (!confirmed) return;
    setIsPending(true);
    const result = await deleteEvent(event.id);
    if (result?.error) { setError(result.error); setIsPending(false); }
    else { router.push('/admin/events'); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-24 max-w-4xl">
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">&#9888; {error}</div>}

      <input type="hidden" name="id" value={event?.id || 'new'} />
      <input type="hidden" name="publicationStatus" value={pubStatus} />
      <input type="hidden" name="tags" value={JSON.stringify(tagsVal)} />
      <input type="hidden" name="heroImage" value={heroImage ? JSON.stringify(heroImage) : ''} />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Basic Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
            <input type="text" name="title" required defaultValue={event?.title || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <input type="text" name="slug" defaultValue={event?.slug || ''} placeholder="Auto-generated if empty"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
            <select name="category" required defaultValue={event?.category || 'festival'}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white">
              <option value="festival">Festival</option><option value="exhibition">Exhibition</option>
              <option value="concert">Concert</option><option value="sports">Sports</option>
              <option value="cultural">Cultural</option><option value="holiday">Holiday</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Event Dates</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
            <input type="date" name="startDate" required defaultValue={event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">End Date <span className="text-red-500">*</span></label>
            <input type="date" name="endDate" required defaultValue={event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Location</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Country</label>
            <select name="countrySlug" defaultValue={event?.countrySlug || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white">
              <option value="">Global / Multiple</option>
              {countries.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Destination</label>
            <select name="destinationSlug" defaultValue={event?.destinationSlug || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white">
              <option value="">None / Regional</option>
              {destinations.map(d => <option key={d.id} value={d.slug}>{d.name} ({d.country})</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Statuses & Links</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lifecycle Status <span className="text-red-500">*</span></label>
            <select name="lifecycleStatus" required defaultValue={event?.lifecycleStatus || 'scheduled'}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white">
              <option value="scheduled">Scheduled</option><option value="ongoing">Ongoing</option>
              <option value="postponed">Postponed</option><option value="cancelled">Cancelled</option><option value="completed">Completed</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Organizer</label>
            <input type="text" name="organizer" defaultValue={event?.organizer || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Official URL</label>
            <input type="text" name="officialUrl" defaultValue={event?.officialUrl || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ticket URL</label>
            <input type="text" name="ticketUrl" defaultValue={event?.ticketUrl || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Event Description</h2>
        <ContentBlockEditor initialBlocks={event && Array.isArray(event.body) ? event.body as any[] : []} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-4">
        <h2 className="text-xl font-bold text-[#2B221C]">Factual Sourcing</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Source References JSON</label>
          <textarea name="sourceReferences" rows={5} value={sourceReferences} onChange={(e) => setSourceReferences(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Advanced Data & Media</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <TagPicker value={tagsVal} onChange={setTagsVal} tags={tags} label="Tags" />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">SEO JSON</label>
              <textarea name="seo" rows={4} defaultValue={event?.seo ? JSON.stringify(event.seo, null, 2) : '{\n  "title": "",\n  "description": ""\n}'}
                className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
            </div>
          </div>
          <div>
            <MediaPicker value={heroImage} onChange={setHeroImage} label="Hero Image" />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-[#E9D9CA] flex items-center justify-between shadow-lg z-50">
        <div className="flex items-center gap-4">
          <select value={pubStatus} onChange={(e) => setPubStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#0D6E7A]">
            <option value="draft">Save as Draft</option>
            <option value="published">Publish Live</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          {event && (
            <button type="button" onClick={handleDelete} disabled={isPending}
              className="text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-lg disabled:opacity-50">Delete Event</button>
          )}
          <button type="button" onClick={() => router.back()} disabled={isPending}
            className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">Cancel</button>
          <button type="submit" disabled={isPending}
            className="bg-[#0D6E7A] text-white px-8 py-2 rounded-lg hover:bg-[#095663] font-medium disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </div>
    </form>
  );
}
