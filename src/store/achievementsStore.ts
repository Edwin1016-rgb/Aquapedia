import create from 'zustand';

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  unlockedAt?: string;
}

interface AchState {
  badges: Badge[];
  modalBadge?: Badge | null;
  unlockBadge: (b: Badge) => void;
  closeModal: () => void;
}

export const useAchievementsStore = create<AchState>((set) => ({
  badges: [],
  modalBadge: null,
  unlockBadge: (b) => set((s) => {
    const exists = s.badges.find(x => x.id === b.id);
    if (exists) return s;
    const bd = { ...b, unlockedAt: new Date().toISOString() };
    return { badges: [...s.badges, bd], modalBadge: bd };
  }),
  closeModal: () => set({ modalBadge: null }),
}));

export default useAchievementsStore;
