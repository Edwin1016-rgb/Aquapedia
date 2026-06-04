import { supabase } from './supabase';
import { db, addToSyncQueue } from '../db/indexedDB';
import { evaluateAchievementsForUser } from './achievementsService';
import { checkCompatibility } from '../utils/compatibility';
import type { CollectionCard, Fish } from '../types';

export async function fetchUserCollection(userId: string): Promise<CollectionCard[]> {
  try {
    const { data, error } = await supabase
      .from('collection_cards')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    const mapped = (data ?? []) as any[];
    const cards: CollectionCard[] = mapped.map((r) => ({
      id: r.id,
      userId: r.user_id,
      fishId: r.fish_id,
      userPhoto: r.user_photo,
      notes: r.notes,
      isFavorite: r.is_favorite,
      addedAt: r.added_at,
    }));

    // save to local Dexie
    await db.collection.bulkPut(cards);
    return cards;
  } catch (err) {
    // fallback to local
    return db.collection.where('userId').equals(userId).toArray();
  }
}

export async function addToCollection(userId: string, fishId: string, userPhoto?: string, notes?: string) {
  const payload = { user_id: userId, fish_id: fishId, user_photo: userPhoto ?? null, notes: notes ?? null, is_favorite: false };
  try {
    const { data, error } = await supabase.from('collection_cards').insert(payload).select();
    if (error) throw error;
    const created = (data && (data as any)[0]) as any;
    const card: CollectionCard = {
      id: created.id,
      userId,
      fishId,
      userPhoto: created.user_photo ?? undefined,
      notes: created.notes ?? undefined,
      addedAt: created.added_at,
      isFavorite: created.is_favorite ?? false,
    };
    await db.collection.put(card);
    // attach fish if available and evaluate achievements
    try {
      const fish = await db.fish.get(fishId);
      const cardWithFish = { ...card, fish } as CollectionCard & { fish?: any };
      void evaluateAchievementsForUser(userId, cardWithFish as CollectionCard);
      void checkAndNotifyCompatibility(userId, card.fishId, fish as Fish | undefined);
    } catch {}

    return card;
  } catch (err) {
    // offline: create local id and queue for sync
    const id = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : String(Date.now());
    const now = new Date().toISOString();
    const localCard: CollectionCard = {
      id,
      userId,
      fishId,
      userPhoto,
      notes,
      addedAt: now,
      isFavorite: false,
    };
    await db.collection.put(localCard);
    await addToSyncQueue('add_collection', { ...localCard });
    try {
      const fish = await db.fish.get(fishId);
      const localWithFish = { ...localCard, fish } as CollectionCard & { fish?: any };
      void evaluateAchievementsForUser(userId, localWithFish as CollectionCard);
      void checkAndNotifyCompatibility(userId, localCard.fishId, fish as Fish | undefined);
    } catch {}
    return localCard;
  }
}

export async function removeFromCollection(cardId: string) {
  try {
    const { error } = await supabase.from('collection_cards').delete().eq('id', cardId);
    if (error) throw error;
    await db.collection.delete(cardId);
    return true;
  } catch (err) {
    // offline: mark for delete
    await db.collection.delete(cardId);
    await addToSyncQueue('delete_collection', { id: cardId });
    return false;
  }
}

export async function toggleFavorite(cardId: string, favorite: boolean) {
  try {
    const { error } = await supabase.from('collection_cards').update({ is_favorite: favorite }).eq('id', cardId);
    if (error) throw error;
    const card = await db.collection.get(cardId);
    if (card) {
      await db.collection.put({ ...card, isFavorite: favorite });
    }
    return true;
  } catch (err) {
    const card = await db.collection.get(cardId);
    if (card) {
      await db.collection.put({ ...card, isFavorite: favorite });
    }
    await addToSyncQueue('update_collection', { id: cardId, isFavorite: favorite });
    return false;
  }
}

async function checkAndNotifyCompatibility(userId: string, newFishId: string, newFish: Fish | undefined) {
  if (!newFish) return;
  try {
    const existingCards = await db.collection.where('userId').equals(userId).toArray();
    for (const card of existingCards) {
      if (card.fishId === newFishId) continue;
      const existingFish = await db.fish.get(card.fishId);
      if (!existingFish) continue;
      const result = checkCompatibility(existingFish, { otherTemperament: newFish.temperament });
      if (result.level !== 'compatible') {
        const { showToast } = await import('../store/uiStore');
        showToast('warning', `${newFish.commonName} podría no ser compatible con ${existingFish.commonName}`);
        const { sendNotification } = await import('./notificationService');
        sendNotification({ userId, title: `⚠️ Alerta: ${newFish.commonName}`, body: `No es compatible con ${existingFish.commonName} que ya tienes en tu colección.` }).catch(() => {});
      }
    }
  } catch {
    // non-critical
  }
}
