import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCollectionStore } from '../store/collectionStore';
import type { Fish } from '../types';
import FishCard from '../components/cards/FishCard';
import { useCamera } from '../hooks/useCamera';
import { showToast } from '../store/uiStore';

export default function Collection() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const load = useCollectionStore((s) => s.load);
  const items = useCollectionStore((s) => s.items);
  const remove = useCollectionStore((s) => s.remove);
  const toggleFavorite = useCollectionStore((s) => s.toggleFavorite);
  const updatePhoto = useCollectionStore((s) => s.updatePhoto);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const camera = useCamera();

  useEffect(() => {
    if (user) load(user.id).catch(() => {});
  }, [user]);

  async function handleCamera(cardId: string) {
    const file = await camera.open();
    if (!file || !user) return;
    setUploadingCardId(cardId);
    try {
      const url = await camera.upload(user.id, file);
      await updatePhoto(cardId, url);
      showToast('success', 'Foto actualizada');
    } catch {
      showToast('error', 'No se pudo subir la foto');
    } finally {
      setUploadingCardId(null);
    }
  }

  if (!user) return <main className="p-4 text-gray-700 dark:text-gray-300">Por favor inicia sesión para ver tu colección.</main>;

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mi Colección</h1>

      {items.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No tienes cartas en tu colección. Explora el <button onClick={() => navigate('/catalog')} className="text-emerald-600 underline">catálogo</button> para agregar peces.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((c) => {
            const f = c.fish;
            const fishData = f ?? { id: c.fishId, commonName: 'Pez', scientificName: '', family: '', description: '', imageUrl: c.userPhoto ?? '', communityPhotos: [], tempMin: 0, tempMax: 0, phMin: 0, phMax: 0, hardnessMin: 0, hardnessMax: 0, sizeAdultCm: 0, lifespan: '', diet: 'omnivoro', temperament: 'pacifico', tankLevelMin: 0, difficultyLevel: 1, rarity: 'comun', compatibleWith: [], incompatibleWith: [], careNotes: '', tags: [], createdAt: '', updatedAt: '' } as Fish;
            return (
              <div key={c.id} className="relative">
                <div onClick={() => navigate(`/fish/${c.fishId}`)}>
                  <FishCard fish={fishData} />
                </div>
                <div className="mt-2 flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(c.id, !c.isFavorite); }} className={`px-2 py-1 border border-gray-200 dark:border-slate-600 rounded-md ${c.isFavorite ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    <i className={`fa-solid ${c.isFavorite ? 'fa-star' : 'fa-regular fa-star'}`}></i>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCamera(c.id); }}
                    disabled={uploadingCardId === c.id}
                    className="px-2 py-1 border border-gray-200 dark:border-slate-600 rounded-md text-indigo-600 dark:text-indigo-400 disabled:opacity-50"
                    title="Agregar foto de tu pez"
                  >
                    <i className={`fa-solid ${uploadingCardId === c.id ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); remove(c.id); }} className="px-2 py-1 border border-gray-200 dark:border-slate-600 rounded-md text-red-600 dark:text-red-400"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}