// ─────────────────────────────────────────────────────────────────────────────
// lib/content/repository.ts
// SUNWARD TRAVEL — Content Data Access Layer
//
// This module provides a thin boundary between page components and the
// underlying content storage mechanism.
//
// CURRENT storage: Static TypeScript arrays in lib/guides.ts
// FUTURE storage:  Supabase/PostgreSQL, headless CMS, or hybrid
//
// The goal: page components call functions from this module, not directly
// from lib/guides.ts or future DB clients. When the storage changes,
// only this file needs to be updated — not every page.
//
// Naming convention:
//   get*         — returns data (never throws, returns undefined/[] on miss)
//   getPublished* — only returns status: 'published' content
// ─────────────────────────────────────────────────────────────────────────────

import {
  GUIDES,
  GUIDE_BY_SLUG,
  FEATURED_GUIDES,
  getRelatedGuides as _getRelatedGuides,
  getGuidesForDestination,
  getGuidesForCountry,
  type TravelGuide,
  type GuideCategory,
} from '@/lib/guides';
import {
  NEWS_ARTICLES,
  NEWS_BY_SLUG,
  FEATURED_NEWS,
} from '@/lib/news';
import type { NewsCategory, TravelNews } from '@/lib/content/news';

// ─── Guide queries ────────────────────────────────────────────────────────────

/**
 * Returns all published guides.
 * Filters out draft/archived content (currently all guides are published).
 * Future: queries DB with status = 'published' filter.
 */
export function getPublishedGuides(): TravelGuide[] {
  return GUIDES.filter((g) => !g.status || g.status === 'published');
}

/**
 * Returns a single guide by URL slug.
 * Returns undefined if not found or not published.
 */
export function getGuideBySlug(slug: string): TravelGuide | undefined {
  const guide = GUIDE_BY_SLUG[slug];
  if (!guide) return undefined;
  if (guide.status && guide.status !== 'published') return undefined;
  return guide;
}

/**
 * Returns featured guides, optionally limited.
 * Future: queries DB with featured = true AND status = 'published'.
 */
export function getFeaturedGuides(limit?: number): TravelGuide[] {
  const guides = FEATURED_GUIDES;
  return limit ? guides.slice(0, limit) : guides;
}

/**
 * Returns guides sorted by publishedAt descending (most recent first).
 */
