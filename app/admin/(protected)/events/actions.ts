'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAdmin, requireRole } from '@/lib/auth/requireAdmin';
import { validateContentBlocks } from '@/lib/content/validation';
import type { ContentStatus } from '@/lib/content/types';
import type { EventCategory, EventStatus } from '@/lib/content/events';

// ─── Allowed enum values (source of truth) ────────────────────────────────────

const VALID_PUB_STATUSES: ContentStatus[] = ['draft', 'in_review', 'scheduled', 'published', 'archived'];
const VALID_LIFECYCLE_STATUSES: EventStatus[] = ['scheduled', 'ongoing', 'postponed', 'cancelled', 'completed'];
const VALID_CATEGORIES: EventCategory[] = [
  'festivals', 'culture', 'music', 'sports', 'food',
  'arts', 'exhibitions', 'markets', 'conferences', 'seasonal',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function validateHttpUrl(raw: string, label: string): void {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error(`${label}: invalid URL "${raw}".`);
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error(`${label}: only http/https URLs are allowed. Got "${u.protocol}".`);
  }
}

function validateIANATimezone(tz: string): void {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
  } catch {
    throw new Error(
      `Timezone "${tz}" is not a valid IANA timezone (e.g. Asia/Singapore, Europe/London).`
    );
  }
}

function validateVenue(raw: unknown): void {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Venue must be a JSON object.');
  }
  const v = raw as Record<string, unknown>;
  if (!v.name || typeof v.name !== 'string' || !v.name.trim()) {
    throw new Error('Venue must include a non-empty "name" field.');
  }
  if (v.latitude !== undefined && typeof v.latitude !== 'number') {
    throw new Error('Venue latitude must be a number if provided.');
  }
  if (v.longitude !== undefined && typeof v.longitude !== 'number') {
    throw new Error('Venue longitude must be a number if provided.');
  }
}

// ─── Main server action ───────────────────────────────────────────────────────

