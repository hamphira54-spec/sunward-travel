'use server';

import 'server-only';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function normalizeSlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function upsertTag(formData: FormData) {
  await requireAdmin();

  try {
    const id = formData.get('id') as string;
    const isNew = !id || id === 'new';
    const name = (formData.get('name') as string | null)?.trim();
    const description = (formData.get('description') as string | null)?.trim() || null;

    if (!name) throw new Error('Tag name is required.');

    const rawSlug = (formData.get('slug') as string | null)?.trim() || name;
    const slug = normalizeSlug(rawSlug);
    if (!slug) throw new Error('Slug could not be generated.');

    // Uniqueness check
    const existingSlug = await prisma.tag.findUnique({ where: { slug } });
    if (existingSlug && existingSlug.id !== id) {
      throw new Error(`The slug "${slug}" is already used by another tag.`);
    }
    const existingName = await prisma.tag.findUnique({ where: { name } });
    if (existingName && existingName.id !== id) {
      throw new Error(`A tag named "${name}" already exists.`);
    }

    if (isNew) {
      await prisma.tag.create({ data: { name, slug, description } });
    } else {
      await prisma.tag.update({ where: { id }, data: { name, slug, description } });
    }
  } catch (error: any) {
    console.error('[TagAction] upsertTag error:', error?.message);
    return { error: error.message || 'Failed to save tag.' };
  }

  revalidatePath('/admin/tags');
  redirect('/admin/tags');
}

export async function deleteTag(id: string) {
  await requireAdmin();

  try {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new Error('Tag not found.');

    // Check if this tag slug is in any content JSON tag arrays
    // Guides, News, Events all store tags as Json arrays (strings)
    const guideRef = await prisma.guide.findFirst({
      where: { tags: { array_contains: tag.slug } },
      select: { id: true, title: true },
    });
    if (guideRef) {
      throw new Error(`Cannot delete: tag "${tag.name}" is used by Guide "${guideRef.title}". Remove tag from all content first.`);
    }

    const newsRef = await prisma.news.findFirst({
      where: { tags: { array_contains: tag.slug } },
      select: { id: true, title: true },
    });
    if (newsRef) {
      throw new Error(`Cannot delete: tag "${tag.name}" is used by News "${newsRef.title}". Remove tag from all content first.`);
    }

    const eventRef = await prisma.event.findFirst({
      where: { tags: { array_contains: tag.slug } },
      select: { id: true, title: true },
    });
    if (eventRef) {
      throw new Error(`Cannot delete: tag "${tag.name}" is used by Event "${eventRef.title}". Remove tag from all content first.`);
    }

    await prisma.tag.delete({ where: { id } });
  } catch (error: any) {
    console.error('[TagAction] deleteTag error:', error?.message);
    return { error: error.message || 'Failed to delete tag.' };
  }

  revalidatePath('/admin/tags');
  redirect('/admin/tags');
}
