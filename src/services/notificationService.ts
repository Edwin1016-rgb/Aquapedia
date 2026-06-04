export async function sendNotification(options: {
  userId: string;
  title: string;
  body?: string;
  icon?: string;
  url?: string;
}) {
  const resp = await fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  if (!resp.ok) throw new Error('Failed to send notification');
  return resp.json() as Promise<{ sent: number; total: number }>;
}

export async function notifyAll(options: {
  title: string;
  body?: string;
  icon?: string;
  url?: string;
}) {
  const resp = await fetch('/api/notify/all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  if (!resp.ok) throw new Error('Failed to broadcast notification');
  return resp.json() as Promise<{ sent: number; total: number }>;
}
