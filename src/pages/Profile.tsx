import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import useAchievementsStore from '../store/achievementsStore';
import { useCollectionStore } from '../store/collectionStore';
import DarkToggle from '../components/ui/DarkToggle';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const badges = useAchievementsStore((s) => s.badges);
  const collection = useCollectionStore((s) => s.items);
  const load = useCollectionStore((s) => s.load);

  useEffect(() => {
    if (user) load(user.id);
  }, [user]);

  if (!user) return <div className="max-w-4xl mx-auto p-6">Por favor inicia sesión para ver tu perfil.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4">
        <img src={user.avatarUrl ?? '/icons/icon-192.png'} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
        <div>
          <h2 className="text-2xl font-semibold">{user.username ?? user.email}</h2>
          <p className="text-sm text-gray-500">Miembro desde {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto">
          <DarkToggle />
        </div>
      </div>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <div className="text-sm text-gray-500">Cartas</div>
          <div className="text-2xl font-bold">{collection.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <div className="text-sm text-gray-500">Logros</div>
          <div className="text-2xl font-bold">{badges.length}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <div className="text-sm text-gray-500">Progreso</div>
          <div className="text-2xl font-bold">{Math.round((collection.length / 50) * 100)}%</div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-semibold">Insignias</h3>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.length === 0 ? (
            <div className="col-span-full text-sm text-gray-500">Aún no tienes insignias. Añade cartas para desbloquear logros.</div>
          ) : (
            badges.map((b) => (
              <div key={b.id} className="p-3 bg-white dark:bg-slate-800 rounded shadow flex items-center space-x-3">
                <img src={b.iconUrl ?? '/icons/icon-96.png'} alt={b.name} className="w-10 h-10" />
                <div>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-gray-500">{b.unlockedAt ? new Date(b.unlockedAt).toLocaleDateString() : ''}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="mt-6 flex space-x-3">
        <button
          className="px-4 py-2 rounded bg-red-600 text-white"
          onClick={() => signOut()}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
