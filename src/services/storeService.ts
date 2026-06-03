import { supabase } from './supabase';
import { db } from '../db/indexedDB';
import type { AquaStore } from '../types';

export async function fetchStores(): Promise<AquaStore[]> {
  try {
    const { data, error } = await supabase.from('aqua_stores').select('*');
    if (error) throw error;
    const stores: AquaStore[] = (data ?? []) as any;
    // persist to local Dexie
    await db.stores.clear();
    if (stores.length) await db.stores.bulkPut(stores);
    return stores;
  } catch (err) {
    // fallback to local
    return db.stores.toArray();
  }
}
export async function suggestStore(payload: Partial<AquaStore>) {
  try {
    const insert = {
      name: payload.name,
      type: payload.type || 'tienda',
      lat: payload.lat,
      lng: payload.lng,
      address: payload.address,
      phone: payload.phone,
      website: payload.website,
      schedule: payload.schedule,
      rating: payload.rating ?? null,
      verified_by: null,
    };
    const { data, error } = await supabase.from('aqua_stores').insert(insert).select();
    if (error) throw error;
    const store = (data && data[0]) as AquaStore;
    // persist locally as well
    await db.stores.put(store);
    return store;
  } catch (err) {
    // fallback: save locally with random id
    const loc: AquaStore = {
      id: crypto.randomUUID(),
      name: payload.name || 'Sugerida',
      type: (payload.type as any) || 'tienda',
      lat: payload.lat ?? 0,
      lng: payload.lng ?? 0,
      address: payload.address ?? '',
      phone: payload.phone,
      website: payload.website,
      schedule: payload.schedule,
      rating: payload.rating ?? null,
      verifiedBy: null,
    };
    await db.stores.add(loc);
    return loc;
  }
}

export default { fetchStores, suggestStore };
