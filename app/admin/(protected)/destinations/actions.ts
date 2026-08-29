'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { redirect } from 'next/navigation';

export async function upsertDestination(prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const id = formData.get('id') as string | null;
    const isNew = !id;
    const slug = formData.get('slug') as string;
    
    // We need to fetch the country to duplicate continent/region strings
    // as per schema, or rely on form input. We'll use form input but ensure they match.
    // The schema has country (name) and countrySlug.
    const countrySlug = formData.get('countrySlug') as string;
    const countryData = await prisma.country.findUnique({ where: { slug: countrySlug } });
    if (!countryData) {
      throw new Error('Selected country not found');
    }

    const data = {
      slug,
      name: formData.get('name') as string,
      countrySlug,
      country: countryData.name, // denormalized
      continent: formData.get('continent') as string,
      region: formData.get('region') as string,
      tagline: formData.get('tagline') as string,
      shortDescription: formData.get('shortDescription') as string,
      overview: formData.get('overview') as string,
      badge: formData.get('badge') as string,
      featured: formData.get('featured') === 'on',
      heroImage: JSON.parse((formData.get('heroImage') as string) || '{}'),
      cardImage: JSON.parse((formData.get('cardImage') as string) || '{}'),
      facts: JSON.parse((formData.get('facts') as string) || '[]'),
      affiliate: JSON.parse((formData.get('affiliate') as string) || '{}'),
      relatedDestinations: JSON.parse((formData.get('relatedDestinations') as string) || '[]'),
    };

    if (isNew) {
      await prisma.destination.create({ data });
    } else {
      await prisma.destination.update({
        where: { id },
        data,
      });
    }
  } catch (error: any) {
    console.error('Error upserting destination:', error);
    return { error: error.message || 'Failed to save destination' };
  }

  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
  redirect('/admin/destinations');
}

export async function deleteDestination(id: string) {
  await requireAdmin();
  await prisma.destination.delete({ where: { id } });
  revalidatePath('/admin/destinations');
  revalidatePath('/destinations');
  redirect('/admin/destinations');
}
