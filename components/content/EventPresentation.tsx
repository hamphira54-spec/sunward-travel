import { formatEventDate } from '@/lib/events';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Clock, Globe, MapPin, Tag, ExternalLink, Ticket, Building2 } from 'lucide-react';
import ContentRenderer from '@/components/content/ContentRenderer';
import { EVENT_CATEGORY_LABELS } from '@/lib/content/events';

export default function EventPresentation({
  event,
  
  
  relatedEvents,
  relatedGuides,
  previewMode = false,
}: {
  event: any;
  
  
  relatedEvents: any[];
  relatedGuides: any[];
  previewMode?: boolean;
}) {
  const dateString = formatEventDate(event.startDate, event.endDate, event.timezone, event.allDay);
    // Format dates
  const startDate = new Date(event.startDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    ...(event.allDay ? {} : { hour: 'numeric', minute: '2-digit', timeZone: event.timezone }),
  });
  const endDate = event.endDate 
    ? new Date(event.endDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        ...(event.allDay ? {} : { hour: 'numeric', minute: '2-digit', timeZone: event.timezone }),
      })
    : null;

  const baseUrl = 'https://sunwardtravel.com';

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.excerpt,
    image: event.heroImage?.src,
    startDate: new Date(event.startDate).toISOString(),
    endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
    eventStatus: event.lifecycleStatus === 'cancelled' 
      ? 'https://schema.org/EventCancelled'
      : event.lifecycleStatus === 'postponed'
        ? 'https://schema.org/EventPostponed'
        : 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.venue.isVirtual && !event.venue.name 
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : event.venue.isVirtual
        ? 'https://schema.org/MixedEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.venue.isVirtual && !event.venue.name ? {
      '@type': 'VirtualLocation',
      url: event.officialUrl,
    } : {
      '@type': 'Place',
      name: event.venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.venue.city,
        addressCountry: event.venue.country,
      },
    },
    organizer: event.organizer ? {
      '@type': 'Organization',
      name: event.organizer,
    } : undefined,
    offers: event.ticketUrl ? {
      '@type': 'Offer',
      url: event.ticketUrl,
      availability: 'https://schema.org/InStock',
    } : undefined,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Events', item: `${baseUrl}/events` },
      { '@type': 'ListItem', position: 3, name: event.title, item: `${baseUrl}/events/${event.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="pb-24">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[500px] w-full bg-ink">
          {event.heroImage && (
            <Image
              src={event.heroImage.src}
              alt={event.heroImage.alt || event.title}
              fill
              className="object-cover opacity-80"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
              <div className="flex gap-2 text-sm font-bold tracking-wider text-ocean uppercase">
                <span>{EVENT_CATEGORY_LABELS[event.category as keyof typeof EVENT_CATEGORY_LABELS]}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-7xl text-white font-bold leading-tight max-w-4xl">
                {event.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
          <DestinationBreadcrumb 
            crumbs={[
              { label: 'Home', href: '/' },
              { label: 'Events', href: '/events' },
              { label: event.title }
            ]}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="prose prose-lg prose-ink max-w-none">
              <p className="text-xl text-mist leading-relaxed font-medium mb-8">
                {event.excerpt}
              </p>
              <ContentRenderer blocks={event.body} />
            </div>

            {event.sourceReferences && event.sourceReferences.length > 0 && (
              <div className="border-t border-gray-200 pt-8 mt-12">
                <h3 className="font-display text-lg text-ink font-bold mb-4">Sources & References</h3>
                <ul className="space-y-3">
                  {event.sourceReferences.map((ref: any, idx: number) => (
                    <li key={idx} className="flex flex-col text-sm text-mist">
                      {ref.url ? (
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-ocean hover:underline font-medium">
                          {ref.title}
                        </a>
                      ) : (
                        <span className="font-medium text-ink">{ref.title}</span>
                      )}
                      <span>{ref.publisher} {ref.date ? `(${ref.date})` : ''}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Related content */}
            {relatedGuides.length > 0 && (
              <div className="border-t border-gray-200 pt-12 mt-12">
                <h3 className="font-display text-2xl text-ink font-bold mb-6">Related Travel Guides</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedGuides.map((guide: any) => (
                    <Link key={guide.slug} href={`/guides/${guide.slug}`} className="block p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-ink mb-2">{guide.title}</h4>
                      <p className="text-sm text-mist line-clamp-2">{guide.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {relatedEvents.length > 0 && (
              <div className="border-t border-gray-200 pt-12 mt-12">
                <h3 className="font-display text-2xl text-ink font-bold mb-6">Related Events</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedEvents.map((e: any) => (
                    <Link key={e.slug} href={`/events/${e.slug}`} className="block p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-ink mb-2">{e.title}</h4>
                      <p className="text-sm text-mist line-clamp-2">{e.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-surface p-8 rounded-3xl space-y-8 border border-gray-100">
              <div>
                <h3 className="text-xs font-bold tracking-wider text-mist uppercase mb-2">When</h3>
                <p className="text-ink font-medium">{dateString}</p>
                <p className="text-sm text-mist mt-1 capitalize">{event.lifecycleStatus}</p>
              </div>
              
              {event.venue && (
                <div>
                  <h3 className="text-xs font-bold tracking-wider text-mist uppercase mb-2">Where</h3>
                  <p className="text-ink font-medium">{event.venue.name}</p>
                  {event.venue.city && <p className="text-mist text-sm mt-1">{event.venue.city}</p>}
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold tracking-wider text-mist uppercase mb-2">Category</h3>
                <p className="text-ink font-medium">{EVENT_CATEGORY_LABELS[event.category as keyof typeof EVENT_CATEGORY_LABELS]}</p>
              </div>

              {event.officialUrl && (
                <a 
                  href={event.officialUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full text-center bg-white border border-gray-200 text-ink font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Visit Official Website
                </a>
              )}
              
              <div className="pt-6 border-t border-gray-200">
                <Link 
                  href={event.destinationSlug ? `/destinations/${event.countrySlug}/${event.destinationSlug}` : `/destinations/${event.countrySlug}`}
                  className="block w-full text-center bg-interactive text-white font-medium px-4 py-3 rounded-xl hover:bg-interactive/90 transition-colors"
                >
                  Plan Your Trip
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