export async function upsertEvent(formData: FormData) {
  await requireAdmin();

  const id = (formData.get('id') as string | null) ?? '';
  const isNew = !id || id === 'new';

  try {
    // 1. ContentBlock validation — REJECT on invalid, never silently coerce
    let rawBody: unknown;
    try {
      rawBody = JSON.parse((formData.get('body') as string) || '[]');
    } catch {
      throw new Error('Body content is malformed JSON. Save aborted.');
    }
    const validatedBody = validateContentBlocks(rawBody);
    if (validatedBody === undefined) {
      throw new Error('Body content failed validation. Invalid ContentBlock structure. Save aborted.');
    }
    const body = validatedBody;

    // 2. Slug normalisation — same as Guides/News
    const rawSlug = (formData.get('slug') as string | null) || '';
    const slug = normalizeSlug(rawSlug);
    if (!slug) throw new Error('Slug is required and must contain valid characters.');

    // 3. Publication — built server-side from individually named fields
    const pubStatusRaw = (formData.get('publicationStatus') as string | null) || 'draft';
    if (!VALID_PUB_STATUSES.includes(pubStatusRaw as ContentStatus)) {
      throw new Error(`Invalid publication status: "${pubStatusRaw}".`);
    }
    const pubStatus = pubStatusRaw as ContentStatus;
    const pubDateRaw = (formData.get('publishedAt') as string | null) || '';
    const publication: Record<string, string> = {
      status: pubStatus,
      updatedAt: new Date().toISOString(),
    };
    if (pubStatus === 'published') {
      const effectivePublishedAt = pubDateRaw || new Date().toISOString();
      publication.publishedAt = effectivePublishedAt;
    } else if (pubDateRaw) {
      publication.publishedAt = pubDateRaw;
    }

    // 4. Lifecycle status
    const lifecycleStatus = (formData.get('lifecycleStatus') as string | null) || '';
    if (!VALID_LIFECYCLE_STATUSES.includes(lifecycleStatus as EventStatus)) {
      throw new Error(`Invalid lifecycle status: "${lifecycleStatus}".`);
    }

    // 5. Category
    const category = (formData.get('category') as string | null) || '';
    if (!VALID_CATEGORIES.includes(category as EventCategory)) {
      throw new Error(`Invalid category: "${category}".`);
    }

    // 6. Required text fields
    const title = (formData.get('title') as string | null) || '';
    if (!title.trim()) throw new Error('Title is required.');
    const excerpt = (formData.get('excerpt') as string | null) || '';

    // 7. Date validation
    const startDate = (formData.get('startDate') as string | null) || '';
    if (!startDate) throw new Error('Start date is required.');
    if (isNaN(new Date(startDate).getTime())) {
      throw new Error('Start date must be a valid ISO 8601 date string.');
    }
    const endDateRaw = (formData.get('endDate') as string | null) || '';
    const endDate = endDateRaw || null;
    if (endDate) {
      if (isNaN(new Date(endDate).getTime())) {
        throw new Error('End date must be a valid ISO 8601 date string.');
      }
      if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
        throw new Error('End date cannot precede start date.');
      }
    }

    // 8. Timezone validation (IANA only, if provided)
    const timezoneRaw = (formData.get('timezone') as string | null) || '';
    const timezone = timezoneRaw || null;
    if (timezone) {
      validateIANATimezone(timezone);
    }

    // 9. Official / Ticket URLs — server-side http/https only
    const officialUrlRaw = (formData.get('officialUrl') as string | null) || '';
    const officialUrl = officialUrlRaw || null;
    if (officialUrl) validateHttpUrl(officialUrl, 'Official URL');

    const ticketUrlRaw = (formData.get('ticketUrl') as string | null) || '';
    const ticketUrl = ticketUrlRaw || null;
    if (ticketUrl) validateHttpUrl(ticketUrl, 'Ticket URL');

    // 10. Venue — must be a valid EventVenue object or null
    const venueRaw = (formData.get('venue') as string | null) || '';
    let venue: unknown = null;
    if (venueRaw && venueRaw.trim()) {
      try {
        venue = JSON.parse(venueRaw);
      } catch {
        throw new Error('Venue JSON is malformed.');
      }
      validateVenue(venue);
    }

    // 11. Source references — strict http/https validation
    let sourceReferences: unknown[];
    try {
      sourceReferences = JSON.parse((formData.get('sourceReferences') as string) || '[]');
    } catch {
      throw new Error('Source references is malformed JSON.');
    }
    if (!Array.isArray(sourceReferences)) {
      throw new Error('Source references must be a JSON array.');
    }
    for (const src of sourceReferences) {
      if (!src || typeof src !== 'object') throw new Error('Each source reference must be an object.');
      const s = src as Record<string, unknown>;
      if (!s.name || typeof s.name !== 'string') throw new Error('Source reference missing "name".');
      if (!s.url || typeof s.url !== 'string') throw new Error('Source reference missing "url".');
      validateHttpUrl(s.url, `Source reference "${s.name}"`);
    }

    // 12. Tags
    let tags: unknown[];
    try {
      tags = JSON.parse((formData.get('tags') as string) || '[]');
    } catch {
      throw new Error('Tags is malformed JSON.');
    }
    if (!Array.isArray(tags)) throw new Error('Tags must be a JSON array.');

    // 13. Hero image & SEO
    let heroImage: unknown;
    try {
      heroImage = JSON.parse((formData.get('heroImage') as string) || '{}');
    } catch {
      throw new Error('Hero image is malformed JSON.');
    }
    let seo: unknown;
    try {
      seo = JSON.parse((formData.get('seo') as string) || '{}');
    } catch {
      throw new Error('SEO is malformed JSON.');
    }

    // 14. Country / Destination existence and integrity
    const countrySlug = (formData.get('countrySlug') as string | null) || null;
    const destinationSlug = (formData.get('destinationSlug') as string | null) || null;

    if (countrySlug) {
      const country = await prisma.country.findUnique({ where: { slug: countrySlug } });
      if (!country) throw new Error(`Country "${countrySlug}" does not exist.`);
    }
    if (destinationSlug) {
      const dest = await prisma.destination.findUnique({ where: { slug: destinationSlug } });
      if (!dest) throw new Error(`Destination "${destinationSlug}" does not exist.`);
      if (countrySlug && dest.country !== countrySlug) {
        throw new Error(`Destination "${destinationSlug}" does not belong to country "${countrySlug}".`);
      }
    }

    // 15. Publish-time requirements
    if (pubStatus === 'published') {
      if (!body || body.length === 0) {
        throw new Error('Body content is required to publish an event.');
      }
      if (!Array.isArray(sourceReferences) || sourceReferences.length === 0) {
        throw new Error(
          'Published events require at least one source reference. Sources attached does not mean the event is factually verified — that remains an editorial responsibility.'
        );
      }
    }

    // 16. Slug uniqueness
    const existingSlug = await prisma.event.findUnique({ where: { slug } });
    if (existingSlug && existingSlug.id !== id) {
      throw new Error(`The slug "${slug}" is already used by another event.`);
    }

    const data = {
      title,
      slug,
      excerpt,
      category,
      featured: formData.get('featured') === 'true',
      countrySlug,
      destinationSlug,
      startDate,
      endDate,
      timezone,
      allDay: formData.get('allDay') === 'true',
      officialUrl,
      ticketUrl,
      organizer: (formData.get('organizer') as string | null) || null,
      lifecycleStatus,
      publication: publication as any,
      seo: seo as any,
      sourceReferences: sourceReferences as any,
      tags: tags as any,
      heroImage: heroImage as any,
      venue: venue as any,
      body: body as any,
    };

    if (isNew) {
      await prisma.event.create({ data });
    } else {
      await prisma.event.update({ where: { id }, data });
    }
  } catch (error: any) {
    console.error('[EventAction] upsertEvent error:', error?.message);
    return { error: error.message || 'Failed to save event.' };
  }

  revalidatePath('/admin/events');
  revalidatePath('/events');
  return { success: true };
}

export async function deleteEvent(id: string) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  try {
    await prisma.event.delete({ where: { id } });
  } catch (error: any) {
    console.error('[EventAction] deleteEvent error:', error?.message);
    return { error: error.message || 'Failed to delete event.' };
  }

  revalidatePath('/admin/events');
  revalidatePath('/events');
  return { success: true };
}


