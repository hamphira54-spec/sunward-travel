import { requireAdmin } from "@/lib/auth/requireAdmin";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Shield } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: {
    default: "Sunward Admin",
    template: "%s | Sunward Admin",
  },
  robots: { index: false, follow: false },
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
    throw e;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F2]">
      {/* ── Top Header Bar ───────────────────────────────────────────── */}
      <header className="bg-[#2B221C] text-[#FFF8F0] shadow-md z-20 shrink-0">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#E8622C] shrink-0" />
            <span className="font-serif font-bold text-lg tracking-tight">
              Sunward Admin
            </span>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-[#C4AFA6] truncate max-w-[180px]">
                {admin.displayName ?? admin.email}
              </span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#8B5E3C] text-white font-medium">
                {admin.role}
              </span>
            </div>

            <form
              action={async () => {
                "use server";
                const supabase = await createClient();
                await supabase.auth.signOut();
                redirect("/admin/login");
              }}
            >
              <button
                type="submit"
                className="text-sm text-[#F4A825] hover:text-[#FFD166] transition-colors font-medium"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Body: Sidebar + Content ───────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar role={admin.role} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
