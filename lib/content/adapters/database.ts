import prisma from '@/lib/db';
import type { TravelGuide, GuideCategory } from '@/lib/guides';
import type { TravelNews, NewsCategory } from '@/lib/content/news';
import type { TravelEvent, EventCategory } from '@/lib/content/events';

// ─── Guide queries ────────────────────────────────────────────────────────────

export async function getPublishedGuides(): Promise<TravelGuide[]> {
  const guides = await prisma.guide.findMany({ where: { status: 'published' } });
  return guides.map(mapGuide);
}

export async function getGuideBySlug(slug: string): Promise<TravelGuide | undefined> {
  const guide = await prisma.guide.findUnique({ where: { slug } });
  if (!guide || guide.status !== 'published') return undefined;
  return mapGuide(guide);
}

export async function getFeaturedGuides(limit?: number): Promise<TravelGuide[]> {
  const guides = await prisma.guide.findMany({
    where: { featured: true, status: 'published' },
    take: limit,
  });
  return guides.map(mapGuide);
}

export async function getRecentGuides(limit?: number): Promise<TravelGuide[]> {
  const guides = await prisma.guide.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
  return guides.map(mapGuide);
}

export async function getGuidesByDestination(destinationSlug: string): Promise<TravelGuide[]> {
  const guides = await prisma.guide.findMany({
    where: { destinationSlug, status: 'published' },
  });
  return guides.map(mapGuide);
}

export async function getGuidesByCountry(countrySlug: string): Promise<TravelGuide[]> {
  const guides = await prisma.guide.findMany({
    where: {
      OR: [{ countrySlug }, { destinationSlug: countrySlug }],
      status: 'published',
    },
  });
  return guides.map(mapGuide);
}

export async function getGuidesByCategory(category: GuideCategory): Promise<TravelGuide[]> {
  const guides = await prisma.guide.findMany({
    where: { category, status: 'published' },
  });
  return guides.map(mapGuide);
}

export async function getGuidesByTag(tag: string): Promise<TravelGuide[]> {
  const guides = await prisma.guide.findMany({
    where: {
      status: 'published',
      tags: { array_contains: tag }, // Prisma JSON filter
    },
  });
  return guides.map(mapGuide);
}

export async function getRelatedGuidesFor(slug: string, limit = 3): Promise<TravelGuide[]> {
  // Simplified for stub - ideally requires complex querying or fetching all
  return [];
}

// ─── News queries ─────────────────────────────────────────────────────────────

export async function getAllPublishedNews(limit?: number): Promise<TravelNews[]> {
  const news = await prisma.news.findMany({ take: limit });
  return news.map(mapNews).filter((n: TravelNews) => n.publication.status === 'published');
}

export async function getNewsBySlug(slug: string): Promise<TravelNews | undefined> {
  const article = await prisma.news.findUnique({ where: { slug } });
  if (!article) return undefined;
  const mapped = mapNews(article);
  if (mapped.publication.status !== 'published') return undefined;
  return mapped;
}

export async function getFeaturedNews(limit?: number): Promise<TravelNews[]> {
  const news = await prisma.news.findMany({ where: { featured: true }, take: limit });
  return news.map(mapNews).filter((n: TravelNews) => n.publication.status === 'published');
}

export async function getRecentNews(limit?: number): Promise<TravelNews[]> {
  return getAllPublishedNews(limit);
}

export async function getNewsByCategory(category: NewsCategory, limit?: number): Promise<TravelNews[]> {
  const news = await prisma.news.findMany({ where: { category }, take: limit });
  return news.map(mapNews).filter((n: TravelNews) => n.publication.status === 'published');
}

export async function getNewsByDestination(destinationSlug: string): Promise<TravelNews[]> {
  const news = await prisma.news.findMany({ where: { destinationSlug } });
  return news.map(mapNews).filter((n: TravelNews) => n.publication.status === 'published');
}

export async function getNewsByCountry(countrySlug: string): Promise<TravelNews[]> {
  const news = await prisma.news.findMany({
    where: { OR: [{ countrySlug }, { destinationSlug: countrySlug }] },
  });
  return news.map(mapNews).filter((n: TravelNews) => n.publication.status === 'published');
}

export async function getRelatedNews(slug: string, limit = 3): Promise<TravelNews[]> {
  return [];
}

// ─── Event queries ─────────────────────────────────────────────────────────────

export async function getAllPublishedEvents(limit?: number): Promise<TravelEvent[]> {
  const events = await prisma.event.findMany({ take: limit });
  return events.map(mapEvent).filter((e: TravelEvent) => e.publication.status === 'published');
}

