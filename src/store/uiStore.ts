import create from 'zustand';
import { get as idbGet, set as idbSet } from 'idb-keyval';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export type Theme = 'system' | 'light' | 'dark';

interface UiState {
  toasts: ToastItem[];
  addToast: (t: ToastItem) => void;
  removeToast: (id: string) => void;
  showToast: (type: ToastType, message: string, ms?: number) => void;
  theme: Theme;
  setTheme: (t: Theme) => Promise<void>;
  initTheme: () => Promise<void>;
}

function applyThemeToDocument(theme: Theme) {
  if (typeof window === 'undefined' || !document?.documentElement) return;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  if (isDark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  addToast: (t) => set((s) => ({ toasts: [...s.toasts, t] })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  showToast: (type, message, ms = 3000) => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const item: ToastItem = { id, type, message };
    get().addToast(item);
    setTimeout(() => get().removeToast(id), ms);
  },
  theme: 'system',
  setTheme: async (t: Theme) => {
    try {
      await idbSet('theme', t);
    } catch (err) {
      // ignore persistence errors
    }
    set({ theme: t });
    applyThemeToDocument(t);
  },
  initTheme: async () => {
    try {
      const saved = (await idbGet('theme')) as Theme | undefined;
      const initial: Theme = saved ?? 'system';
      set({ theme: initial });
      applyThemeToDocument(initial);
      // listen to system changes
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
          const current = useUiStore.getState().theme;
          if (current === 'system') applyThemeToDocument('system');
        };
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else mq.addListener(handler as any);
      }
    } catch (err) {
      // fallback: ensure document has sensible class
      try {
        applyThemeToDocument('system');
      } catch {}
    }
  },
}));

export const showToast = (type: ToastType, message: string, ms?: number) => {
  try {
    const s = useUiStore.getState();
    s.showToast(type, message, ms);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(`[Toast] ${type}: ${message}`);
  }
};

export default useUiStore;
