import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Fish } from '../types';
import { getFishById } from '../services/fishService';
import { useCamera } from '../hooks/useCamera';
import { useAuthStore } from '../store/authStore';
import { useCollectionStore } from '../store/collectionStore';
import { showToast } from '../store/uiStore';
import { saveCardPhoto } from '../services/cardPhotoService';
import { rarityClass } from '../utils/rarity';

const rarityLabels: Record<string, string> = {
  comun: 'Común',
  poco_comun: 'Poco común',
  raro: 'Raro',
  epico: 'Épico',
};

const dietLabels: Record<string, string> = {
  omnivoro: 'Omnívoro',
  carnivoro: 'Carnívoro',
  herbivoro: 'Herbívoro',
};

const temperamentLabels: Record<string, string> = {
  pacifico: 'Pacífico',
  semiagressivo: 'Semiagresivo',
  agresivo: 'Agresivo',
};

export default function FishDetail() {
  const { id } = useParams();
  const [fish, setFish] = useState<Fish | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const camera = useCamera();
  const user = useAuthStore((s) => s.user);
  const addToCollection = useCollectionStore((s) => s.add);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getFishById(id)
      .then((f) => {
        setFish(f ?? null);
        setSelectedPhoto(f?.imageUrl ?? null);
        setPhotoIndex(0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const allPhotos = fish
    ? [fish.imageUrl, ...(fish.communityPhotos ?? [])].filter(Boolean)
    : [];

  function changePhoto(dir: number) {
    if (allPhotos.length <= 1) return;
    const next = (photoIndex + dir + allPhotos.length) % allPhotos.length;
    setPhotoIndex(next);
    setSelectedPhoto(allPhotos[next]);
  }

  async function handleShare() {
    if (!fish) return;
    const shareData = {
      title: fish.commonName,
      text: `${fish.commonName} — ${fish.scientificName}`,
      url: `${location.origin}/fish/${fish.id}`,
    };
    try {
      if ((navigator as any).share) {
        await (navigator as any).share(shareData);
        setMessage('Compartido correctamente');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        setMessage('Enlace copiado al portapapeles');
      } else {
        setMessage('Tu navegador no soporta compartir. Copia manualmente la URL.');
      }
    } catch {
      setMessage('No se pudo compartir.');
    }
    setTimeout(() => setMessage(''), 2500);
  }

  function barPercent(value: number, min: number, max: number) {
    if (max <= min) return 0;
    return Math.round(((value - min) / (max - min)) * 100);
  }

  if (loading) return <main className="p-4 text-gray-700 dark:text-gray-300">Cargando...</main>;
  if (!fish) return <main className="p-4 text-gray-700 dark:text-gray-300">Especie no encontrada.</main>;

  const rarity = rarityClass(fish.rarity);
  const tags = fish.tags ?? [];
  const compat = fish.compatibleWith ?? [];
  const incompat = fish.incompatibleWith ?? [];
  const tempMid = (fish.tempMin + fish.tempMax) / 2;
  const phMid = (fish.phMin + fish.phMax) / 2;

  return (
    <main className="p-4 max-w-4xl mx-auto">
      {/* Header con galería */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Galería de imágenes */}
        <div className="md:w-5/12">
          <div className="relative bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden h-72 flex items-center justify-center group">
            {selectedPhoto ? (
              <img src={selectedPhoto} alt={fish.commonName} className="object-contain w-full h-full" />
            ) : (
              <div className="text-gray-400 dark:text-gray-500"><i className="fa-solid fa-fish text-4xl"></i></div>
            )}
            {allPhotos.length > 1 && (
              <>
                <button onClick={() => changePhoto(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-chevron-left text-sm"></i></button>
                <button onClick={() => changePhoto(1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa-solid fa-chevron-right text-sm"></i></button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allPhotos.map((_, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${i === photoIndex ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info principal */}
        <div className="md:w-7/12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{fish.commonName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">{fish.scientificName}</p>

          {/* Rango de rareza */}
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${rarity.bg} ${rarity.text}`}>{rarityLabels[fish.rarity] ?? fish.rarity}</span>
          </div>

          <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">{fish.description}</p>

          {/* Píldoras rápidas */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-utensils text-emerald-500"></i> {dietLabels[fish.diet] ?? fish.diet}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
              <i className={`fa-solid fa-face-${fish.temperament === 'agresivo' ? 'angry' : fish.temperament === 'semiagressivo' ? 'meh' : 'smile'} ${fish.temperament === 'agresivo' ? 'text-red-500' : fish.temperament === 'semiagressivo' ? 'text-yellow-500' : 'text-emerald-500'}`}></i> {temperamentLabels[fish.temperament] ?? fish.temperament}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-sitemap text-indigo-500"></i> {fish.family}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-signal text-orange-500"></i> Nivel {fish.difficultyLevel}/5
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-clock text-blue-500"></i> {fish.lifespan}
            </span>
          </div>

          {/* Acciones */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button onClick={handleShare} className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm"><i className="fa-solid fa-share-nodes"></i> Compartir</button>
            <button onClick={() => navigator.clipboard?.writeText(`${location.origin}/fish/${fish.id}`)} className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-slate-600 rounded-md text-sm text-gray-700 dark:text-gray-300"><i className="fa-solid fa-link"></i> Copiar enlace</button>
            {user && (
              <button
                disabled={uploading}
                onClick={async () => {
                  const file = await camera.open();
                  if (!file) return;
                  setUploading(true);
                  try {
                    const card = await addToCollection(user.id, fish.id);
                    const url = await saveCardPhoto(card.id, file);
                    setSelectedPhoto(url);
                    showToast('success', 'Foto agregada a tu colección');
                  } catch {
                    showToast('error', 'No se pudo agregar la foto');
                  } finally {
                    setUploading(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm disabled:opacity-50"
              >
                <i className="fa-solid fa-camera"></i> {uploading ? 'Guardando...' : 'Subir foto'}
              </button>
            )}
            {message && <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">{message}</span>}
          </div>
        </div>
      </div>

      {/* Parámetros del agua */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i className="fa-solid fa-droplet text-blue-500 mr-2"></i>Parámetros del agua</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400"><i className="fa-solid fa-temperature-high mr-1 text-red-400"></i>Temperatura</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{fish.tempMin} – {fish.tempMax} °C</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-1">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 to-red-400" style={{ width: `${barPercent(tempMid, 15, 32)}%` }} />
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400"><i className="fa-solid fa-flask mr-1 text-purple-400"></i>pH</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{fish.phMin} – {fish.phMax}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-1">
              <div className="h-2 rounded-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-blue-500" style={{ width: `${barPercent(phMid, 5, 9)}%` }} />
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400"><i className="fa-solid fa-weight-scale mr-1 text-amber-400"></i>Dureza (GH)</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{fish.hardnessMin} – {fish.hardnessMax}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-1">
              <div className="h-2 rounded-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600" style={{ width: `${barPercent((fish.hardnessMin + fish.hardnessMax) / 2, 0, 30)}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Características físicas */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i className="fa-solid fa-ruler text-indigo-500 mr-2"></i>Características</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400"><i className="fa-solid fa-ruler-combined mr-1 text-indigo-400"></i>Tamaño adulto</span>
            <span className="font-medium text-gray-900 dark:text-white">{fish.sizeAdultCm} cm</span>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400"><i className="fa-solid fa-fish-tank mr-1 text-cyan-400"></i>Acuario mínimo</span>
            <span className="font-medium text-gray-900 dark:text-white">{fish.tankLevelMin} L</span>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400"><i className="fa-solid fa-clock mr-1 text-blue-400"></i>Esperanza de vida</span>
            <span className="font-medium text-gray-900 dark:text-white">{fish.lifespan}</span>
          </div>
        </div>
      </section>

      {/* Compatibilidad */}
      {(compat.length > 0 || incompat.length > 0) && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i className="fa-solid fa-heart-circle-check text-emerald-500 mr-2"></i>Compatibilidad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {compat.length > 0 && (
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2"><i className="fa-solid fa-circle-check text-emerald-500 mr-1"></i>Compatible con</p>
                <div className="flex flex-wrap gap-1.5">
                  {compat.map((name) => (
                    <span key={name} className="px-2.5 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">{name}</span>
                  ))}
                </div>
              </div>
            )}
            {incompat.length > 0 && (
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2"><i className="fa-solid fa-circle-xmark text-red-500 mr-1"></i>Incompatible con</p>
                <div className="flex flex-wrap gap-1.5">
                  {incompat.map((name) => (
                    <span key={name} className="px-2.5 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">{name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Notas de cuidado */}
      {fish.careNotes && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i className="fa-solid fa-circle-info text-sky-500 mr-2"></i>Cuidados</h2>
          <div className="p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-100 dark:border-sky-800/40 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {fish.careNotes}
          </div>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4"><i className="fa-solid fa-tags text-gray-500 mr-2"></i>Etiquetas</h2>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400">{tag}</span>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
