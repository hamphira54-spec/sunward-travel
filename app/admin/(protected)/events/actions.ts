'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { validateContentBlocks } from '@/lib/content/adapters/database';

export async function upsertEvent(formData: FormData) {
  await requireAdmin();

  const id = formData.get('id') as string;
  const isNew = !id || id === 'new';

  try {
    const rawBody = JSON.parse((formData.get('body') as string) || '[]');
    const body = validateContentBlocks(rawBody) || [];

    const venue = formData.get('venue') ? JSON.parse(formData.get('venue') as string) : null;

    if (venue) {
      if (!venue.name) throw new Error('Venue requires at least a name.');
    }

    const data = {
      title: formData.get('title') as string,
      slug: (formData.get('slug') as string).toLowerCase().trim(),
      excerpt: formData.get('excerpt') as string,
      category: formData.get('category') as string,
      featured: formData.get('featured') === 'true',
      countrySlug: (formData.get('countrySlug') as string) || null,
      destinationSlug: (formData.get('destinationSlug') as string) || null,
      startDate: formData.get('startDate') as string,
      endDate: (formData.get('endDate') as string) || null,
      timezone: (formData.get('timezone') as string) || null,
      allDay: formData.get('allDay') === 'true',
      officialUrl: (formData.get('officialUrl') as string) || null,
      ticketUrl: (formData.get('ticketUrl') as string) || null,
      organizer: (formData.get('organizer') as string) || null,
      lifecycleStatus: formData.get('lifecycleStatus') as string,
      publication: JSON.parse((formData.get('publication') as string) || '{}'),
      seo: JSON.parse((formData.get('seo') as string) || '{}'),
      sourceReferences: JSON.parse((formData.get('sourceReferences') as string) || '[]'),
      tags: JSON.parse((formData.get('tags') as string) || '[]'),
      heroImage: JSON.parse((formData.get('heroImage') as string) || '{}'),
      venue,
      body,
    };

    const existingSlug = await prisma.event.findUnique({ where: { slug: data.slug } });
    if (existingSlug && existingSlug.id !== id) {
      throw new Error(`The slug "${data.slug}" is already used by another event.`);
    }

    if (!data.startDate) throw new Error('Start date is required.');
    if (isNaN(new Date(data.startDate).getTime())) throw new Error('Start date must be valid ISO date.');
    if (data.endDate) {
      if (isNaN(new Date(data.endDate).getTime())) throw new Error('End date must be valid ISO date.');
      if (new Date(data.endDate).getTime() < new Date(data.startDate).getTime()) {
        throw new Error('End date cannot precede start date.');
      }
    }

    if (data.countrySlug && data.destinationSlug) {
      const dest = await prisma.destination.findUnique({ where: { slug: data.destinationSlug } });
      if (dest && dest.country !== data.countrySlug) {
        throw new Error(`Destination does not belong to Country ${data.countrySlug}.`);
      }
    }

    if (Array.isArray(data.sourceReferences)) {
      for (const src of data.sourceReferences) {
        if (!src.name) throw new Error('Source reference missing name.');
        if (!src.url) throw new Error('Source reference missing url.');
        try {
          const u = new URL(src.url);
          if (u.protocol !== 'http:' && u.protocol !== 'https:') {
            throw new Error(`Invalid URL protocol in source reference: ${src.url}`);
          }
        } catch (e) {
          throw new Error(`Invalid URL format in source reference: ${src.url}`);
        }
      }
    }

    if (data.publication.status === 'published') {
      if (!data.title) throw new Error('Title is required for published events.');
      if (!data.slug) throw new Error('Slug is required for published events.');
      if (!data.category) throw new Error('Category is required for published events.');
      if (!data.lifecycleStatus) throw new Error('Event status is required for published events.');
      if (!data.body || data.body.length === 0) throw new Error('Body content is required for published events.');
      
      if (!Array.isArray(data.sourceReferences) || data.sourceReferences.length === 0) {
         throw new Error('Published events require at least one valid source reference for factual verification.');
      }
    }

    if (isNew) {
      await prisma.event.create({ data });
    } else {
      await prisma.event.update({ where: { id }, data });
    }
  } catch (error: any) {
    console.error('Event Upsert Error:', error);
    return { error: error.message || 'Failed to save event' };
  }

  revalidatePath('/admin/events');
  revalidatePath('/events');
  redirect('/admin/events');
}

export async function deleteEvent(id: string) {
  await requireAdmin();

  try {
    await prisma.event.delete({ where: { id } });
  } catch (error: any) {
    console.error('Event Delete Error:', error);
    return { error: error.message || 'Failed to delete event' };
  }

  revalidatePath('/admin/events');
  revalidatePath('/events');
  redirect('/admin/events');
}
