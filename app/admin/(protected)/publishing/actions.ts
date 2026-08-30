'use server';

import { transitionContentStatus } from '@/lib/publishing/service';
import type { PublishingAction, ContentType } from '@/lib/publishing/types';
import { revalidatePath } from 'next/cache';

export async function submitPublishingAction(
  contentType: ContentType,
  contentId: string,
  action: PublishingAction,
  note?: string,
  scheduledDateIso?: string
) {
  try {
    const scheduledDate = scheduledDateIso ? new Date(scheduledDateIso) : undefined;
    const result = await transitionContentStatus(contentType, contentId, action, note, scheduledDate);
    
    // Revalidate lists and items
    revalidatePath(`/admin/${contentType}s`);
    revalidatePath(`/${contentType}s`);
    
    return { success: true, newStatus: result.newStatus };
  } catch (error: any) {
    console.error('[PublishingAction] Error:', error?.message);
    return { error: error.message || 'Failed to perform publishing action' };
  }
}

