'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  BookOpen,
  Newspaper,
  CalendarDays,
  Users,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  soon?: boolean;
  superAdminOnly?: boolean;
}

interface NavGroup {
  heading?: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    heading: 'Content',
    items: [
      { label: 'Destinations', href: '/admin/destinations', icon: MapPin, soon: true },
      { label: 'Travel Guides', href: '/admin/guides', icon: BookOpen, soon: true },
      { label: 'News & Articles', href: '/admin/news', icon: Newspaper, soon: true },
      { label: 'Events', href: '/admin/events', icon: CalendarDays, soon: true },
    ],
  },
  {
    heading: 'System',
    items: [
      { label: 'Admin Users', href: '/admin/users', icon: Users, soon: true, superAdminOnly: true },
    ],
  },
];

interface AdminSidebarProps {
  role: string;
}

export default function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const isSuperAdmin = role === 'SUPER_ADMIN';

  return (
    <aside className="w-64 min-h-full bg-[#1E1712] flex flex-col shrink-0">
      <nav className="flex-1 px-3 py-6 space-y-6">
        {NAV_GROUPS.map((group, gi) => {
          const visibleItems = group.items.filter(
            (item) => !item.superAdminOnly || isSuperAdmin
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={gi}>
              {group.heading && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#76675D]">
                  {group.heading}
                </p>
              )}
              <ul className="space-y-1">
                {visibleItems.map((item) => {
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  if (item.soon) {
                    return (
                      <li key={item.href}>
                        <span className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#4A3D36] cursor-not-allowed select-none">
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          <span className="text-[10px] font-medium bg-[#2B221C] text-[#8B5E3C] px-1.5 py-0.5 rounded">
                            Soon
                          </span>
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group ${
                          isActive
                            ? 'bg-[#E8622C] text-white font-medium'
                            : 'text-[#C4AFA6] hover:bg-[#2B221C] hover:text-[#FFF8F0]'
                        }`}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="px-4 py-4 border-t border-[#2B221C]">
        <p className="text-[10px] text-[#4A3D36] text-center">
          Sunward Admin · Phase L2
        </p>
      </div>
    </aside>
  );
}
