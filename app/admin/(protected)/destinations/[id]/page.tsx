import { requireAdmin } from '@/lib/auth/requireAdmin';
import DestinationForm from '@/components/admin/DestinationForm';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Edit Destination' };

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  
  const [destination, countries] = await Promise.all([
    prisma.destination.findUnique({ where: { id } }),
    prisma.country.findMany({
      select: { slug: true, name: true, continent: true, region: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  if (!destination) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-[#76675D]">
        <Link href="/admin/destinations" className="hover:text-[#E8622C] transition-colors flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          Destinations
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#2B221C] font-medium truncate max-w-[200px]">{destination.name}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Edit Destination</h1>
      </div>

      <DestinationForm initialData={destination} countries={countries} />
    </div>
  );
}
