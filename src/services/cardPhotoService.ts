import { db } from '../db/indexedDB';

let objectUrls = new Map<string, string>();

export async function saveCardPhoto(cardId: string, file: File): Promise<string> {
  const blob = new Blob([file], { type: file.type || 'image/jpeg' });
  await db.cardPhotos.put({ cardId, blob, createdAt: new Date().toISOString() });
  revokeCardPhoto(cardId);
  const url = URL.createObjectURL(blob);
  objectUrls.set(cardId, url);
  return url;
}

export async function getCardPhotoUrl(cardId: string): Promise<string | null> {
  const existing = objectUrls.get(cardId);
  if (existing) return existing;
  const photo = await db.cardPhotos.get(cardId);
  if (!photo) return null;
  const url = URL.createObjectURL(photo.blob);
  objectUrls.set(cardId, url);
  return url;
}

export function revokeCardPhoto(cardId: string) {
  const url = objectUrls.get(cardId);
  if (url) {
    URL.revokeObjectURL(url);
    objectUrls.delete(cardId);
  }
}

export function revokeAllCardPhotos() {
  for (const [, url] of objectUrls) {
    URL.revokeObjectURL(url);
  }
  objectUrls.clear();
}

export async function deleteCardPhoto(cardId: string) {
  revokeCardPhoto(cardId);
  await db.cardPhotos.delete(cardId);
}
