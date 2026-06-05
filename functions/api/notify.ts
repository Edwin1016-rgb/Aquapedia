import type { PushSub } from '../utils/webpush';
import { sendWebPush } from '../utils/webpush';

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { userId, title, body, icon } = (await request.json()) as {
      userId?: string; title?: string; body?: string; icon?: string;
    };
    if (!userId) return new Response('Missing userId', { status: 400 });

    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/push_subscriptions?user_id=eq.${userId}&select=endpoint,p256dh,auth`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      },
    );
    if (!res.ok) return new Response('Failed to fetch subscriptions', { status: 500 });

    const subs: PushSub[] = await res.json();
    if (subs.length === 0) return new Response('No subscriptions', { status: 200 });

    const payload = JSON.stringify({
      title: title ?? 'AquaPedia',
      body: body ?? '',
      icon: icon ?? '/icons/icon-192.png',
    });

    const results = await Promise.allSettled(
      subs.map((s) =>
        sendWebPush(s, payload, {
          publicKey: env.VAPID_PUBLIC_KEY,
          privateKey: env.VAPID_PRIVATE_KEY,
          subject: 'mailto:notifications@aquapedia.app',
        }),
      ),
    );

    const sent = results.filter((r) => r.status === 'fulfilled' && r.value.ok).length;
    return new Response(JSON.stringify({ sent, total: subs.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
};
