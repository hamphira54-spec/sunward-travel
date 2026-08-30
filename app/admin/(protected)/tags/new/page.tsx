import { requireAdmin } from '@/lib/auth/requireAdmin';
import TagForm from '@/components/admin/TagForm';

export const metadata = { title: 'New Tag — Sunward Admin' };

export default async function NewTagPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2B221C]">New Tag</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new content tag.</p>
      </div>
      <TagForm tag={null} />
    </div>
  );
}
