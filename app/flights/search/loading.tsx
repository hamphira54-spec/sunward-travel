import FlightResultsSkeleton from '@/components/flights/FlightResultsSkeleton';
import FlightSearchForm from '@/components/flights/FlightSearchForm';

export default function FlightSearchLoading() {
  return (
    <div className="min-h-screen bg-sand">
      {/* Compact search bar placeholder */}
      <div className="bg-ink pt-20 pb-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-6 w-48 rounded bg-white/10 animate-pulse mb-4" />
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl animate-pulse h-48" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <FlightResultsSkeleton />
      </div>
    </div>
  );
}
