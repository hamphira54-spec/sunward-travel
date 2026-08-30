import EventPresentation from '@/components/content/EventPresentation';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getEventBySlug, getAllPublishedEvents, getRelatedEvents, getRelatedGuidesFor } from '@/lib/content/repository';
import { EVENT_CATEGORY_LABELS } from '@/lib/content/events';
import { formatEventDate } from '@/lib/events';
import DestinationBreadcrumb from '@/components/travel/DestinationBreadcrumb';
import ContentRenderer from '@/components/content/ContentRenderer';

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await getAllPublishedEvents();
  return events.map((e) => ({
    slug: e.slug,
  }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const p = await params;
  const event = await getEventBySlug(p.slug);
  
  if (!event) return {};

  return {
    title: event.seo.title,
    description: event.seo.description,
    openGraph: {
      title: event.seo.title,
      description: event.seo.description,
      images: event.heroImage ? [{ url: event.heroImage.src, alt: event.heroImage.alt }] : [],
    }
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const p = await params;
  const event = await getEventBySlug(p.slug);

  if (!event) {
    notFound();
  }

  const relatedEvents = await getRelatedEvents(event.slug, 3);
  const relatedGuides = await getRelatedGuidesFor(event.slug, 3);
  const dateString = formatEventDate(event.startDate, event.endDate, event.timezone, event.allDay);

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.excerpt,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: `https://schema.org/${event.lifecycleStatus === 'scheduled' ? 'EventScheduled' : event.lifecycleStatus === 'cancelled' ? 'EventCancelled' : 'EventScheduled'}`,
    image: event.heroImage ? [event.heroImage.src] : [],
    location: event.venue ? {
      '@type': 'Place',
      name: event.venue.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.venue.city
      }
    } : undefined
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://sunwardtravel.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Events',
        item: 'https://sunwardtravel.com/events'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: event.title,
        item: `https://sunwardtravel.com/events/${event.slug}`
      }
    ]
  };

  
  return (
    <EventPresentation 
      event={event}
      
      
      relatedEvents={relatedEvents}
      relatedGuides={relatedGuides}
    />
  );
}
