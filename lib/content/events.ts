import type { ContentBlock } from './blocks';
import type {
  ContentImage,
  SEOFields,
  SourceReference,
  PublicationMetadata,
} from './types';

export type EventCategory =
  | 'festivals'
  | 'culture'
  | 'music'
  | 'sports'
  | 'food'
  | 'arts'
  | 'exhibitions'
  | 'markets'
  | 'conferences'
  | 'seasonal';

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  'festivals': 'Festivals',
  'culture': 'Culture & Heritage',
  'music': 'Music',
  'sports': 'Sports',
  'food': 'Food & Drink',
  'arts': 'Arts',
  'exhibitions': 'Exhibitions',
  'markets': 'Markets & Fairs',
  'conferences': 'Conferences',
  'seasonal': 'Seasonal Events',
};

export type EventStatus = 'scheduled' | 'ongoing' | 'postponed' | 'cancelled' | 'completed';

export interface EventVenue {
  name: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface TravelEvent {
  id: string;
  slug: string;

  title: string;
  excerpt: string;
  body: ContentBlock[];
  heroImage: ContentImage;

  countrySlug?: string;
  destinationSlug?: string;
  venue?: EventVenue;

  startDate: string;
  endDate?: string;
  timezone?: string;
  allDay?: boolean;

  category: EventCategory;

  officialUrl?: string;
  ticketUrl?: string;
  sourceReferences?: SourceReference[];
  organizer?: string;

  lifecycleStatus: EventStatus;
  publication: PublicationMetadata;
  featured?: boolean;
  seo: SEOFields;
  tags: string[];
}
