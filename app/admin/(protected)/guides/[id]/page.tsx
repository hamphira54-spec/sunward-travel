import { requireAdmin } from '@/lib/auth/requireAdmin';
import GuideForm from '@/components/admin/GuideForm';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Edit Travel Guide' };

export default async function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  
  const [guide, countries, destinations] = await Promise.all([
    prisma.guide.findUnique({ where: { id } }),
    prisma.country.findMany({ select: { slug: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.destination.findMany({ select: { slug: true, name: true, country: true }, orderBy: { name: 'asc' } }),
  ]);

  if (!guide) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-2 text-sm text-[#76675D]">
        <Link href="/admin/guides" className="hover:text-[#E8622C] transition-colors flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          Guides
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#2B221C] font-medium truncate max-w-[200px]">{guide.title}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Edit Guide</h1>
        {guide.status === 'published' && (
          <a
            href={`/guides/${guide.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#3B6CB7] hover:text-blue-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Live Page
          </a>
        )}
      </div>

      <GuideForm initialData={guide} countries={countries} destinations={destinations} />
    </div>
  );
}
