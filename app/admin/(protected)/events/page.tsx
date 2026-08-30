import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Calendar, MapPin, Globe, CheckCircle, Clock } from 'lucide-react';
import { EVENT_CATEGORY_LABELS, EventCategory, EventStatus } from '@/lib/content/events';

export const metadata = { title: 'Manage Events - Sunward Admin' };

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pubStatus?: string; lifeStatus?: string }>;
}) {
  await requireAdmin();
  
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || '';
  const categoryFilter = resolvedSearchParams.category || '';
  const pubStatusFilter = resolvedSearchParams.pubStatus || '';
  const lifeStatusFilter = resolvedSearchParams.lifeStatus || '';

  const events = await prisma.event.findMany({
    where: {
      ...(q ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { slug: { contains: q, mode: 'insensitive' } },
        ]
      } : {}),
      ...(categoryFilter ? { category: categoryFilter } : {}),
      ...(pubStatusFilter ? { publication: { path: ['status'], equals: pubStatusFilter } } : {}),
      ...(lifeStatusFilter ? { lifecycleStatus: lifeStatusFilter } : {}),
    },
    include: {
      country: true,
      destination: true,
    },
    orderBy: { startDate: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2B221C]">Events</h1>
        <Link 
          href="/admin/events/new"
          className="inline-flex items-center gap-2 bg-[#0D6E7A] text-white px-4 py-2 rounded-lg hover:bg-[#095663] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          New Event
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E9D9CA] overflow-hidden">
        <div className="p-4 border-b border-[#E9D9CA] bg-gray-50 flex flex-wrap gap-4">
          <form className="flex-1 min-w-[200px] flex gap-4">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search events by title or slug..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E7A]"
            />
            <select
              name="category"
              defaultValue={categoryFilter}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="">All Categories</option>
              {Object.entries(EVENT_CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              name="pubStatus"
              defaultValue={pubStatusFilter}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="">All Publication</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select
              name="lifeStatus"
              defaultValue={lifeStatusFilter}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white"
            >
              <option value="">All Lifecycles</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="postponed">Postponed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black text-sm">
              Filter
            </button>
            {(q || categoryFilter || pubStatusFilter || lifeStatusFilter) && (
              <Link href="/admin/events" className="text-gray-500 hover:text-black flex items-center px-2 text-sm">
                Clear
              </Link>
            )}
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-[#E9D9CA]">
              <tr>
                <th className="px-6 py-4">Title & Dates</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Source/Verify</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D9CA]">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No events found matching your filters.
                  </td>
                </tr>
              ) : (
                events.map((event) => {
                  const pub = event.publication as any;
                  const pubStatus = pub?.status || 'draft';
                  const sources = event.sourceReferences as any[];
                  const hasSources = Array.isArray(sources) && sources.length > 0;
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#2B221C]">{event.title}</div>
                        <div className="text-gray-500 text-xs mt-1">/{event.slug}</div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[#0D6E7A] font-medium">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.startDate).toLocaleDateString()}
                          {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-[#2B221C]">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {event.destination ? event.destination.name : event.country ? event.country.name : 'Global/Online'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 ml-5">
                          {EVENT_CATEGORY_LABELS[event.category as EventCategory] || event.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-medium ${
                            pubStatus === 'published' ? 'bg-green-100 text-green-800' : 
                            pubStatus === 'archived' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {pubStatus.toUpperCase()}
                          </span>
                          <span className="inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
                            {event.lifecycleStatus.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {hasSources ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {sources.length} Source(s)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="inline-flex items-center gap-1 text-[#0D6E7A] hover:text-[#095663] text-sm font-medium"
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
