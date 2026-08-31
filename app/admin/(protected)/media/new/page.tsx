import { requireAdmin } from '@/lib/auth/requireAdmin';
import MediaUploadForm from '@/components/admin/MediaUploadForm';

export const metadata = { title: 'Upload Media — Sunward Admin' };

export default async function NewMediaPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2B221C]">Upload Media</h1>
        <p className="text-sm text-gray-500 mt-1">Upload an image to the media library.</p>
      </div>
      <MediaUploadForm />
    </div>
  );
}
