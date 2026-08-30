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
