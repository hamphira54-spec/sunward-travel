// ┌──────────────────────────────────────────────────────────────────────────┐
// │  SearchPlaceholderZone                                                    │
// │                                                                           │
// │  ╔══ AFFILIATE WIDGET ZONE ══════════════════════════════════════════╗   │
// │  ║                                                                   ║   │
// │  ║  Replace this component with <BookingSearch provider={adapter} /> ║   │
// │  ║  once affiliate credentials are approved and the adapter is       ║   │
// │  ║  implemented in components/booking/adapters/                      ║   │
// │  ║                                                                   ║   │
// │  ║  Supported adapters to build:                                     ║   │
// │  ║  - Travelpayouts (flights, hotels, car)                           ║   │
// │  ║  - Booking.com Affiliate Partner Programme                        ║   │
// │  ║  - Expedia Affiliate Network (EAN)                                ║   │
// │  ║  - Viator / GetYourGuide (activities)                             ║   │
// │  ║                                                                   ║   │
// │  ╚═══════════════════════════════════════════════════════════════════╝   │
// └──────────────────────────────────────────────────────────────────────────┘

import BookingSearch from '@/components/booking/BookingSearch';
import type { BookingTab } from '@/components/booking/adapters/types';

interface SearchPlaceholderZoneProps {
  defaultTab?: BookingTab;
  providerName?: string; // e.g. "Travelpayouts" — shown in placeholder label
}

export default function SearchPlaceholderZone({
  defaultTab = 'flights',
  providerName,
}: SearchPlaceholderZoneProps) {
  return (
    <div className="container-wide -mt-10 relative z-20">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Integration status banner */}
        <div className="bg-horizon/15 border-b border-horizon/25 px-5 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-horizon animate-pulse shrink-0" />
          <p className="text-xs text-ink/70">
            <strong className="text-ink">
              {providerName ? `${providerName} integration` : 'Live search'} coming soon
            </strong>
            {' '}— we&apos;re connecting our affiliate partners. Search capability will appear here automatically once approved.
          </p>
        </div>

        {/* Booking search in placeholder mode */}
        <div className="p-1">
          {/* ╔══ AFFILIATE HOOK ══╗
              Replace `provider={undefined}` with your adapter:
              provider={travelpayoutsAdapter}  or  provider={expediaAdapter}
              ╚════════════════════╝ */}
          <BookingSearch defaultTab={defaultTab} provider={undefined} />
        </div>
      </div>
    </div>
  );
}
