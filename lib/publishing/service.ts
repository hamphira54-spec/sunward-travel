import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { getAvailableActions, getTargetStatus } from './permissions';
import type { PublishingAction, ContentType } from './types';
import type { ContentStatus } from '@/lib/content/types';

export async function transitionContentStatus(
  contentType: ContentType,
  contentId: string,
  action: PublishingAction,
  note?: string,
  scheduledDate?: Date,
  systemBypass: boolean = false
) {
  let adminId = 'SYSTEM';
  let role = 'SUPER_ADMIN';

  if (!systemBypass) {
    const admin = await requireAdmin();
    adminId = admin.id;
    role = admin.role;
  }

  // 1. Fetch current status
  let currentStatus: ContentStatus = 'draft';
  
  if (contentType === 'guide') {
    const guide = await prisma.guide.findUnique({ where: { id: contentId } });
    if (!guide) throw new Error('Guide not found');
    currentStatus = (guide.publishStatus as ContentStatus) || 'draft';
  } else if (contentType === 'news') {
    const news = await prisma.news.findUnique({ where: { id: contentId } });
    if (!news) throw new Error('News not found');
    currentStatus = (news.publishStatus as ContentStatus) || 'draft';
  } else if (contentType === 'event') {
    const event = await prisma.event.findUnique({ where: { id: contentId } });
    if (!event) throw new Error('Event not found');
    currentStatus = (event.publishStatus as ContentStatus) || 'draft';
  }

  // 2. Validate action is allowed for this role and current status
  const availableActions = getAvailableActions(currentStatus, role);
  if (!availableActions.includes(action)) {
    throw new Error(`Action ${action} is not allowed from status ${currentStatus} for role ${role}`);
  }

  const newStatus = getTargetStatus(action);
  
  // 3. Additional validation
  if (action === 'SCHEDULE' && !scheduledDate) {
    throw new Error('Scheduled date is required for scheduling');
  }

  // 4. Update the record
  const updateData: any = {
    publishStatus: newStatus
  };

  if (action === 'PUBLISH') {
    updateData.publishDate = new Date();
    updateData.scheduleDate = null;
  } else if (action === 'SCHEDULE') {
    updateData.scheduleDate = scheduledDate;
  } else if (action === 'CANCEL_SCHEDULE' || action === 'UNPUBLISH' || action === 'REQUEST_CHANGES' || action === 'RESTORE_TO_DRAFT') {
    updateData.scheduleDate = null;
  }

  if (contentType === 'guide') {
    await prisma.guide.update({ where: { id: contentId }, data: updateData });
  } else if (contentType === 'news') {
    await prisma.news.update({ where: { id: contentId }, data: updateData });
  } else if (contentType === 'event') {
    await prisma.event.update({ where: { id: contentId }, data: updateData });
  }

  // 5. Create audit log
  await prisma.publishingAudit.create({
    data: {
      contentType,
      contentId,
      action,
      fromStatus: currentStatus,
      toStatus: newStatus,
      actorAdminUserId: adminId,
      actorRole: role,
      note
    }
  });

  return { success: true, newStatus };
}
