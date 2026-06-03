// Edge function placeholder: send push notifications to saved subscriptions
// Implement using web-push or Supabase's push facilities when deploying to server.

export default async function handler(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    console.log('send-push called with', body);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}
