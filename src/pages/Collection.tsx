import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCollectionStore } from '../store/collectionStore';
import FishCard from '../components/cards/FishCard';

export default function Collection() {
  const user = useAuthStore((s) => s.user);
  const load = useCollectionStore((s) => s.load);
  const items = useCollectionStore((s) => s.items);
  const add = useCollectionStore((s) => s.add);
  const remove = useCollectionStore((s) => s.remove);
  const toggleFavorite = useCollectionStore((s) => s.toggleFavorite);
  const [newFishId, setNewFishId] = useState('');

  useEffect(() => {
    if (user) load(user.id).catch(() => {});
  }, [user]);

  if (!user) return <main className="p-4">Por favor inicia sesión para ver tu colección.</main>;

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mi Colección</h1>

      <form className="mb-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); add(user.id, newFishId); setNewFishId(''); }}>
        <input placeholder="ID del pez (ej: pegar id)" value={newFishId} onChange={(e) => setNewFishId(e.target.value)} className="flex-1 px-3 py-2 border rounded-md" />
        <button className="px-3 py-2 bg-emerald-600 text-white rounded-md">Añadir</button>
      </form>

      {items.length === 0 ? (
        <div className="text-gray-500">No tienes cartas en tu colección.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((c) => (
            <div key={c.id} className="relative">
              <FishCard fish={{ id: c.fishId, commonName: c.fish?.commonName ?? 'Pez', scientificName: c.fish?.scientificName ?? '', family: '', description: '', imageUrl: c.userPhoto ?? '', communityPhotos: [], tempMin: 0, tempMax: 0, phMin: 0, phMax: 0, hardnessMin: 0, hardnessMax: 0, sizeAdultCm: 0, lifespan: '', diet: 'omnivoro', temperament: 'pacifico', tankLevelMin: 0, difficultyLevel: 1, rarity: 'comun', compatibleWith: [], incompatibleWith: [], careNotes: '', tags: [], createdAt: '', updatedAt: '' }} />
              <div className="mt-2 flex gap-2">
                <button onClick={() => toggleFavorite(c.id, !c.isFavorite)} className="px-2 py-1 border rounded-md">{c.isFavorite ? '★' : '☆'}</button>
                <button onClick={() => remove(c.id)} className="px-2 py-1 border rounded-md">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
