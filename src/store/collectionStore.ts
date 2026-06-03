import create from 'zustand';
import type { CollectionCard } from '../types';
import * as collectionService from '../services/collectionService';

type State = {
  items: CollectionCard[];
  load: (userId: string) => Promise<void>;
  add: (userId: string, fishId: string, userPhoto?: string, notes?: string) => Promise<void>;
  remove: (cardId: string) => Promise<void>;
  toggleFavorite: (cardId: string, fav: boolean) => Promise<void>;
};

export const useCollectionStore = create<State>((set, get) => ({
  items: [],
  load: async (userId: string) => {
    const list = await collectionService.fetchUserCollection(userId);
    set({ items: list });
  },
  add: async (userId: string, fishId: string, userPhoto?: string, notes?: string) => {
    const card = await collectionService.addToCollection(userId, fishId, userPhoto, notes);
    set({ items: [card, ...get().items] });
  },
  remove: async (cardId: string) => {
    await collectionService.removeFromCollection(cardId);
    set({ items: get().items.filter((i) => i.id !== cardId) });
  },
  toggleFavorite: async (cardId: string, fav: boolean) => {
    await collectionService.toggleFavorite(cardId, fav);
    set({ items: get().items.map((i) => (i.id === cardId ? { ...i, isFavorite: fav } : i)) });
  },
}));
