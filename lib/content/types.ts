// ─────────────────────────────────────────────────────────────────────────────
// lib/content/types.ts
// SUNWARD TRAVEL — Shared Publishing Primitives
//
// These types form the foundation of the content architecture.
// They are designed to be:
//   - Serializable (safe for future DB/CMS storage)
//   - Server-friendly (no React dependencies)
//   - Framework-agnostic (usable by future mobile apps / APIs)
//   - Database-ready (all fields map cleanly to DB columns)
//
// NOTE: Do not put React-specific types here.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Publication lifecycle ────────────────────────────────────────────────────

/**
 * Lifecycle status for any piece of content.
 * - draft:     work in progress, not publicly visible
 * - review:    submitted for editorial review
 * - scheduled: approved, waiting for publishedAt date
 * - published: live and publicly accessible
 * - archived:  removed from public discovery, URL may still resolve
 */
export type ContentStatus =
  | 'draft'
  | 'review'
  | 'scheduled'
  | 'published'
  | 'archived';

// ─── Content type taxonomy ────────────────────────────────────────────────────

/**
 * All supported editorial content types.
 * Guides use a subset — future news/events/stories use additional values.
 */
export type ContentType =
  | 'travel-guide'
  | 'destination-story'
  | 'travel-news'
  | 'travel-tip'
  | 'itinerary'
  | 'things-to-do'
  | 'where-to-stay'
  | 'transportation'
  | 'food'
  | 'budget'
  | 'best-time-to-visit'
  | 'flight-tip';

// ─── Media ───────────────────────────────────────────────────────────────────

/**
 * Reusable image/media descriptor.
 * src and alt are always required.
 */
export interface ContentImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  /** Photographer or source attribution */
  credit?: string;
}

// ─── Author ──────────────────────────────────────────────────────────────────

/**
 * Reusable author structure.
 * Supports future rich author profiles with avatars and bios.
 * Currently Sunward Travel uses a single editorial team attribution.
 */
export interface ContentAuthor {
  /** Stable unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** URL slug for future /authors/[slug] pages */
  slug?: string;
  /** e.g. 'Senior Editor', 'Travel Writer' */
  role?: string;
  /** Short biography for author pages */
  bio?: string;
  /** Author avatar image */
  avatar?: ContentImage;
}

// ─── SEO ─────────────────────────────────────────────────────────────────────

/**
 * Normalised SEO metadata fields.
 * Used by guides, news, events, destination pages.
 * generateMetadata() consumes these to produce Next.js Metadata objects.
 */
export interface SEOFields {
  title: string;
  description: string;
  /** Absolute canonical URL — omit to auto-derive from slug */
  canonical?: string;
  /** Override og:title if different from title */
  ogTitle?: string;
  /** Override og:description if different from description */
  ogDescription?: string;
  /** Social preview image — ContentImage for rich data, string for legacy URLs */
  ogImage?: ContentImage | string;
  /** Set true for draft/private content that should not be indexed */
  noindex?: boolean;
}

// ─── Publication metadata ─────────────────────────────────────────────────────

/**
 * Reusable publishing metadata.
 * All dates are ISO 8601 strings (YYYY-MM-DD or full datetime).
 * Do not fabricate historical dates.
 */
export interface PublicationMetadata {
  status: ContentStatus;
  /** Date content was/will be published */
  publishedAt?: string;
  /** Date content was last substantially updated */
  updatedAt?: string;
  /** For scheduled content: when it should go live */
  scheduledAt?: string;
}

// ─── Affiliate CTAs ───────────────────────────────────────────────────────────

/** Types of affiliate service we can link to */
export type AffiliateCTAType =
  | 'flights'
  | 'hotels'
  | 'activities'
  | 'transfers'
  | 'cars';

/**
 * Contextual affiliate call-to-action.
 * Appears at the end of articles and in sidebars.
 */
export interface AffiliateCTA {
  type: AffiliateCTAType;
  label: string;
  href: string;
}

// ─── Content relations ────────────────────────────────────────────────────────

/**
 * Lightweight reference to another piece of content.
 * Used for related articles, related news, etc.
 * Full content is loaded separately — this is just a pointer.
 */
export interface ContentRelation {
  id: string;
  slug: string;
  type: ContentType;
  title: string;
}

// ─── Source references ────────────────────────────────────────────────────────

/**
 * Editorial source attribution.
 * Used for news articles that reference external reports.
 * Never scrape or copy external content — reference only.
 */
export interface SourceReference {
  /** Publication or source name */
  name: string;
  /** URL of the original source */
  url: string;
  /** When the source was published (ISO 8601) */
  publishedAt?: string;
}

// ─── Tags ────────────────────────────────────────────────────────────────────

/**
 * Taxonomy tag with machine-readable slug and display label.
 * Future UI can render tag clouds, filters, and tag archive pages.
 */
export interface ContentTag {
  slug: string;
  label: string;
}
