import { supabase } from './supabase';
import { db } from '../db/indexedDB';
import { showToast } from '../store/uiStore';
import type { CollectionCard } from '../types';

async function processAddCollection(itemId: number, payload: CollectionCard) {
  try {
    const insert = {
      user_id: payload.userId,
      fish_id: payload.fishId,
      user_photo: payload.userPhoto ?? null,
      notes: payload.notes ?? null,
      is_favorite: payload.isFavorite ?? false,
    };

    const { data, error } = await supabase.from('collection_cards').insert(insert).select();
    if (error) throw error;
    const created = (data && (data as any)[0]) as any;

    const serverCard: CollectionCard = {
      id: created.id,
      userId: created.user_id,
      fishId: created.fish_id,
      userPhoto: created.user_photo ?? undefined,
      notes: created.notes ?? undefined,
      addedAt: created.added_at,
      isFavorite: created.is_favorite ?? false,
    };

    await db.transaction('rw', db.collection, db.syncQueue, async () => {
      // remove local (possibly temporary) entry and insert server-backed card
      try {
        await db.collection.delete(payload.id);
      } catch {}
      await db.collection.put(serverCard);
      await db.syncQueue.delete(itemId);
    });
    return true;
  } catch (err) {
    console.error('processAddCollection failed', err);
    // If it fails, keep in queue for retry
    return false;
  }
}

async function processDeleteCollection(itemId: number, payload: { id: string }) {
  try {
    const { error } = await supabase.from('collection_cards').delete().eq('id', payload.id);
    if (error) {
      // If the id is local-only, server will not find it; remove queue to avoid blocking
      console.warn('delete_collection supabase error, removing queue entry', error.message ?? error);
    }

    // Ensure local is deleted
    try {
      await db.collection.delete(payload.id);
    } catch {}

    await db.syncQueue.delete(itemId);
    return true;
  } catch (err) {
    console.error('processDeleteCollection failed', err);
    return false;
  }
}

async function processUpdateCollection(itemId: number, payload: { id: string; isFavorite: boolean }) {
  try {
    const { error } = await supabase
      .from('collection_cards')
      .update({ is_favorite: payload.isFavorite })
      .eq('id', payload.id);
    if (error) throw error;

    const card = await db.collection.get(payload.id);
    if (card) {
      await db.collection.put({ ...card, isFavorite: payload.isFavorite });
    }

    await db.syncQueue.delete(itemId);
    return true;
  } catch (err) {
    console.error('processUpdateCollection failed', err);
    // If update fails because id is local, remove queue to avoid stuck entries
    await db.syncQueue.delete(itemId);
    return false;
  }
}

export async function processSyncQueue() {
  try {
    const items = await db.syncQueue.toArray();
    if (!items || items.length === 0) return 0;

    let successCount = 0;
    for (const item of items) {
      if (!item.id) continue;
      const type = item.type;
      const payload = item.payload as any;
      let ok = false;
      if (type === 'add_collection') {
        ok = await processAddCollection(item.id, payload as CollectionCard);
      } else if (type === 'delete_collection') {
        ok = await processDeleteCollection(item.id, payload as { id: string });
      } else if (type === 'update_collection') {
        ok = await processUpdateCollection(item.id, payload as { id: string; isFavorite: boolean });
      } else {
        // unknown type: remove to avoid infinite loop
        console.warn('Unknown syncQueue type, removing', type);
        await db.syncQueue.delete(item.id);
        ok = true;
      }

      if (ok) successCount++;
    }

    // Notify user via in-app toast (fallback to console inside showToast)
    try {
      showToast('success', `Sincronizadas ${successCount} operación(es)`);
    } catch (nErr) {
      // ignore
    }

    return successCount;
  } catch (err) {
    console.error('processSyncQueue general error', err);
    return 0;
  }
}

let _listening = false;
export function startSyncListener() {
  if (_listening) return;
  _listening = true;

  window.addEventListener('online', () => {
    // small delay to let network settle
    setTimeout(() => {
      void processSyncQueue();
    }, 1_000);
  });

  // try immediate sync on start if online
  if (navigator.onLine) {
    void processSyncQueue();
  }
}

export function stopSyncListener() {
  // no-op for now, as we didn't store the handler reference
  _listening = false;
}

// auto-start
if (typeof window !== 'undefined') {
  startSyncListener();
}

export default { processSyncQueue, startSyncListener, stopSyncListener };
