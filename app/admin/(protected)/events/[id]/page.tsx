import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import EventForm from '@/components/admin/EventForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Edit Event - Sunward Admin' };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [event, countries, destinations] = await Promise.all([
    prisma.event.findUnique({ where: { id } }),
    prisma.country.findMany({ orderBy: { name: 'asc' } }),
    prisma.destination.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/events"
          className="text-gray-500 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-[#2B221C]">Edit Event: {event.title}</h1>
      </div>

      <EventForm 
        event={event} 
        countries={countries}
        destinations={destinations}
      />
    </div>
  );
}
