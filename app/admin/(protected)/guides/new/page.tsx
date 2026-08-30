import { requireAdmin } from '@/lib/auth/requireAdmin';
import GuideForm from '@/components/admin/GuideForm';
import prisma from '@/lib/db';
import { ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Create Travel Guide' };

export default async function NewGuidePage() {
  const admin = await requireAdmin();
  const [countries, destinations, authors, tags] = await Promise.all([
    prisma.country.findMany({ select: { slug: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.destination.findMany({ select: { slug: true, name: true, country: true }, orderBy: { name: 'asc' } }),
    prisma.author.findMany({ select: { id: true, name: true, slug: true, title: true, avatarUrl: true }, orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-2 text-sm text-[#76675D]">
        <Link href="/admin/guides" className="hover:text-[#E8622C] transition-colors flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          Guides
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#2B221C] font-medium">Create New</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Create Travel Guide</h1>
      </div>

      <GuideForm countries={countries} destinations={destinations} authors={authors} tags={tags} adminRole={admin.role} />
    </div>
  );
}
