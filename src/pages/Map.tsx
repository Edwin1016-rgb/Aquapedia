import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo } from 'react';
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

function MapCenterUpdater({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 13, { duration: 1.5 });
    }
  }, [map, position]);
  return null;
}

interface StoreWithSource extends AquaStore {
  source?: string;
}

export default function MapPage() {
  const geoOptions = useMemo(() => ({ enableHighAccuracy: true, maximumAge: 10000 }), []);
  const { position } = useGeolocation(geoOptions);
  const [stores, setStores] = useState<StoreWithSource[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setSearching(true);
      try {
        const lat = position?.lat ?? DEFAULT_CENTER.lat;
        const lng = position?.lng ?? DEFAULT_CENTER.lng;
        const res = await fetch(`/api/stores/nearby?lat=${lat}&lng=${lng}&radius=10000`);
        if (res.ok) {
          const data = await res.json();
          if (mounted) setStores(data.stores);
        } else {
          const db = await fetchStores();
          if (mounted) setStores(db.map(s => ({ ...s, source: 'db' })));
        }
      } catch {
        const db = await fetchStores();
        if (mounted) setStores(db.map(s => ({ ...s, source: 'db' })));
      } finally {
        if (mounted) setSearching(false);
      }
    }
    load();
  }, [position]);

  async function fetchNearbyStores(lat: number, lng: number) {
    const apiUrl = `/api/stores/nearby?lat=${lat}&lng=${lng}&radius=10000`;
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.stores?.length) return data.stores;
      }
    } catch {}
    const db = await fetchStores();
    return db.map(s => ({ ...s, source: 'db' }));
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      setSearching(true);
      const lat = position?.lat ?? DEFAULT_CENTER.lat;
      const lng = position?.lng ?? DEFAULT_CENTER.lng;
      const result = await fetchNearbyStores(lat, lng);
      if (mounted) setStores(result);
      if (mounted) setSearching(false);
    }
    load();
  }, [position]);

  return (
    <div className="h-[70vh] w-full relative overflow-hidden" style={{ isolation: 'isolate' }}>
      <div className="absolute inset-0">
        <MapContainer
          center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
          zoom={5}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenterUpdater position={position} />

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
  );
}