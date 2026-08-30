import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { deleteCountry } from './actions';

export const metadata = { title: 'Countries' };
export const dynamic = 'force-dynamic';

export default async function CountriesPage() {
  await requireAdmin();
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Countries</h1>
          <p className="text-[#76675D] text-sm mt-1">Manage destination regions and top-level country content.</p>
        </div>
        <Link
          href="/admin/countries/new"
          className="flex items-center gap-2 bg-[#E8622C] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#C74A1E] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Country
        </Link>
      </div>

      <div className="bg-white border border-[#E9D9CA] rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#F0EDE8] text-[#76675D] border-b border-[#E9D9CA]">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Continent</th>
              <th className="px-6 py-3 font-semibold">Region</th>
              <th className="px-6 py-3 font-semibold text-center">Featured</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9D9CA] text-[#2B221C]">
            {countries.map((country) => (
              <tr key={country.id} className="hover:bg-[#F9F6F2] transition-colors">
                <td className="px-6 py-4 font-medium">{country.name}</td>
                <td className="px-6 py-4">{country.continent}</td>
                <td className="px-6 py-4 text-[#76675D]">{country.region}</td>
                <td className="px-6 py-4 text-center">
                  {country.featured ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/countries/${country.id}`}
                      className="text-[#3B6CB7] hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <form action={async () => {
                      'use server';
                      await deleteCountry(country.id);
                    }}>
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                        
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {countries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#76675D]">
                  No countries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
