import { Metadata } from 'next';
import { getUpcomingEvents, getFeaturedEvents } from '@/lib/content/repository';
import { EventCategoryFilter } from '@/components/events/EventCategoryFilter';
import { EventCard } from '@/components/events/EventCard';

export const metadata: Metadata = {
  title: 'Global Travel Events & Festivals | Sunward Travel',
  description: 'Discover the world\'s most exciting festivals, cultural celebrations, sporting events, and seasonal highlights to plan your next trip around.',
  openGraph: {
    title: 'Global Travel Events & Festivals',
    description: 'Discover the world\'s most exciting festivals and events.',
  }
};

export default function EventsPage() {
  const upcomingEvents = getUpcomingEvents();
  const featuredEvent = getFeaturedEvents(1)[0];

  return (
    <main className="pb-24 pt-12">
      {/* Editorial Hero */}
      <section className="bg-sand py-20 px-4 md:px-8 mb-16 rounded-3xl mx-4 md:mx-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink font-bold mb-6 leading-tight">
            What&apos;s Happening Around the World
          </h1>
          <p className="text-lg md:text-xl text-mist max-w-2xl mx-auto leading-relaxed">
            Plan your next journey around the world&apos;s most spectacular festivals, cultural celebrations, and iconic sporting events.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {featuredEvent && (
          <section className="mb-20">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ocean mb-6">Featured Event</h2>
            <div className="h-[600px]">
              <EventCard event={featuredEvent} variant="featured" />
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-display text-ink font-bold mb-8">Upcoming Events</h2>
          <EventCategoryFilter allEvents={upcomingEvents} />
        </section>
      </div>
    </main>
  );
}
