import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { notFound } from 'next/navigation';
import EventForm from '@/components/admin/EventForm';
import Link from 'next/link';
import { ChevronLeft, ExternalLink } from 'lucide-react';

export const metadata = { title: 'Edit Event - Sunward Admin' };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const [event, countries, destinations, tags] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    prisma.country.findMany({ orderBy: { name: 'asc' } }),
    prisma.destination.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
  ]);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="text-gray-500 hover:text-black transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-[#2B221C]">Edit Event</h1>
        </div>

        {event.publication && (event.publication as any).status === 'published' && (
          <a
            href={`/events/${event.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#3B6CB7] hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-full"
          >
            <ExternalLink className="w-4 h-4" />
            View Live
          </a>
        )}
      </div>

      <EventForm event={event} countries={countries} destinations={destinations} tags={tags} />
    </div>
  );
}