// ─────────────────────────────────────────────────────────────────────────────
// BookingSearch — Abstracted search widget
// ─────────────────────────────────────────────────────────────────────────────
// This component owns the tab UI and search form state.
// When a `provider` prop is passed (after affiliate credentials are approved),
// it delegates rendering to that provider's adapter.
//
// AFFILIATE INTEGRATION POINTS are marked with:
//   ╔══ AFFILIATE HOOK ══╗
//   ╚════════════════════╝
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useState, useRef, useEffect } from 'react';
import { Plane, Building2, Car, Sailboat, Compass } from 'lucide-react';
import type { BookingTab, BookingProvider, SearchParams } from './adapters/types';
import FlightSearchForm from '@/components/flights/FlightSearchForm';

interface BookingSearchProps {
  defaultTab?: BookingTab;
  /**
   * ╔══ AFFILIATE HOOK ══╗
   * Wire in a provider adapter here once credentials are approved.
   * Leave undefined to show the branded placeholder UI.
   * ╚════════════════════╝
   */
  provider?: BookingProvider;
  className?: string;
}

const TABS: { id: BookingTab; label: string; icon: React.ReactNode }[] = [
  { id: 'flights',    label: 'Flights',    icon: <Plane    size={16} /> },
  { id: 'hotels',     label: 'Hotels',     icon: <Building2 size={16} /> },
  { id: 'cars',       label: 'Cars',       icon: <Car      size={16} /> },
  { id: 'cruises',    label: 'Cruises',    icon: <Sailboat  size={16} /> },
  { id: 'activities', label: 'Activities', icon: <Compass  size={16} /> },
];

export default function BookingSearch({
  defaultTab = 'flights',
  provider,
  className = '',
}: BookingSearchProps) {
  const [activeTab, setActiveTab] = useState<BookingTab>(defaultTab);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  const searchParams: SearchParams = { tab: activeTab };

  // ╔══ AFFILIATE HOOK ══╗
  // When a provider is supplied, mount its widget into widgetContainerRef.
  // The provider's renderWidget handles all SDK initialization.
  useEffect(() => {
    if (!provider?.renderWidget || !widgetContainerRef.current) return;
    const cleanup = provider.renderWidget(searchParams, widgetContainerRef.current);
    return () => { if (typeof cleanup === 'function') cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, activeTab]);
  // ╚════════════════════╝

  const availableTabs = provider
    ? TABS.filter((t) => provider.supportedTabs.includes(t.id))
    : TABS;

  return (
    <div className={`booking-search rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Tab bar */}
      <div className="flex bg-ink/80 backdrop-blur-sm">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-ocean text-white border-b-2 border-horizon'
                : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Widget area */}
      <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6">
        {provider ? (
          // ╔══ AFFILIATE HOOK ══╗
          // Provider widget mounts here
          <div ref={widgetContainerRef} className="min-h-[80px]" />
          // ╚════════════════════╝
        ) : (
          <BookingPlaceholder tab={activeTab} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder dispatcher — flights now uses live custom search form;
// hotels/cars keep their static forms until those widgets are integrated.
// ─────────────────────────────────────────────────────────────────────────────
function BookingPlaceholder({ tab }: { tab: BookingTab }) {
  if (tab === 'flights') return <FlightSearchForm />;
  if (tab === 'hotels')  return <HotelsPlaceholder />;
  if (tab === 'cars')    return <CarsPlaceholder />;
  return (
    <div className="flex items-center justify-center py-8 text-mist text-sm">
      <span>Search coming soon — we&apos;re connecting the best {tab} deals for you.</span>
    </div>
  );
}

function HotelsPlaceholder() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
      <div className="lg:col-span-2">
        <label className="block text-xs font-medium text-mist mb-1 uppercase tracking-wide">Destination</label>
        <input
          type="text"
          placeholder="City, region, or hotel name"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/40 bg-sand"
          readOnly
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-mist mb-1 uppercase tracking-wide">Check-in / Check-out</label>
        <input
          type="text"
          placeholder="Select dates"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/40 bg-sand"
          readOnly
        />
      </div>
      <ComingSoonButton />
    </div>
  );
}

function CarsPlaceholder() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
      <div>
        <label className="block text-xs font-medium text-mist mb-1 uppercase tracking-wide">Pick-up Location</label>
        <input
          type="text"
          placeholder="City or airport"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/40 bg-sand"
          readOnly
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-mist mb-1 uppercase tracking-wide">Pick-up / Drop-off</label>
        <input
          type="text"
          placeholder="Select dates"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/40 bg-sand"
          readOnly
        />
      </div>
      <ComingSoonButton />
    </div>
  );
}

function ComingSoonButton() {
  return (
    <div>
      <button
        disabled
        className="w-full py-2.5 px-6 rounded-lg bg-ocean/40 text-white/60 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
        title="Booking integration coming soon"
      >
        <Plane size={15} className="rotate-45" />
        Search
      </button>
      <p className="text-[10px] text-mist text-center mt-1">
        Live search launching soon
      </p>
    </div>
  );
}
