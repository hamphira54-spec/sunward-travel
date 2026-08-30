import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import MediaEditForm from '@/components/admin/MediaEditForm';

export const metadata = { title: 'Edit Media — Sunward Admin' };

export default async function EditMediaPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) notFound();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2B221C]">Edit Media</h1>
        <p className="text-sm text-gray-500 mt-1">{media.title || media.alt || media.url}</p>
      </div>
      <MediaEditForm media={media} />
    </div>
  );
}