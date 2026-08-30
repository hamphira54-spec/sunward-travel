import { requireAdmin } from '@/lib/auth/requireAdmin';
import AuthorForm from '@/components/admin/AuthorForm';

export const metadata = { title: 'New Author — Sunward Admin' };

export default async function NewAuthorPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2B221C]">New Author</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new author profile.</p>
      </div>
      <AuthorForm author={null} />
    </div>
  );
}