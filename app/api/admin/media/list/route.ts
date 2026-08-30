import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get('q') || '';

  const items = await prisma.media.findMany({
    where: q
      ? {
          OR: [
            { alt: { contains: q, mode: 'insensitive' } },
            { title: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, url: true, alt: true, title: true, caption: true, credit: true },
  });

  return NextResponse.json({ items });
}
