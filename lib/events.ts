import type { TravelEvent } from '@/lib/content/events';
export { EVENT_CATEGORY_LABELS } from '@/lib/content/events';

export function formatEventDate(
  startDate: string,
  endDate?: string,
  timezone?: string,
  allDay = false
): string {
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: timezone || 'UTC',
  };
  
  const start = new Date(startDate);
  
  if (!endDate) {
    if (allDay) {
      return new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: 'short', day: 'numeric' }).format(start);
    }
    return new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(start);
  }
  
  const end = new Date(endDate);
  
  const startMonth = new Intl.DateTimeFormat('en-US', { ...opts, month: 'short' }).format(start);
  const endMonth = new Intl.DateTimeFormat('en-US', { ...opts, month: 'short' }).format(end);
  const startYear = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric' }).format(start);
  const endYear = new Intl.DateTimeFormat('en-US', { ...opts, year: 'numeric' }).format(end);
  const startDay = new Intl.DateTimeFormat('en-US', { ...opts, day: 'numeric' }).format(start);
  const endDay = new Intl.DateTimeFormat('en-US', { ...opts, day: 'numeric' }).format(end);
  
  if (startYear === endYear && startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}, ${startYear}`;
  } else if (startYear === endYear) {
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
  }
  return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
}

export const EVENT_ARTICLES: TravelEvent[] = [
  {
    id: 'sapporo-snow-festival-2027',
    slug: 'sapporo-snow-festival-2027',
    title: 'Sapporo Snow Festival 2027',
    excerpt: 'One of Japan\'s largest winter events, featuring hundreds of spectacular snow statues and ice sculptures across three sites in Sapporo.',
    body: [
      {
        type: 'paragraph',
        nodes: [{ type: 'text', content: 'The Sapporo Snow Festival (Sapporo Yuki Matsuri) is held annually in Sapporo, Hokkaido. Over two million visitors travel to see hundreds of snow statues and ice sculptures.' }]
      }
    ],
    heroImage: { src: 'https://images.unsplash.com/photo-1547826131-7299a910abeb?w=1400&q=80', alt: 'Sapporo Snow Festival illuminated at night' },
    countrySlug: 'japan',
    venue: { name: 'Odori Park, Susukino, and Tsu Dome', city: 'Sapporo' },
    startDate: '2027-02-04T00:00:00Z',
    endDate: '2027-02-11T23:59:59Z',
    timezone: 'Asia/Tokyo',
    allDay: true,
    category: 'festivals',
    officialUrl: 'https://www.snowmatsuri.com/',
    sourceReferences: [{ name: 'Sapporo Snow Festival Official Website', url: 'https://www.snowmatsuri.com/' }],
    lifecycleStatus: 'scheduled',
    publication: { status: 'published', publishedAt: '2026-08-01' },
    featured: true,
    seo: { title: 'Sapporo Snow Festival 2027 | Sunward Travel', description: 'Experience the magic of the Sapporo Snow Festival.' },
    tags: ['japan', 'winter', 'festivals', 'hokkaido']
  },
  {
    id: 'songkran-water-festival',
    slug: 'songkran-water-festival',
    title: 'Songkran Water Festival 2027',
    excerpt: 'Thailand\'s traditional New Year celebration transforms the entire country into a massive, joyful water fight.',
    body: [
      {
        type: 'paragraph',
        nodes: [{ type: 'text', content: 'Songkran marks the beginning of the traditional Thai New Year. It is famous globally for its nationwide water fights, signifying the washing away of bad luck.' }]
      }
    ],
    heroImage: { src: 'https://images.unsplash.com/photo-1554868478-f7b575ea48ab?w=1400&q=80', alt: 'People celebrating Songkran with water guns' },
    countrySlug: 'thailand',
    destinationSlug: 'bangkok',
    venue: { name: 'Nationwide (Key events in Bangkok & Chiang Mai)', city: 'Bangkok' },
    startDate: '2027-04-13T00:00:00Z',
    endDate: '2027-04-15T23:59:59Z',
    timezone: 'Asia/Bangkok',
    allDay: true,
    category: 'culture',
    lifecycleStatus: 'scheduled',
    publication: { status: 'draft', publishedAt: '2026-08-01' },
    seo: { title: 'Songkran Water Festival 2027 | Sunward Travel', description: 'Celebrate the Thai New Year.' },
    tags: ['thailand', 'bangkok', 'festivals', 'culture']
  },
  {
    id: 'singapore-grand-prix',
    slug: 'singapore-grand-prix',
    title: 'FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2026',
    excerpt: 'The original F1 night race returns to the Marina Bay Street Circuit, combining high-speed motorsport with spectacular entertainment.',
    body: [
      {
        type: 'paragraph',
        nodes: [{ type: 'text', content: 'The Marina Bay Street Circuit lights up for the Formula 1 Singapore Grand Prix, a spectacular night race featuring top international music acts.' }]
      }
    ],
    heroImage: { src: 'https://images.unsplash.com/photo-1536647209995-1f6004c7c8b2?w=1400&q=80', alt: 'F1 race cars at night' },
    countrySlug: 'singapore',
    destinationSlug: 'singapore',
    venue: { name: 'Marina Bay Street Circuit', city: 'Singapore' },
    startDate: '2026-10-09T15:00:00Z',
    endDate: '2026-10-11T23:00:00Z',
    timezone: 'Asia/Singapore',
    allDay: false,
    category: 'sports',
    officialUrl: 'https://singaporegp.sg/',
    sourceReferences: [{ name: 'Singapore Grand Prix Official Website', url: 'https://singaporegp.sg/' }],
    lifecycleStatus: 'scheduled',
    publication: { status: 'published', publishedAt: '2026-08-01' },
    seo: { title: 'F1 Singapore Grand Prix 2026 | Sunward Travel', description: 'The ultimate night race in Singapore.' },
    tags: ['singapore', 'f1', 'sports', 'motorsport']
  }
];

export const EVENTS_BY_SLUG: Record<string, TravelEvent> = Object.fromEntries(
  EVENT_ARTICLES.map((e) => [e.slug, e])
);

export const FEATURED_EVENTS = EVENT_ARTICLES.filter(
  (e) => e.featured && e.publication.status === 'published'
);
