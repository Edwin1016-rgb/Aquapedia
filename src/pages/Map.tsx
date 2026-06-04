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

const DEFAULT_CENTER = { lat: 19.4326, lng: -99.1332 };

function MapCenterUpdater({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 13, { duration: 1.5 });
    }
  }, [map, position]);
  return null;
}

type SuggestForm = {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
};

export default function MapPage() {
  const geoOptions = useMemo(() => ({ enableHighAccuracy: true, maximumAge: 10000 }), []);
  const { position } = useGeolocation(geoOptions);
  const [stores, setStores] = useState<AquaStore[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchStores().then((s) => {
      if (mounted) setStores(s);
    });
    return () => { mounted = false };
  }, []);

  return (
    <div className="h-[70vh] w-full relative">
      <MapContainer
        center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
        zoom={5}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenterUpdater position={position} />

        {position && (
          <Marker position={[position.lat, position.lng]}>
            <Popup>Tu ubicación</Popup>
          </Marker>
        )}

        {stores.map((st) => (
          <Marker key={st.id} position={[st.lat, st.lng]}>
            <Popup>
              <div>
                <strong>{st.name}</strong>
                <div className="text-sm">{st.address}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute right-4 bottom-4 z-40">
        <details className="group">
          <summary className="bg-emerald-600 text-white px-4 py-2 rounded shadow cursor-pointer">Sugerir tienda</summary>
          <form className="mt-2 bg-white dark:bg-slate-800 p-3 rounded shadow w-80" onSubmit={async (e) => {
            e.preventDefault();
            const formEl = e.currentTarget;
            const el = formEl.elements as unknown as Record<string, HTMLInputElement>;
            const data: SuggestForm = {
              name: el.name.value,
              address: el.address?.value ?? '',
              phone: el.phone?.value ?? '',
              website: el.website?.value ?? '',
            };
            const lat = position?.lat ?? DEFAULT_CENTER.lat;
            const lng = position?.lng ?? DEFAULT_CENTER.lng;
            try {
              await suggestStore({ ...data, lat, lng } as any);
              const s = await fetchStores();
              setStores(s);
              (formEl.closest('details') as HTMLDetailsElement).open = false;
              alert('Gracias — tu sugerencia fue enviada.');
            } catch (err) {
              alert('No se pudo enviar la sugerencia. Intenta más tarde.');
            }
          }}>
            <div className="mb-2">
              <label className="text-sm">Nombre</label>
              <input name="name" required className="w-full border dark:border-slate-600 px-2 py-1 rounded mt-1 dark:bg-slate-700" />
            </div>
            <div className="mb-2">
              <label className="text-sm">Dirección</label>
              <input name="address" className="w-full border dark:border-slate-600 px-2 py-1 rounded mt-1 dark:bg-slate-700" />
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <input name="phone" placeholder="Teléfono" className="w-full border dark:border-slate-600 px-2 py-1 rounded mt-1 dark:bg-slate-700" />
              <input name="website" placeholder="Web" className="w-full border dark:border-slate-600 px-2 py-1 rounded mt-1 dark:bg-slate-700" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-3 py-1 bg-emerald-600 text-white rounded">Enviar</button>
            </div>
          </form>
        </details>
      </div>
    </div>
  );
}