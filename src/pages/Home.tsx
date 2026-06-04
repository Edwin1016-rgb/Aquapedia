import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFishList } from '../services/fishService';
import type { Fish } from '../types';

export default function Home() {
  const [featured, setFeatured] = useState<Fish[]>([]);

  useEffect(() => {
    fetchFishList().then((list) => {
      const shuffled = [...list].sort(() => Math.random() - 0.5);
      setFeatured(shuffled.slice(0, 3));
    }).catch(() => {});
  }, []);

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <section className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-4">
          <i className="fa-solid fa-fish text-3xl text-emerald-700 dark:text-emerald-300"></i>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AquaPedia</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Enciclopedia interactiva de peces de acuario. Descubre, colecciona y aprende.
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link to="/catalog" className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
          <i className="fa-solid fa-book text-xl text-emerald-600 mb-1"></i>
          <div className="font-semibold text-gray-900 dark:text-white text-sm">Catálogo</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Explorar especies</div>
        </Link>
        <Link to="/map" className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
          <i className="fa-solid fa-map text-xl text-emerald-600 mb-1"></i>
          <div className="font-semibold text-gray-900 dark:text-white text-sm">Mapa</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tiendas cercanas</div>
        </Link>
        <Link to="/collection" className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
          <i className="fa-solid fa-trophy text-xl text-emerald-600 mb-1"></i>
          <div className="font-semibold text-gray-900 dark:text-white text-sm">Colección</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tus cartas</div>
        </Link>
        <Link to="/auth" className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
          <i className="fa-solid fa-user text-xl text-emerald-600 mb-1"></i>
          <div className="font-semibold text-gray-900 dark:text-white text-sm">Perfil</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Iniciar sesión</div>
        </Link>
      </section>

      {featured.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Especies destacadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {featured.map((f) => (
              <Link key={f.id} to={`/fish/${f.id}`} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-gray-100 dark:bg-slate-700 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {f.imageUrl ? (
                    <img src={f.imageUrl} alt={f.commonName} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-gray-400 text-xs">No img</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white text-sm truncate">{f.commonName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{f.scientificName}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}