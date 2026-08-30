import { supabaseAdmin, MEDIA_BUCKET } from './supabaseAdmin';

let bucketReady = false;

/**
 * Ensures the sunward-media bucket exists.
 * Called server-side before any upload.
 * Safe to call multiple times (idempotent after first success).
 */
export async function ensureMediaBucket(): Promise<void> {
  if (bucketReady) return;

  const { data: existing } = await supabaseAdmin.storage.getBucket(MEDIA_BUCKET);
  if (existing) {
    bucketReady = true;
    return;
  }

  const { error } = await supabaseAdmin.storage.createBucket(MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  });

  if (error && error.message !== 'The resource already exists') {
    throw new Error(`Failed to create storage bucket: ${error.message}`);
  }

  bucketReady = true;
}

/**
 * Generates a safe, unique storage key from the original filename.
 * Format: <timestamp>-<random>.<ext>
 * Never trusts user-provided filenames directly.
 */
export function generateStorageKey(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  const safe = ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext) ? ext : 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `uploads/${timestamp}-${random}.${safe}`;
}

/**
 * Deletes a storage object by its key.
 * Does not throw if not found.
 */
export async function deleteStorageObject(storageKey: string): Promise<void> {
  await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([storageKey]);
}

/**
 * Returns the public URL for a storage key.
 */
export function getPublicUrl(storageKey: string): string {
  const { data } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(storageKey);
  return data.publicUrl;
}
