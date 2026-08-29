import Link from 'next/link';
import Image from 'next/image';
import { EVENT_CATEGORY_LABELS, type TravelEvent } from '@/lib/content/events';
import { formatEventDate } from '@/lib/events';

interface EventCardProps {
  event: TravelEvent;
  variant?: 'standard' | 'compact' | 'featured';
}

export function EventCard({ event, variant = 'standard' }: EventCardProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  const categoryLabel = EVENT_CATEGORY_LABELS[event.category];
  const dateString = formatEventDate(event.startDate, event.endDate, event.timezone, event.allDay);
  
  const startDateObj = new Date(event.startDate);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(startDateObj);
  const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(startDateObj);

  return (
    <Link href={`/events/${event.slug}`} className="group flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className={`relative ${isCompact ? 'aspect-[4/3]' : 'aspect-[16/9]'} w-full overflow-hidden bg-gray-100`}>
        {event.heroImage && (
          <Image
            src={event.heroImage.src}
            alt={event.heroImage.alt || event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        
        {/* Date Badge */}
        {!isCompact && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl text-center shadow-sm">
            <span className="block text-xs font-bold text-ocean uppercase tracking-wider">{month}</span>
            <span className="block text-xl font-display text-ink">{day}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold tracking-wider text-ocean uppercase">
            {categoryLabel}
          </span>
          {event.lifecycleStatus !== 'scheduled' && event.lifecycleStatus !== 'ongoing' && (
             <span className="text-xs font-bold tracking-wider px-2 py-1 bg-red-100 text-red-700 rounded-md uppercase">
               {event.lifecycleStatus}
             </span>
          )}
        </div>

        <h3 className={`font-display text-ink mb-2 group-hover:text-ocean transition-colors line-clamp-2 ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
          {event.title}
        </h3>

        {!isCompact && (
          <p className="text-mist text-sm mb-4 line-clamp-2 flex-grow">
            {event.excerpt}
          </p>
        )}

        <div className={`mt-auto text-sm text-mist/80 flex flex-col gap-1 ${isCompact ? 'mt-3' : ''}`}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{dateString}</span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.venue.name}{event.venue.city ? `, ${event.venue.city}` : ''}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
