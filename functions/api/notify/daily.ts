import type { PushSub } from '../../utils/webpush';
import { sendWebPushAll } from '../../utils/webpush';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  try {
    const [subsRes, fishRes] = await Promise.all([
      fetch(`${env.SUPABASE_URL}/rest/v1/push_subscriptions?select=endpoint,p256dh,auth`, {
        headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
      }),
      fetch(`${env.SUPABASE_URL}/rest/v1/fish?select=id,common_name,image_url`, {
        headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
      }),
    ]);

    if (!subsRes.ok || !fishRes.ok) return new Response('Failed to fetch data', { status: 500 });

    const subs: PushSub[] = await subsRes.json();
    const allFish: { id: string; common_name: string; image_url: string }[] = await fishRes.json();

    if (subs.length === 0) return new Response('No subscriptions', { status: 200 });
    if (allFish.length === 0) return new Response('No fish', { status: 200 });

    const fish = allFish[Math.floor(Math.random() * allFish.length)];

    const payload = JSON.stringify({
      title: 'Pez del dia',
      body: `Hoy te presentamos a ${fish.common_name}`,
      icon: fish.image_url || '/icons/icon-192.png',
      data: { url: `/fish/${fish.id}`, type: 'pez_del_dia' },
    });

    const result = await sendWebPushAll(subs, payload, {
      publicKey: env.VAPID_PUBLIC_KEY,
      privateKey: env.VAPID_PRIVATE_KEY,
      subject: 'mailto:notifications@aquapedia.app',
    });

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
};
