// ─────────────────────────────────────────────────────────────────────────────
// lib/destinations-v2.ts
// SINGLE SOURCE OF TRUTH for all destination + country data
//
// TypeScript interfaces are designed for future CMS/Supabase migration:
// just swap the static arrays for API calls — page components are unchanged.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Affiliate configuration ──────────────────────────────────────────────────

export interface AffiliateConfig {
  activities: {
    enabled: boolean;
    provider?: 'klook';
    /** Klook city_id used in the widget src URL */
    klookCityId?: number;
    /** Klook category ID */
    klookCategory?: number;
  };
  transfers: { enabled: boolean };
  flights: {
    enabled: boolean;
    /** IATA airport codes for this destination */
    airportCodes: string[];
  };
  hotels: { enabled: boolean };
  carRental: { enabled: boolean };
}

// ─── Guide article ────────────────────────────────────────────────────────────

export interface GuideArticle {
  slug: string;
  title: string;
  excerpt: string;
  destination: string;
  /** Matches a DestinationEntry.slug for auto-linking */
  destinationSlug?: string;
  /** Matches a CountryEntry.slug for auto-linking */
  countrySlug?: string;
  readTime: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: string;
  tags?: string[];
}

// ─── Destination ──────────────────────────────────────────────────────────────

export interface DestinationEntry {
  id: string;
  /** URL slug: e.g. 'bangkok' → /destinations/thailand/bangkok */
  slug: string;
  /** Country slug this destination belongs to: e.g. 'thailand' */
  countrySlug: string;
  name: string;
  country: string;
  continent: string;
  region: string;
  tagline: string;
  shortDescription: string;
  /** Editorial content — may be expanded later */
  overview: string;
  heroImage: {
    src: string;
    alt: string;
  };
  cardImage: {
    src: string;
    alt: string;
  };
  badge: string;
  facts: {
    currency: string;
    languages: string[];
    timezone: string;
    bestTimeToVisit: string;
    averageStay: string;
    airportCodes: string[];
    mainAirportName?: string;
  };
  featured: boolean;
  affiliate: AffiliateConfig;
  relatedDestinationSlugs: string[];
}

// ─── Country ──────────────────────────────────────────────────────────────────

