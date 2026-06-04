import { supabase } from './supabase';
import { db, addToSyncQueue } from '../db/indexedDB';
import { evaluateAchievementsForUser } from './achievementsService';
import { checkCompatibility } from '../utils/compatibility';
import type { CollectionCard, Fish } from '../types';

function rowToFish(row: any): Fish {
  return {
    id: row.id,
    commonName: row.common_name,
    scientificName: row.scientific_name,
    family: row.family,
    description: row.description ?? '',
    imageUrl: row.image_url ?? '',
    communityPhotos: row.community_photos ?? [],
    tempMin: Number(row.temp_min),
    tempMax: Number(row.temp_max),
    phMin: Number(row.ph_min),
    phMax: Number(row.ph_max),
    hardnessMin: row.hardness_min ?? 0,
    hardnessMax: row.hardness_max ?? 0,
    sizeAdultCm: Number(row.size_adult_cm),
    lifespan: row.lifespan ?? '',
    diet: row.diet as Fish['diet'],
    temperament: row.temperament as Fish['temperament'],
    tankLevelMin: row.tank_level_min ?? 0,
    difficultyLevel: (row.difficulty_level as Fish['difficultyLevel']) ?? 1,
    rarity: row.rarity as Fish['rarity'],
    compatibleWith: row.compatible_with ?? [],
    incompatibleWith: row.incompatible_with ?? [],
    careNotes: row.care_notes ?? '',
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchUserCollection(userId: string): Promise<CollectionCard[]> {
  try {
    const { data, error } = await supabase
      .from('collection_cards')
      .select('*, fish:fish_id(*)')
      .eq('user_id', userId);
    if (error) throw error;
    const mapped = (data ?? []) as any[];
    const cards: CollectionCard[] = mapped.map((r: any) => {
      const card: CollectionCard = {
        id: r.id,
        userId: r.user_id,
        fishId: r.fish_id,
        userPhoto: r.user_photo,
        notes: r.notes,
        isFavorite: r.is_favorite,
        addedAt: r.added_at,
      };
      if (r.fish) card.fish = rowToFish(r.fish);
      return card;
    });

    // save to local Dexie
    await db.collection.bulkPut(cards);
    return cards;
  } catch (err) {
    // fallback to local
    const localCards = await db.collection.where('userId').equals(userId).toArray();
    // attach fish data from local Dexie
    for (const card of localCards) {
      if (!card.fish) {
        const fish = await db.fish.get(card.fishId);
        if (fish) card.fish = fish;
      }
    }
    return localCards;
  }
}

export async function addToCollection(userId: string, fishId: string, userPhoto?: string, notes?: string) {
  const payload = { user_id: userId, fish_id: fishId, user_photo: userPhoto ?? null, notes: notes ?? null, is_favorite: false };
  const attachFish = async (card: CollectionCard) => {
    const fish = await db.fish.get(fishId);
    if (fish) (card as any).fish = fish;
    return card;
  };
  try {
    const { data, error } = await supabase.from('collection_cards').insert(payload).select('*, fish:fish_id(*)');
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
    if (created.fish) (card as any).fish = rowToFish(created.fish);
    await db.collection.put(card);
    void evaluateAchievementsForUser(userId, card as CollectionCard);
    void checkAndNotifyCompatibility(userId, card.fishId, card.fish as Fish | undefined);
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
    await attachFish(localCard);
    await db.collection.put(localCard);
    await addToSyncQueue('add_collection', { ...localCard });
    void evaluateAchievementsForUser(userId, localCard as CollectionCard);
    void checkAndNotifyCompatibility(userId, localCard.fishId, localCard.fish as Fish | undefined);
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

export async function updateCardPhoto(cardId: string, photoUrl: string) {
  try {
    const { error } = await supabase.from('collection_cards').update({ user_photo: photoUrl }).eq('id', cardId);
    if (error) throw error;
    const card = await db.collection.get(cardId);
    if (card) {
      await db.collection.put({ ...card, userPhoto: photoUrl });
    }
    return true;
  } catch (err) {
    const card = await db.collection.get(cardId);
    if (card) {
      await db.collection.put({ ...card, userPhoto: photoUrl });
    }
    await addToSyncQueue('update_collection', { id: cardId, userPhoto: photoUrl });
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
