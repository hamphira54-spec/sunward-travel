import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import EventForm from '@/components/admin/EventForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = { title: 'New Event - Sunward Admin' };

export default async function NewEventPage() {
  const admin = await requireAdmin();

  const [countries, destinations, tags] = await Promise.all([
    prisma.country.findMany({ orderBy: { name: 'asc' } }),
    prisma.destination.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="text-gray-500 hover:text-black transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
        <h1 className="text-2xl font-bold text-[#2B221C]">Create New Event</h1>
      </div>
      <EventForm event={null} countries={countries} destinations={destinations} tags={tags} adminRole={admin.role} />
    </div>
  );
}
