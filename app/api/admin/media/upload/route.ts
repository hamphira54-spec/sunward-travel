import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { supabaseAdmin, MEDIA_BUCKET } from '@/lib/storage/supabaseAdmin';
import { ensureMediaBucket, generateStorageKey, getPublicUrl } from '@/lib/storage/mediaStorage';
import prisma from '@/lib/db';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    // Auth check
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const alt = (formData.get('alt') as string | null)?.trim() || null;
    const title = (formData.get('title') as string | null)?.trim() || null;
    const caption = (formData.get('caption') as string | null)?.trim() || null;
    const credit = (formData.get('credit') as string | null)?.trim() || null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // MIME validation
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF.` },
        { status: 400 }
      );
    }

    // Size validation
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)} MB. Maximum is 10 MB.` },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty.' }, { status: 400 });
    }

    // Ensure bucket exists
    await ensureMediaBucket();

    // Generate safe storage key (never trust user filename)
    const storageKey = generateStorageKey(file.name);

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .upload(storageKey, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const publicUrl = getPublicUrl(storageKey);

    // Create DB record
    let mediaRecord;
    try {
      mediaRecord = await prisma.media.create({
        data: {
          url: publicUrl,
          alt,
          title,
          caption,
          credit,
          mimeType: file.type,
          sizeBytes: file.size,
          storageProvider: 'supabase',
          storageKey,
        },
      });
    } catch (dbError: any) {
      // DB create failed — attempt to clean up the orphaned storage object
      console.error('[MediaUpload] DB create failed, cleaning up storage:', dbError?.message);
      await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([storageKey]);
      throw new Error('Failed to save media record. Upload cleaned up.');
    }

    return NextResponse.json({ media: mediaRecord }, { status: 201 });
  } catch (error: any) {
    console.error('[MediaUpload] Error:', error?.message);
    return NextResponse.json({ error: error.message || 'Upload failed.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
