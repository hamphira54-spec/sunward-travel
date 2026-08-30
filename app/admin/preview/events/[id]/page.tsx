import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import EventPresentation from '@/components/content/EventPresentation';

export const metadata = {
  title: 'Preview Event | Sunward Admin',
  robots: 'noindex, nofollow',
};

export default async function EventPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const parsedEvent = {
    ...event,
    publication: event.publication as any,
    venue: event.venue as any,
    sourceReferences: event.sourceReferences as any,
    tags: event.tags as any,
    heroImage: event.heroImage as any,
    seo: event.seo as any,
    body: event.body as any,
  };

  const countryEntry = parsedEvent.countrySlug 
    ? await prisma.country.findUnique({ where: { slug: parsedEvent.countrySlug } }) 
    : null;
    
  const destEntry = parsedEvent.destinationSlug 
    ? await prisma.destination.findUnique({ where: { slug: parsedEvent.destinationSlug } }) 
    : null;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#2B221C] text-[#F0EDE8] px-4 py-2 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="bg-[#E8622C] text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            {parsedEvent.publication?.status || 'DRAFT'} PREVIEW
          </span>
          <span className="text-sm font-medium opacity-80">
            {parsedEvent.title}
          </span>
        </div>
        <Link 
          href={`/admin/events/${id}`}
          className="flex items-center gap-1.5 text-sm font-medium hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Editor
        </Link>
      </div>
      <EventPresentation 
        event={parsedEvent} 
         
         
        relatedEvents={[]}
        relatedGuides={[]} 
        previewMode={true} 
      />
    </div>
  );
}
