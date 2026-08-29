// ─────────────────────────────────────────────────────────────────────────────
// lib/content/events.ts
// SUNWARD TRAVEL — Future Travel Event Type Model
//
// THIS FILE CONTAINS TYPE DEFINITIONS ONLY.
// No event data is created here. No fake events. No placeholder content.
//
// Events differ fundamentally from articles:
//   - They have a real-world start date (and optional end date)
//   - Their relevance is time-bounded (upcoming → ongoing → past)
//   - They have a physical or virtual venue
//   - They link to official external sources
//
// Implementation of /events route happens in a future controlled phase.
// ─────────────────────────────────────────────────────────────────────────────

import type { ContentBlock } from './blocks';
import type {
  ContentImage,
  SEOFields,
  SourceReference,
} from './types';

// ─── Event category taxonomy ──────────────────────────────────────────────────

/**
 * Editorial categories for travel events.
 * Determines section placement, filtering, and contextual matching.
 */
export type EventCategory =
  | 'festival'
  | 'cultural-event'
  | 'food-event'
  | 'exhibition'
  | 'seasonal-event'
  | 'attraction'
  | 'music-event'
  | 'sports-event'
  | 'tourism-event';

// ─── Event lifecycle ──────────────────────────────────────────────────────────

/**
 * Real-world lifecycle status for an event.
 * This is COMPUTED from the event's dates — not manually set for most events.
 *
 * upcoming:  startDate is in the future
 * ongoing:   startDate has passed, endDate is in the future (or today)
 * past:      endDate has passed (or startDate has passed for single-day events)
 * cancelled: explicitly cancelled regardless of dates
 *
 * Future implementation: a server-side utility computes this from startDate/endDate.
 * Do not implement background workers in this phase.
 */
export type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'cancelled';

// ─── Travel Event interface ───────────────────────────────────────────────────

/**
 * A real-world travel event: festival, cultural celebration, exhibition, etc.
 *
 * Events are NOT articles:
 *   - Content is time-sensitive and date-driven
 *   - They have a physical location (venue, destination)
 *   - Their lifecycle changes automatically as time passes
 *   - They link to official external event sources
 *
 * Future /events route will:
 *   - Filter events by status (upcoming, ongoing)
 *   - Group by destination and category
 *   - Show a calendar view for date-based discovery
 *
 * All event data must be real, verifiable, and appropriately attributed.
 * Do not fabricate event names, dates, venues, or descriptions.
 */
export interface TravelEvent {
  /** Stable unique identifier */
  id: string;
  /** URL slug: /events/[slug] */
  slug: string;

  // ── Core content ──────────────────────────────────────────────────────────
  name: string;
  /** 1-3 sentence summary shown in cards and listings */
  excerpt: string;
  /** Structured event description body */
  body: ContentBlock[];
  heroImage: ContentImage;

  // ── Geography ─────────────────────────────────────────────────────────────
  /** Country where the event takes place */
  countrySlug: string;
  /** Specific destination if applicable */
  destinationSlug?: string;
  /** Venue name or area (e.g. 'Denpasar Cultural Centre') */
  venue?: string;

  // ── Dates ─────────────────────────────────────────────────────────────────
  /** ISO 8601 date or datetime: YYYY-MM-DD */
  startDate: string;
  /** ISO 8601 date or datetime — omit for single-day events */
  endDate?: string;
  /** IANA timezone identifier: e.g. 'Asia/Bangkok' */
  timezone?: string;

  // ── Classification ────────────────────────────────────────────────────────
  category: EventCategory;

  // ── External references ───────────────────────────────────────────────────
  /** Official event website or ticketing page */
  officialUrl?: string;
  /** Source references for editorial accuracy */
  sourceReferences?: SourceReference[];

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  /**
   * Lifecycle status.
   * For most events, this is COMPUTED from startDate/endDate.
   * Set 'cancelled' explicitly when an event is cancelled.
   */
  lifecycleStatus: EventStatus;

  // ── Discovery signals ─────────────────────────────────────────────────────
  /** Editorially selected as featured content */
  featured?: boolean;

  // ── SEO ──────────────────────────────────────────────────────────────────
  seo: SEOFields;
}

// ─── Future utility: compute lifecycle status from dates ─────────────────────
// This will be implemented when /events is built.
// Typed here as architectural documentation.

// export function computeEventStatus(
//   startDate: string,
//   endDate?: string,
//   explicitlyCancelled?: boolean
// ): EventStatus { ... }
