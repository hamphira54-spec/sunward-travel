// ─────────────────────────────────────────────────────────────────────────────
// lib/guides.ts
// SINGLE AUTHORITATIVE GUIDE/ARTICLE DATA SOURCE FOR SUNWARD TRAVEL
//
// Migration notes:
//   – SAMPLE_GUIDES in lib/destinations.ts is DEPRECATED. Do not add new guides
//     there. Migrate all imports to this file.
//   – lib/destinations.ts still required by: TicketCard, DestinationCard,
//     FeaturedDestinations, app/page.tsx (via FEATURED_DESTINATIONS).
//     Those consumers will be migrated in a follow-up pass.
//   – Content sections rendered as structured React blocks (no innerHTML).
//
// To add a new guide:
//   1. Add an entry to GUIDES below.
//   2. Add its React content to GUIDE_CONTENT below.
//   3. npm run build — sitemap + generateStaticParams pick it up automatically.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Category type ────────────────────────────────────────────────────────────

export type GuideCategory =
  | 'destination-guide'
  | 'itinerary'
  | 'things-to-do'
  | 'where-to-stay'
  | 'transportation'
  | 'food'
  | 'budget'
  | 'best-time-to-visit'
  | 'travel-tips'
  | 'flight-tips';

export const CATEGORY_LABELS: Record<GuideCategory, string> = {
  'destination-guide': 'Destination Guide',
  'itinerary': 'Itinerary',
  'things-to-do': 'Things to Do',
  'where-to-stay': 'Where to Stay',
  'transportation': 'Transportation',
  'food': 'Food',
  'budget': 'Budget Travel',
  'best-time-to-visit': 'Best Time to Visit',
  'travel-tips': 'Travel Tips',
  'flight-tips': 'Flight Tips',
};

// ─── Affiliate CTA type ───────────────────────────────────────────────────────

export type AffiliateCTAType =
  | 'flights'
  | 'hotels'
  | 'activities'
  | 'transfers'
  | 'cars';

export interface AffiliateCTA {
  type: AffiliateCTAType;
  label: string;
  href: string;
}

// ─── Main TravelGuide interface ───────────────────────────────────────────────

export interface TravelGuide {
  /** Unique stable ID — same as slug */
  id: string;
  /** URL slug: /guides/[slug] */
  slug: string;

  // Content
  title: string;
  excerpt: string;

  // Relationship keys (optional — omit for general/regional articles)
  countrySlug?: string;
  destinationSlug?: string;
  /** Human-readable destination label shown in meta and cards */
  destinationLabel: string;

  // Classification
  category: GuideCategory;
  tags: string[];

  // Media
  heroImage: {
    src: string;
    alt: string;
  };
  cardImage: {
    src: string;
    alt: string;
  };

  // Attribution
  /** Defaults to 'Sunward Travel Editorial Team' if omitted */
  author?: string;

  // Dates — use real dates only, never fabricated history
  publishedAt: string;       // ISO 8601 date
  updatedAt?: string;        // only if genuinely updated

  /** Reading time in minutes — computed from content via calcReadingTime() */
  readingTimeMinutes: number;

  featured?: boolean;

  // SEO
  seo: {
    title: string;
    description: string;
  };

  // Contextual affiliate CTAs to render in/after article
  affiliateCTAs: AffiliateCTA[];

  // Section headings — used to auto-generate Table of Contents
  // Must match IDs used in GUIDE_CONTENT blocks
  tocSections: Array<{
    id: string;
    heading: string;
  }>;
}

// ─── Helper: calculate reading time ───────────────────────────────────────────

/**
 * Returns estimated minutes based on word count at ~200 words/minute.
 * Pass a representative word count for the article.
 */
export function calcReadingTime(words: number): number {
  return Math.max(1, Math.round(words / 200));
}

// ─── Helper: get related guides ───────────────────────────────────────────────

/**
 * Returns up to `limit` related guides, ranked by:
 *   1. Same destination slug
 *   2. Same category
 *   3. Same country slug
 *   4. Shared tags
 * Excludes the current guide by slug.
 */
