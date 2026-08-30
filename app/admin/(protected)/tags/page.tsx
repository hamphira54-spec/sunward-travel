import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import Link from 'next/link';
import { PlusCircle, Pencil, Tag as TagIcon } from 'lucide-react';

export const metadata = { title: 'Tags — Sunward Admin' };

export default async function TagsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;

  const tags = await prisma.tag.findMany({
    where: q
      ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { slug: { contains: q, mode: 'insensitive' } }] }
      : undefined,
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B221C]">Tags</h1>
          <p className="text-sm text-gray-500 mt-1">{tags.length} tag{tags.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/tags/new"
          className="flex items-center gap-2 bg-[#E8622C] text-white px-4 py-2 rounded-lg hover:bg-[#C94E1E] transition-colors font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          New Tag
        </Link>
      </div>

      <form method="get" className="flex gap-3">
        <input
          type="text" name="q" defaultValue={q || ''}
          placeholder="Search by name or slug..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
        />
        <button type="submit" className="bg-[#0D6E7A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#095663] transition-colors">Search</button>
        {q && <Link href="/admin/tags" className="px-4 py-2 text-sm text-gray-600 hover:underline flex items-center">Clear</Link>}
      </form>

      {tags.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9D9CA] p-16 text-center">
          <TagIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No tags found</p>
          <Link href="/admin/tags/new" className="inline-block mt-4 text-[#E8622C] font-medium hover:underline text-sm">+ New Tag</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E9D9CA] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FFF8F0] border-b border-[#E9D9CA]">
                <th className="px-6 py-3 text-left font-semibold text-[#2B221C]">Tag</th>
                <th className="px-6 py-3 text-left font-semibold text-[#2B221C]">Slug</th>
                <th className="px-6 py-3 text-left font-semibold text-[#2B221C]">Description</th>
                <th className="px-6 py-3 text-left font-semibold text-[#2B221C]">Updated</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EDE5]">
              {tags.map((t) => (
                <tr key={t.id} className="hover:bg-[#FFFBF7]">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8622C]" />
                      <span className="font-medium text-[#2B221C]">{t.name}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{t.slug}</td>
                  <td className="px-6 py-4 text-gray-600 text-xs max-w-xs truncate">{t.description || <span className="text-gray-300">—</span>}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {t.updatedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/tags/${t.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-[#0D6E7A] hover:underline">
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
