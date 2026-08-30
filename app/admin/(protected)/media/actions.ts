'use server';

import 'server-only';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { deleteStorageObject } from '@/lib/storage/mediaStorage';

export async function updateMedia(formData: FormData) {
  await requireAdmin();

  try {
    const id = formData.get('id') as string;
    if (!id) throw new Error('Media ID is required.');

    const alt = (formData.get('alt') as string | null)?.trim() || null;
    const title = (formData.get('title') as string | null)?.trim() || null;
    const caption = (formData.get('caption') as string | null)?.trim() || null;
    const credit = (formData.get('credit') as string | null)?.trim() || null;

    await prisma.media.update({
      where: { id },
      data: { alt, title, caption, credit },
    });
  } catch (error: any) {
    console.error('[MediaAction] updateMedia error:', error?.message);
    return { error: error.message || 'Failed to update media.' };
  }

  revalidatePath('/admin/media');
  redirect('/admin/media');
}

export async function deleteMedia(id: string) {
  await requireAdmin();

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw new Error('Media record not found.');

    const url = media.url;
    
    // Check Guides
    const guideRef = await prisma.$queryRaw<any[]>`SELECT id FROM "Guide" WHERE "heroImage"::text LIKE ${'%' + url + '%'} OR "cardImage"::text LIKE ${'%' + url + '%'} OR "body"::text LIKE ${'%' + url + '%'} LIMIT 1`;
    if (guideRef.length > 0) throw new Error('Cannot delete media: It is referenced by one or more Guides.');

    // Check News
    const newsRef = await prisma.$queryRaw<any[]>`SELECT id FROM "News" WHERE "heroImage"::text LIKE ${'%' + url + '%'} OR "body"::text LIKE ${'%' + url + '%'} LIMIT 1`;
    if (newsRef.length > 0) throw new Error('Cannot delete media: It is referenced by one or more News articles.');

    // Check Events
    const eventRef = await prisma.$queryRaw<any[]>`SELECT id FROM "Event" WHERE "heroImage"::text LIKE ${'%' + url + '%'} OR "body"::text LIKE ${'%' + url + '%'} LIMIT 1`;
    if (eventRef.length > 0) throw new Error('Cannot delete media: It is referenced by one or more Events.');

    // Check Countries
    const countryRef = await prisma.$queryRaw<any[]>`SELECT id FROM "Country" WHERE "heroImage"::text LIKE ${'%' + url + '%'} OR "cardImage"::text LIKE ${'%' + url + '%'} LIMIT 1`;
    if (countryRef.length > 0) throw new Error('Cannot delete media: It is referenced by one or more Countries.');

    // Check Destinations
    const destRef = await prisma.$queryRaw<any[]>`SELECT id FROM "Destination" WHERE "heroImage"::text LIKE ${'%' + url + '%'} OR "cardImage"::text LIKE ${'%' + url + '%'} LIMIT 1`;
    if (destRef.length > 0) throw new Error('Cannot delete media: It is referenced by one or more Destinations.');

    // Delete from storage first (if managed)
    if (media.storageProvider === 'supabase' && media.storageKey) {
      await deleteStorageObject(media.storageKey);
    }

    // Delete DB record
    await prisma.media.delete({ where: { id } });
  } catch (error: any) {
    console.error('[MediaAction] deleteMedia error:', error?.message);
    return { error: error.message || 'Failed to delete media.' };
  }

  revalidatePath('/admin/media');
  redirect('/admin/media');
}
