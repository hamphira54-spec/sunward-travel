'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@prisma/client';
import { upsertEvent, deleteEvent } from '@/app/admin/(protected)/events/actions';
import ContentBlockEditor from '@/components/admin/ContentBlockEditor';
import { EVENT_CATEGORY_LABELS, EventCategory, EventStatus } from '@/lib/content/events';

export default function EventForm({
  event,
  countries,
  destinations,
}: {
  event: Event | null;
  countries: any[];
  destinations: any[];
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pubStatus = event ? (event.publication as any)?.status : 'draft';
  const pubDate = event ? (event.publication as any)?.publishedAt : '';

  const sources = event ? (event.sourceReferences as any[]) || [] : [];
  const tags = event ? (event.tags as any[]) || [] : [];
  
  const [sourceReferences, setSourceReferences] = useState(JSON.stringify(sources, null, 2));
  const [tagsStr, setTagsStr] = useState(JSON.stringify(tags, null, 2));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = await upsertEvent(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!event || !window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    setIsPending(true);
    const result = await deleteEvent(event.id);
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-24">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      <input type="hidden" name="id" value={event?.id || 'new'} />

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Basic Information</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              required
              defaultValue={event?.title || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              name="slug"
              required
              defaultValue={event?.slug || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">Excerpt / Summary</label>
            <textarea
              name="excerpt"
              required
              rows={3}
              defaultValue={event?.excerpt || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              required
              defaultValue={event?.category || 'festivals'}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white"
            >
              {Object.entries(EVENT_CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Featured Event?</label>
            <select
              name="featured"
              defaultValue={event?.featured ? 'true' : 'false'}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dates and Time */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Dates & Time</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Start Date (ISO)</label>
            <input
              type="text"
              name="startDate"
              required
              placeholder="e.g. 2026-10-09T15:00:00Z"
              defaultValue={event?.startDate || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">End Date (ISO)</label>
            <input
              type="text"
              name="endDate"
              placeholder="e.g. 2026-10-11T23:59:59Z"
              defaultValue={event?.endDate || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Timezone (e.g. Asia/Singapore)</label>
            <input
              type="text"
              name="timezone"
              defaultValue={event?.timezone || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">All Day Event?</label>
            <select
              name="allDay"
              defaultValue={event?.allDay ? 'true' : 'false'}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Location & Venue</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Country</label>
            <select
              name="countrySlug"
              defaultValue={event?.countrySlug || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white"
            >
              <option value="">None (Global)</option>
              {countries.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Destination</label>
            <select
              name="destinationSlug"
              defaultValue={event?.destinationSlug || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white"
            >
              <option value="">None</option>
              {destinations.map(d => (
                <option key={d.slug} value={d.slug}>{d.name} ({d.country})</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">Venue JSON</label>
            <p className="text-xs text-gray-500">Must include at least &apos;name&apos;. Example: {`{"name":"Marina Bay Circuit","city":"Singapore"}`}</p>
            <textarea
              name="venue"
              rows={4}
              defaultValue={event?.venue ? JSON.stringify(event.venue, null, 2) : ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Statuses & URLs */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Statuses & Links</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lifecycle Status</label>
            <select
              name="lifecycleStatus"
              required
              defaultValue={event?.lifecycleStatus || 'scheduled'}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white font-medium"
            >
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="postponed">Postponed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <p className="text-xs text-gray-500">Real-world state of the event.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Organizer</label>
            <input
              type="text"
              name="organizer"
              defaultValue={event?.organizer || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Official URL</label>
            <input
              type="url"
              name="officialUrl"
              defaultValue={event?.officialUrl || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ticket URL</label>
            <input
              type="url"
              name="ticketUrl"
              defaultValue={event?.ticketUrl || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Event Description</h2>
        <ContentBlockEditor initialBlocks={event && Array.isArray(event.body) ? event.body : []} />
      </div>
      
      {/* JSON Metadatas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Factual Sourcing (Required for Publish)</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Source References JSON</label>
          <textarea
            name="sourceReferences"
            rows={5}
            value={sourceReferences}
            onChange={(e) => setSourceReferences(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Advanced Data</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tags JSON</label>
          <textarea
            name="tags"
            rows={3}
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Hero Image JSON</label>
          <textarea
            name="heroImage"
            required
            rows={4}
            defaultValue={event?.heroImage ? JSON.stringify(event.heroImage, null, 2) : '{\n  "url": "",\n  "alt": ""\n}'}
            className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">SEO JSON</label>
          <textarea
            name="seo"
            required
            rows={4}
            defaultValue={event?.seo ? JSON.stringify(event.seo, null, 2) : '{\n  "title": "",\n  "description": ""\n}'}
            className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
          />
        </div>
      </div>

      {/* Save Action */}
      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-[#E9D9CA] flex items-center justify-between shadow-lg z-50">
        <div className="flex items-center gap-4">
          <select
            name="publication[status]"
            defaultValue={pubStatus}
            className="border border-gray-300 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#0D6E7A]"
          >
            <option value="draft">Save as Draft</option>
            <option value="published">Publish Live</option>
            <option value="archived">Archived</option>
          </select>
          
          <input 
            type="hidden" 
            name="publication[publishedAt]" 
            value={pubStatus === 'published' && !pubDate ? new Date().toISOString() : pubDate} 
          />
        </div>
        
        <div className="flex items-center gap-4">
          {event && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              Delete Event
            </button>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#0D6E7A] text-white px-8 py-2 rounded-lg hover:bg-[#095663] transition-colors font-medium disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </div>
    </form>
  );
}
