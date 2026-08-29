import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import AdminStatCard from "@/components/admin/AdminStatCard";
import {
  MapPin,
  BookOpen,
  Newspaper,
  CalendarDays,
  Globe,
  Users,
  CheckCircle2,
  Database,
  ShieldCheck,
} from "lucide-react";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function getDashboardStats() {
  const [
    countries,
    destinations,
    guidesPublished,
    guidesTotal,
    newsTotal,
    eventsPublished,
    eventsTotal,
    adminUsers,
  ] = await Promise.all([
    prisma.country.count(),
    prisma.destination.count(),
    prisma.guide.count({ where: { status: "published" } }),
    prisma.guide.count(),
    prisma.news.count(),
    prisma.event.count({
      where: { publication: { path: ["status"], equals: "published" } },
    }),
    prisma.event.count(),
    prisma.adminUser.count({ where: { status: "ACTIVE" } }),
  ]);

  return {
    countries,
    destinations,
    guidesPublished,
    guidesTotal,
    newsTotal,
    eventsPublished,
    eventsTotal,
    adminUsers,
  };
}

export default async function AdminDashboard() {
  const [admin, stats] = await Promise.all([
    requireAdmin(),
    getDashboardStats(),
  ]);

  const greeting = (() => {
    const h = new Date().getUTCHours() + 7; // ICT UTC+7
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-8">
      {/* ── Welcome ────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-[#2B221C] font-serif">
          {greeting},{" "}
          {admin.displayName ?? admin.email.split("@")[0]}
        </h1>
        <p className="text-[#76675D] text-sm mt-1">
          Sunward Travel CMS · Phase L3 Active
        </p>
      </div>

      {/* ── Content Stats ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#76675D] mb-3">
          Content Library
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminStatCard
            label="Countries"
            value={stats.countries}
            icon={Globe}
            iconBg="bg-[#F0EDE8]"
            iconColor="text-[#8B5E3C]"
            sublabel="Active regions"
          />
          <AdminStatCard
            label="Destinations"
            value={stats.destinations}
            icon={MapPin}
            iconBg="bg-[#FEF3EC]"
            iconColor="text-[#E8622C]"
            sublabel="Across all regions"
          />
          <AdminStatCard
            label="Travel Guides"
            value={stats.guidesPublished}
            icon={BookOpen}
            iconBg="bg-[#FFF8EC]"
            iconColor="text-[#C47B1A]"
            sublabel={`${stats.guidesTotal} total · ${stats.guidesPublished} published`}
          />
          <AdminStatCard
            label="News Articles"
            value={stats.newsTotal}
            icon={Newspaper}
            iconBg="bg-[#EDF4FF]"
            iconColor="text-[#3B6CB7]"
            sublabel="Published articles"
          />
          <AdminStatCard
            label="Events"
            value={stats.eventsPublished}
            icon={CalendarDays}
            iconBg="bg-[#F0FFF4]"
            iconColor="text-[#2E7D52]"
            sublabel={`${stats.eventsTotal} total · ${stats.eventsPublished} published`}
          />
          {admin.role === "SUPER_ADMIN" && (
            <AdminStatCard
              label="Admin Users"
              value={stats.adminUsers}
              icon={Users}
              iconBg="bg-[#F5F0FF]"
              iconColor="text-[#6B4EBB]"
              sublabel="Active accounts"
            />
          )}
        </div>
      </section>

      {/* ── System Status ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#76675D] mb-3">
          System Status
        </h2>
        <div className="bg-white rounded-lg border border-[#E9D9CA] divide-y divide-[#F0EDE8]">
          {[
            {
              label: "Database",
              detail: "PostgreSQL · Supabase · Connected",
              icon: Database,
            },
            {
              label: "Authentication",
              detail: "Supabase Auth · Prisma AdminUser · Active",
              icon: ShieldCheck,
            },
            {
              label: "Content",
              detail: `${stats.destinations} destinations · ${stats.guidesPublished} guides · ${stats.newsTotal} news · ${stats.eventsPublished} events`,
              icon: CheckCircle2,
            },
          ].map(({ label, detail, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <Icon className="w-4 h-4 text-[#8B5E3C] shrink-0" />
              <div className="min-w-0">
                <span className="text-sm font-medium text-[#2B221C]">
                  {label}
                </span>
                <span className="text-xs text-[#76675D] ml-2 truncate">
                  {detail}
                </span>
              </div>
              <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                OK
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Phase Roadmap ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#76675D] mb-3">
          CMS Roadmap
        </h2>
        <div className="bg-white rounded-lg border border-[#E9D9CA] p-5">
          <div className="space-y-2">
            {[
              { phase: "L1", label: "Auth & Admin Architecture", done: true },
              { phase: "L2", label: "Dashboard & Navigation Foundation", done: true },
              { phase: "L3", label: "Destinations & Countries CRUD", done: true },
              { phase: "L4", label: "Travel Guides CRUD", done: false },
              { phase: "L5", label: "News & Events CRUD", done: false },
              { phase: "L6", label: "Media Library", done: false },
            ].map(({ phase, label, done }) => (
              <div key={phase} className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    done
                      ? "bg-[#E8622C] text-white"
                      : "bg-[#F0EDE8] text-[#76675D]"
                  }`}
                >
                  {phase}
                </span>
                <span
                  className={`text-sm ${
                    done
                      ? "text-[#2B221C] font-medium"
                      : "text-[#76675D]"
                  }`}
                >
                  {label}
                </span>
                {done && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
