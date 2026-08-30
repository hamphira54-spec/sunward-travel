import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NewsForm from '@/components/admin/NewsForm';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit News | Admin' };
export const dynamic = 'force-dynamic';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  
  const [article, countries, destinations, authors] = await Promise.all([
    prisma.news.findUnique({ where: { id } }),
    prisma.country.findMany({ select: { slug: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.destination.findMany({ select: { slug: true, name: true, country: true }, orderBy: { name: 'asc' } }),
    prisma.author.findMany({ select: { name: true, id: true, slug: true }, orderBy: { name: 'asc' } }),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/news"
            className="text-[#76675D] hover:text-[#E8622C] transition-colors"
            title="Back to News"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Edit News Article</h1>
        </div>
        {(article.publication as any)?.status === 'published' && (
          <a
            href={`/news/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#3B6CB7] hover:underline"
          >
            View live
          </a>
        )}
      </div>

      <NewsForm initialData={article} countries={countries} destinations={destinations} authors={authors} />
    </div>
  );
}
