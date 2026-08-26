export default function FlightResultsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading flight results">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-[var(--shadow-card)] border border-gray-100 p-5 animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center gap-4 flex-wrap">
            {/* Airline */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100" />
              <div className="space-y-1.5">
                <div className="h-3 w-28 rounded bg-gray-100" />
                <div className="h-2.5 w-12 rounded bg-gray-100" />
              </div>
            </div>
            {/* Flight segment */}
            <div className="flex-1 flex items-center gap-4">
              <div className="space-y-1.5 text-center">
                <div className="h-5 w-12 rounded bg-gray-100 mx-auto" />
                <div className="h-2.5 w-8 rounded bg-gray-100 mx-auto" />
              </div>
              <div className="flex-1 h-px bg-gray-100" />
              <div className="space-y-1.5 text-center">
                <div className="h-5 w-12 rounded bg-gray-100 mx-auto" />
                <div className="h-2.5 w-8 rounded bg-gray-100 mx-auto" />
              </div>
            </div>
            {/* Price */}
            <div className="ml-auto flex flex-col items-end gap-2">
              <div className="h-7 w-20 rounded bg-gray-100" />
              <div className="h-8 w-24 rounded-lg bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