export function getRecentGuides(limit?: number): TravelGuide[] {
  const sorted = getPublishedGuides().sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Returns all published guides for a specific destination.
 */
export function getGuidesByDestination(destinationSlug: string): TravelGuide[] {
  return getGuidesForDestination(destinationSlug);
}

/**
 * Returns all published guides for a specific country.
 */
export function getGuidesByCountry(countrySlug: string): TravelGuide[] {
  return getGuidesForCountry(countrySlug);
}

/**
 * Returns all published guides matching a specific category.
 */
export function getGuidesByCategory(category: GuideCategory): TravelGuide[] {
  return getPublishedGuides().filter((g) => g.category === category);
}

/**
 * Returns all published guides that include a specific tag.
 */
export function getGuidesByTag(tag: string): TravelGuide[] {
  return getPublishedGuides().filter((g) => g.tags.includes(tag));
}

/**
 * Returns related guides for a given guide slug.
 * Scores by: same destination (4pts) > same category (3pts) > same country (2pts) > shared tags (1pt each).
 * Excludes the current guide. Only returns guides with score > 0.
 */
export function getRelatedGuidesFor(
  slug: string,
  limit = 3
): TravelGuide[] {
  return _getRelatedGuides(slug, limit);
}

// ─── News queries ─────────────────────────────────────────────────────────────

/**
 * Returns all published news articles, sorted by publishedAt descending.
 * Filters out draft/archived/scheduled content.
 */
export function getAllPublishedNews(limit?: number): TravelNews[] {
  const published = NEWS_ARTICLES.filter(
    (n) => n.publication.status === 'published'
  ).sort((a, b) => {
    const aDate = a.publication.publishedAt ?? '';
    const bDate = b.publication.publishedAt ?? '';
    return bDate.localeCompare(aDate);
  });
  return limit ? published.slice(0, limit) : published;
}

/**
 * Returns a single published news article by URL slug.
 * Returns undefined if not found or not published.
 */
export function getNewsBySlug(slug: string): TravelNews | undefined {
  const article = NEWS_BY_SLUG[slug];
  if (!article) return undefined;
  if (article.publication.status !== 'published') return undefined;
  return article;
}

/**
 * Returns featured published news articles.
 */
export function getFeaturedNews(limit?: number): TravelNews[] {
  const featured = FEATURED_NEWS.filter(
    (n) => n.publication.status === 'published'
  ).sort((a, b) => {
    const aDate = a.publication.publishedAt ?? '';
    const bDate = b.publication.publishedAt ?? '';
    return bDate.localeCompare(aDate);
  });
  return limit ? featured.slice(0, limit) : featured;
}

/**
 * Returns published news articles sorted by publishedAt descending.
 */
export function getRecentNews(limit?: number): TravelNews[] {
  return getAllPublishedNews(limit);
}

/**
 * Returns published news articles for a specific category.
 */
export function getNewsByCategory(
  category: NewsCategory,
  limit?: number
): TravelNews[] {
  const filtered = getAllPublishedNews().filter(
    (n) => n.category === category
  );
  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Returns published news articles related to a specific destination slug.
 */
export function getNewsByDestination(destinationSlug: string): TravelNews[] {
  return getAllPublishedNews().filter(
    (n) => n.destinationSlug === destinationSlug
  );
}

/**
 * Returns published news articles related to a specific country slug.
 * Includes both country-level and destination-specific articles for that country.
 */
export function getNewsByCountry(countrySlug: string): TravelNews[] {
  return getAllPublishedNews().filter(
    (n) => n.countrySlug === countrySlug || n.destinationSlug === countrySlug
  );
}

/**
 * Returns related news articles for a given slug.
 * Scoring:
 *   same destination: 4 pts
 *   same country:     3 pts
 *   same category:    2 pts
 *   shared tag:       1 pt each
 * Only returns articles with score > 0. Excludes the current article.
 */
export function getRelatedNews(
  slug: string,
  limit = 3
): TravelNews[] {
  const current = NEWS_BY_SLUG[slug];
  if (!current) return [];

  return getAllPublishedNews()
    .filter((n) => n.slug !== slug)
    .map((n) => {
      let score = 0;
      if (current.destinationSlug && n.destinationSlug === current.destinationSlug) score += 4;
      if (current.countrySlug && n.countrySlug === current.countrySlug) score += 3;
      if (n.category === current.category) score += 2;
      const sharedTags = n.tags.filter((t) => current.tags.includes(t)).length;
      score += sharedTags;
      return { article: n, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => article);
}

// ─── Future: unified content query helpers ────────────────────────────────────
// These stubs document the contract for future multi-type content queries.
// Implement when /news and /events are built.

// /**
//  * Returns recently published content across all types.
//  * Useful for homepage "Latest" sections.
//  */
// export function getRecentContent(
//   types: ContentType[],
//   limit?: number
// ): (TravelGuide | TravelNews | TravelEvent)[] { ... }

// /**
//  * Returns content associated with a specific destination.
//  * Cross-type: guides + news + events all linked to destinationSlug.
//  */
// export function getContentByDestination(
//   destinationSlug: string,
//   types?: ContentType[]
// ): (TravelGuide | TravelNews | TravelEvent)[] { ... }

// ─── Re-exports for convenience ───────────────────────────────────────────────
// Pages that previously imported directly from lib/guides.ts can migrate
// to importing from here instead for better storage-layer isolation.

export type { TravelGuide, GuideCategory };
export { GUIDES, GUIDE_BY_SLUG, FEATURED_GUIDES };
export type { TravelNews };
export { NEWS_ARTICLES, NEWS_BY_SLUG, FEATURED_NEWS };
