import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCollectionStore } from '../store/collectionStore';
import type { Fish } from '../types';
import FishCard from '../components/cards/FishCard';
import { useCamera } from '../hooks/useCamera';
import { saveCardPhoto, getCardPhotoUrl, revokeAllCardPhotos } from '../services/cardPhotoService';
import { showToast } from '../store/uiStore';
import { checkCompatibility, type CompatibilityLevel } from '../utils/compatibility';

export default function Collection() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const load = useCollectionStore((s) => s.load);
  const items = useCollectionStore((s) => s.items);
  const remove = useCollectionStore((s) => s.remove);
  const toggleFavorite = useCollectionStore((s) => s.toggleFavorite);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [compatResults, setCompatResults] = useState<Record<string, CompatibilityLevel | null>>({});
  const camera = useCamera();

  useEffect(() => {
    if (user) load(user.id).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!items.length) return;
    let mounted = true;
    (async () => {
      const entries: Record<string, string> = {};
      for (const c of items) {
        const url = await getCardPhotoUrl(c.id);
        if (url && mounted) entries[c.id] = url;
      }
      if (mounted) setPhotoUrls(entries);
    })();
    return () => { mounted = false; revokeAllCardPhotos(); };
  }, [items]);

  function checkCompatibilityForCard(cardId: string, fish: Fish) {
    let worst: CompatibilityLevel = 'compatible';
    for (const other of items) {
      if (other.id === cardId || !other.fish) continue;
      const result = checkCompatibility(fish, { otherTemperament: other.fish.temperament });
      if (result.level === 'incompatible') { worst = 'incompatible'; break; }
      if (result.level === 'caution') worst = 'caution';
    }
    setCompatResults((prev) => ({ ...prev, [cardId]: worst }));
  }

  async function handleCamera(cardId: string) {
    const file = await camera.open();
    if (!file) return;
    setUploadingCardId(cardId);
    try {
      const url = await saveCardPhoto(cardId, file);
      setPhotoUrls((prev) => ({ ...prev, [cardId]: url }));
      showToast('success', 'Foto guardada');
    } catch {
      showToast('error', 'No se pudo guardar la foto');
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
            const localPhoto = photoUrls[c.id];
            const userPhoto = localPhoto ?? c.userPhoto;
            const fishData = f ?? { id: c.fishId, commonName: 'Pez', scientificName: '', family: '', description: '', imageUrl: '', communityPhotos: [], tempMin: 0, tempMax: 0, phMin: 0, phMax: 0, hardnessMin: 0, hardnessMax: 0, sizeAdultCm: 0, lifespan: '', diet: 'omnivoro', temperament: 'pacifico', tankLevelMin: 0, difficultyLevel: 1, rarity: 'comun', compatibleWith: [], incompatibleWith: [], careNotes: '', tags: [], createdAt: '', updatedAt: '' } as Fish;
            return (
              <div key={c.id} className="relative">
                <div onClick={() => navigate(`/fish/${c.fishId}`)}>
                  <FishCard fish={fishData} userPhotoUrl={userPhoto} />
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
                  <button
                    onClick={(e) => { e.stopPropagation(); checkCompatibilityForCard(c.id, fishData); }}
                    className={`px-2 py-1 border rounded-md ${
                      compatResults[c.id] === undefined
                        ? 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400'
                        : compatResults[c.id] === 'compatible'
                          ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : compatResults[c.id] === 'caution'
                            ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'border-red-300 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}
                    title="Verificar compatibilidad"
                  >
                    <i className={`fa-solid ${
                      compatResults[c.id] === undefined
                        ? 'fa-flask'
                        : compatResults[c.id] === 'compatible'
                          ? 'fa-circle-check'
                          : compatResults[c.id] === 'caution'
                            ? 'fa-triangle-exclamation'
                            : 'fa-circle-xmark'
                    }`}></i>
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