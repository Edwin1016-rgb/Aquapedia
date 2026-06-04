import Dexie, { type Table } from 'dexie';
import type { Fish, CollectionCard, AquaStore } from '../types';

export interface CardPhoto {
  cardId: string;
  blob: Blob;
  createdAt: string;
}

export class AquaPediaDB extends Dexie {
  fish!: Table<Fish>;
  collection!: Table<CollectionCard>;
  stores!: Table<AquaStore>;
  syncQueue!: Table<{ id?: number; type: string; payload: unknown; createdAt: string }>;
  cardPhotos!: Table<CardPhoto>;

  constructor() {
    super('AquaPediaDB');
    this.version(2).stores({
      fish: '&id, commonName, scientificName, family, rarity, diet, temperament',
      collection: '&id, userId, fishId, addedAt, isFavorite',
      stores: '&id, name, type, lat, lng',
      syncQueue: '++id, type, createdAt',
      cardPhotos: '&cardId, createdAt',
    });
  }
}

export const db = new AquaPediaDB();

export const getFishById = (id: string) => db.fish.get(id);
export const searchFish = (q: string) =>
  db.fish
    .filter(
      (f) =>
        f.commonName.toLowerCase().includes(q.toLowerCase()) ||
        f.scientificName.toLowerCase().includes(q.toLowerCase()),
    )
    .toArray();
export const getCollection = (userId: string) =>
  db.collection.where('userId').equals(userId).toArray();
export const addToSyncQueue = (type: string, payload: unknown) =>
  db.syncQueue.add({ type, payload, createdAt: new Date().toISOString() });
