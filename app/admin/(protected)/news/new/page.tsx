import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import NewsForm from '@/components/admin/NewsForm';

export const metadata = { title: 'Create News | Admin' };
export const dynamic = 'force-dynamic';

export default async function NewNewsPage() {
  await requireAdmin();
  const [countries, destinations, authors] = await Promise.all([
    prisma.country.findMany({ select: { slug: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.destination.findMany({ select: { slug: true, name: true, country: true }, orderBy: { name: 'asc' } }),
    prisma.author.findMany({ select: { name: true, id: true, slug: true }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/news"
          className="text-[#76675D] hover:text-[#E8622C] transition-colors"
          title="Back to News"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Create News Article</h1>
      </div>

      <NewsForm countries={countries} destinations={destinations} authors={authors} />
    </div>
  );
}
