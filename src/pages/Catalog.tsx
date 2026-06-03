import { useEffect, useState } from 'react';
import type { Fish } from '../types';
import { fetchFishList } from '../services/fishService';
import FishCard from '../components/cards/FishCard';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';

export default function Catalog() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [rarityFilter, setRarityFilter] = useState<string | 'all'>('all');
  const [dietFilter, setDietFilter] = useState<string | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [fish, setFish] = useState<Fish[]>([]);
  const [visibleCount, setVisibleCount] = useState(24);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchFishList()
      .then((list) => {
        if (!mounted) return;
        let filtered = list;
        if (debouncedQuery) {
          const q = debouncedQuery.toLowerCase();
          filtered = filtered.filter(
            (f) =>
              f.commonName.toLowerCase().includes(q) ||
              f.scientificName.toLowerCase().includes(q)
          );
        }
        if (rarityFilter !== 'all') filtered = filtered.filter((f) => f.rarity === rarityFilter);
        if (dietFilter !== 'all') filtered = filtered.filter((f) => f.diet === dietFilter);
        setFish(filtered);
      })
      .catch(() => {
        // fallbacks handled in service
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [debouncedQuery, rarityFilter, dietFilter]);

  return (
    <main className="p-4">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">Catálogo</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="sm:col-span-2">
            <Input value={query} onChange={setQuery} placeholder="Buscar por nombre común o científico" />
          </div>

          <div className="flex gap-2">
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-md w-full"
            >
              <option value="all">Todas las rarezas</option>
              <option value="comun">Común</option>
              <option value="poco_comun">Poco común</option>
              <option value="raro">Raro</option>
              <option value="epico">Épico</option>
            </select>

            <select
              value={dietFilter}
              onChange={(e) => setDietFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-md w-full"
            >
              <option value="all">Todos los dietas</option>
              <option value="omnivoro">Omnívoro</option>
              <option value="carnivoro">Carnívoro</option>
              <option value="herbivoro">Herbívoro</option>
            </select>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg h-56" />
            ))}
          </div>
        ) : fish.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">No se encontraron especies.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {fish.slice(0, visibleCount).map((f) => (
                <div key={f.id} onClick={() => navigate(`/fish/${f.id}`)}>
                  <FishCard fish={f} />
                </div>
              ))}
            </div>

            {visibleCount < fish.length ? (
              <div className="text-center mt-6">
                <button onClick={() => setVisibleCount((v) => v + 24)} className="px-4 py-2 bg-emerald-600 text-white rounded">
                  Cargar más
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
