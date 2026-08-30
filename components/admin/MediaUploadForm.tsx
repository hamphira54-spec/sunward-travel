'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_MB = 10;

export default function MediaUploadForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side pre-validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Unsupported type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF.`);
      e.target.value = '';
      setPreview(null);
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File too large: ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum is ${MAX_MB} MB.`);
      e.target.value = '';
      setPreview(null);
      return;
    }

    setError(null);
    setFilename(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed.');
      }

      // Revoke preview to avoid memory leak
      if (preview) URL.revokeObjectURL(preview);

      router.push('/admin/media');
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl pb-24">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg font-medium">
          &#9888; {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E9D9CA] space-y-5">
        <h2 className="text-lg font-bold text-[#2B221C]">Image Upload</h2>
        <p className="text-xs text-gray-500">Accepted: JPEG, PNG, WebP, AVIF. Maximum size: 10 MB.</p>

        <div
          className="border-2 border-dashed border-[#E9D9CA] rounded-xl p-8 text-center cursor-pointer hover:border-[#0D6E7A] transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <div className="space-y-3">
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
              <p className="text-sm text-gray-500">{filename}</p>
              <p className="text-xs text-[#0D6E7A]">Click to change file</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-500">Click to select an image</p>
              <p className="text-xs text-gray-400">JPEG, PNG, WebP, AVIF up to 10 MB</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          required
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Alt Text <span className="text-red-500">*</span>
          </label>
          <input type="text" name="alt" required
            placeholder="Descriptive text for screen readers and SEO"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          <p className="text-xs text-gray-400">Required. Describe the image content accurately. Do not use the filename.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title"
            placeholder="Optional display title"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Caption</label>
          <input type="text" name="caption"
            placeholder="Optional caption shown with the image"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Credit / Source</label>
          <input type="text" name="credit"
            placeholder="e.g. Photo by John Smith / Unsplash"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#0D6E7A] focus:outline-none" />
          <p className="text-xs text-gray-400">Attribution for the image. Do not fabricate credits.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-[#E9D9CA] flex items-center justify-end shadow-lg z-50 gap-4">
        <button type="button" onClick={() => router.back()} disabled={isPending}
          className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg">Cancel</button>
        <button type="submit" disabled={isPending || !preview}
          className="bg-[#E8622C] text-white px-8 py-2 rounded-lg hover:bg-[#C94E1E] transition-colors font-medium disabled:opacity-50">
          {isPending ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
    </form>
  );
}
