/* eslint-disable @next/next/no-img-element */
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import Link from 'next/link';
import { PlusCircle, Pencil, Image as ImageIcon, AlertTriangle } from 'lucide-react';

export const metadata = { title: 'Media Library — Sunward Admin' };

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  await requireAdmin();
  const { q, type } = await searchParams;

  const media = await prisma.media.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { alt: { contains: q, mode: 'insensitive' } },
            { storageKey: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  function formatBytes(b: number | null) {
    if (!b) return null;
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B221C]">Media Library</h1>
          <p className="text-sm text-gray-500 mt-1">{media.length} item{media.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/media/new" className="flex items-center gap-2 bg-[#E8622C] text-white px-4 py-2 rounded-lg hover:bg-[#C94E1E] transition-colors font-medium">
          <PlusCircle className="w-4 h-4" />
          Upload Media
        </Link>
      </div>

      <form method="get" className="flex gap-3">
        <input type="text" name="q" defaultValue={q || ''} placeholder="Search by title, alt text..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
        <button type="submit" className="bg-[#0D6E7A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#095663] transition-colors">Search</button>
        {q && <Link href="/admin/media" className="px-4 py-2 text-sm text-gray-600 hover:underline flex items-center">Clear</Link>}
      </form>

      {media.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E9D9CA] p-16 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No media found</p>
          <p className="text-sm text-gray-400 mt-1">Upload your first image to get started.</p>
          <Link href="/admin/media/new" className="inline-block mt-4 text-[#E8622C] font-medium hover:underline text-sm">+ Upload Media</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((m) => (
            <Link key={m.id} href={`/admin/media/${m.id}`} className="group bg-white rounded-xl border border-[#E9D9CA] overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {m.url ? (
                  <img src={m.url} alt={m.alt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                {!m.alt && (
                  <div className="absolute top-1 right-1 bg-amber-500 rounded-full p-0.5" title="Missing alt text">
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-[#2B221C] truncate">{m.title || m.alt || 'Untitled'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {m.width && m.height ? `${m.width}×${m.height} · ` : ''}
                  {formatBytes(m.sizeBytes) || m.mimeType?.split('/')[1]?.toUpperCase() || 'Image'}
                </p>
                {!m.alt && <p className="text-[10px] text-amber-600 font-medium mt-0.5">⚠ No alt text</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}