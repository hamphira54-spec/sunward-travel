'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { redirect } from 'next/navigation';
import { validateContentBlocks } from '@/lib/content/adapters/database';

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

export async function upsertGuide(prevState: any, formData: FormData) {
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
    let destinationLabel = 'Global';

    if (destinationSlug) {
      const dest = await prisma.destination.findUnique({ where: { slug: destinationSlug } });
      if (dest) destinationLabel = dest.name;
    } else if (countrySlug) {
      const country = await prisma.country.findUnique({ where: { slug: countrySlug } });
      if (country) destinationLabel = country.name;
    }

    const rawBody = JSON.parse((formData.get('body') as string) || '[]');
    const body = validateContentBlocks(rawBody) || [];
    
    // Auto calculate if readingTimeMinutes is not explicitly set or is 0
    let readingTimeMinutes = parseInt((formData.get('readingTimeMinutes') as string) || '0', 10);
    if (readingTimeMinutes <= 0) {
      readingTimeMinutes = calculateReadingTime(body);
    }

    const data = {
      slug,
      title,
      excerpt: formData.get('excerpt') as string,
      category: formData.get('category') as string,
      author: formData.get('author') as string || admin.displayName || admin.email.split('@')[0],
      publishedAt: formData.get('publishedAt') as string,
      updatedAt: formData.get('updatedAt') as string || new Date().toISOString(),
      status: formData.get('status') as string,
      featured: formData.get('featured') === 'on',
      readingTimeMinutes,
      countrySlug: countrySlug || null,
      destinationSlug: destinationSlug || null,
      destinationLabel,
      
      // JSON fields
      tags: JSON.parse((formData.get('tags') as string) || '[]'),
      heroImage: JSON.parse((formData.get('heroImage') as string) || '{}'),
      cardImage: JSON.parse((formData.get('cardImage') as string) || '{}'),
      seo: JSON.parse((formData.get('seo') as string) || '{}'),
      affiliateCTAs: JSON.parse((formData.get('affiliateCTAs') as string) || '[]'),
      tocSections: JSON.parse((formData.get('tocSections') as string) || '[]'),
      body,
    };

    if (isNew) {
      await prisma.guide.create({ data });
    } else {
      await prisma.guide.update({
        where: { id },
        data,
      });
    }
  } catch (error: any) {
    console.error('Error upserting guide:', error);
    return { error: error.message || 'Failed to save guide' };
  }

  revalidatePath('/admin/guides');
  revalidatePath('/guides');
  redirect('/admin/guides');
}

export async function deleteGuide(id: string) {
  await requireAdmin();
  await prisma.guide.delete({ where: { id } });
  revalidatePath('/admin/guides');
  revalidatePath('/guides');
  redirect('/admin/guides');
}
