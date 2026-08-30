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
  const current = await getNewsBySlug(slug);
  if (!current) return [];

  const allNews = await getAllPublishedNews();
  return allNews
    .filter((n) => n.slug !== slug)
    .map((n) => {
      let score = 0;
      if (current.destinationSlug && n.destinationSlug === current.destinationSlug) score += 4;
      if (current.countrySlug && n.countrySlug === current.countrySlug) score += 3;
      if (n.category === current.category) score += 2;
      const sharedTags = Array.isArray(n.tags) && Array.isArray(current.tags) 
        ? n.tags.filter((t) => current.tags.includes(t)).length 
        : 0;
      score += sharedTags;
      return { article: n, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.article);
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
  const current = await getEventBySlug(slug);
  if (!current) return [];

  const upcomingEvents = await getUpcomingEvents();
  return upcomingEvents
    .filter((e) => e.slug !== slug)
    .map((e) => {
      let score = 0;
      if (current.destinationSlug && e.destinationSlug === current.destinationSlug) score += 4;
      if (current.countrySlug && e.countrySlug === current.countrySlug) score += 3;
      if (e.category === current.category) score += 2;
      const sharedTags = Array.isArray(e.tags) && Array.isArray(current.tags) 
        ? e.tags.filter((t) => current.tags.includes(t)).length 
        : 0;
      score += sharedTags;
      return { event: e, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ event }) => event);
}


// ─── Mappers ─────────────────────────────────────────────────────────────

export function validateUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed === '') return '';

  // Allow relative paths (e.g. /guides/bangkok)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Check for allowed protocols
  const lowerUrl = trimmed.toLowerCase();
  if (lowerUrl.startsWith('http://') || lowerUrl.startsWith('https://')) {
    try {
      new URL(trimmed); // ensure it's parseable
      return trimmed;
    } catch {
      throw new Error(`Malformed URL: ${trimmed}`);
    }
  }

  throw new Error(`Invalid URL protocol or format. Only http, https, and absolute relative paths are allowed: ${trimmed}`);
}

export function validateInlineNodes(nodes: any[]): any[] {
  if (!Array.isArray(nodes)) throw new Error("Inline nodes must be an array");
  
  return nodes.map((node, i) => {
    if (!node || typeof node !== 'object') throw new Error(`Invalid inline node at index ${i}`);
    
    switch (node.type) {
      case 'text':
      case 'strong':
        if (typeof node.content !== 'string') throw new Error(`Inline ${node.type} must have string content`);
        return { type: node.type, content: node.content };
      
      case 'link':
        if (typeof node.content !== 'string') throw new Error("Inline link must have string content");
        const safeHref = validateUrl(node.href);
        return { type: 'link', content: node.content, href: safeHref, external: !!node.external };
      
      default:
        throw new Error(`Unknown inline node type: ${node.type}`);
    }
  });
}

export function validateContentBlocks(blocks: any): any[] {
  if (!Array.isArray(blocks)) throw new Error("ContentBlocks must be an array");

  return blocks.map((block, i) => {
    if (!block || typeof block !== 'object' || !block.type) {
      throw new Error(`Invalid block at index ${i}`);
    }

    switch (block.type) {
      case 'paragraph':
        return { type: 'paragraph', nodes: validateInlineNodes(block.nodes) };
      
      case 'heading':
        return { 
          type: 'heading', 
          level: (block.level === 2 || block.level === 3) ? block.level : 2, 
          id: typeof block.id === 'string' ? block.id : '', 
          text: typeof block.text === 'string' ? block.text : '' 
        };
      
      case 'image':
        return { 
          type: 'image', 
          src: validateUrl(block.src), 
          alt: typeof block.alt === 'string' ? block.alt : '', 
          caption: typeof block.caption === 'string' ? block.caption : undefined, 
          credit: typeof block.credit === 'string' ? block.credit : undefined, 
          width: typeof block.width === 'number' ? block.width : undefined, 
          height: typeof block.height === 'number' ? block.height : undefined 
        };
      
      case 'list':
        return { 
          type: 'list', 
          ordered: !!block.ordered, 
          items: Array.isArray(block.items) ? block.items.map((item: any, j: number) => {
            if (!item || typeof item !== 'object') throw new Error(`Invalid list item at block ${i} index ${j}`);
            return { nodes: validateInlineNodes(item.nodes) };
          }) : [] 
        };
      
      case 'quote':
        return { 
          type: 'quote', 
          nodes: validateInlineNodes(block.nodes),
          attribution: typeof block.attribution === 'string' ? block.attribution : undefined
        };
        
      case 'callout':
        return { 
          type: 'callout', 
          variant: ['tip', 'info', 'warning'].includes(block.variant) ? block.variant : 'info', 
          heading: typeof block.heading === 'string' ? block.heading : undefined, 
          nodes: validateInlineNodes(block.nodes) 
        };
      
      case 'divider':
        return { type: 'divider' };
      
      default:
        // Instead of silently destroying, reject the save.
        throw new Error(`Unsupported or unknown block type: ${block.type}`);
    }
  });
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
