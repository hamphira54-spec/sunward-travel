import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import TagForm from '@/components/admin/TagForm';

export const metadata = { title: 'Edit Tag — Sunward Admin' };

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) notFound();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2B221C]">Edit Tag</h1>
        <p className="text-sm text-gray-500 mt-1">{tag.name}</p>
      </div>
      <TagForm tag={tag} />
    </div>
  );
}