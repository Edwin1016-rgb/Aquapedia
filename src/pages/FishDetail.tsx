import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Fish } from '../types';
import { getFishById } from '../services/fishService';

export default function FishDetail() {
  const { id } = useParams();
  const [fish, setFish] = useState<Fish | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getFishById(id)
      .then((f) => {
        setFish(f ?? null);
        setSelectedPhoto(f?.imageUrl ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  function pct(value: number, min: number, max: number) {
    if (max <= min) return 0;
    return Math.round(((value - min) / (max - min)) * 100);
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
    } catch (e) {
      setMessage('No se pudo compartir.');
    }

    setTimeout(() => setMessage(''), 2500);
  }

  if (loading) return <main className="p-4">Cargando...</main>;
  if (!fish) return <main className="p-4">Especie no encontrada.</main>;

  const tempRangePct = pct(fish.tempMax, fish.tempMin, fish.tempMax);
  const phRangePct = pct(fish.phMax, fish.phMin, fish.phMax);
  const sizePct = Math.min(100, Math.round((fish.sizeAdultCm / 50) * 100));

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
            {selectedPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedPhoto} alt={fish.commonName} className="object-cover w-full h-full" />
            ) : (
              <div className="text-gray-400">Sin imagen</div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {[fish.imageUrl, ...fish.communityPhotos].filter(Boolean).slice(0, 4).map((src) => (
              <button
                key={src}
                onClick={() => setSelectedPhoto(src)}
                className="h-16 bg-gray-50 rounded-md overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="foto comunidad" className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold">{fish.commonName}</h1>
          <p className="text-sm text-gray-500 italic">{fish.scientificName}</p>
          <p className="mt-3 text-gray-700">{fish.description}</p>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Temperatura (°C)</span>
                <span className="text-sm">{fish.tempMin} - {fish.tempMax}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${tempRangePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>pH</span>
                <span className="text-sm">{fish.phMin} - {fish.phMax}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div className="h-3 rounded-full bg-blue-500" style={{ width: `${phRangePct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Tamaño adulto (cm)</span>
                <span className="text-sm">{fish.sizeAdultCm} cm</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div className="h-3 rounded-full bg-indigo-500" style={{ width: `${sizePct}%` }} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button onClick={handleShare} className="px-3 py-2 bg-emerald-600 text-white rounded-md">Compartir</button>
              <button onClick={() => navigator.clipboard?.writeText(`${location.origin}/fish/${fish.id}`)} className="px-3 py-2 border rounded-md">Copiar enlace</button>
              {message && <div className="text-sm text-gray-700">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
