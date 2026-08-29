import 'server-only';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    redirect('/admin/login');
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { authUserId: data.user.id }
  });

  if (!adminUser) {
    redirect('/admin/login');
  }

  if (adminUser.status !== 'ACTIVE') {
    redirect('/admin/login');
  }

  return adminUser;
}

