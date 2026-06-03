import { useCallback } from 'react';
import { subscribeToPush, unsubscribePush } from '../services/pushService';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const register = useCallback(async (userId: string) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notifications no soportadas en este navegador');
    }

    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) {
      await subscribeToPush(userId, existing);
      return existing;
    }

    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    await subscribeToPush(userId, sub);
    return sub;
  }, []);

  const unregister = useCallback(async (endpoint: string) => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub && sub.endpoint === endpoint) await sub.unsubscribe();
    } catch {}
    await unsubscribePush(endpoint);
  }, []);

  return { register, unregister } as const;
}

export default usePushNotifications;
