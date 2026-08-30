import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { deleteNews } from './actions';

export const metadata = { title: 'Travel News' };
export const dynamic = 'force-dynamic';

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  await requireAdmin();
  const { q, category } = await searchParams;

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (category) where.category = category;
  
  // Note: we can't easily filter by status at DB level because it's inside JSON, 
  // but Prisma does support JSON filtering if we need to. Let's fetch and filter in memory if we wanted to, 
  // or just use Prisma JSON filter: 
  // where.publication = { path: ['status'], equals: 'published' } (PostgreSQL only usually).
  // We'll skip status filter for simplicity and just show it in the table.

  const news = await prisma.news.findMany({
    where,
    orderBy: { id: 'desc' }, // Can't easily order by JSON publishedAt
    include: { country: true, destination: true },
  });

  // Sort by publication.publishedAt in memory
  news.sort((a, b) => {
    const pubA = (a.publication as any)?.publishedAt || '';
    const pubB = (b.publication as any)?.publishedAt || '';
    return pubB.localeCompare(pubA);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Travel News</h1>
          <p className="text-[#76675D] text-sm mt-1">Manage global travel news, updates, and alerts.</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 bg-[#E8622C] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#C74A1E] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create News
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
            name="category"
            defaultValue={category || ''}
            className="border border-[#E9D9CA] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622C] bg-white"
          >
            <option value="">All Categories</option>
            <option value="flight-news">Flight News</option>
            <option value="destination-update">Destination Update</option>
            <option value="travel-alert">Travel Alert</option>
            <option value="industry-news">Industry News</option>
          </select>
          <button type="submit" className="bg-[#F0EDE8] text-[#2B221C] px-4 py-2 rounded-md font-medium text-sm hover:bg-[#E9D9CA] transition-colors">
            Filter
          </button>
          {(q || category) && (
            <Link href="/admin/news" className="flex items-center text-sm text-[#76675D] hover:text-[#E8622C]">
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
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Published</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D9CA] text-[#2B221C]">
              {news.map((article) => {
                const pub = article.publication as any;
                const status = pub?.status || 'draft';
                const publishedAt = pub?.publishedAt;
                return (
                  <tr key={article.id} className="hover:bg-[#F9F6F2] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#2B221C]">{article.title}</div>
                      <div className="text-xs text-[#76675D] font-mono mt-0.5">/{article.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        status === 'published' ? 'bg-emerald-100 text-emerald-800' : 
                        status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {status.toUpperCase()}
                      </span>
                      {article.featured && <span className="ml-2 text-xs text-[#E8622C] font-semibold">Featured</span>}
                      {article.trending && <span className="ml-2 text-xs text-blue-600 font-semibold">Trending</span>}
                    </td>
                    <td className="px-6 py-4 text-[#76675D]">{article.category}</td>
                    <td className="px-6 py-4 text-[#76675D]">
                      {publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/news/${article.id}`}
                          className="text-[#3B6CB7] hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <form action={async () => {
                          'use server';
                          await deleteNews(article.id);
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
                );
              })}
              {news.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#76675D]">
                    No news articles found matching your criteria.
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
