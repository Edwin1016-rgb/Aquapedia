import webpush from 'web-push';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
}

interface SubscriptionRow {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { userId, title, body, icon } = (await request.json()) as {
      userId?: string;
      title?: string;
      body?: string;
      icon?: string;
    };
    if (!userId) return new Response('Missing userId', { status: 400 });

    webpush.setVapidDetails(
      'mailto:notifications@aquapedia.app',
      env.VAPID_PUBLIC_KEY,
      env.VAPID_PRIVATE_KEY,
    );

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

    const subs: SubscriptionRow[] = await res.json();
    if (subs.length === 0) return new Response('No subscriptions', { status: 200 });

    const results = await Promise.allSettled(
      subs.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({ title: title ?? 'AquaPedia', body: body ?? '', icon: icon ?? '/icons/icon-192.png' }),
        ),
      ),
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    return new Response(JSON.stringify({ sent, total: subs.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
};
