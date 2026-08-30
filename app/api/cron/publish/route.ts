import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { transitionContentStatus } from '@/lib/publishing/service';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  
  try {
    let processed = 0;

    // 1. Guides
    const scheduledGuides = await prisma.guide.findMany({
      where: {
        publishStatus: 'scheduled',
        scheduleDate: { lte: now }
      }
    });
    for (const guide of scheduledGuides) {
      await transitionContentStatus('guide', guide.id, 'PUBLISH', 'Automated CRON publish', undefined, true);
      processed++;
    }

    // 2. News
    const scheduledNews = await prisma.news.findMany({
      where: {
        publishStatus: 'scheduled',
        scheduleDate: { lte: now }
      }
    });
    for (const news of scheduledNews) {
      await transitionContentStatus('news', news.id, 'PUBLISH', 'Automated CRON publish', undefined, true);
      processed++;
    }

    // 3. Events
    const scheduledEvents = await prisma.event.findMany({
      where: {
        publishStatus: 'scheduled',
        scheduleDate: { lte: now }
      }
    });
    for (const event of scheduledEvents) {
      await transitionContentStatus('event', event.id, 'PUBLISH', 'Automated CRON publish', undefined, true);
      processed++;
    }

    return NextResponse.json({ success: true, processed, message: `Processed ${processed} scheduled items.` });
  } catch (error: any) {
    console.error('[CRON Publish] Error:', error?.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
