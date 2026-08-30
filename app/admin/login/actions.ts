'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';

// Simple in-memory rate limiter for serverless container instances
// Note: In a distributed serverless environment, this only limits per-container.
// Persistent distributed rate limiting requires Redis/KV.
const rateLimitMap = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }
  
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  const attempt = rateLimitMap.get(normalizedEmail);

  if (attempt) {
    if (attempt.count >= MAX_ATTEMPTS && now - attempt.lastAttempt < LOCKOUT_MS) {
      return { error: 'Too many login attempts. Please try again later.' };
    }
    if (now - attempt.lastAttempt >= LOCKOUT_MS) {
      // Reset after lockout period
      rateLimitMap.set(normalizedEmail, { count: 0, lastAttempt: now });
    }
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Record failed attempt
    const current = rateLimitMap.get(normalizedEmail) || { count: 0, lastAttempt: now };
    rateLimitMap.set(normalizedEmail, { count: current.count + 1, lastAttempt: now });
    
    return { error: 'Invalid email, password, or access permissions.' };
  }

  // Clear rate limit on success
  rateLimitMap.delete(normalizedEmail);

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