export interface CountryEntry {
  slug: string;
  name: string;
  continent: string;
  region: string;
  shortDescription: string;
  heroImage: { src: string; alt: string };
  cardImage: { src: string; alt: string };
  /** IATA airport codes for the country (most popular) */
  airportCodes: string[];
  /** Destination slugs within this country */
  destinationSlugs: string[];
  featured: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

export const DESTINATIONS: DestinationEntry[] = [
  // ── THAILAND ───────────────────────────────────────────────────────────────
  {
    id: 'bangkok',
    slug: 'bangkok',
    countrySlug: 'thailand',
    name: 'Bangkok',
    country: 'Thailand',
    continent: 'Asia',
    region: 'Southeast Asia',
    tagline: 'A city that never sits still',
    shortDescription:
      'Grand palaces, floating markets, world-class street food, and a skyline that glows at night — Bangkok rewards every kind of traveller.',
    overview:
      'Bangkok is one of Southeast Asia\'s most captivating cities: a place where gilded temples sit beside glass skyscrapers, tuk-tuks weave through luxury hotel traffic, and the best meal you\'ve ever eaten costs less than a coffee. The city is enormous — over 10 million people — but its neighbourhoods each have a distinct character. Explore the river-fronting old town around Rattanakosin, the backpacker chaos of Khao San Road, the upscale malls of Siam, and the hip streets of Ari. Bangkok rewards curiosity.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1400&q=80',
      alt: 'Grand Palace and Wat Phra Kaew illuminated at night in Bangkok, Thailand',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=75',
      alt: 'Bangkok Grand Palace temple complex',
    },
    badge: 'Thailand',
    facts: {
      currency: 'Thai Baht (THB)',
      languages: ['Thai', 'English (widely spoken in tourist areas)'],
      timezone: 'ICT (UTC+7)',
      bestTimeToVisit: 'November – February (cool, dry season)',
      averageStay: '3 – 5 days',
      airportCodes: ['BKK', 'DMK'],
      mainAirportName: 'Suvarnabhumi Airport (BKK)',
    },
    featured: true,
    affiliate: {
      activities: {
        enabled: true,
        provider: 'klook',
        klookCityId: 10,
        klookCategory: 3,
      },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['BKK', 'DMK'] },
      hotels: { enabled: true },
      carRental: { enabled: true },
    },
    relatedDestinationSlugs: ['phuket', 'siem-reap', 'singapore'],
  },
  {
    id: 'phuket',
    slug: 'phuket',
    countrySlug: 'thailand',
    name: 'Phuket',
    country: 'Thailand',
    continent: 'Asia',
    region: 'Southeast Asia',
    tagline: 'Thailand\'s island paradise',
    shortDescription:
      'White-sand beaches, turquoise waters, and a buzzing nightlife — Phuket is Thailand\'s most visited island for good reason.',
    overview:
      'Phuket is Thailand\'s largest island and its most popular beach destination. The west coast holds the famous beaches — Patong, Kata, and Karon — while the quieter east-coast areas and the island interior have Sino-Portuguese architecture in Phuket Town, mangrove-lined bays, and rubber plantations. Use Phuket as a base for island-hopping to Phi Phi, James Bond Island, and the Similan Islands.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1400&q=80',
      alt: 'Turquoise Andaman Sea and white sand beach in Phuket, Thailand',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=75',
      alt: 'Phuket beach with longtail boats',
    },
    badge: 'Thailand',
    facts: {
      currency: 'Thai Baht (THB)',
      languages: ['Thai', 'English (widely spoken)'],
      timezone: 'ICT (UTC+7)',
      bestTimeToVisit: 'November – April (dry season)',
      averageStay: '5 – 7 days',
      airportCodes: ['HKT'],
      mainAirportName: 'Phuket International Airport (HKT)',
    },
    featured: true,
    affiliate: {
      activities: { enabled: false },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['HKT'] },
      hotels: { enabled: true },
      carRental: { enabled: true },
    },
    relatedDestinationSlugs: ['bangkok', 'bali', 'singapore'],
  },

  // ── CAMBODIA ───────────────────────────────────────────────────────────────
  {
    id: 'siem-reap',
    slug: 'siem-reap',
    countrySlug: 'cambodia',
    name: 'Siem Reap',
    country: 'Cambodia',
    continent: 'Asia',
    region: 'Southeast Asia',
    tagline: 'Gateway to Angkor Wat',
    shortDescription:
      'A charming riverside town that serves as the base for exploring the magnificent Angkor temple complex — one of the world\'s greatest archaeological sites.',
    overview:
      'Siem Reap was a small market town until Angkor Wat put it on the world\'s travel map. Today it\'s a comfortable, friendly city with a growing restaurant and bar scene centred on Pub Street and the Old Market. The real draw remains Angkor: over 1,000 temples spread across 400 square kilometres of jungle. Angkor Wat at sunrise, Bayon\'s giant stone faces, and the jungle-consumed towers of Ta Prohm are experiences that stay with you for life.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=80',
      alt: 'Angkor Wat temple complex reflected in water at sunrise, Siem Reap, Cambodia',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=75',
      alt: 'Angkor Wat at sunrise',
    },
    badge: 'Cambodia',
    facts: {
      currency: 'US Dollar (USD) / Cambodian Riel (KHR)',
      languages: ['Khmer', 'English (widely used in tourism)'],
      timezone: 'ICT (UTC+7)',
      bestTimeToVisit: 'November – March (cool, dry season)',
      averageStay: '3 – 4 days',
      airportCodes: ['REP'],
      mainAirportName: 'Siem Reap–Angkor International Airport (REP)',
    },
    featured: true,
    affiliate: {
      activities: { enabled: false },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['REP'] },
      hotels: { enabled: true },
      carRental: { enabled: false },
    },
    relatedDestinationSlugs: ['phnom-penh', 'bangkok', 'ho-chi-minh-city'],
  },
  {
    id: 'phnom-penh',
    slug: 'phnom-penh',
    countrySlug: 'cambodia',
    name: 'Phnom Penh',
    country: 'Cambodia',
    continent: 'Asia',
    region: 'Southeast Asia',
    tagline: 'Cambodia\'s evolving capital',
    shortDescription:
      'A riverfront capital with a complex history, excellent food, and a growing creative scene — Phnom Penh is more than a stopover between Siem Reap and Vietnam.',
    overview:
      'Phnom Penh sits at the confluence of the Mekong and Tonle Sap rivers. The Royal Palace and Silver Pagoda reflect Cambodia\'s royal heritage; the National Museum holds the world\'s finest collection of Khmer sculpture. The difficult history of the Khmer Rouge era is documented with great care at the Tuol Sleng Genocide Museum and the Killing Fields of Choeung Ek — sites every visitor should understand. Beyond the history, a new generation of Cambodian chefs, artists, and entrepreneurs is creating something genuinely exciting.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=1400&q=80',
      alt: 'Royal Palace and riverside promenade in Phnom Penh, Cambodia',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&q=75',
      alt: 'Phnom Penh Royal Palace',
    },
    badge: 'Cambodia',
    facts: {
      currency: 'US Dollar (USD) / Cambodian Riel (KHR)',
      languages: ['Khmer', 'English (common in tourist areas)'],
      timezone: 'ICT (UTC+7)',
      bestTimeToVisit: 'November – February',
      averageStay: '2 – 3 days',
      airportCodes: ['PNH'],
      mainAirportName: 'Phnom Penh International Airport (PNH)',
    },
    featured: false,
    affiliate: {
      activities: { enabled: false },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['PNH'] },
      hotels: { enabled: true },
      carRental: { enabled: false },
    },
    relatedDestinationSlugs: ['siem-reap', 'ho-chi-minh-city', 'bangkok'],
  },

  // ── SINGAPORE ──────────────────────────────────────────────────────────────
  {
    id: 'singapore',
    slug: 'singapore',
    countrySlug: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    continent: 'Asia',
    region: 'Southeast Asia',
    tagline: 'The city-state that does everything well',
    shortDescription:
      'A global city where hawker centres, Michelin-starred restaurants, colonial heritage, futuristic architecture, and lush nature coexist seamlessly.',
    overview:
      'Singapore punches far above its size. In a city-state of just 730 square kilometres, you can eat your way through four distinct culinary cultures (Chinese, Malay, Indian, Peranakan), wander air-conditioned shopping malls connected by underground walkways, explore the world-class Gardens by the Bay, and be deep in primary rainforest at MacRitchie Reservoir — all in one day. Singapore is also a frequent transit hub; if you have a long layover, the city rewards a quick exit from Changi Airport.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1400&q=80',
      alt: 'Singapore skyline with Marina Bay Sands and Gardens by the Bay at night',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=75',
      alt: 'Singapore Marina Bay Sands skyline',
    },
    badge: 'Singapore',
    facts: {
      currency: 'Singapore Dollar (SGD)',
      languages: ['English', 'Mandarin', 'Malay', 'Tamil'],
      timezone: 'SGT (UTC+8)',
      bestTimeToVisit: 'February – April or July – September (relatively drier)',
      averageStay: '3 – 5 days',
      airportCodes: ['SIN'],
      mainAirportName: 'Changi Airport (SIN)',
    },
    featured: true,
    affiliate: {
      activities: { enabled: false },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['SIN'] },
      hotels: { enabled: true },
      carRental: { enabled: false },
    },
    relatedDestinationSlugs: ['bangkok', 'kuala-lumpur', 'bali'],
  },

  // ── JAPAN ──────────────────────────────────────────────────────────────────
  {
    id: 'tokyo',
    slug: 'tokyo',
    countrySlug: 'japan',
    name: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    region: 'East Asia',
    tagline: 'Where tradition meets tomorrow',
    shortDescription:
      'A city of neon-lit skyscrapers and serene temples, unrivalled food culture and bullet trains — Tokyo is a lifetime of discovery compressed into one city.',
    overview:
      'Tokyo is a study in organised complexity. It is the world\'s most populous metropolitan area, yet feels remarkably safe, clean, and efficient. Each neighbourhood has its own identity: Shibuya\'s scramble crossing and youth fashion, Shinjuku\'s izakayas and department stores, Asakusa\'s Senso-ji temple and rickshaws, Yanaka\'s preserved Edo-era streetscape. Japanese cuisine — from three-Michelin-star kaiseki to a ¥500 bowl of ramen at 2am — defines the experience as much as any monument.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=80',
      alt: 'Tokyo skyline at dusk with Tokyo Tower and Mount Fuji visible in the background',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=75',
      alt: 'Tokyo skyline at dusk',
    },
    badge: 'Japan',
    facts: {
      currency: 'Japanese Yen (JPY)',
      languages: ['Japanese', 'English (signage in tourist areas)'],
      timezone: 'JST (UTC+9)',
      bestTimeToVisit: 'March – May (cherry blossom) or October – November (autumn)',
      averageStay: '5 – 7 days',
      airportCodes: ['NRT', 'HND'],
      mainAirportName: 'Narita International Airport (NRT)',
    },
    featured: true,
    affiliate: {
      activities: { enabled: false },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['NRT', 'HND'] },
      hotels: { enabled: true },
      carRental: { enabled: false },
    },
    relatedDestinationSlugs: ['singapore', 'seoul', 'bangkok'],
  },

  // ── INDONESIA ──────────────────────────────────────────────────────────────
  {
    id: 'bali',
    slug: 'bali',
    countrySlug: 'indonesia',
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    region: 'Southeast Asia',
    tagline: 'Island of gods and golden rice terraces',
    shortDescription:
      'Volcanic peaks, emerald rice paddies, ancient temples, and world-class surf breaks — Bali is the quintessential tropical escape with a spiritual heart.',
    overview:
      'Bali is Indonesia\'s most famous island, and for good reason. The south — Seminyak, Kuta, Canggu — has beaches, surf, restaurants, and nightlife. The cultural heartland is Ubud: rice terraces, traditional dance, and healing retreats. The north and east offer diving, black-sand beaches, and Bali\'s most sacred temple, Pura Besakih. The island\'s Hindu culture means ceremonies, offerings, and festivals are woven into everyday life — a constant visual and sensory backdrop.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=80',
      alt: 'Tegalalang Rice Terrace in Ubud, Bali at sunrise with palm trees',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=75',
      alt: 'Bali Tegalalang rice terraces',
    },
    badge: 'Indonesia',
    facts: {
      currency: 'Indonesian Rupiah (IDR)',
      languages: ['Balinese', 'Indonesian', 'English (widely spoken in tourist areas)'],
      timezone: 'WITA (UTC+8)',
      bestTimeToVisit: 'May – September (dry season)',
      averageStay: '7 – 10 days',
      airportCodes: ['DPS'],
      mainAirportName: 'Ngurah Rai International Airport (DPS)',
    },
    featured: true,
    affiliate: {
      activities: { enabled: false },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['DPS'] },
      hotels: { enabled: true },
      carRental: { enabled: true },
    },
    relatedDestinationSlugs: ['singapore', 'phuket', 'kuala-lumpur'],
  },

  // ── MALAYSIA ───────────────────────────────────────────────────────────────
  {
    id: 'kuala-lumpur',
    slug: 'kuala-lumpur',
    countrySlug: 'malaysia',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    continent: 'Asia',
    region: 'Southeast Asia',
    tagline: 'Towers, temples, and the best hawker food in Asia',
    shortDescription:
      'A multicultural capital with an extraordinary food scene, the iconic Petronas Twin Towers, and easy access to beaches, rainforests, and neighbouring countries.',
    overview:
      'Kuala Lumpur — KL to locals — is a city of genuine cultural plurality. Malay, Chinese, Indian, and indigenous traditions coexist in the same neighbourhoods, which means the food is extraordinary: dim sum in Chinatown, nasi lemak at a mamak stall at 3am, roti canai fresh off the griddle. The Petronas Twin Towers define the skyline; Batu Caves, 13 kilometres north, are among Southeast Asia\'s most dramatic Hindu shrines. KL is also a gateway: the Cameron Highlands, Penang, and the beaches of Langkawi are all within easy reach.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1400&q=80',
      alt: 'Petronas Twin Towers illuminated at night in Kuala Lumpur, Malaysia',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=75',
      alt: 'Kuala Lumpur Petronas Towers at night',
    },
    badge: 'Malaysia',
    facts: {
      currency: 'Malaysian Ringgit (MYR)',
      languages: ['Bahasa Malaysia', 'English (widely spoken)', 'Mandarin', 'Tamil'],
      timezone: 'MYT (UTC+8)',
      bestTimeToVisit: 'May – July or December – February',
      averageStay: '3 – 5 days',
      airportCodes: ['KUL'],
      mainAirportName: 'Kuala Lumpur International Airport (KUL)',
    },
    featured: false,
    affiliate: {
      activities: { enabled: false },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['KUL'] },
      hotels: { enabled: true },
      carRental: { enabled: true },
    },
    relatedDestinationSlugs: ['singapore', 'bangkok', 'bali'],
  },

  // ── VIETNAM ────────────────────────────────────────────────────────────────
  {
    id: 'ho-chi-minh-city',
    slug: 'ho-chi-minh-city',
    countrySlug: 'vietnam',
    name: 'Ho Chi Minh City',
    country: 'Vietnam',
    continent: 'Asia',
    region: 'Southeast Asia',
    tagline: 'Vietnam\'s relentless, energetic south',
    shortDescription:
      'A city of motorbikes, French-colonial architecture, exceptional food, and a history that is both recent and profound — Ho Chi Minh City moves fast.',
    overview:
      'Ho Chi Minh City (still called Saigon by most locals) is Vietnam\'s largest and most dynamic city. District 1 — the commercial heart — has the War Remnants Museum, Reunification Palace, Notre-Dame Cathedral, and the Central Post Office. Street food here is world-class: banh mi, pho, com tam (broken rice), and countless regional dishes. Day trips reach the Cu Chi Tunnels, the Mekong Delta, and the Cao Dai Holy See. The city\'s café culture and growing art scene make it a destination in its own right.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1400&q=80',
      alt: 'Ho Chi Minh City skyline with Bitexco Financial Tower at dusk',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=75',
      alt: 'Ho Chi Minh City skyline at dusk',
    },
    badge: 'Vietnam',
    facts: {
      currency: 'Vietnamese Dong (VND)',
      languages: ['Vietnamese', 'English (widely spoken in tourist areas)'],
      timezone: 'ICT (UTC+7)',
      bestTimeToVisit: 'December – April (dry season in the south)',
      averageStay: '3 – 4 days',
      airportCodes: ['SGN'],
      mainAirportName: 'Tan Son Nhat International Airport (SGN)',
    },
    featured: false,
    affiliate: {
      activities: { enabled: false },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['SGN'] },
      hotels: { enabled: true },
      carRental: { enabled: false },
    },
    relatedDestinationSlugs: ['siem-reap', 'phnom-penh', 'bangkok'],
  },

  // ── SOUTH KOREA ────────────────────────────────────────────────────────────
  {
    id: 'seoul',
    slug: 'seoul',
    countrySlug: 'south-korea',
    name: 'Seoul',
    country: 'South Korea',
    continent: 'Asia',
    region: 'East Asia',
    tagline: 'Ancient palaces, K-culture, and exceptional food',
    shortDescription:
      'A city that blends five centuries of royal history with cutting-edge design, street food markets, and a K-pop and K-drama cultural wave the world cannot ignore.',
    overview:
      'Seoul is one of Asia\'s most compelling capital cities. The five grand Joseon-dynasty palaces — Gyeongbokgung, Changdeokgung, and others — anchor the city\'s historic north. The neighbourhoods that surround them — Bukchon Hanok Village, Insadong, and Jongno — preserve traditional architecture and craft. Cross the Han River and you reach Gangnam, the wealthy southern district that defines modern Korean ambition. The food scene spans everything from royal court cuisine to 24-hour street stalls selling tteokbokki and Korean fried chicken.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1538669715315-155098f0fb1d?w=1400&q=80',
      alt: 'Gyeongbokgung Palace in Seoul with Bugaksan mountain in the background',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1538669715315-155098f0fb1d?w=800&q=75',
      alt: 'Gyeongbokgung Palace Seoul',
    },
    badge: 'South Korea',
    facts: {
      currency: 'South Korean Won (KRW)',
      languages: ['Korean', 'English (signage and transport widely available)'],
      timezone: 'KST (UTC+9)',
      bestTimeToVisit: 'April – May (spring) or September – November (autumn)',
      averageStay: '4 – 6 days',
      airportCodes: ['ICN', 'GMP'],
      mainAirportName: 'Incheon International Airport (ICN)',
    },
    featured: false,
    affiliate: {
      activities: { enabled: false },
      transfers: { enabled: true },
      flights: { enabled: true, airportCodes: ['ICN', 'GMP'] },
      hotels: { enabled: true },
      carRental: { enabled: false },
    },
    relatedDestinationSlugs: ['tokyo', 'singapore', 'bangkok'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COUNTRIES
// ─────────────────────────────────────────────────────────────────────────────

export const COUNTRIES: CountryEntry[] = [
  {
    slug: 'thailand',
    name: 'Thailand',
    continent: 'Asia',
    region: 'Southeast Asia',
    shortDescription:
      'Golden temples, tropical islands, excellent cuisine, and some of Southeast Asia\'s warmest hospitality make Thailand one of the world\'s most visited countries.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1400&q=80',
      alt: 'Grand Palace in Bangkok, Thailand with golden spires',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=75',
      alt: 'Thailand Grand Palace Bangkok',
    },
    airportCodes: ['BKK', 'DMK', 'HKT', 'CNX'],
    destinationSlugs: ['bangkok', 'phuket'],
    featured: true,
  },
  {
    slug: 'cambodia',
    name: 'Cambodia',
    continent: 'Asia',
    region: 'Southeast Asia',
    shortDescription:
      'Home to the world\'s largest religious monument and a people whose resilience after recent history is as remarkable as their country\'s ancient achievements.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=80',
      alt: 'Angkor Wat temple at sunrise in Cambodia',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=75',
      alt: 'Angkor Wat Cambodia',
    },
    airportCodes: ['REP', 'PNH'],
    destinationSlugs: ['siem-reap', 'phnom-penh'],
    featured: true,
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    continent: 'Asia',
    region: 'Southeast Asia',
    shortDescription:
      'The ultimate city-state: safe, efficient, diverse, delicious, and surprisingly green for a place that is essentially one very well-run city.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1400&q=80',
      alt: 'Singapore skyline with Marina Bay Sands',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=75',
      alt: 'Singapore Marina Bay Sands',
    },
    airportCodes: ['SIN'],
    destinationSlugs: ['singapore'],
    featured: true,
  },
  {
    slug: 'japan',
    name: 'Japan',
    continent: 'Asia',
    region: 'East Asia',
    shortDescription:
      'Four distinct seasons, ancient temples alongside modern design, and a food culture that is widely considered among the world\'s finest.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=80',
      alt: 'Tokyo skyline with Mount Fuji at dusk',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=75',
      alt: 'Tokyo skyline Japan',
    },
    airportCodes: ['NRT', 'HND', 'KIX', 'ITM'],
    destinationSlugs: ['tokyo'],
    featured: true,
  },
  {
    slug: 'indonesia',
    name: 'Indonesia',
    continent: 'Asia',
    region: 'Southeast Asia',
    shortDescription:
      'The world\'s largest archipelago: 17,000 islands spanning active volcanoes, coral reefs, Hindu temples, and some of the most diverse ecosystems on Earth.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=80',
      alt: 'Bali rice terraces in Indonesia at sunrise',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=75',
      alt: 'Bali Indonesia rice terraces',
    },
    airportCodes: ['DPS', 'CGK'],
    destinationSlugs: ['bali'],
    featured: true,
  },
  {
    slug: 'malaysia',
    name: 'Malaysia',
    continent: 'Asia',
    region: 'Southeast Asia',
    shortDescription:
      'A multicultural country with extraordinary food, rainforest interiors, beautiful islands, and one of the world\'s great transport hubs at Kuala Lumpur.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1400&q=80',
      alt: 'Petronas Twin Towers in Kuala Lumpur Malaysia at night',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=75',
      alt: 'Kuala Lumpur Malaysia Petronas Towers',
    },
    airportCodes: ['KUL'],
    destinationSlugs: ['kuala-lumpur'],
    featured: false,
  },
  {
    slug: 'vietnam',
    name: 'Vietnam',
    continent: 'Asia',
    region: 'Southeast Asia',
    shortDescription:
      'A long, thin country of dramatic contrasts: limestone karst in Ha Long Bay, rice paddies in the Mekong Delta, street food in Hanoi and Saigon, and beaches in between.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1400&q=80',
      alt: 'Ho Chi Minh City skyline Vietnam at night',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=75',
      alt: 'Vietnam Ho Chi Minh City skyline',
    },
    airportCodes: ['SGN', 'HAN', 'DAD'],
    destinationSlugs: ['ho-chi-minh-city'],
    featured: false,
  },
  {
    slug: 'south-korea',
    name: 'South Korea',
    continent: 'Asia',
    region: 'East Asia',
    shortDescription:
      'Dynamic cities, ancient palaces, superb food, and a cultural export phenomenon — South Korea offers some of Asia\'s most rewarding travel experiences.',
    heroImage: {
      src: 'https://images.unsplash.com/photo-1538669715315-155098f0fb1d?w=1400&q=80',
      alt: 'Gyeongbokgung Palace in Seoul South Korea',
    },
    cardImage: {
      src: 'https://images.unsplash.com/photo-1538669715315-155098f0fb1d?w=800&q=75',
      alt: 'Seoul South Korea Gyeongbokgung Palace',
    },
    airportCodes: ['ICN', 'GMP'],
    destinationSlugs: ['seoul'],
    featured: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP MAPS (computed once at module init — O(1) lookups in page components)
// ─────────────────────────────────────────────────────────────────────────────

export const DESTINATION_BY_SLUG = Object.fromEntries(
  DESTINATIONS.map((d) => [d.slug, d])
) as Record<string, DestinationEntry>;

export const COUNTRY_BY_SLUG = Object.fromEntries(
  COUNTRIES.map((c) => [c.slug, c])
) as Record<string, CountryEntry>;

export const DESTINATIONS_BY_COUNTRY = COUNTRIES.reduce<Record<string, DestinationEntry[]>>(
  (acc, country) => {
    acc[country.slug] = country.destinationSlugs
      .map((s) => DESTINATION_BY_SLUG[s])
      .filter(Boolean);
    return acc;
  },
  {}
);

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE ARTICLES — extended with destinationSlug + countrySlug
// ─────────────────────────────────────────────────────────────────────────────

export const GUIDES: GuideArticle[] = [
  {
    slug: 'best-time-to-visit-bali',
    title: 'Best Time to Visit Bali: A Month-by-Month Guide',
    excerpt:
      "From dry-season surfer swells to rice-harvest ceremonies — here's exactly when to go to Bali depending on what you want to do.",
    destination: 'Bali, Indonesia',
    destinationSlug: 'bali',
    countrySlug: 'indonesia',
    readTime: '7 min read',
    category: 'Travel Tips',
    imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',
    imageAlt: 'Bali temple at sunrise surrounded by mist',
    publishedAt: '2025-08-01',
    tags: ['bali', 'indonesia', 'planning', 'weather'],
  },
  {
    slug: 'cheapest-ways-to-fly-to-europe',
    title: 'How to Find Cheap Flights to Europe: 9 Proven Strategies',
    excerpt:
      "Budget airlines, booking windows, hidden city ticketing — our guide to scoring sub-$500 transatlantic flights more often than you'd think possible.",
    destination: 'Europe',
    readTime: '9 min read',
    category: 'Flight Tips',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
    imageAlt: 'Airplane wing over clouds at sunset',
    publishedAt: '2025-07-14',
    tags: ['flights', 'europe', 'budget', 'tips'],
  },
  {
    slug: 'tokyo-first-timer-guide',
    title: 'First Time in Tokyo? Everything You Need to Know',
    excerpt:
      "IC cards, etiquette rules, the best neighbourhood to stay in — a complete first-timer's blueprint for navigating Japan's magnificent capital.",
    destination: 'Tokyo, Japan',
    destinationSlug: 'tokyo',
    countrySlug: 'japan',
    readTime: '12 min read',
    category: 'City Guides',
    imageUrl: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=600&q=80',
    imageAlt: 'Tokyo streets at night with neon signs',
    publishedAt: '2025-06-22',
    tags: ['tokyo', 'japan', 'first-time', 'guide'],
  },
];

export const GUIDE_BY_SLUG = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g])
) as Record<string, GuideArticle>;

/** Returns guides related to a destination slug */
export function getGuidesForDestination(destinationSlug: string): GuideArticle[] {
  return GUIDES.filter((g) => g.destinationSlug === destinationSlug);
}

/** Returns guides related to a country slug */
export function getGuidesForCountry(countrySlug: string): GuideArticle[] {
  return GUIDES.filter((g) => g.countrySlug === countrySlug);
}

/** Returns related DestinationEntry objects for a destination */
export function getRelatedDestinations(destination: DestinationEntry): DestinationEntry[] {
  return destination.relatedDestinationSlugs
    .map((s) => DESTINATION_BY_SLUG[s])
    .filter(Boolean);
}
