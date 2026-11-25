import imageCompression from 'browser-image-compression';
import { supabase, isSupabaseConfigured } from './supabase';

export async function uploadImage(file: File, folder: string): Promise<string> {
  // Compress image client side first (max 1600px, webp or jpeg)
  let compressedFile = file;
  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: 'image/webp',
    };
    compressedFile = await imageCompression(file, options);
  } catch (err) {
    console.warn('Image compression fallback:', err);
  }

  if (isSupabaseConfigured && supabase) {
    const fileExt = compressedFile.name.split('.').pop() || 'webp';
    const filePath = `media/${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('media')
      .upload(filePath, compressedFile, { upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  // Demo Mode: create local object URL or return mock URL
  return URL.createObjectURL(compressedFile);
}
