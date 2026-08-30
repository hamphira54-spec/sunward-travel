'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@prisma/client';
import { upsertEvent, deleteEvent } from '@/app/admin/(protected)/events/actions';
import ContentBlockEditor from '@/components/admin/ContentBlockEditor';
import TagPicker from '@/components/admin/TagPicker';
import MediaPicker from '@/components/admin/MediaPicker';
import { EVENT_CATEGORY_LABELS, EventCategory } from '@/lib/content/events';

export default function EventForm({
  event,
  countries,
  destinations,
  tags = [],
}: {
  event: Event | null;
  countries: any[];
  destinations: any[];
  tags?: any[];
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const [isDirty, setIsDirty] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
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

  const [error, setError] = useState<string | null>(null);

  // Read existing publication metadata safely
  const existingPub = event?.publication as any;
  const existingPubStatus: string = existingPub?.status || 'draft';
  const existingPublishedAt: string = existingPub?.publishedAt || '';

  // State for the current publication status selector
  const [pubStatus, setPubStatus] = useState(existingPubStatus);

  // Source references and tags as editable JSON strings
  const existingSources = event ? (event.sourceReferences as any[]) || [] : [];
  const existingTags = event ? (event.tags as any[]) || [] : [];
  const [sourceReferences, setSourceReferences] = useState(
    existingSources.length > 0 ? JSON.stringify(existingSources, null, 2) : '[]'
  );
  const [tagsStr, setTagsStr] = useState(
    existingTags.length > 0 ? JSON.stringify(existingTags, null, 2) : '[]'
  );

  const [tagsArr, setTagsArr] = useState<string[]>(Array.isArray(existingTags) ? existingTags : []);
  const [heroImageObj, setHeroImageObj] = useState<any>(event?.heroImage || null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Inject controlled state values that need to be fresh
    // (sourceReferences and tags are controlled textareas — FormData already has them)

    const result = await upsertEvent(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
    // On success, the server action redirects — no client-side navigation needed
  }

  async function handleDelete() {
    if (!event) return;
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${event.title}"?\n\nThis action cannot be undone. Related Country, Destination, Media, and Tags will NOT be deleted.`
    );
    if (!confirmed) return;

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
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg font-medium">
          ⚠ {error}
        </div>
      )}

      {/* Hidden fields */}
      <input type="hidden" name="id" value={event?.id || 'new'} />
      {/* Publication fields — individually named, built server-side */}
      <input type="hidden" name="publicationStatus" value={pubStatus} />
      {/* publishedAt: preserve existing if already published, set on first publish */}
      <input
        type="hidden"
        name="publishedAt"
        value={
          pubStatus === 'published'
            ? existingPublishedAt || new Date().toISOString()
            : existingPublishedAt
        }
      />

      {/* ── Basic Info ──────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Basic Information</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={event?.title || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              required
              defaultValue={event?.slug || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
            <p className="text-xs text-gray-500">URL-safe slug. Will be auto-normalized server-side (e.g. spaces → hyphens). Must be unique.</p>
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Excerpt / Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              name="excerpt"
              required
              rows={3}
              defaultValue={event?.excerpt || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
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

      {/* ── Dates & Time ────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Dates & Time</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Start Date (ISO 8601) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="startDate"
              required
              placeholder="e.g. 2027-02-04T00:00:00Z"
              defaultValue={event?.startDate || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">End Date (ISO 8601)</label>
            <input
              type="text"
              name="endDate"
              placeholder="e.g. 2027-02-11T23:59:59Z"
              defaultValue={event?.endDate || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Timezone (IANA)</label>
            <input
              type="text"
              name="timezone"
              placeholder="e.g. Asia/Singapore, Europe/London"
              defaultValue={event?.timezone || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
            <p className="text-xs text-gray-500">Must be a valid IANA timezone. Validated server-side.</p>
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

      {/* ── Location & Venue ────────────────────────────────────────────────── */}
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
              {countries.map((c) => (
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
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name} ({d.country})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">Venue JSON</label>
            <p className="text-xs text-gray-500">
              Required fields: <code>name</code> (string). Optional: <code>city</code>, <code>address</code>, <code>latitude</code> (number), <code>longitude</code> (number).
              <br />Example: <code>{`{"name":"Marina Bay Circuit","city":"Singapore"}`}</code>
            </p>
            <textarea
              name="venue"
              rows={4}
              defaultValue={event?.venue ? JSON.stringify(event.venue, null, 2) : ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ── Statuses & Links ────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Statuses & Links</h2>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-sm">
          <strong>Note:</strong> Publication status is a CMS lifecycle state. Lifecycle status reflects the real-world state of the event. These are independent.
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Lifecycle Status <span className="text-red-500">*</span>
            </label>
            <select
              name="lifecycleStatus"
              required
              defaultValue={event?.lifecycleStatus || 'scheduled'}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none bg-white"
            >
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="postponed">Postponed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <p className="text-xs text-gray-500">Real-world state of the event (not the CMS publication state).</p>
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
              type="text"
              name="officialUrl"
              placeholder="https://..."
              defaultValue={event?.officialUrl || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
            <p className="text-xs text-gray-500">http/https only. Validated server-side.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ticket URL</label>
            <input
              type="text"
              name="ticketUrl"
              placeholder="https://..."
              defaultValue={event?.ticketUrl || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
            />
            <p className="text-xs text-gray-500">http/https only. Validated server-side.</p>
          </div>
        </div>
      </div>

      {/* ── Event Description ───────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Event Description</h2>
        <ContentBlockEditor initialBlocks={event && Array.isArray(event.body) ? event.body as any[] : []} />
      </div>

      {/* ── Factual Sourcing ─────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#2B221C]">Factual Sourcing</h2>
          <p className="text-sm text-amber-700 mt-1 bg-amber-50 border border-amber-200 rounded p-2">
            ⚠ <strong>Required to publish.</strong> Attaching sources does NOT automatically verify this event — factual verification remains an editorial responsibility.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Source References JSON <span className="text-gray-400">(array of {`{"name":"...","url":"https://..."}`})</span>
          </label>
          <textarea
            name="sourceReferences"
            rows={5}
            value={sourceReferences}
            onChange={(e) => setSourceReferences(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
          />
        </div>
      </div>

      {/* ── Advanced Data ───────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-6">
        <h2 className="text-xl font-bold text-[#2B221C]">Advanced Data</h2>

        <div className="space-y-2"><TagPicker value={tagsArr} onChange={setTagsArr} tags={tags} label="Tags" /></div>

        <div className="space-y-2"><MediaPicker value={heroImageObj} onChange={setHeroImageObj} label="Hero Image" /></div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">SEO JSON</label>
          <textarea
            name="seo"
            rows={4}
            defaultValue={event?.seo ? JSON.stringify(event.seo, null, 2) : '{\n  "title": "",\n  "description": ""\n}'}
            className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
          />
        </div>
      </div>

      {/* ── Save Action Bar ─────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-[#E9D9CA] flex items-center justify-between shadow-lg z-50">
        <div className="flex items-center gap-4">
          <select
            value={pubStatus}
            onChange={(e) => setPubStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#0D6E7A]"
          >
            <option value="draft">Save as Draft</option>
            <option value="published">Publish Live</option>
            <option value="archived">Archived</option>
          </select>
          <span className="text-xs text-gray-400">
            {pubStatus === 'published' ? 'Publishing requires sources.' : pubStatus === 'archived' ? 'Archived: URL may still resolve.' : 'Draft: not publicly visible.'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {event && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
        {event?.id && (
          <a
            href={`/admin/preview/events/${event.id}`}
            target="_blank"
            className="bg-[#F0EDE8] text-[#2B221C] px-6 py-2.5 rounded-md font-medium hover:bg-[#E9D9CA] transition-colors border border-[#E9D9CA]"
          >
            Preview
          </a>
        )}
        {event?.id && (
          <a
            href={`/admin/preview/events/${event.id}`}
            target="_blank"
            className="bg-[#F0EDE8] text-[#2B221C] px-6 py-2.5 rounded-md font-medium hover:bg-[#E9D9CA] transition-colors border border-[#E9D9CA]"
          >
            Preview
          </a>
        )}
        </div>
      </div>
      <input type="hidden" name="tags" value={JSON.stringify(tagsArr)} />
      <input type="hidden" name="heroImage" value={heroImageObj ? JSON.stringify(heroImageObj) : ''} />
    </form>
  );
}
