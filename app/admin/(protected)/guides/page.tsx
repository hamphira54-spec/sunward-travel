import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { deleteGuide } from './actions';

export const metadata = { title: 'Travel Guides' };
export const dynamic = 'force-dynamic';

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string }>;
}) {
  await requireAdmin();
  const { q, status, category } = await searchParams;

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;
  if (category) where.category = category;

  const guides = await prisma.guide.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    include: { country: true, destination: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Travel Guides</h1>
          <p className="text-[#76675D] text-sm mt-1">Manage long-form travel guides and itineraries.</p>
        </div>
        <Link
          href="/admin/guides/new"
          className="flex items-center gap-2 bg-[#E8622C] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#C74A1E] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Guide
        </Link>
      </div>

      <div className="bg-white border border-[#E9D9CA] rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <form className="flex-1 flex gap-4 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#76675D]" />
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Search by title or slug..."
              className="w-full pl-9 pr-4 py-2 border border-[#E9D9CA] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C]"
            />
          </div>
          <select
            name="status"
            defaultValue={status || ''}
            className="border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <button type="submit" className="bg-[#F0EDE8] text-[#2B221C] px-4 py-2 rounded-md font-medium text-sm hover:bg-[#E9D9CA] transition-colors">
            Filter
          </button>
          {(q || status || category) && (
            <Link href="/admin/guides" className="flex items-center text-sm text-[#76675D] hover:text-[#E8622C]">
              Clear
            </Link>
          )}
        </form>
      </div>

      <div className="bg-white border border-[#E9D9CA] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F0EDE8] text-[#76675D] border-b border-[#E9D9CA]">
              <tr>
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Location</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Published</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D9CA] text-[#2B221C]">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-[#F9F6F2] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#2B221C]">{guide.title}</div>
                    <div className="text-xs text-[#76675D] font-mono mt-0.5">/{guide.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      guide.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 
                      guide.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {guide.status?.toUpperCase() || 'DRAFT'}
                    </span>
                    {guide.featured && <span className="ml-2 text-xs text-[#E8622C] font-semibold"></span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[#2B221C]">{guide.destination?.name || guide.country?.name || 'Global'}</div>
                  </td>
                  <td className="px-6 py-4 text-[#76675D]">{guide.category}</td>
                  <td className="px-6 py-4 text-[#76675D]">
                    {new Date(guide.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/guides/${guide.id}`}
                        className="text-[#3B6CB7] hover:text-blue-800 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form action={async () => {
                        'use server';
                        await deleteGuide(guide.id);
                      }}>
                        <button
                          type="submit"
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                          
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {guides.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#76675D]">
                    No guides found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
