import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { deleteDestination } from './actions';

export const metadata = { title: 'Destinations' };
export const dynamic = 'force-dynamic';

export default async function DestinationsPage() {
  await requireAdmin();
  const destinations = await prisma.destination.findMany({
    orderBy: { name: 'asc' },
    include: { countryRel: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B221C] font-serif">Destinations</h1>
          <p className="text-[#76675D] text-sm mt-1">Manage cities, regions, and specific travel destinations.</p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="flex items-center gap-2 bg-[#E8622C] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#C74A1E] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Destination
        </Link>
      </div>

      <div className="bg-white border border-[#E9D9CA] rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#F0EDE8] text-[#76675D] border-b border-[#E9D9CA]">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Country</th>
              <th className="px-6 py-3 font-semibold">Continent</th>
              <th className="px-6 py-3 font-semibold text-center">Featured</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9D9CA] text-[#2B221C]">
            {destinations.map((dest) => (
              <tr key={dest.id} className="hover:bg-[#F9F6F2] transition-colors">
                <td className="px-6 py-4 font-medium">{dest.name}</td>
                <td className="px-6 py-4">{dest.country}</td>
                <td className="px-6 py-4 text-[#76675D]">{dest.continent}</td>
                <td className="px-6 py-4 text-center">
                  {dest.featured ? (
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
                      href={`/admin/destinations/${dest.id}`}
                      className="text-[#3B6CB7] hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <form action={async () => {
                      'use server';
                      await deleteDestination(dest.id);
                    }}>
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                        onClick={(e) => {
                          if (!confirm(`Are you sure you want to delete ${dest.name}?`)) e.preventDefault();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {destinations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[#76675D]">
                  No destinations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
