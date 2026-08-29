// ─────────────────────────────────────────────────────────────────────────────
// lib/content/news.ts
// SUNWARD TRAVEL — Future Travel News Type Model
//
// THIS FILE CONTAINS TYPE DEFINITIONS ONLY.
// No news data is created here. No fake news. No placeholder content.
//
// This architecture prepares for a future /news publishing system.
// Implementation of the actual /news route happens in a future controlled phase.
// ─────────────────────────────────────────────────────────────────────────────

import type { ContentBlock } from './blocks';
import type {
  ContentImage,
  ContentAuthor,
  PublicationMetadata,
  SEOFields,
  SourceReference,
} from './types';

// ─── News category taxonomy ───────────────────────────────────────────────────

/**
 * Editorial categories for travel news content.
 * Determines section placement, filtering, and future ad targeting context.
 */
export type NewsCategory =
  | 'aviation'
  | 'hotels'
  | 'destinations'
  | 'attractions'
  | 'transportation'
  | 'travel-industry'
  | 'travel-technology'
  | 'border-visa'
  | 'cruises';

// ─── Travel News interface ────────────────────────────────────────────────────

/**
 * A single travel news article.
 *
 * Unlike TravelGuide (evergreen editorial content), TravelNews is:
 *   - Time-sensitive and date-driven
 *   - Linked to source references for transparency
 *   - Associated with trending/breaking signals
 *   - Potentially linked to a NewsArticle JSON-LD schema type
 *
 * Future /news route will:
 *   - Generate static paths from published news items
 *   - Support ISR (Incremental Static Regeneration) for freshness
 *   - Or use server-side rendering for breaking news
 *
 * Content must be original editorial writing.
 * Never scrape, copy, or republish third-party articles.
 */
export interface TravelNews {
  /** Stable unique identifier */
  id: string;
  /** URL slug: /news/[slug] */
  slug: string;

  // ── Core content ──────────────────────────────────────────────────────────
  title: string;
  /** 1-3 sentence summary shown in cards and social previews */
  excerpt: string;
  /** Structured article body — serializable, CMS-ready, safe */
  body: ContentBlock[];
  heroImage: ContentImage;

  // ── Attribution ───────────────────────────────────────────────────────────
  author: ContentAuthor;

  // ── Publication ───────────────────────────────────────────────────────────
  publication: PublicationMetadata;

  // ── Classification ────────────────────────────────────────────────────────
  category: NewsCategory;
  tags: string[];

  // ── Geography ─────────────────────────────────────────────────────────────
  /** Link to country page if news is country-specific */
  countrySlug?: string;
  /** Link to destination page if news is destination-specific */
  destinationSlug?: string;

  // ── Source transparency ────────────────────────────────────────────────────
  /**
   * References to original news sources.
   * Sunward Travel editorial team writes original commentary —
   * source references indicate what news was reported on.
   */
  sourceReferences?: SourceReference[];

  // ── Discovery signals ─────────────────────────────────────────────────────
  /** Editorially selected as featured content */
  featured?: boolean;
  /**
   * Trending signal.
   * NOT hardcoded — future implementation reads from analytics.
   * Do not set trending: true in static data.
   */
  trending?: boolean;

  // ── SEO ──────────────────────────────────────────────────────────────────
  seo: SEOFields;
}

// ─── Future data access functions (stubs for architecture) ───────────────────
// These will be implemented when the /news route is built.
// They are typed here to define the expected contract.

// export function getPublishedNews(limit?: number): TravelNews[] { ... }
// export function getNewsBySlug(slug: string): TravelNews | undefined { ... }
// export function getNewsByCategory(category: NewsCategory): TravelNews[] { ... }
// export function getNewsByDestination(destinationSlug: string): TravelNews[] { ... }
// export function getFeaturedNews(limit?: number): TravelNews[] { ... }
// export function getTrendingNews(limit?: number): TravelNews[] { ... }
