import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import AuthorForm from '@/components/admin/AuthorForm';

export const metadata = { title: 'Edit Author — Sunward Admin' };

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const author = await prisma.author.findUnique({ where: { id } });
  if (!author) notFound();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2B221C]">Edit Author</h1>
        <p className="text-sm text-gray-500 mt-1">{author.name}</p>
      </div>
      <AuthorForm author={author} />
    </div>
  );
}