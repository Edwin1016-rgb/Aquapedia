import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import useAchievementsStore from '../store/achievementsStore';
import { useCollectionStore } from '../store/collectionStore';
import { usePushNotifications } from '../hooks/usePushNotifications';
import DarkToggle from '../components/ui/DarkToggle';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const badges = useAchievementsStore((s) => s.badges);
  const collection = useCollectionStore((s) => s.items);
  const load = useCollectionStore((s) => s.load);
  const { register, unregister } = usePushNotifications();

  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushEndpoint, setPushEndpoint] = useState('');
  const [pushMsg, setPushMsg] = useState('');

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setPushSupported(supported);
    if (supported && user) {
      navigator.serviceWorker.ready.then((reg) =>
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) {
            setPushEnabled(true);
            setPushEndpoint(sub.endpoint);
          }
        }),
      );
    }
  }, [user]);

  useEffect(() => {
    if (user) load(user.id);
  }, [user]);

  async function togglePush(enable: boolean) {
    setPushMsg('');
    if (!user) return;
    if (enable) {
      try {
        const sub = await register(user.id);
        if (sub) {
          setPushEnabled(true);
          setPushEndpoint(sub.endpoint);
        }
      } catch (err) {
        setPushMsg((err as Error).message || 'No se pudo activar. Revisa permisos del navegador.');
      }
    } else {
      await unregister(pushEndpoint);
      setPushEnabled(false);
      setPushEndpoint('');
    }
  }

  if (!user) return <div className="max-w-4xl mx-auto p-6 text-gray-700 dark:text-gray-300">Por favor inicia sesión para ver tu perfil.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4">
        <img src={user.avatarUrl ?? '/icons/icon-192.png'} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.username ?? user.email}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Miembro desde {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto">
          <DarkToggle />
        </div>
      </div>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Cartas</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{collection.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Logros</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{badges.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Progreso</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round((collection.length / 50) * 100)}%</div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insignias</h3>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.length === 0 ? (
            <div className="col-span-full text-sm text-gray-500 dark:text-gray-400">Aún no tienes insignias. Añade cartas para desbloquear logros.</div>
          ) : (
            badges.map((b) => (
              <div key={b.id} className="p-3 bg-white dark:bg-slate-800 rounded shadow flex items-center space-x-3">
                <img src={b.iconUrl ?? '/icons/icon-96.png'} alt={b.name} className="w-10 h-10" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{b.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{b.unlockedAt ? new Date(b.unlockedAt).toLocaleDateString() : ''}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {pushSupported && (
        <section className="mt-6 p-4 bg-white dark:bg-slate-800 rounded shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {pushEnabled ? 'Activadas' : 'Recibe alertas de nuevas especies y logros'}
              </p>
            </div>
            <button
              onClick={() => togglePush(!pushEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${pushEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-600'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${pushEnabled ? 'translate-x-6' : ''}`} />
            </button>
          </div>
          {pushMsg && <p className="mt-2 text-sm text-red-500">{pushMsg}</p>}
        </section>
      )}

      <div className="mt-6 flex space-x-3">
        <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={() => signOut()}>Cerrar sesión</button>
      </div>
    </div>
  );
}