export async function getEventBySlug(slug: string): Promise<TravelEvent | undefined> {
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return undefined;
  const mapped = mapEvent(event);
  if (mapped.publication.status !== 'published') return undefined;
  return mapped;
}

export async function getUpcomingEvents(limit?: number): Promise<TravelEvent[]> {
  const events = await prisma.event.findMany({
    where: { lifecycleStatus: { notIn: ['cancelled', 'completed'] } },
    take: limit,
  });
  return events.map(mapEvent).filter((e: TravelEvent) => e.publication.status === 'published');
}

export async function getFeaturedEvents(limit?: number): Promise<TravelEvent[]> {
  const events = await prisma.event.findMany({ where: { featured: true }, take: limit });
  return events.map(mapEvent).filter((e: TravelEvent) => e.publication.status === 'published');
}

export async function getEventsByCategory(category: EventCategory, limit?: number): Promise<TravelEvent[]> {
  const events = await prisma.event.findMany({ where: { category }, take: limit });
  return events.map(mapEvent).filter((e: TravelEvent) => e.publication.status === 'published');
}

export async function getEventsByDestination(destinationSlug: string): Promise<TravelEvent[]> {
  const events = await prisma.event.findMany({ where: { destinationSlug } });
  return events.map(mapEvent).filter((e: TravelEvent) => e.publication.status === 'published');
}

export async function getEventsByCountry(countrySlug: string): Promise<TravelEvent[]> {
  const events = await prisma.event.findMany({
    where: { OR: [{ countrySlug }, { destinationSlug: countrySlug }] },
  });
  return events.map(mapEvent).filter((e: TravelEvent) => e.publication.status === 'published');
}

export async function getRelatedEvents(slug: string, limit = 3): Promise<TravelEvent[]> {
  return [];
}


// ─── Mappers ─────────────────────────────────────────────────────────────

export function validateInlineNodes(nodes: any[]): any[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node) => {
    if (!node || typeof node !== 'object') return null;
    if (node.type === 'text' && typeof node.content === 'string') return node;
    if (node.type === 'strong' && typeof node.content === 'string') return node;
    if (node.type === 'link' && typeof node.content === 'string' && typeof node.href === 'string') return node;
    return null;
  }).filter(Boolean);
}

export function validateContentBlocks(blocks: any): any[] | undefined {
  if (!blocks) return undefined;
  if (!Array.isArray(blocks)) return [];

  return blocks.map((block) => {
    if (!block || typeof block !== 'object' || !block.type) return null;
    switch (block.type) {
      case 'paragraph':
        return { type: 'paragraph', nodes: validateInlineNodes(block.nodes) };
      case 'heading':
        return { type: 'heading', level: block.level === 2 || block.level === 3 ? block.level : 2, id: block.id, text: block.text || '' };
      case 'image':
        return { type: 'image', src: block.src || '', alt: block.alt || '', caption: block.caption, credit: block.credit, width: block.width, height: block.height };
      case 'list':
        return { type: 'list', ordered: !!block.ordered, items: Array.isArray(block.items) ? block.items.map((i: any) => ({ nodes: validateInlineNodes(i.nodes) })) : [] };
      case 'quote':
        return { type: 'quote', nodes: validateInlineNodes(block.nodes), attribution: block.attribution };
      case 'callout':
        return { type: 'callout', variant: ['tip', 'info', 'warning'].includes(block.variant) ? block.variant : 'info', heading: block.heading, nodes: validateInlineNodes(block.nodes) };
      case 'divider':
        return { type: 'divider' };
      default:
        return null;
    }
  }).filter(Boolean);
}

function mapGuide(row: any): TravelGuide {
  return {
    ...row,
    tags: row.tags as any,
    heroImage: row.heroImage as any,
    cardImage: row.cardImage as any,
    body: validateContentBlocks(row.body) as any,
    seo: row.seo as any,
    affiliateCTAs: row.affiliateCTAs as any,
    tocSections: row.tocSections as any,
  };
}

function mapNews(row: any): TravelNews {
  return {
    ...row,
    body: validateContentBlocks(row.body) || [],
    heroImage: row.heroImage as any,
    tags: row.tags as any,
    author: row.author as any,
    publication: row.publication as any,
    sourceReferences: row.sourceReferences as any,
    seo: row.seo as any,
  };
}

function mapEvent(row: any): TravelEvent {
  return {
    ...row,
    body: validateContentBlocks(row.body) || [],
    heroImage: row.heroImage as any,
    venue: row.venue as any,
    sourceReferences: row.sourceReferences as any,
    publication: row.publication as any,
    seo: row.seo as any,
    tags: row.tags as any,
  };
}
