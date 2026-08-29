// ─────────────────────────────────────────────────────────────────────────────
// lib/news.ts
// SUNWARD TRAVEL — Travel News Data Source
//
// Authoritative data source for all travel news articles.
// Mirrors the pattern of lib/guides.ts.
//
// Architecture:
//   Types    → lib/content/news.ts (TravelNews, NewsCategory)
//   Data     → this file
//   Queries  → lib/content/repository.ts
//   Renderer → components/content/ContentRenderer.tsx
//
// To add a new article:
//   1. Add an entry to NEWS_ARTICLES below
//   2. npm run build — sitemap + generateStaticParams pick it up automatically
//
// CONTENT RULES:
//   - Original editorial writing only — never copy or scrape external content
//   - Do not fabricate breaking news, events, prices, quotes, or statistics
//   - Only include sourceReferences with real, verifiable URLs
//   - publishedAt dates must be real — do not backdate fabricated history
// ─────────────────────────────────────────────────────────────────────────────

import type { TravelNews } from '@/lib/content/news';
export { NEWS_CATEGORY_LABELS } from '@/lib/content/news';

// ─────────────────────────────────────────────────────────────────────────────
// EDITORIAL TEAM AUTHOR
// ─────────────────────────────────────────────────────────────────────────────

const EDITORIAL_TEAM = {
  id:   'sunward-editorial',
  name: 'Sunward Travel Editorial Team',
  slug: 'editorial',
  role: 'Editorial Team',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DATE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats an ISO 8601 date string to a human-readable date.
 * Output: "Aug 29, 2026"
 */
export function formatNewsDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWS ARTICLES
// ─────────────────────────────────────────────────────────────────────────────

export const NEWS_ARTICLES: TravelNews[] = [

  // ── 1. Aviation: Dynamic Pricing ──────────────────────────────────────────
  {
    id:   'why-flight-prices-change-so-often',
    slug: 'why-flight-prices-change-so-often',
    title: 'Why Flight Prices Change So Often — And How to Catch the Better Fares',
    excerpt:
      "If you've ever searched for a flight, walked away, and returned to find the price had changed — you've experienced airline dynamic pricing. Understanding how it works helps you book smarter.",
    heroImage: {
      src: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80',
      alt: 'Airplane wing viewed from passenger window at golden-hour sunset',
    },
    author: EDITORIAL_TEAM,
    publication: {
      status: 'published',
      publishedAt: '2026-08-15',
    },
    category: 'aviation',
    tags: ['flights', 'aviation', 'pricing', 'booking', 'tips'],
    featured: true,
    readingTimeMinutes: 6,
    seo: {
      title: 'Why Flight Prices Change So Often — And How to Catch the Best Fares | Sunward Travel',
      description:
        'Understanding airline dynamic pricing helps you make smarter booking decisions. Learn what drives fare changes, when to book, and which tools actually help you find better deals.',
    },
    body: [
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              "If you've ever searched for a flight, walked away to think about it, and returned to find the price had changed — sometimes higher, sometimes lower — you've experienced airline dynamic pricing in action. Understanding how it works won't guarantee you the cheapest fare every time, but it will help you make smarter booking decisions.",
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'dynamic-pricing',
        text: 'Airline Pricing Is Never Static',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Airlines use sophisticated revenue management systems that adjust fares in real time based on demand, remaining seat inventory, time to departure, competitor pricing, and dozens of other variables. A single flight may have twenty different price points active simultaneously across its seat classes. What you see at any given moment is simply where the algorithm has positioned itself.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'price-drivers',
        text: 'What Drives Price Changes',
      },
      {
        type: 'list' as const,
        ordered: false,
        items: [
          {
            nodes: [
              { type: 'strong' as const, content: 'Remaining seat inventory' },
              { type: 'text' as const, content: ' — Fewer seats remaining in a cabin class typically pushes prices up.' },
            ],
          },
          {
            nodes: [
              { type: 'strong' as const, content: 'Time to departure' },
              { type: 'text' as const, content: ' — Last-minute fares are often expensive on popular routes; unpopular routes may drop as the airline tries to fill seats.' },
            ],
          },
          {
            nodes: [
              { type: 'strong' as const, content: 'Day and time of booking' },
              { type: 'text' as const, content: ' — Mid-week searches sometimes surface slightly lower fares, though this varies significantly by route.' },
            ],
          },
          {
            nodes: [
              { type: 'strong' as const, content: 'Competitor pricing' },
              { type: 'text' as const, content: ' — Airlines monitor each other and adjust to stay competitive on routes with multiple carriers.' },
            ],
          },
          {
            nodes: [
              { type: 'strong' as const, content: 'Search behaviour' },
              { type: 'text' as const, content: ' — Some systems temporarily raise prices after repeated searches from the same account.' },
            ],
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'when-to-book',
        text: 'The Best Time to Book',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Research consistently points to a booking sweet spot: roughly 3–6 months ahead for long-haul international routes, and 4–8 weeks ahead for shorter regional flights. Booking too early (more than 11 months out) or too late (within 2 weeks for most routes) tends to be more expensive. The lowest fares for popular peak-season dates typically appear around 4–5 months before departure.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'tools',
        text: 'Tools That Actually Help',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              "Flexible-date search tools — available on most major booking platforms — let you see an entire month of prices at once. Fare alert services notify you when prices drop on routes you're watching. Using a private or incognito browser window when comparing fares is a low-friction way to avoid any possible search-history pricing effects.",
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'what-wont-work',
        text: "What Won't Work",
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Waiting indefinitely for prices to drop rarely pays off on popular routes. Neither does checking prices obsessively multiple times per day — airline pricing systems do not update that frequently for most seats. The best strategy is to know roughly what a fair price looks like for your route, set alerts at that threshold, and book confidently when you see a fare that meets it.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'bottom-line',
        text: 'The Bottom Line',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Airline pricing rewards travellers who plan ahead, stay flexible on dates, and move quickly when a good fare appears. Understanding that prices are deliberately fluid — not random — helps you approach flight booking as a skill rather than a lottery.',
          },
        ],
      },
    ],
  },

  // ── 2. Transportation: Airport Transfer Guide ──────────────────────────────
  {
    id:   'private-airport-transfer-vs-taxi',
    slug: 'private-airport-transfer-vs-taxi',
    title: 'Private Airport Transfer vs Taxi: What Experienced Travellers Choose',
    excerpt:
      'Pre-booked private transfer or official taxi? The right answer depends on your destination, group size, arrival time, and how much uncertainty you want to manage after a long flight.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1400&q=80',
      alt: 'Black private car at airport pick-up lane at dusk',
    },
    author: EDITORIAL_TEAM,
    publication: {
      status: 'published',
      publishedAt: '2026-08-20',
    },
    category: 'transportation',
    tags: ['airport-transfers', 'transportation', 'travel-tips', 'taxis', 'planning'],
    featured: false,
    readingTimeMinutes: 4,
    seo: {
      title: 'Private Airport Transfer vs Taxi: What Experienced Travellers Choose | Sunward Travel',
      description:
        'Pre-booked private transfer or official taxi? We break down which airport transfer option works best for different types of travellers and destinations.',
    },
    body: [
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'The moment you land at an unfamiliar airport, the question of how to get to your hotel becomes surprisingly stressful. Private transfers and taxis have served travellers for decades, but they serve very different needs. Understanding the difference means arriving smoothly — rather than negotiating with an unlicensed driver at midnight.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'private-transfers',
        text: 'The Case for Private Transfers',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'A private airport transfer is pre-booked and pre-priced. A driver meets you in the arrivals hall, often holding a name sign, and takes you door-to-door. The fixed price means no meter anxiety and no late-night negotiation. For travellers arriving in an unfamiliar city after a long flight — particularly with family, heavy luggage, or at an unusual hour — this predictability has real value. Airport transfers work particularly well in cities where taxis are metered but meters are frequently disputed, or where language barriers make navigation difficult.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'taxis',
        text: 'When a Taxi Makes More Sense',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'In cities with reliable, metered, official taxi ranks — London, Singapore, Tokyo, Sydney — jumping in a licensed cab from the airport queue is fast and fairly priced. No pre-booking required. If your plans change or your flight arrives very late, there is no booking to cancel. Experienced travellers on short trips to familiar cities often prefer this flexibility.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'shuttles',
        text: 'Shuttle Services: The Middle Ground',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Shared shuttle services sit between private transfers and public transport in terms of price and convenience. You share the vehicle with other passengers and may make several stops before reaching your destination. They are a reasonable option for solo travellers on a budget who do not mind extra journey time. Purpose-built airport rail links, where they exist, are often the best value for solo city-centre travel.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'which-option',
        text: 'Which Option Is Right for You?',
      },
      {
        type: 'list' as const,
        ordered: false,
        items: [
          { nodes: [{ type: 'text' as const, content: 'Travelling with family or heavy luggage — private transfer' }] },
          { nodes: [{ type: 'text' as const, content: 'Arriving late at night in an unfamiliar city — private transfer' }] },
          { nodes: [{ type: 'text' as const, content: 'Solo traveller to a city with reliable metered taxis — taxi rank' }] },
          { nodes: [{ type: 'text' as const, content: 'Budget traveller with light bags heading to city centre — airport rail or bus' }] },
          { nodes: [{ type: 'text' as const, content: 'Group of 3–4 splitting costs — private transfer is often competitive with multiple taxis' }] },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'safety-note',
        text: 'One Thing Both Options Have in Common',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Whether you choose a pre-booked private transfer or a metered taxi, always use official, licensed services. Unofficial drivers approaching you in arrivals halls are a consistent source of overcharging at airports worldwide. Official taxi ranks are clearly signposted; licensed private transfer drivers will be in the arrivals hall, not approaching you unsolicited.',
          },
        ],
      },
    ],
  },

  // ── 3. Destinations: Southeast Asia ───────────────────────────────────────
  {
    id:   'southeast-asia-travel-essentials',
    slug: 'southeast-asia-travel-essentials',
    title: 'Why Southeast Asia Continues to Draw the World\u2019s Travellers',
    excerpt:
      'From affordability to extraordinary food culture and remarkable internal diversity — we explore why Southeast Asia remains one of the most compelling regions for international travel.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
      alt: 'Mountain landscape at sunrise in Southeast Asia with layered mist',
    },
    author: EDITORIAL_TEAM,
    publication: {
      status: 'published',
      publishedAt: '2026-08-25',
    },
    category: 'destinations',
    tags: ['southeast-asia', 'destinations', 'travel-trends', 'asia', 'planning'],
    featured: false,
    readingTimeMinutes: 5,
    seo: {
      title: 'Why Southeast Asia Continues to Draw the World\u2019s Travellers | Sunward Travel',
      description:
        'From affordability to extraordinary food culture and regional diversity — we explore why Southeast Asia remains one of the most compelling destinations for international travellers.',
    },
    body: [
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Decade after decade, Southeast Asia appears near the top of almost every most-visited and most-recommended travel list. The region spans eleven countries across millions of square kilometres of coastline, rainforest, ancient temple complexes, modern megacities, and remote islands. Understanding why travellers keep returning reveals a great deal about what makes a destination genuinely compelling.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'affordability',
        text: 'Affordability Without Compromise',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Across much of Southeast Asia, traveller purchasing power remains high relative to Western markets. A well-reviewed restaurant meal, a comfortable hotel, a domestic flight between major cities, or a day of guided touring all cost significantly less than equivalent experiences in Europe, North America, or Australia. This affordability is not a compromise on quality — Bangkok, Singapore, and Ho Chi Minh City have world-class hospitality industries with internationally competitive standards.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'diversity',
        text: 'A Region of Remarkable Diversity',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              "No two Southeast Asian countries feel alike. Singapore is an efficient, cosmopolitan island city-state. Bali offers Hindu temple culture and world-class surf breaks on the same island. Cambodia's Angkor Wat is one of the great archaeological sites on earth. Thailand balances frenetic urban energy in Bangkok with tranquil beach islands and mountainous northern provinces. This internal diversity means a multi-country trip offers genuinely different experiences — not just variations on the same theme.",
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'food',
        text: 'The Food Factor',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Southeast Asian cuisine is widely regarded as among the most varied and flavour-forward in the world. Thai street food, Vietnamese pho, Balinese babi guling, Singaporean hawker culture, Cambodian amok, Malaysian nasi lemak — the culinary diversity across the region is extraordinary. For many travellers, eating their way through a destination is itself a primary motivation, and Southeast Asia delivers consistently on this.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'accessibility',
        text: 'Accessibility Has Never Been Better',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              'Low-cost carriers have transformed intra-regional travel. Budget airlines now connect major Southeast Asian cities with fares that can be lower than a long-distance bus journey in some countries. International gateways — Bangkok, Singapore, Kuala Lumpur, Jakarta — connect to almost every major global aviation hub with multiple daily options. Getting into the region, and moving around within it, has become dramatically more accessible over the past decade.',
          },
        ],
      },
      {
        type: 'heading' as const,
        level: 2 as const,
        id: 'where-to-start',
        text: 'Where to Start',
      },
      {
        type: 'paragraph' as const,
        nodes: [
          {
            type: 'text' as const,
            content:
              "For first-time visitors, Bangkok and Singapore are both excellent entry points. Both cities have strong transport infrastructure, English is widely spoken, and each provides a manageable introduction to the region's culture and cuisine. From either hub, onward connections to the rest of Southeast Asia are frequent and affordable. Explore our destination guides for detailed planning information on each country and city.",
          },
        ],
      },
    ],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP MAPS
// ─────────────────────────────────────────────────────────────────────────────

export const NEWS_BY_SLUG: Record<string, TravelNews> = Object.fromEntries(
  NEWS_ARTICLES.map((n) => [n.slug, n])
);

export const FEATURED_NEWS = NEWS_ARTICLES.filter(
  (n) => n.featured && n.publication.status === 'published'
);
