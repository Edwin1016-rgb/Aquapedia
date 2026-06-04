import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCollectionStore } from '../store/collectionStore';
import FishCard from '../components/cards/FishCard';
import { useCamera } from '../hooks/useCamera';
import { showToast } from '../store/uiStore';

export default function Collection() {
  const user = useAuthStore((s) => s.user);
  const load = useCollectionStore((s) => s.load);
  const items = useCollectionStore((s) => s.items);
  const add = useCollectionStore((s) => s.add);
  const remove = useCollectionStore((s) => s.remove);
  const toggleFavorite = useCollectionStore((s) => s.toggleFavorite);
  const [newFishId, setNewFishId] = useState('');
  const [uploading, setUploading] = useState(false);
  const camera = useCamera();

  useEffect(() => {
    if (user) load(user.id).catch(() => {});
  }, [user]);

  if (!user) return <main className="p-4 text-gray-700 dark:text-gray-300">Por favor inicia sesión para ver tu colección.</main>;

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mi Colección</h1>

      <form className="mb-4 flex gap-2" onSubmit={async (e) => {
        e.preventDefault();
        if (!newFishId.trim()) return;
        try {
          await add(user.id, newFishId.trim());
          showToast('success', 'Carta agregada a la colección');
          setNewFishId('');
        } catch {
          showToast('error', 'No se pudo agregar la carta');
        }
      }}>
        <input
          placeholder="ID del pez"
          value={newFishId}
          onChange={(e) => setNewFishId(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
        />
        <button type="submit" className="px-3 py-2 bg-emerald-600 text-white rounded-md shrink-0">Añadir</button>
        <button
          type="button"
          disabled={uploading}
          onClick={async () => {
            const file = await camera.open();
            if (!file) return;
            setUploading(true);
            try {
              await camera.upload(user.id, file);
              showToast('success', 'Foto subida. Agrega el ID del pez para asociarla.');
            } catch {
              showToast('error', 'No se pudo subir la foto');
            } finally {
              setUploading(false);
            }
          }}
          className="px-3 py-2 bg-indigo-600 text-white rounded-md shrink-0 disabled:opacity-50"
        >
          {uploading ? '...' : <i className="fa-solid fa-camera"></i>}
        </button>
      </form>

      {items.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No tienes cartas en tu colección.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((c) => (
            <div key={c.id} className="relative">
              <FishCard fish={{ id: c.fishId, commonName: c.fish?.commonName ?? 'Pez', scientificName: c.fish?.scientificName ?? '', family: '', description: '', imageUrl: c.userPhoto ?? c.fish?.imageUrl ?? '', communityPhotos: [], tempMin: 0, tempMax: 0, phMin: 0, phMax: 0, hardnessMin: 0, hardnessMax: 0, sizeAdultCm: 0, lifespan: '', diet: 'omnivoro', temperament: 'pacifico', tankLevelMin: 0, difficultyLevel: 1, rarity: 'comun', compatibleWith: [], incompatibleWith: [], careNotes: '', tags: [], createdAt: '', updatedAt: '' }} />
              <div className="mt-2 flex gap-2">
                <button onClick={() => toggleFavorite(c.id, !c.isFavorite)} className="px-2 py-1 border border-gray-200 dark:border-slate-600 rounded-md text-gray-700 dark:text-gray-300">{c.isFavorite ? '★' : '☆'}</button>
                <button onClick={() => remove(c.id)} className="px-2 py-1 border border-gray-200 dark:border-slate-600 rounded-md text-gray-700 dark:text-gray-300">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}