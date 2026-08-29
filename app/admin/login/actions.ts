'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Invalid email, password, or access permissions.' };
  }

  // Check if this user is a recognized admin
  const adminUser = await prisma.adminUser.findUnique({
    where: { authUserId: data.user.id }
  });

  if (!adminUser || adminUser.status !== 'ACTIVE') {
    // Sign out immediately if not an active admin
    await supabase.auth.signOut();
    return { error: 'Invalid email, password, or access permissions.' };
  }

  // Update last login
  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: { lastLoginAt: new Date() }
  });

  redirect('/admin');
}

