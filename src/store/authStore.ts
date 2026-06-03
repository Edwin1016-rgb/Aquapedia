import create from 'zustand';
import { supabase } from '../services/supabase';
import type { UserProfile } from '../types';

type State = {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<State>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      // no-op; UI handles errors
      set({ user: null });
    }
  },
}));
