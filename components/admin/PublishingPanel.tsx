'use client';

import { useState } from 'react';
import { submitPublishingAction } from '@/app/admin/(protected)/publishing/actions';
import type { ContentType, PublishingAction } from '@/lib/publishing/types';
import type { ContentStatus } from '@/lib/content/types';

interface Props {
  contentType: ContentType;
  contentId: string;
  currentStatus: ContentStatus;
  publishDate?: Date | null;
  scheduleDate?: Date | null;
  role: string;
  isDirty: boolean;
  onSaveRequested: () => Promise<boolean | void>; // Request form save before transition
}

export function PublishingPanel({
  contentType,
  contentId,
  currentStatus,
  publishDate,
  scheduleDate,
  role,
  isDirty,
  onSaveRequested,
}: Props) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If new record, we can't publish yet
  if (contentId === 'new') {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-500">Unsaved Draft</span>
        <button type="submit" className="bg-[#0D6E7A] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#095663]">
          Save Draft
        </button>
      </div>
    );
  }

  const handleAction = async (action: PublishingAction) => {
    setIsPending(true);
    setError(null);
    try {
      if (isDirty) {
        const saved = await onSaveRequested();
        if (saved === false) {
          setError('Validation failed. Please fix errors and save before transitioning.');
          return;
        }
      }
      const res = await submitPublishingAction(contentType, contentId, action);
      if (res.error) {
        setError(res.error);
      }
    } catch (e: any) {
      setError(e.message || 'Error occurred');
    } finally {
      setIsPending(false);
    }
  };

  const actions = [];
  
  if (currentStatus === 'draft') {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'EDITOR') {
      actions.push(<button key="submit" type="button" onClick={() => handleAction('SUBMIT_FOR_REVIEW')} disabled={isPending} className="border border-[#0D6E7A] text-[#0D6E7A] px-4 py-2 rounded-lg font-medium hover:bg-gray-50">Submit for Review</button>);
    }
  }
  
  if (currentStatus === 'in_review') {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      actions.push(<button key="approve" type="button" onClick={() => handleAction('APPROVE')} disabled={isPending} className="bg-[#F2C04A] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#D9A832]">Approve</button>);
      actions.push(<button key="reject" type="button" onClick={() => handleAction('REQUEST_CHANGES')} disabled={isPending} className="border border-red-500 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-50">Request Changes</button>);
    }
  }

  if (currentStatus === 'approved') {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      actions.push(<button key="publish" type="button" onClick={() => handleAction('PUBLISH')} disabled={isPending} className="bg-[#0D6E7A] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#095663]">Publish Now</button>);
      // Schedule could be another modal, keeping simple for now
    }
  }

  if (currentStatus === 'published') {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      actions.push(<button key="unpublish" type="button" onClick={() => handleAction('UNPUBLISH')} disabled={isPending} className="border border-gray-500 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50">Return to Draft</button>);
      actions.push(<button key="archive" type="button" onClick={() => handleAction('ARCHIVE')} disabled={isPending} className="border border-gray-500 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50">Archive</button>);
    }
  }

  if (currentStatus === 'archived') {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      actions.push(<button key="restore" type="button" onClick={() => handleAction('RESTORE_TO_DRAFT')} disabled={isPending} className="border border-gray-500 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50">Restore to Draft</button>);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
      <div className="flex items-center gap-2 mr-4 border-r border-gray-200 pr-4">
        <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Status:</span>
        <span className="text-sm font-bold bg-gray-100 px-2 py-1 rounded">{currentStatus.toUpperCase()}</span>
      </div>
      
      {/* Save Button for standard form submission */}
      <button type="submit" disabled={isPending} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700">
        {isDirty ? 'Save Changes' : 'Saved'}
      </button>

      {actions}
    </div>
  );
}
