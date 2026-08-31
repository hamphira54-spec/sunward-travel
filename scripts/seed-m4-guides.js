const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const guides = [
    {
      slug: 'where-to-stay-in-bangkok',
      title: 'Where to Stay in Bangkok',
      excerpt: 'Discover the best neighborhoods in Bangkok for every travel style, from luxury riverside resorts to budget-friendly hostels.',
      category: 'where-to-stay',
      destinationSlug: 'bangkok',
      destinationLabel: 'Bangkok, Thailand',
      countrySlug: 'thailand',
      tags: ['where-to-stay', 'hotels', 'bangkok'],
      heroImage: { src: '/images/destinations/bangkok-hero.jpg', alt: 'Bangkok Cityscape' },
      cardImage: { src: '/images/destinations/bangkok-card.jpg', alt: 'Bangkok' },
      author: 'Sunward Travel Editorial Team',
      publishedAt: new Date().toISOString(),
      readingTimeMinutes: 5,
      featured: true,
      status: 'published',
      publishStatus: 'published',
      publishDate: new Date(),
      seo: { title: 'Where to Stay in Bangkok: Best Areas & Neighborhoods', description: 'Find the perfect area to stay in Bangkok, whether you want luxury shopping in Sukhumvit or historic charm in Riverside.' },
      affiliateCTAs: [],
      tocSections: [{ id: 'overview', title: 'Overview' }, { id: 'sukhumvit', title: 'Sukhumvit' }, { id: 'riverside', title: 'Riverside' }, { id: 'silom', title: 'Silom' }],
      body: [
        { type: 'heading', level: 2, id: 'overview', text: 'Overview' },
        { type: 'paragraph', nodes: [{ type: 'text', content: 'Bangkok is a sprawling metropolis with distinct neighborhoods offering completely different experiences.' }] },
        {
          type: 'stay_area',
          id: 'sukhumvit',
          name: 'Sukhumvit',
          bestForTitle: 'Best for',
          summary: 'The commercial heart of Bangkok, packed with luxury malls, fine dining, and endless nightlife options.',
          bestFor: ['Shopping', 'Nightlife', 'Luxury dining'],
          accommodationTypes: ['High-end business hotels', 'Luxury condos'],
          atmosphere: 'Modern, bustling, upscale',
          transportNotes: 'Excellent BTS Skytrain access',
          nearbyHighlights: ['Terminal 21', 'EmQuartier'],
          considerations: ['Heavy traffic during rush hour', 'Can feel less authentically Thai']
        },
        {
          type: 'stay_area',
          id: 'riverside',
          name: 'Riverside',
          bestForTitle: 'Best for',
          summary: 'The historic and scenic heart of the city, offering stunning views and easy access to ancient temples.',
          bestFor: ['Couples', 'First-timers', 'Relaxation'],
          accommodationTypes: ['5-star heritage hotels', 'Boutique resorts'],
          atmosphere: 'Romantic, peaceful, historic',
          transportNotes: 'Chao Phraya Express Boat is the main transport',
          nearbyHighlights: ['Grand Palace', 'Wat Arun', 'Wat Pho'],
          considerations: ['Further from modern shopping districts', 'More expensive on average']
        }
      ]
    },
    {
      slug: 'where-to-stay-in-seoul',
      title: 'Where to Stay in Seoul',
      excerpt: 'Navigate Seoul’s diverse districts to find your perfect base, from the trendy streets of Hongdae to the historic charm of Bukchon.',
      category: 'where-to-stay',
      destinationSlug: 'seoul',
      destinationLabel: 'Seoul, South Korea',
      countrySlug: 'south-korea',
      tags: ['where-to-stay', 'hotels', 'seoul'],
      heroImage: { src: '/images/destinations/seoul-hero.jpg', alt: 'Seoul Cityscape' },
      cardImage: { src: '/images/destinations/seoul-card.jpg', alt: 'Seoul' },
      author: 'Sunward Travel Editorial Team',
      publishedAt: new Date().toISOString(),
      readingTimeMinutes: 5,
      featured: true,
      status: 'published',
      publishStatus: 'published',
      publishDate: new Date(),
      seo: { title: 'Where to Stay in Seoul: Best Areas & Neighborhoods', description: 'Find the perfect area to stay in Seoul, whether you want trendy nightlife in Hongdae or historic hanoks in Bukchon.' },
      affiliateCTAs: [],
      tocSections: [{ id: 'overview', title: 'Overview' }, { id: 'myeongdong', title: 'Myeongdong' }, { id: 'hongdae', title: 'Hongdae' }],
      body: [
        { type: 'heading', level: 2, id: 'overview', text: 'Overview' },
        { type: 'paragraph', nodes: [{ type: 'text', content: 'Seoul is a massive, dynamic city where ancient palaces sit alongside ultra-modern skyscrapers. Choosing the right neighborhood is essential.' }] },
        {
          type: 'stay_area',
          id: 'myeongdong',
          name: 'Myeongdong',
          bestForTitle: 'Best for',
          summary: 'The epicenter of Korean skincare, street food, and retail therapy. Perfect for shopaholics and first-time visitors.',
          bestFor: ['Shopping', 'Street food', 'First-timers'],
          accommodationTypes: ['Mid-range business hotels', 'Guesthouses'],
          atmosphere: 'Vibrant, crowded, tourist-friendly',
          transportNotes: 'Extremely well-connected via subway',
          nearbyHighlights: ['Myeongdong Shopping Street', 'N Seoul Tower'],
          considerations: ['Very touristy', 'Lacks traditional charm']
        },
        {
          type: 'stay_area',
          id: 'hongdae',
          name: 'Hongdae',
          bestForTitle: 'Best for',
          summary: 'A youthful, artistic neighborhood surrounding Hongik University, famous for indie music, nightlife, and quirky cafes.',
          bestFor: ['Nightlife', 'Budget travelers', 'Youth culture'],
          accommodationTypes: ['Hostels', 'Boutique guesthouses'],
          atmosphere: 'Energetic, creative, young',
          transportNotes: 'AREX train direct to Incheon Airport',
          nearbyHighlights: ['Trick Eye Museum', 'Hongdae Free Market'],
          considerations: ['Can be loud at night', 'Further from historic palaces']
        }
      ]
    }
  ];

  for (const guide of guides) {
    const existing = await prisma.guide.findUnique({ where: { slug: guide.slug } });
    if (!existing) {
      await prisma.guide.create({ data: guide });
      console.log(`Created ${guide.slug}`);
    } else {
      console.log(`Skipped ${guide.slug} (already exists)`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
