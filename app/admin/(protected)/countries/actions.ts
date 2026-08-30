'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { requireAdmin, requireRole } from '@/lib/auth/requireAdmin';
import { redirect } from 'next/navigation';

export async function upsertCountry(prevState: any, formData: FormData) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);

    const id = formData.get('id') as string | null;
    const isNew = !id;
    const slug = formData.get('slug') as string;

    const data = {
      slug,
      name: formData.get('name') as string,
      continent: formData.get('continent') as string,
      region: formData.get('region') as string,
      shortDescription: formData.get('shortDescription') as string,
      featured: formData.get('featured') === 'on',
      heroImage: JSON.parse((formData.get('heroImage') as string) || '{}'),
      cardImage: JSON.parse((formData.get('cardImage') as string) || '{}'),
      airportCodes: JSON.parse((formData.get('airportCodes') as string) || '[]'),
    };

    if (isNew) {
      // Create
      await prisma.country.create({ data });
    } else {
      // Update
      await prisma.country.update({
        where: { id },
        data,
      });
    }
  } catch (error: any) {
    console.error('Error upserting country:', error);
    return { error: error.message || 'Failed to save country' };
  }

  revalidatePath('/admin/countries');
  revalidatePath('/destinations');
  redirect('/admin/countries');
}

export async function deleteCountry(id: string) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  await prisma.country.delete({ where: { id } });
  revalidatePath('/admin/countries');
  revalidatePath('/destinations');
  redirect('/admin/countries');
}


