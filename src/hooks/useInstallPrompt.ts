import { useEffect, useState, useCallback } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setSupported(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const prompt = useCallback(async () => {
    if (!deferredPrompt) return { outcome: 'unsupported' } as const;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      return choice;
    } catch (e) {
      return { outcome: 'dismissed', platform: 'unknown' } as const;
    }
  }, [deferredPrompt]);

  return { supported, prompt, deferredPrompt } as const;
}
