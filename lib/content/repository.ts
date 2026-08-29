// lib/content/repository.ts

import * as staticAdapter from './adapters/static';
// import * as databaseAdapter from './adapters/database'; // Future

import type { TravelGuide, GuideCategory } from '@/lib/guides';
import type { TravelNews, NewsCategory } from '@/lib/content/news';
import type { TravelEvent, EventCategory } from '@/lib/content/events';

// For now, always use staticAdapter, unless CONTENT_SOURCE is explicitly set
// In a real environment, you'd dynamically import or switch
const isDatabase = process.env.CONTENT_SOURCE === 'database';

// Helper to pick the right adapter
const adapter = isDatabase ? (require('./adapters/database') as typeof staticAdapter) : staticAdapter;

// ─── Guide queries ────────────────────────────────────────────────────────────

export function getPublishedGuides(): TravelGuide[] | Promise<TravelGuide[]> {
  return adapter.getPublishedGuides();
}

export function getGuideBySlug(slug: string): TravelGuide | undefined | Promise<TravelGuide | undefined> {
  return adapter.getGuideBySlug(slug);
}

export function getFeaturedGuides(limit?: number): TravelGuide[] | Promise<TravelGuide[]> {
  return adapter.getFeaturedGuides(limit);
}

export function getRecentGuides(limit?: number): TravelGuide[] | Promise<TravelGuide[]> {
  return adapter.getRecentGuides(limit);
}

export function getGuidesByDestination(destinationSlug: string): TravelGuide[] | Promise<TravelGuide[]> {
  return adapter.getGuidesByDestination(destinationSlug);
}

export function getGuidesByCountry(countrySlug: string): TravelGuide[] | Promise<TravelGuide[]> {
  return adapter.getGuidesByCountry(countrySlug);
}

export function getGuidesByCategory(category: GuideCategory): TravelGuide[] | Promise<TravelGuide[]> {
  return adapter.getGuidesByCategory(category);
}

export function getGuidesByTag(tag: string): TravelGuide[] | Promise<TravelGuide[]> {
  return adapter.getGuidesByTag(tag);
}

export function getRelatedGuidesFor(slug: string, limit = 3): TravelGuide[] | Promise<TravelGuide[]> {
  return adapter.getRelatedGuidesFor(slug, limit);
}

// ─── News queries ─────────────────────────────────────────────────────────────

export function getAllPublishedNews(limit?: number): TravelNews[] | Promise<TravelNews[]> {
  return adapter.getAllPublishedNews(limit);
}

export function getNewsBySlug(slug: string): TravelNews | undefined | Promise<TravelNews | undefined> {
  return adapter.getNewsBySlug(slug);
}

export function getFeaturedNews(limit?: number): TravelNews[] | Promise<TravelNews[]> {
  return adapter.getFeaturedNews(limit);
}

export function getRecentNews(limit?: number): TravelNews[] | Promise<TravelNews[]> {
  return adapter.getRecentNews(limit);
}

export function getNewsByCategory(category: NewsCategory, limit?: number): TravelNews[] | Promise<TravelNews[]> {
  return adapter.getNewsByCategory(category, limit);
}

export function getNewsByDestination(destinationSlug: string): TravelNews[] | Promise<TravelNews[]> {
  return adapter.getNewsByDestination(destinationSlug);
}

export function getNewsByCountry(countrySlug: string): TravelNews[] | Promise<TravelNews[]> {
  return adapter.getNewsByCountry(countrySlug);
}

export function getRelatedNews(slug: string, limit = 3): TravelNews[] | Promise<TravelNews[]> {
  return adapter.getRelatedNews(slug, limit);
}

// ─── Event queries ─────────────────────────────────────────────────────────────

export function getAllPublishedEvents(limit?: number): TravelEvent[] | Promise<TravelEvent[]> {
  return adapter.getAllPublishedEvents(limit);
}

export function getEventBySlug(slug: string): TravelEvent | undefined | Promise<TravelEvent | undefined> {
  return adapter.getEventBySlug(slug);
}

export function getUpcomingEvents(limit?: number): TravelEvent[] | Promise<TravelEvent[]> {
  return adapter.getUpcomingEvents(limit);
}

export function getFeaturedEvents(limit?: number): TravelEvent[] | Promise<TravelEvent[]> {
  return adapter.getFeaturedEvents(limit);
}

export function getEventsByCategory(category: EventCategory, limit?: number): TravelEvent[] | Promise<TravelEvent[]> {
  return adapter.getEventsByCategory(category, limit);
}

export function getEventsByDestination(destinationSlug: string): TravelEvent[] | Promise<TravelEvent[]> {
  return adapter.getEventsByDestination(destinationSlug);
}

export function getEventsByCountry(countrySlug: string): TravelEvent[] | Promise<TravelEvent[]> {
  return adapter.getEventsByCountry(countrySlug);
}

export function getRelatedEvents(slug: string, limit = 3): TravelEvent[] | Promise<TravelEvent[]> {
  return adapter.getRelatedEvents(slug, limit);
}

export type { TravelGuide, GuideCategory, TravelNews, TravelEvent };
export const GUIDES = staticAdapter.GUIDES;
export const GUIDE_BY_SLUG = staticAdapter.GUIDE_BY_SLUG;
export const FEATURED_GUIDES = staticAdapter.FEATURED_GUIDES;
export const NEWS_ARTICLES = staticAdapter.NEWS_ARTICLES;
export const NEWS_BY_SLUG = staticAdapter.NEWS_BY_SLUG;
export const FEATURED_NEWS = staticAdapter.FEATURED_NEWS;
export const EVENT_ARTICLES = staticAdapter.EVENT_ARTICLES;
export const EVENTS_BY_SLUG = staticAdapter.EVENTS_BY_SLUG;
export const FEATURED_EVENTS = staticAdapter.FEATURED_EVENTS;
