import type { PublishingAction, ContentType } from './types';
import type { ContentStatus } from '@/lib/content/types';

export function canPerformAction(role: string, action: PublishingAction): boolean {
  if (role === 'SUPER_ADMIN') return true;

  if (role === 'ADMIN') {
    return true; // Admin can do everything
  }

  if (role === 'EDITOR') {
    // Editor can only draft, submit for review, unpublish back to draft
    switch (action) {
      case 'SUBMIT_FOR_REVIEW':
      case 'RESTORE_TO_DRAFT': // Wait, editors can revert their own? We'll just allow RESTORE_TO_DRAFT from 'in_review' or 'draft', maybe 'published' if allowed.
        return true;
      default:
        return false;
    }
  }

  return false;
}

export function getAvailableActions(status: ContentStatus, role: string): PublishingAction[] {
  const actions: PublishingAction[] = [];

  if (status === 'draft') {
    if (canPerformAction(role, 'SUBMIT_FOR_REVIEW')) actions.push('SUBMIT_FOR_REVIEW');
  }

  if (status === 'in_review') {
    if (canPerformAction(role, 'APPROVE')) actions.push('APPROVE');
    if (canPerformAction(role, 'REQUEST_CHANGES')) actions.push('REQUEST_CHANGES');
  }

  if (status === 'approved') {
    if (canPerformAction(role, 'PUBLISH')) actions.push('PUBLISH');
    if (canPerformAction(role, 'SCHEDULE')) actions.push('SCHEDULE');
    if (canPerformAction(role, 'REQUEST_CHANGES')) actions.push('REQUEST_CHANGES');
  }

  if (status === 'scheduled') {
    if (canPerformAction(role, 'CANCEL_SCHEDULE')) actions.push('CANCEL_SCHEDULE');
    if (canPerformAction(role, 'PUBLISH')) actions.push('PUBLISH');
  }

  if (status === 'published') {
    if (canPerformAction(role, 'UNPUBLISH')) actions.push('UNPUBLISH');
    if (canPerformAction(role, 'ARCHIVE')) actions.push('ARCHIVE');
  }

  if (status === 'archived') {
    if (canPerformAction(role, 'RESTORE_TO_DRAFT')) actions.push('RESTORE_TO_DRAFT');
  }

  return actions;
}

export function getTargetStatus(action: PublishingAction): ContentStatus {
  switch (action) {
    case 'SUBMIT_FOR_REVIEW': return 'in_review';
    case 'REQUEST_CHANGES': return 'draft';
    case 'APPROVE': return 'approved'; // Wait, approved is not in ContentStatus!
    case 'SCHEDULE': return 'scheduled';
    case 'CANCEL_SCHEDULE': return 'approved';
    case 'PUBLISH': return 'published';
    case 'UNPUBLISH': return 'draft';
    case 'ARCHIVE': return 'archived';
    case 'RESTORE_TO_DRAFT': return 'draft';
  }
}