export function getRelatedGuides(
  currentSlug: string,
  count = 3
): TravelGuide[] {
  const current = GUIDE_BY_SLUG[currentSlug];
  if (!current) return [];

  return GUIDES
    .filter((g) => g.slug !== currentSlug)
    .map((g) => {
      let score = 0;
      if (current.destinationSlug && g.destinationSlug === current.destinationSlug) score += 4;
      if (g.category === current.category) score += 3;
      if (current.countrySlug && g.countrySlug === current.countrySlug) score += 2;
      const sharedTags = g.tags.filter((t) => current.tags.includes(t)).length;
      score += sharedTags;
      return { guide: g, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ guide }) => guide);
}

/**
 * Returns all guides for a specific destination slug.
 * General guides (no destinationSlug) are never included.
 */
export function getGuidesForDestination(destinationSlug: string): TravelGuide[] {
  return GUIDES.filter((g) => g.destinationSlug === destinationSlug);
}

/**
 * Returns all guides for a specific country slug.
 * Includes both destination-specific and country-level guides.
 */
export function getGuidesForCountry(countrySlug: string): TravelGuide[] {
  return GUIDES.filter(
    (g) => g.countrySlug === countrySlug || g.destinationSlug === countrySlug
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GUIDES DATA
// ─────────────────────────────────────────────────────────────────────────────

export const GUIDES: TravelGuide[] = [
  // ── 1. Best Time to Visit Bali ─────────────────────────────────────────────
  {
    id: 'best-time-to-visit-bali',
    slug: 'best-time-to-visit-bali',
    title: 'Best Time to Visit Bali: A Month-by-Month Guide',
    excerpt:
      "From dry-season surfer swells to rice-harvest ceremonies — here's exactly when to go to Bali depending on what you want to do.",
    countrySlug: 'indonesia',
    destinationSlug: 'bali',
    destinationLabel: 'Bali, Indonesia',
    category: 'best-time-to-visit',
    tags: ['bali', 'indonesia', 'weather', 'planning', 'seasons'],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1400&q=80',
      alt: 'Bali temple at sunrise surrounded by mist and tropical vegetation',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=75',
      alt: 'Bali temple at sunrise',
    },
    author: 'Sunward Travel Editorial Team',
    publishedAt: '2025-08-01',
    readingTimeMinutes: 7,
    featured: true,
    seo: {
      title: 'Best Time to Visit Bali: Month-by-Month Guide | Sunward Travel',
      description:
        'When is the best time to visit Bali? Our month-by-month guide covers dry season, wet season, festivals, and the best times for surfing, diving, and exploring temples.',
    },
    affiliateCTAs: [
      { type: 'flights', label: 'Search Flights to Bali', href: '/flights' },
      { type: 'hotels', label: 'Find Hotels in Bali', href: '/hotels' },
      { type: 'transfers', label: 'Airport Transfer from Ngurah Rai', href: '/airport-transfers' },
    ],
    tocSections: [
      { id: 'overview', heading: 'Bali Weather Overview' },
      { id: 'dry-season', heading: 'Dry Season: May – September' },
      { id: 'shoulder-season', heading: 'Shoulder Season: April & October' },
      { id: 'wet-season', heading: 'Wet Season: November – March' },
      { id: 'special-events', heading: 'Special Events Worth Planning Around' },
      { id: 'recommendation', heading: 'Our Recommendation' },
    ],
  },

  // ── 2. Cheap Flights to Europe ─────────────────────────────────────────────
  {
    id: 'cheapest-ways-to-fly-to-europe',
    slug: 'cheapest-ways-to-fly-to-europe',
    title: 'How to Find Cheap Flights to Europe: 9 Proven Strategies',
    excerpt:
      "Budget airlines, booking windows, hidden city ticketing — our guide to scoring sub-$500 transatlantic flights more often than you'd think possible.",
    // No countrySlug/destinationSlug — this is a general travel tips article
    destinationLabel: 'Europe',
    category: 'flight-tips',
    tags: ['flights', 'europe', 'budget', 'tips', 'booking'],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80',
      alt: 'Airplane wing over clouds at golden-hour sunset',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=75',
      alt: 'Airplane wing over clouds at sunset',
    },
    author: 'Sunward Travel Editorial Team',
    publishedAt: '2025-07-14',
    readingTimeMinutes: 9,
    featured: true,
    seo: {
      title: 'How to Find Cheap Flights to Europe: 9 Proven Strategies | Sunward Travel',
      description:
        'Practical strategies for finding cheap flights to Europe — including the best booking window, budget airline routes, flexible date tricks, and how to use fare alerts effectively.',
    },
    affiliateCTAs: [
      { type: 'flights', label: 'Search Flights to Europe', href: '/flights' },
    ],
    tocSections: [
      { id: 'booking-window', heading: 'Book at the Right Time' },
      { id: 'budget-airlines', heading: 'Use Budget Airlines Strategically' },
      { id: 'flexible-dates', heading: 'Stay Flexible on Dates' },
      { id: 'fare-alerts', heading: 'Set Fare Alerts' },
      { id: 'positioning-flights', heading: 'Consider Positioning Flights' },
      { id: 'travel-credit-cards', heading: 'Leverage Travel Credit Cards' },
      { id: 'indirect-routes', heading: 'Try Indirect Routes' },
      { id: 'shoulder-season', heading: 'Travel in Shoulder Season' },
      { id: 'nearby-airports', heading: 'Check Nearby Airports' },
    ],
  },

  // ── 3. Tokyo First-Timer Guide ─────────────────────────────────────────────
  {
    id: 'tokyo-first-timer-guide',
    slug: 'tokyo-first-timer-guide',
    title: 'First Time in Tokyo? Everything You Need to Know',
    excerpt:
      "IC cards, etiquette rules, the best neighbourhood to stay in — a complete first-timer's blueprint for navigating Japan's magnificent capital.",
    countrySlug: 'japan',
    destinationSlug: 'tokyo',
    destinationLabel: 'Tokyo, Japan',
    category: 'destination-guide',
    tags: ['tokyo', 'japan', 'first-time', 'guide', 'planning'],
    heroImage: {
      src: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=1400&q=80',
      alt: 'Tokyo alley at night with neon signs, lanterns and pedestrians',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600&q=75',
      alt: 'Tokyo streets at night with neon signs',
    },
    author: 'Sunward Travel Editorial Team',
    publishedAt: '2025-06-22',
    readingTimeMinutes: 12,
    featured: true,
    seo: {
      title: 'First Time in Tokyo: The Complete Visitor Guide | Sunward Travel',
      description:
        'Everything first-time visitors need to know about Tokyo — how to get around, where to stay, what to eat, cultural etiquette, money, and the best neighbourhoods to explore.',
    },
    affiliateCTAs: [
      { type: 'flights', label: 'Search Flights to Tokyo', href: '/flights' },
      { type: 'hotels', label: 'Find Hotels in Tokyo', href: '/hotels' },
      { type: 'transfers', label: 'Airport Transfer from Narita', href: '/airport-transfers' },
    ],
    tocSections: [
      { id: 'getting-there', heading: 'Getting to Tokyo' },
      { id: 'getting-around', heading: 'Getting Around: IC Card & Trains' },
      { id: 'best-neighbourhoods', heading: 'Best Neighbourhoods to Stay In' },
      { id: 'money-tipping', heading: 'Money, Tipping & Costs' },
      { id: 'cultural-etiquette', heading: 'Cultural Etiquette to Know' },
      { id: 'what-to-eat', heading: 'What to Eat in Tokyo' },
      { id: 'must-see', heading: 'Must-See Attractions' },
      { id: 'day-trips', heading: 'Day Trips from Tokyo' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP MAPS
// ─────────────────────────────────────────────────────────────────────────────

export const GUIDE_BY_SLUG = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g])
) as Record<string, TravelGuide>;

export const FEATURED_GUIDES = GUIDES.filter((g) => g.featured);
