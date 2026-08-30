import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import Link from 'next/link';
import AuditLog from '@/components/admin/AuditLog';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import NewsForm from '@/components/admin/NewsForm';

export const metadata = { title: 'Edit News | Admin' };
export const dynamic = 'force-dynamic';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  
  const [article, countries, destinations, authors, tags] = await Promise.all([
    prisma.news.findUnique({ where: { id } }),
    prisma.country.findMany({ select: { slug: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.destination.findMany({ select: { slug: true, name: true, country: true }, orderBy: { name: 'asc' } }),
    prisma.author.findMany({ select: { id: true, name: true, slug: true, title: true, avatarUrl: true }, orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
  ]);

  if (!article) notFound();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/news" className="text-[#76675D] hover:text-[#E8622C] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Edit News Article</h1>
        </div>
        
        {article.publication && (article.publication as any).status === 'published' && (
          <a
            href={`/news/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#3B6CB7] hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-full"
          >
            <ExternalLink className="w-4 h-4" />
            View Live
          </a>
        )}
      </div>

      <NewsForm initialData={article} countries={countries} destinations={destinations} authors={authors} tags={tags} adminRole={admin.role} />
      <AuditLog contentType="news" contentId={id} />
    </div>
  );
}