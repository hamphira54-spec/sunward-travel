/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Media } from '@prisma/client';
import { updateMedia, deleteMedia } from '@/app/admin/(protected)/media/actions';

export default function MediaEditForm({ media }: { media: Media }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await updateMedia(formData);
    if (result?.error) { setError(result.error); setIsPending(false); }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete this media item permanently?\n\nIf this image is used in any content, those references will break. Verify before deleting.`
    );
    if (!confirmed) return;
    setIsPending(true);
    const result = await deleteMedia(media.id);
    if (result?.error) { setError(result.error); setIsPending(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl pb-24">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg font-medium">
          &#9888; {error}
        </div>
      )}

      <input type="hidden" name="id" value={media.id} />

      <div className="grid grid-cols-2 gap-6">
        {/* Preview */}
        <div className="bg-white rounded-xl border border-[#E9D9CA] p-4 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-[#2B221C]">Preview</h2>
          <div className="rounded-lg overflow-hidden bg-gray-50 aspect-square flex items-center justify-center">
            <img src={media.url} alt={media.alt || ''} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            {media.width && media.height && <p>Dimensions: {media.width} × {media.height}px</p>}
            {media.mimeType && <p>Type: {media.mimeType}</p>}
            {media.sizeBytes && <p>Size: {(media.sizeBytes / 1024).toFixed(1)} KB</p>}
            {media.storageProvider && <p>Storage: {media.storageProvider}</p>}
            <p className="break-all text-[10px] text-gray-400">{media.url}</p>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-5">
          <h2 className="text-lg font-bold text-[#2B221C]">Metadata</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Alt Text {!media.alt && <span className="text-amber-500 text-xs">(missing — add for accessibility)</span>}
            </label>
            <input type="text" name="alt" defaultValue={media.alt || ''}
              placeholder="Descriptive text for screen readers"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" defaultValue={media.title || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Caption</label>
            <input type="text" name="caption" defaultValue={media.caption || ''}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Credit / Source</label>
            <input type="text" name="credit" defaultValue={media.credit || ''}
              placeholder="e.g. Photo by John Smith"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Public URL</label>
            <div className="flex items-center gap-2">
              <input type="text" readOnly value={media.url}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-mono bg-gray-50 text-gray-500" />
              <button type="button"
                onClick={() => navigator.clipboard.writeText(media.url)}
                className="shrink-0 text-xs text-[#0D6E7A] hover:underline px-2">Copy</button>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
              &#9888; Do not change the URL after this image is used in content. Create a new media item instead.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-[#E9D9CA] flex items-center justify-between shadow-lg z-50">
        <div>
          <button type="button" onClick={handleDelete} disabled={isPending}
            className="text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
            Delete Media
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.back()} disabled={isPending}
            className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">Cancel</button>
          <button type="submit" disabled={isPending}
            className="bg-[#0D6E7A] text-white px-8 py-2 rounded-lg hover:bg-[#095663] transition-colors font-medium disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save Metadata'}
          </button>
        </div>
      </div>
    </form>
  );
}
