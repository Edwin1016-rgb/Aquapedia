import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo, useRef } from 'react';
import L from 'leaflet';
import { fetchStores, suggestStore } from '../services/storeService';
import useGeolocation from '../hooks/useGeolocation';
import type { AquaStore } from '../types';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const storeIcon = L.divIcon({
  className: 'custom-store-icon',
  html: '<i class="fa-solid fa-store text-emerald-600 text-xl"></i>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const osmIcon = L.divIcon({
  className: 'custom-osm-icon',
  html: '<i class="fa-solid fa-map-pin text-blue-600 text-xl"></i>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const DEFAULT_CENTER = { lat: 4.5709, lng: -74.2973 };

interface StoreWithSource extends AquaStore {
  source?: string;
}

function MapController({ center, onMapMoved }: { center: { lat: number; lng: number } | null; onMapMoved: (c: { lat: number; lng: number }) => void }) {
  const map = useMap();
  const initRef = useRef(false);
  useEffect(() => {
    if (center && !initRef.current) {
      map.setView([center.lat, center.lng], 13);
      initRef.current = true;
    }
  }, [center, map]);
  useEffect(() => {
    const handler = () => {
      const c = map.getCenter();
      onMapMoved({ lat: c.lat, lng: c.lng });
    };
    map.on('moveend', handler);
    return () => { map.off('moveend', handler); };
  }, [map, onMapMoved]);
  return null;
}

export default function MapPage() {
  const geoOptions = useMemo(() => ({ enableHighAccuracy: true, maximumAge: 10000 }), []);
  const { position } = useGeolocation(geoOptions);
  const [stores, setStores] = useState<StoreWithSource[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  async function loadStores(lat: number, lng: number) {
    setSearching(true);
    try {
      const res = await fetch(`/api/stores/nearby?lat=${lat}&lng=${lng}&radius=10000`);
      if (res.ok) {
        const data = await res.json();
        setStores(data.stores ?? []);
      } else {
        const db = await fetchStores();
        setStores(db.map(s => ({ ...s, source: 'db' })));
      }
    } catch {
      const db = await fetchStores();
      setStores(db.map(s => ({ ...s, source: 'db' })));
    } finally {
      setSearching(false);
    }
  }

  useEffect(() => {
    if (!position) return;
    loadStores(position.lat, position.lng);
  }, [position]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=co`
      );
      const geoData = await geo.json();
      if (geoData.length > 0) {
        const c = { lat: parseFloat(geoData[0].lat), lng: parseFloat(geoData[0].lon) };
        setMapCenter(c);
        await loadStores(c.lat, c.lng);
      } else {
        setSearching(false);
      }
    } catch {
      setSearching(false);
    }
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Mapa de tiendas</h1>

      <form onSubmit={handleSearch} className="mb-3 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar ciudad (ej. Tunja, Medellín...)"
          className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm"
        />
        <button type="submit" disabled={searching} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-50">
          {searching ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-search"></i>}
        </button>
      </form>

    <div className="h-[65vh] w-full relative overflow-hidden rounded-xl" style={{ isolation: 'isolate' }}>
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <MapContainer
          center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
          zoom={5}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter ?? position} onMapMoved={(c) => setMapCenter(c)} />

          {position && (
            <Marker position={[position.lat, position.lng]}>
              <Popup>Estás aquí</Popup>
            </Marker>
          )}

          {stores.map((st) => (
            <Marker key={st.id} position={[st.lat, st.lng]} icon={st.source === 'openstreetmap' ? osmIcon : storeIcon}>
              <Popup>
                <div className="min-w-[180px]">
                  <strong className="text-gray-900">{st.name}</strong>
                  <div className="text-xs text-gray-500 mt-1">
                    <i className={`fa-solid ${st.source === 'openstreetmap' ? 'fa-map-pin' : 'fa-store'} mr-1`}></i>
                    {st.source === 'openstreetmap' ? 'OpenStreetMap' : 'Añadida por usuario'}
                  </div>
                  {st.address && <div className="text-sm text-gray-700 mt-1"><i className="fa-solid fa-location-dot mr-1 text-gray-400"></i>{st.address}</div>}
                  {st.phone && <div className="text-sm text-gray-700"><i className="fa-solid fa-phone mr-1 text-gray-400"></i>{st.phone}</div>}
                  {st.schedule && <div className="text-sm text-gray-700"><i className="fa-regular fa-clock mr-1 text-gray-400"></i>{st.schedule}</div>}
                  {st.website && (
                    <a href={st.website} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 underline block mt-1">
                      <i className="fa-solid fa-globe mr-1"></i>{st.website}
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="absolute inset-0 pointer-events-none z-[9999]">
        {searching && (
          <div className="flex justify-center mt-4 pointer-events-auto">
            <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-lg text-sm text-gray-600 dark:text-gray-300 inline-flex items-center">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>Buscando tiendas cercanas...
            </div>
          </div>
        )}

        <div className="absolute right-4 bottom-4 pointer-events-auto">
          <details className="group relative">
            <summary className="bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-lg cursor-pointer hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-medium">
              <i className="fa-solid fa-plus"></i>
              <span>Sugerir tienda</span>
            </summary>
            <div className="absolute bottom-full right-0 mb-2">
              <form className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg w-80 border dark:border-slate-700" onSubmit={async (e) => {
                e.preventDefault();
                const formEl = e.currentTarget;
                const el = formEl.elements as unknown as Record<string, HTMLInputElement>;
                const data: { name: string; address?: string; phone?: string; website?: string } = {
                  name: el.name.value,
                  address: el.address?.value ?? '',
                  phone: el.phone?.value ?? '',
                  website: el.website?.value ?? '',
                };
                const lat = position?.lat ?? DEFAULT_CENTER.lat;
                const lng = position?.lng ?? DEFAULT_CENTER.lng;
                try {
                  await suggestStore({ ...data, lat, lng, type: 'tienda' } as any);
                  const s = await fetchStores();
                  setStores(s.map(store => ({ ...store, source: 'db' })));
                  (formEl.closest('details') as HTMLDetailsElement).open = false;
                  alert('Gracias — tu sugerencia fue enviada.');
                } catch {
                  alert('No se pudo enviar la sugerencia. Intenta más tarde.');
                }
              }}>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Nueva tienda</h4>
                <div className="mb-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Nombre*</label>
                  <input name="name" required className="w-full border dark:border-slate-600 px-3 py-2 rounded-lg mt-1 dark:bg-slate-700 text-sm" />
                </div>
                <div className="mb-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Dirección</label>
                  <input name="address" className="w-full border dark:border-slate-600 px-3 py-2 rounded-lg mt-1 dark:bg-slate-700 text-sm" />
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Teléfono</label>
                    <input name="phone" className="w-full border dark:border-slate-600 px-3 py-2 rounded-lg mt-1 dark:bg-slate-700 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Web</label>
                    <input name="website" className="w-full border dark:border-slate-600 px-3 py-2 rounded-lg mt-1 dark:bg-slate-700 text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors">Enviar</button>
                </div>
              </form>
            </div>
          </details>
        </div>
      </div>
    </div>
    </div>
  );
}