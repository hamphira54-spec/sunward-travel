// Destination data — used across homepage cards, listings, and guides

export interface Destination {
  id: string;
  city: string;
  country: string;
  continent: string;
  tagline: string;
  description: string;
  /** Unsplash photo URL — replace with licensed images before launch */
  imageUrl: string;
  imageAlt: string;
  /** Category badge label (passport stamp style) */
  badge: string;
  badgeColor: 'ocean' | 'coral' | 'horizon';
  /** Slug for destination guide pages */
  slug: string;
  highlights: string[];
  bestTime: string;
}

export const FEATURED_DESTINATIONS: Destination[] = [
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    tagline: 'Where tradition meets tomorrow',
    description:
      'A city of neon-lit skyscrapers and serene temples, unrivalled food culture and bullet trains — Tokyo is a lifetime of discovery compressed into one city.',
    imageUrl:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    imageAlt: 'Tokyo skyline at dusk with Mount Fuji in the background',
    badge: 'Asia',
    badgeColor: 'ocean',
    slug: 'tokyo-japan',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Market', 'teamLab Borderless'],
    bestTime: 'March–May (cherry blossoms) or Oct–Nov (autumn foliage)',
  },
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    continent: 'Europe',
    tagline: 'The city that never stops inspiring',
    description:
      'Art, cuisine, fashion, and the most iconic skyline on Earth. Paris repays every visit with something new — from hidden courtyards to world-class museums.',
    imageUrl:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    imageAlt: 'Eiffel Tower and Parisian rooftops at golden hour',
    badge: 'Europe',
    badgeColor: 'coral',
    slug: 'paris-france',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River Cruise'],
    bestTime: 'April–June or September–October',
  },
  {
    id: 'bali',
    city: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    tagline: 'Island of gods and golden rice terraces',
    description:
      'Volcanic peaks, emerald rice paddies, ancient temples, and world-class surf breaks — Bali is the quintessential tropical escape with a spiritual heart.',
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    imageAlt: 'Tegalalang Rice Terrace in Ubud, Bali at sunrise',
    badge: 'Islands',
    badgeColor: 'horizon',
    slug: 'bali-indonesia',
    highlights: ['Tegalalang Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur Sunrise'],
    bestTime: 'May–September (dry season)',
  },
  {
    id: 'nyc',
    city: 'New York City',
    country: 'United States',
    continent: 'Americas',
    tagline: 'Eight million stories, one iconic skyline',
    description:
      'The city that defines modern urban life — a borough-hopping adventure of world-class art, food from every culture, and a skyline that never gets old.',
    imageUrl:
      'https://images.unsplash.com/photo-1538970272646-f61fabb3bfdc?w=800&q=80',
    imageAlt: 'Manhattan skyline viewed from Brooklyn Bridge at sunset',
    badge: 'Americas',
    badgeColor: 'ocean',
    slug: 'new-york-city-usa',
    highlights: ['Central Park', 'Brooklyn Bridge', 'The Met', 'High Line'],
    bestTime: 'April–June or September–November',
  },
  {
    id: 'cape-town',
    city: 'Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    tagline: 'Where the Atlantic meets the mountains',
    description:
      'Table Mountain, penguins on the beach, Cape Winelands on your doorstep — Cape Town delivers dramatic landscapes and extraordinary biodiversity in one breathtaking city.',
    imageUrl:
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80',
    imageAlt: 'Cape Town with Table Mountain and the harbour at dusk',
    badge: 'Africa',
    badgeColor: 'coral',
    slug: 'cape-town-south-africa',
    highlights: ['Table Mountain', 'Boulders Beach', 'Cape Winelands', 'Cape Point'],
    bestTime: 'November–March (Southern Hemisphere summer)',
  },
  {
    id: 'santorini',
    city: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    tagline: 'Sunsets, caldera views, and Aegean dreams',
    description:
      'Blue-domed churches, whitewashed cliffs dropping into a caldera, and the most famous sunsets on the planet — Santorini is as extraordinary in person as in the photographs.',
    imageUrl:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    imageAlt: 'White buildings with blue domes in Oia, Santorini, Greece',
    badge: 'Islands',
    badgeColor: 'horizon',
    slug: 'santorini-greece',
    highlights: ['Oia Sunset', 'Caldera Sailing', 'Red Beach', 'Akrotiri Archaeological Site'],
    bestTime: 'April–May or September–October',
  },
];

export const DESTINATION_MAP = Object.fromEntries(
  FEATURED_DESTINATIONS.map((d) => [d.slug, d])
);

// Sample guide articles
export interface GuideArticle {
  slug: string;
  title: string;
  excerpt: string;
  destination: string;
  readTime: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
}

export const SAMPLE_GUIDES: GuideArticle[] = [
  {
    slug: 'best-time-to-visit-bali',
    title: 'Best Time to Visit Bali: A Month-by-Month Guide',
    excerpt:
      'From dry-season surfer swells to rice-harvest ceremonies — here\'s exactly when to go to Bali depending on what you want to do.',
    destination: 'Bali, Indonesia',
    readTime: '7 min read',
    category: 'Travel Tips',
    imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',
    imageAlt: 'Bali temple at sunrise surrounded by mist',
    publishedAt: '2025-08-01',
  },
  {
    slug: 'cheapest-ways-to-fly-to-europe',
    title: 'How to Find Cheap Flights to Europe: 9 Proven Strategies',
    excerpt:
      'Budget airlines, booking windows, hidden city ticketing — our guide to scoring sub-\$500 transatlantic flights more often than you\'d think possible.',
    destination: 'Europe',
    readTime: '9 min read',
    category: 'Flight Tips',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    imageAlt: 'Airplane wing over clouds at sunset',
    publishedAt: '2025-07-14',
  },
  {
    slug: 'tokyo-first-timer-guide',
    title: 'First Time in Tokyo? Everything You Need to Know',
    excerpt:
      'IC cards, etiquette rules, the best neighbourhood to stay in — a complete first-timer\'s blueprint for navigating Japan\'s magnificent capital.',
    destination: 'Tokyo, Japan',
    readTime: '12 min read',
    category: 'City Guides',
    imageUrl: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600&q=80',
    imageAlt: 'Tokyo streets at night with neon signs',
    publishedAt: '2025-06-22',
  },
];
