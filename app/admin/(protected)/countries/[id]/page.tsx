import { requireAdmin } from '@/lib/auth/requireAdmin';
import CountryForm from '@/components/admin/CountryForm';
import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { ChevronRight, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Edit Country' };

export default async function EditCountryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  
  const country = await prisma.country.findUnique({
    where: { id },
  });

  if (!country) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-sm text-[#76675D]">
        <Link href="/admin/countries" className="hover:text-[#E8622C] transition-colors flex items-center gap-1">
          <Globe className="w-4 h-4" />
          Countries
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#2B221C] font-medium truncate max-w-[200px]">{country.name}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Edit Country</h1>
      </div>

      <CountryForm initialData={country} />
    </div>
  );
}
