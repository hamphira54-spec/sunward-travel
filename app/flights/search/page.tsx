import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { searchFlights } from '@/lib/services/travelpayouts';
import FlightResultsList from '@/components/flights/FlightResultsList';
import FlightSearchForm from '@/components/flights/FlightSearchForm';
import FlightResultsSkeleton from '@/components/flights/FlightResultsSkeleton';
import type { FlightSearchParams } from '@/lib/types/flights';

interface PageProps {
  searchParams: Promise<{
    origin?: string;
    destination?: string;
    departDate?: string;
    returnDate?: string;
    adults?: string;
    tripType?: string;
    currency?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const origin      = sp.origin      ?? '';
  const destination = sp.destination ?? '';
  return {
    title: origin && destination
      ? `Flights: ${origin} → ${destination}`
      : 'Flight Search Results',
    description: `Compare cheap flights from ${origin} to ${destination} and book with your favourite airline.`,
    robots: { index: false }, // don't index dynamic search results
  };
}

async function Results({ params }: { params: FlightSearchParams }) {
  const data = await searchFlights(params);
  return <FlightResultsList data={data} />;
}

export default async function FlightSearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const origin      = (sp.origin      ?? '').toUpperCase();
  const destination = (sp.destination ?? '').toUpperCase();
  const departDate  = sp.departDate  ?? '';
  const returnDate  = sp.returnDate;
  const adults      = parseInt(sp.adults ?? '1', 10);
  const tripType    = (sp.tripType ?? 'roundtrip') as 'roundtrip' | 'oneway';
  const currency    = sp.currency ?? 'USD';

  const hasValidParams =
    /^[A-Z]{3}$/.test(origin) &&
    /^[A-Z]{3}$/.test(destination) &&
    /^\d{4}-\d{2}-\d{2}$/.test(departDate);

  const searchParams2: FlightSearchParams = {
    origin,
    destination,
    departDate,
    returnDate: tripType === 'roundtrip' ? returnDate : undefined,
    adults,
    tripType,
    currency,
  };

  return (
    <div className="min-h-screen bg-sand">
      {/* Search bar banner */}
      <div className="bg-ink pt-20 pb-0">
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <Link
            href="/flights"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs mb-4 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Flights
          </Link>
          {/* Compact search form */}
          <div className="bg-white rounded-t-2xl overflow-hidden shadow-2xl">
            <div className="bg-ink/80 px-6 py-3">
              <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Modify your search</p>
            </div>
            <FlightSearchForm />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {!hasValidParams ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-display font-700 text-xl text-ink mb-2">No search submitted yet</h2>
            <p className="text-mist text-sm">Use the form above to search for flights.</p>
          </div>
        ) : (
          <Suspense fallback={<FlightResultsSkeleton />}>
            <Results params={searchParams2} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
