'use server';

import 'server-only';
import { requireAdmin, requireRole } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function normalizeSlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function upsertAuthor(formData: FormData) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  try {
    const id = formData.get('id') as string;
    const isNew = !id || id === 'new';
    const name = (formData.get('name') as string | null)?.trim();
    const title = (formData.get('title') as string | null)?.trim() || null;
    const bio = (formData.get('bio') as string | null)?.trim() || null;
    const avatarUrl = (formData.get('avatarUrl') as string | null)?.trim() || null;

    if (!name) throw new Error('Author name is required.');

    const rawSlug = (formData.get('slug') as string | null)?.trim() || name;
    const slug = normalizeSlug(rawSlug);
    if (!slug) throw new Error('Slug could not be generated from the given name.');

    if (avatarUrl) {
      try {
        const u = new URL(avatarUrl);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          throw new Error('Avatar URL must use http or https.');
        }
      } catch (urlErr: any) {
        if (urlErr.message.includes('Avatar')) throw urlErr;
        throw new Error('Avatar URL is not a valid URL.');
      }
    }

    const existing = await prisma.author.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      throw new Error(`The slug "${slug}" is already used by another author.`);
    }

    if (isNew) {
      await prisma.author.create({ data: { name, slug, title, bio, avatarUrl } });
    } else {
      await prisma.author.update({ where: { id }, data: { name, slug, title, bio, avatarUrl } });
    }
  } catch (error: any) {
    console.error('[AuthorAction] upsertAuthor error:', error?.message);
    return { error: error.message || 'Failed to save author.' };
  }

  revalidatePath('/admin/authors');
  redirect('/admin/authors');
}

export async function deleteAuthor(id: string) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  try {
    const author = await prisma.author.findUnique({ where: { id } });
    if (!author) throw new Error('Author not found.');

    const guidesUsingAuthor = await prisma.guide.findFirst({
      where: { author: author.name },
      select: { id: true, title: true },
    });
    if (guidesUsingAuthor) {
      throw new Error(
        `Cannot delete: author "${author.name}" is referenced by Guide "${guidesUsingAuthor.title}". Remove the author from all Guides first.`
      );
    }

    const newsRef = await prisma.$queryRaw<any[]>`SELECT id, title FROM "News" WHERE "author"::text LIKE ${'%' + author.id + '%'} LIMIT 1`;
    if (newsRef.length > 0) {
      throw new Error(`Cannot delete: author "${author.name}" is referenced by News article "${newsRef[0].title}". Remove the author from all News first.`);
    }

    await prisma.author.delete({ where: { id } });
  } catch (error: any) {
    console.error('[AuthorAction] deleteAuthor error:', error?.message);
    return { error: error.message || 'Failed to delete author.' };
  }

  revalidatePath('/admin/authors');
  redirect('/admin/authors');
}


