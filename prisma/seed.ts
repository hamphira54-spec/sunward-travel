import { PrismaClient } from '@prisma/client';
import { COUNTRIES, DESTINATIONS } from '../lib/destinations-v2';
import { GUIDES } from '../lib/guides';
import { EVENT_ARTICLES } from '../lib/events';
import { NEWS_ARTICLES } from '../lib/news';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // Seed Countries
  for (const country of COUNTRIES) {
    await prisma.country.upsert({
      where: { slug: country.slug },
      update: {},
      create: {
        slug: country.slug,
        name: country.name,
        continent: country.continent,
        region: country.region,
        shortDescription: country.shortDescription,
        heroImage: country.heroImage as any,
        cardImage: country.cardImage as any,
        airportCodes: country.airportCodes,
        featured: country.featured,
      },
    });
  }

  // Seed Destinations
  for (const dest of DESTINATIONS) {
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {},
      create: {
        slug: dest.slug,
        name: dest.name,
        country: dest.country,
        continent: dest.continent,
        region: dest.region,
        tagline: dest.tagline,
        shortDescription: dest.shortDescription,
        overview: dest.overview,
        heroImage: dest.heroImage as any,
        cardImage: dest.cardImage as any,
        badge: dest.badge,
        facts: dest.facts as any,
        featured: dest.featured,
        affiliate: dest.affiliate as any,
        countrySlug: dest.countrySlug,
        relatedDestinations: dest.relatedDestinationSlugs,
      },
    });
  }

  // Seed Guides
  for (const guide of GUIDES) {
    await prisma.guide.upsert({
      where: { slug: guide.slug },
      update: {},
      create: {
        slug: guide.slug,
        title: guide.title,
        excerpt: guide.excerpt,
        category: guide.category,
        tags: guide.tags || [],
        heroImage: guide.heroImage as any,
        cardImage: guide.cardImage as any,
        author: guide.author,
        publishedAt: guide.publishedAt,
        updatedAt: guide.updatedAt,
        readingTimeMinutes: guide.readingTimeMinutes,
        featured: guide.featured || false,
        body: guide.body as any,
        status: guide.status || 'published', // default status
        seo: guide.seo as any,
        affiliateCTAs: guide.affiliateCTAs as any,
        tocSections: guide.tocSections as any,
        countrySlug: guide.countrySlug,
        destinationSlug: guide.destinationSlug,
        destinationLabel: guide.destinationLabel,
      },
    });
  }

  // Seed News
  if (NEWS_ARTICLES) {
    for (const news of NEWS_ARTICLES) {
      await prisma.news.upsert({
        where: { slug: news.slug },
        update: {},
        create: {
          slug: news.slug,
          title: news.title,
          excerpt: news.excerpt,
          body: news.body as any,
          heroImage: news.heroImage as any,
          category: news.category,
          tags: news.tags,
          author: news.author as any,
          publication: news.publication as any,
          sourceReferences: news.sourceReferences as any,
          featured: news.featured || false,
          trending: news.trending || false,
          readingTimeMinutes: news.readingTimeMinutes,
          seo: news.seo as any,
          countrySlug: news.countrySlug,
          destinationSlug: news.destinationSlug,
        },
      });
    }
  }

  // Seed Events
  if (EVENT_ARTICLES) {
    for (const event of EVENT_ARTICLES) {
      await prisma.event.upsert({
        where: { slug: event.slug },
        update: {},
        create: {
          slug: event.slug,
          title: event.title,
          excerpt: event.excerpt,
          body: event.body as any,
          heroImage: event.heroImage as any,
          venue: event.venue as any,
          startDate: event.startDate,
          endDate: event.endDate,
          timezone: event.timezone,
          allDay: event.allDay,
          category: event.category,
          officialUrl: event.officialUrl,
          ticketUrl: event.ticketUrl,
          sourceReferences: event.sourceReferences as any,
          organizer: event.organizer,
          lifecycleStatus: event.lifecycleStatus,
          publication: event.publication as any,
          featured: event.featured || false,
          seo: event.seo as any,
          tags: event.tags,
          countrySlug: event.countrySlug,
          destinationSlug: event.destinationSlug,
        },
      });
    }
  }

  console.log('Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
