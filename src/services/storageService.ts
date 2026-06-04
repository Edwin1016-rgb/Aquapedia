import { supabase } from './supabase';

export async function uploadImage(userId: string, file: File, folder = 'photos') {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${folder}/${userId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage.from('uploads').upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw new Error(`Error al subir imagen: ${error.message} (${error.statusCode ?? 400})`);
  }

  const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(data.path);
  return urlData.publicUrl;
}
