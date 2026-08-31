/* eslint-disable @next/next/no-img-element */
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import Link from 'next/link';
import { PlusCircle, Pencil, User } from 'lucide-react';

export const metadata = { title: 'Authors — Sunward Admin' };

export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;

  const authors = await prisma.author.findMany({
    where: q
      ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { slug: { contains: q, mode: 'insensitive' } }] }
      : undefined,
    orderBy: { name: 'asc' },
  });

  const allGuides = await prisma.guide.findMany({ select: { author: true } });
  const guideCountByName: Record<string, number> = {};
  for (const g of allGuides) {
    if (g.author) guideCountByName[g.author] = (guideCountByName[g.author] || 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B221C]">Authors</h1>
          <p className="text-sm text-gray-500 mt-1">{authors.length} author{authors.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/authors/new" className="flex items-center gap-2 bg-[#E8622C] text-white px-4 py-2 rounded-lg hover:bg-[#C94E1E] transition-colors font-medium">
          <PlusCircle className="w-4 h-4" />
          New Author
        </Link>
      </div>

      <form method="get" className="flex gap-3">
        <input type="text" name="q" defaultValue={q || ''} placeholder="Search by name or slug..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
        <button type="submit" className="bg-[#0D6E7A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#095663] transition-colors">Search</button>
        {q && <Link href="/admin/authors" className="px-4 py-2 text-sm text-gray-600 hover:underline flex items-center">Clear</Link>}
      </form>

      {authors.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9D9CA] p-16 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No authors found</p>
          <p className="text-sm text-gray-400 mt-1">Create your first author to get started.</p>
          <Link href="/admin/authors/new" className="inline-block mt-4 text-[#E8622C] font-medium hover:underline text-sm">+ New Author</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E9D9CA] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FFF8F0] border-b border-[#E9D9CA]">
                <th className="px-6 py-3 text-left font-semibold text-[#2B221C]">Author</th>
                <th className="px-6 py-3 text-left font-semibold text-[#2B221C]">Slug</th>
                <th className="px-6 py-3 text-left font-semibold text-[#2B221C]">Role/Title</th>
                <th className="px-6 py-3 text-left font-semibold text-[#2B221C]">Guides</th>
                <th className="px-6 py-3 text-left font-semibold text-[#2B221C]">Updated</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EDE5]">
              {authors.map((a) => (
                <tr key={a.id} className="hover:bg-[#FFFBF7]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {a.avatarUrl ? (
                        <img src={a.avatarUrl} alt={a.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#E9D9CA] flex items-center justify-center">
                          <User className="w-4 h-4 text-[#8B6E5C]" />
                        </div>
                      )}
                      <span className="font-medium text-[#2B221C]">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{a.slug}</td>
                  <td className="px-6 py-4 text-gray-600">{a.title || <span className="text-gray-300">—</span>}</td>
                  <td className="px-6 py-4"><span className="text-xs font-medium text-gray-600">{guideCountByName[a.name] || 0} guide{(guideCountByName[a.name] || 0) !== 1 ? 's' : ''}</span></td>
                  <td className="px-6 py-4 text-xs text-gray-400">{a.updatedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/authors/${a.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-[#0D6E7A] hover:underline">
                      <Pencil className="w-3 h-3" />Edit
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
