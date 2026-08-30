import type { ContentStatus } from '@/lib/content/types';

export type ContentType = 'guide' | 'news' | 'event';

export type PublishingAction =
  | 'SUBMIT_FOR_REVIEW'
  | 'REQUEST_CHANGES'
  | 'APPROVE'
  | 'SCHEDULE'
  | 'CANCEL_SCHEDULE'
  | 'PUBLISH'
  | 'UNPUBLISH'
  | 'ARCHIVE'
  | 'RESTORE_TO_DRAFT';

export interface TransitionResult {
  success: boolean;
  error?: string;
  newStatus?: ContentStatus;
}
