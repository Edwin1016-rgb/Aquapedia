import type { PushSub } from '../../utils/webpush';
import { sendWebPushAll } from '../../utils/webpush';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las env vars de Cloudflare' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }
    if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: 'Faltan VAPID_PUBLIC_KEY o VAPID_PRIVATE_KEY en las env vars de Cloudflare' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    const { title, body, icon } = (await request.json()) as {
      title?: string; body?: string; icon?: string;
    };
    if (!title) return new Response('Missing title', { status: 400 });

    const subUrl = `${env.SUPABASE_URL}/rest/v1/push_subscriptions?select=endpoint,p256dh,auth`;
    const res = await fetch(subUrl, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: `Supabase error: ${res.status} ${text}` }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    const subs: PushSub[] = await res.json();
    if (subs.length === 0) return new Response(JSON.stringify({ error: 'No hay suscripciones. El usuario debe activar notificaciones en Profile primero.' }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

    const payload = JSON.stringify({
      title,
      body: body ?? '',
      icon: icon ?? '/icons/icon-192.png',
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
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
