import { supabase } from './supabase';

function arrayBufferToBase64(buffer: ArrayBuffer | null) {
  if (!buffer) return null;
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function subscribeToPush(userId: string, subscription: PushSubscription) {
  try {
    const p256dh = arrayBufferToBase64(subscription.getKey ? subscription.getKey('p256dh') : null);
    const auth = arrayBufferToBase64(subscription.getKey ? subscription.getKey('auth') : null);

    const payload = {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh,
      auth,
    } as any;

    // upsert by endpoint to avoid duplicates
    const { error } = await supabase.from('push_subscriptions').upsert(payload, { onConflict: 'endpoint' });
    if (error) throw error;
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('subscribeToPush', err);
    return false;
  }
}

export async function unsubscribePush(endpoint: string) {
  try {
    const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
    if (error) throw error;
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('unsubscribePush', err);
    return false;
  }
}

export default { subscribeToPush, unsubscribePush };
