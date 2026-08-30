import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import GuidePresentation from '@/components/content/GuidePresentation';

export const metadata = {
  title: 'Preview Guide | Sunward Admin',
  robots: 'noindex, nofollow',
};

export default async function GuidePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  
  const guide = await prisma.guide.findUnique({ where: { id } });
  if (!guide) notFound();

  // Parse JSON fields
  const parsedGuide = {
    ...guide,
    tags: guide.tags as any,
    heroImage: guide.heroImage as any,
    cardImage: guide.cardImage as any,
    seo: guide.seo as any,
    tocSections: guide.tocSections as any,
    affiliateCTAs: guide.affiliateCTAs as any,
    body: guide.body as any,
  };

  const countryEntry = parsedGuide.countrySlug 
    ? await prisma.country.findUnique({ where: { slug: parsedGuide.countrySlug } }) 
    : null;
    
  const destEntry = parsedGuide.destinationSlug 
    ? await prisma.destination.findUnique({ where: { slug: parsedGuide.destinationSlug } }) 
    : null;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#2B221C] text-[#F0EDE8] px-4 py-2 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="bg-[#E8622C] text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            {parsedGuide.status} PREVIEW
          </span>
          <span className="text-sm font-medium opacity-80">
            {parsedGuide.title}
          </span>
        </div>
        <Link 
          href={`/admin/guides/${id}`}
          className="flex items-center gap-1.5 text-sm font-medium hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Editor
        </Link>
      </div>
      <div className="pointer-events-none opacity-50 relative">
         {/* We let it be fully interactable so they can preview links, but we can just render normal */}
      </div>
      <GuidePresentation 
        guide={parsedGuide} 
        countryEntry={countryEntry} 
        destEntry={destEntry} 
        relatedGuides={[]} 
        previewMode={true} 
      />
    </div>
  );
}
