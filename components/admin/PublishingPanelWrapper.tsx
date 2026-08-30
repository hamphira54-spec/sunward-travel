import { requireAdmin } from '@/lib/auth/requireAdmin';
import { PublishingPanel } from './PublishingPanel';
import type { ContentType } from '@/lib/publishing/types';
import type { ContentStatus } from '@/lib/content/types';

interface Props {
  contentType: ContentType;
  contentId: string;
  currentStatus: ContentStatus;
  publishDate?: Date | null;
  scheduleDate?: Date | null;
  isDirty: boolean;
  onSaveRequested: () => Promise<void>;
}

export default async function PublishingPanelWrapper(props: Omit<Props, 'role'>) {
  const admin = await requireAdmin();
  return <PublishingPanel {...props} role={admin.role} />;
}
