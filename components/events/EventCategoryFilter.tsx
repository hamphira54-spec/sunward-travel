'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { EVENT_CATEGORY_LABELS, type EventCategory, type TravelEvent } from '@/lib/content/events';
import { EventCard } from './EventCard';

interface EventCategoryFilterProps {
  allEvents: TravelEvent[];
}

function FilterInner({ allEvents }: EventCategoryFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentCategory = searchParams.get('category') as EventCategory | null;

  const categories = Object.keys(EVENT_CATEGORY_LABELS) as EventCategory[];

  const filteredEvents = currentCategory
    ? allEvents.filter((event) => event.category === currentCategory)
    : allEvents;

  const handleCategoryChange = (category: EventCategory | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !currentCategory
              ? 'bg-ocean text-white'
              : 'bg-surface text-ink hover:bg-gray-200'
          }`}
        >
          All Events
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentCategory === category
                ? 'bg-ocean text-white'
                : 'bg-surface text-ink hover:bg-gray-200'
            }`}
          >
            {EVENT_CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-2xl">
          <p className="text-mist text-lg">
            No events found for this category.
          </p>
          <button
            onClick={() => handleCategoryChange(null)}
            className="mt-4 text-ocean font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export function EventCategoryFilter({ allEvents }: EventCategoryFilterProps) {
  return (
    <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-2xl"></div>}>
      <FilterInner allEvents={allEvents} />
    </Suspense>
  );
}
