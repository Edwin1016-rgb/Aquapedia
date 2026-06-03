import { supabase } from './supabase';

export async function uploadImage(userId: string, file: File, folder = 'photos') {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${folder}/${userId}/${Date.now()}.${ext}`;

  try {
    const { data, error } = await supabase.storage.from('uploads').upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) throw error;
    // public URL (requires bucket policy allowing public read)
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(data.path);
    return urlData.publicUrl;
  } catch (err) {
    throw err;
  }
}
