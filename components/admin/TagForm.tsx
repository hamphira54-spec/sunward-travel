'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tag } from '@prisma/client';
import { upsertTag, deleteTag } from '@/app/admin/(protected)/tags/actions';

export default function TagForm({ tag }: { tag: Tag | null }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugLocked, setSlugLocked] = useState(!!tag);
  const [slug, setSlug] = useState(tag?.slug || '');
  const [name, setName] = useState(tag?.name || '');

  function handleNameChange(val: string) {
    setName(val);
    if (!slugLocked) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await upsertTag(formData);
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!tag) return;
    const confirmed = window.confirm(
      `Delete "${tag.name}"?\n\nThis will FAIL if the tag is used in any Guide, News, or Event. No content will be deleted.`
    );
    if (!confirmed) return;
    setIsPending(true);
    const result = await deleteTag(tag.id);
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl pb-24">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg font-medium">⚠ {error}</div>
      )}

      <input type="hidden" name="id" value={tag?.id || 'new'} />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-5">
        <h2 className="text-lg font-bold text-[#2B221C]">Tag Details</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tag Name <span className="text-red-500">*</span></label>
          <input type="text" name="name" required value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Budget Travel"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Slug <span className="text-red-500">*</span></label>
            <button type="button" onClick={() => setSlugLocked(!slugLocked)} className="text-xs text-[#0D6E7A] hover:underline">
              {slugLocked ? 'Unlock to edit' : 'Lock slug'}
            </button>
          </div>
          <input type="text" name="slug" required value={slug}
            onChange={(e) => setSlug(e.target.value)}
            readOnly={slugLocked}
            className={`w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none ${slugLocked ? 'bg-gray-50 text-gray-400' : ''}`}
          />
          <p className="text-xs text-gray-400">Used internally for content matching and scoring. Stable once set.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows={3}
            defaultValue={tag?.description || ''}
            placeholder="Optional description of what this tag covers..."
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-[#E9D9CA] flex items-center justify-between shadow-lg z-50">
        <div>
          {tag && (
            <button type="button" onClick={handleDelete} disabled={isPending}
              className="text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
              Delete Tag
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.back()} disabled={isPending}
            className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">Cancel</button>
          <button type="submit" disabled={isPending}
            className="bg-[#0D6E7A] text-white px-8 py-2 rounded-lg hover:bg-[#095663] transition-colors font-medium disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save Tag'}
          </button>
        </div>
      </div>
    </form>
  );
}
