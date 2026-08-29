import { requireAdmin } from '@/lib/auth/requireAdmin';
import DestinationForm from '@/components/admin/DestinationForm';
import prisma from '@/lib/db';
import { ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Add Destination' };

export default async function NewDestinationPage() {
  await requireAdmin();
  const countries = await prisma.country.findMany({
    select: { slug: true, name: true, continent: true, region: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-[#76675D]">
        <Link href="/admin/destinations" className="hover:text-[#E8622C] transition-colors flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          Destinations
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#2B221C] font-medium">Add New</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Add New Destination</h1>
      </div>

      <DestinationForm countries={countries} />
    </div>
  );
}
