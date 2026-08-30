'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { redirect } from 'next/navigation';
import { validateContentBlocks } from '@/lib/content/validation';

function calculateReadingTime(blocks: any[]): number {
  if (!blocks || !Array.isArray(blocks)) return 1;
  let text = '';
  for (const block of blocks) {
    if (block.nodes) {
      for (const node of block.nodes) {
        if (node.content) text += ' ' + node.content;
      }
    }
  }
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function upsertNews(prevState: any, formData: FormData) {
  try {
    const admin = await requireAdmin();

    const id = formData.get('id') as string | null;
    const isNew = !id;
    let slug = formData.get('slug') as string;
    const title = formData.get('title') as string;

    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const countrySlug = formData.get('countrySlug') as string | null;
    const destinationSlug = formData.get('destinationSlug') as string | null;

    const rawBody = JSON.parse((formData.get('body') as string) || '[]');
    const body = validateContentBlocks(rawBody);
    
    let readingTimeMinutes = parseInt((formData.get('readingTimeMinutes') as string) || '0', 10);
    if (readingTimeMinutes <= 0) {
      readingTimeMinutes = calculateReadingTime(body);
    }

    // Handle nested author object
    let authorId = formData.get('authorId') as string;
    let authorName = admin.displayName || admin.email.split('@')[0];
    let authorSlug = '';

    if (authorId) {
      if (authorId.startsWith('admin-')) {
        // Keep fallback admin logic
      } else {
        const dbAuthor = await prisma.author.findUnique({ where: { id: authorId } });
        if (dbAuthor) {
          authorName = dbAuthor.name;
          authorSlug = dbAuthor.slug;
        } else {
           // fallback to existing logic if it was a legacy custom id, but since we are not passing the name from the form anymore, it might be blank. 
           // We will trust the DB author lookup.
        }
      }
    } else {
       authorId = `admin-${admin.id}`;
    }
    
    const author = {
      id: authorId,
      name: authorName,
      ...(authorSlug ? { slug: authorSlug } : {})
    };

    // Handle nested publication object
    const status = formData.get('status') as string;
    const publishedAt = formData.get('publishedAt') as string;
    
    const publication: any = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (publishedAt) {
      publication.publishedAt = publishedAt;
    }

    const data = {
      slug,
      title,
      excerpt: formData.get('excerpt') as string,
      category: formData.get('category') as string,
      featured: formData.get('featured') === 'on',
      trending: formData.get('trending') === 'on',
      readingTimeMinutes,
      countrySlug: countrySlug || null,
      destinationSlug: destinationSlug || null,
      
      // JSON fields
      tags: JSON.parse((formData.get('tags') as string) || '[]'),
      heroImage: JSON.parse((formData.get('heroImage') as string) || '{}'),
      seo: JSON.parse((formData.get('seo') as string) || '{}'),
      sourceReferences: JSON.parse((formData.get('sourceReferences') as string) || '[]'),
      author,
      publication,
      body,
    };

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
      if (!data.title) throw new Error('Title is required for published news.');
      if (!data.slug) throw new Error('Slug is required for published news.');
      if (!data.category) throw new Error('Category is required for published news.');
      if (!data.publication.publishedAt) throw new Error('Published At date is required for published news.');
      if (!data.body || data.body.length === 0) throw new Error('Content blocks are required to publish news.');
    }

    const existingSlug = await prisma.news.findUnique({ where: { slug: data.slug } });
    if (existingSlug && existingSlug.id !== id) {
      throw new Error(`The slug "${data.slug}" is already used by another news article.`);
    }

    if (data.countrySlug && data.destinationSlug) {
      const dest = await prisma.destination.findUnique({ where: { slug: data.destinationSlug } });
      if (dest && dest.country !== data.countrySlug) {
        throw new Error(`Destination ${dest.name} does not belong to Country ${data.countrySlug}.`);
      }
    }

    if (isNew) {
      await prisma.news.create({ data });
    } else {
      await prisma.news.update({
        where: { id },
        data,
      });
    }
  } catch (error: any) {
    console.error('Error upserting news:', error);
    return { error: error.message || 'Failed to save news article' };
  }

  revalidatePath('/admin/news');
  revalidatePath('/news');
  return { success: true };
}

export async function deleteNews(id: string) {
  await requireAdmin();
  await prisma.news.delete({ where: { id } });
  revalidatePath('/admin/news');
  revalidatePath('/news');
  return { success: true };
}
