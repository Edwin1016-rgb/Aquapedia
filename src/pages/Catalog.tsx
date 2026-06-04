import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import type { Fish } from '../types';
import { fetchFishList } from '../services/fishService';
import FishCard from '../components/cards/FishCard';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCollectionStore } from '../store/collectionStore';
import { showToast } from '../store/uiStore';
import { rarityClass } from '../utils/rarity';

function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return mobile;
}

function SwipeCard({ fish, onLike, onPass, onInfo }: {
  fish: Fish;
  onLike: () => void;
  onPass: () => void;
  onInfo: () => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const rarity = rarityClass(fish.rarity);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX.current;
    setOffsetX(dx);
    setRotation(dx * 0.1);
  }, [isDragging]);

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (offsetX > 100) {
      onLike();
    } else if (offsetX < -100) {
      onPass();
    }
    setOffsetX(0);
    setRotation(0);
  }, [offsetX, onLike, onPass]);

  const opacity = Math.max(0, 1 - Math.abs(offsetX) / 400);

  return (
    <div
      className="relative w-full max-w-sm mx-auto select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-200 border-l-4 ${rarity.border}`}
        style={{
          transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
          opacity,
        }}
      >
        <div className={`h-2 ${rarity.accent}`} />
        <div className="h-64 bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
          {fish.imageUrl ? (
            <img src={fish.imageUrl} alt={fish.commonName} className="object-cover w-full h-full" />
          ) : (
            <div className="text-gray-400 dark:text-gray-500">Sin imagen</div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${rarity.epic ? 'rarity-epic' : ''}`}>{fish.commonName}</h2>
            <span className={`px-2 py-0.5 text-xs rounded-full ${rarity.bg} ${rarity.text} shrink-0`}>{rarity.label}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">{fish.scientificName}</p>
          <div className="mt-2 flex gap-2 flex-wrap">
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">{fish.diet}</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">{fish.temperament}</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">{fish.family}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <button
          onClick={onPass}
          className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900 text-red-600 flex items-center justify-center text-2xl shadow-md"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
        <button
          onClick={onInfo}
          className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center text-2xl shadow-md"
        >
          <i className="fa-solid fa-info text-xl"></i>
        </button>
        <button
          onClick={onLike}
          className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900 text-green-600 flex items-center justify-center text-2xl shadow-md"
        >
          <i className="fa-solid fa-heart text-xl"></i>
        </button>
      </div>
    </div>
  );
}

export default function Catalog() {
  const [query, setQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string | 'all'>('all');
  const [dietFilter, setDietFilter] = useState<string | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [allFish, setAllFish] = useState<Fish[]>([]);
  const [visibleCount, setVisibleCount] = useState(24);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const addToCollection = useCollectionStore((s) => s.add);
  const isMobile = useIsMobile();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchFishList()
      .then((list) => {
        if (!mounted) return;
        setAllFish(list);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    setSwipeIndex(0);
  }, [query, rarityFilter, dietFilter]);

  const fish = useMemo(() => {
    let filtered = allFish;
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.commonName.toLowerCase().includes(q) ||
          f.scientificName.toLowerCase().includes(q),
      );
    }
    if (rarityFilter !== 'all') filtered = filtered.filter((f) => f.rarity === rarityFilter);
    if (dietFilter !== 'all') filtered = filtered.filter((f) => f.diet === dietFilter);
    return filtered;
  }, [allFish, query, rarityFilter, dietFilter]);

  const handleLike = useCallback(async (f: Fish) => {
    if (user) {
      try {
        await addToCollection(user.id, f.id);
      } catch { /* fallback offline */ }
    }
    setSwipeIndex((i) => i + 1);
  }, [user, addToCollection]);

  const handlePass = useCallback(() => {
    setSwipeIndex((i) => i + 1);
  }, []);

  if (isMobile) {
    return (
      <main className="p-4">
        <header className="max-w-4xl mx-auto mb-4">
          <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Catálogo</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="sm:col-span-2">
              <Input value={query} onChange={setQuery} placeholder="Buscar por nombre común o científico" />
            </div>
            <div className="flex gap-2">
              <select value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value)} className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md w-full dark:bg-slate-800 text-gray-900 dark:text-gray-100">
                <option value="all">Todas</option>
                <option value="comun">Común</option>
                <option value="poco_comun">Poco común</option>
                <option value="raro">Raro</option>
                <option value="epico">Épico</option>
              </select>
              <select value={dietFilter} onChange={(e) => setDietFilter(e.target.value)} className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md w-full dark:bg-slate-800 text-gray-900 dark:text-gray-100">
                <option value="all">Todos</option>
                <option value="omnivoro">Omnívoro</option>
                <option value="carnivoro">Carnívoro</option>
                <option value="herbivoro">Herbívoro</option>
              </select>
            </div>
          </div>
        </header>

        <section className="max-w-6xl mx-auto">
          {loading ? (
            <div className="animate-pulse bg-white dark:bg-slate-800 rounded-xl h-96 max-w-sm mx-auto" />
          ) : fish.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">No se encontraron especies.</div>
          ) : swipeIndex >= fish.length ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-16">
              <p className="text-lg text-gray-900 dark:text-white">¡Viste todas las especies!</p>
              <button onClick={() => setSwipeIndex(0)} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">
                Ver de nuevo
              </button>
            </div>
          ) : (
            <SwipeCard
              fish={fish[swipeIndex]}
              onLike={() => handleLike(fish[swipeIndex])}
              onPass={handlePass}
              onInfo={() => navigate(`/fish/${fish[swipeIndex].id}`)}
            />
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="p-4">
      <header className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Catálogo</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="sm:col-span-2">
            <Input value={query} onChange={setQuery} placeholder="Buscar por nombre común o científico" />
          </div>

          <div className="flex gap-2">
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md w-full dark:bg-slate-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Todas las rarezas</option>
              <option value="comun">Común</option>
              <option value="poco_comun">Poco común</option>
              <option value="raro">Raro</option>
              <option value="epico">Épico</option>
            </select>

            <select
              value={dietFilter}
              onChange={(e) => setDietFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md w-full dark:bg-slate-800 text-gray-900 dark:text-gray-100"
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
              <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-lg h-56" />
            ))}
          </div>
        ) : fish.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">No se encontraron especies.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {fish.slice(0, visibleCount).map((f) => (
                <div key={f.id} className="relative group">
                  <div onClick={() => navigate(`/fish/${f.id}`)}>
                    <FishCard fish={f} />
                  </div>
                  {user && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await addToCollection(user.id, f.id);
                          showToast('success', `${f.commonName} añadido a colección`);
                        } catch {
                          showToast('error', 'No se pudo añadir');
                        }
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md text-sm"
                      title="Añadir a colección"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  )}
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