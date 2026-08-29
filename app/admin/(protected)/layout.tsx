import { requireAdmin } from '@/lib/auth/requireAdmin';
import { redirect } from 'next/navigation';
import { Shield } from 'lucide-react';

import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Sunward Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (e) {
    // redirect throws an error that should be caught by Next.js, but just in case
    throw e;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-[#2B221C] text-[#FFF8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Shield className="w-8 h-8 text-[#E8622C] mr-2" />
                <span className="font-serif font-bold text-xl">Sunward Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-300">{admin.email}</span>
                <span className="ml-2 px-2 py-1 text-xs rounded bg-[#8B5E3C] text-white">{admin.role}</span>
              </div>
              <form action={async () => {
                'use server';
                const supabase = await createClient();
                await supabase.auth.signOut();
                redirect('/admin/login');
              }}>
                <button type="submit" className="text-sm text-[#F4A825] hover:text-[#FFD166] transition-colors">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

