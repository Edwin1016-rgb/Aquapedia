import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { fetchStores } from '../services/storeService';
import useGeolocation from '../hooks/useGeolocation';
import type { AquaStore } from '../types';
import storeService from '../services/storeService';

type SuggestForm = {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
};

export default function MapPage() {
  const { position } = useGeolocation({ enableHighAccuracy: true, maximumAge: 10000 });
  const [stores, setStores] = useState<AquaStore[]>([]);

  useEffect(() => {
    let mounted = true;
    void fetchStores().then((s) => {
      if (mounted) setStores(s);
    });
    return () => { mounted = false };
  }, []);

  const center = position ? [position.lat, position.lng] : [0, 0];

  return (
    <div className="h-[70vh] w-full">
      <MapContainer {...({ center: center as any, zoom: 13, className: 'h-full w-full' } as any)}>
        <TileLayer {...({ attribution: '&copy; OpenStreetMap contributors', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' } as any)} />

        {position ? (
          <Marker position={[position.lat, position.lng] as any}>
            <Popup>Tu ubicación</Popup>
          </Marker>
        ) : null}

        {stores.map((st) => (
          <Marker key={st.id} position={[st.lat, st.lng] as any}>
            <Popup>
              <div>
                <strong>{st.name}</strong>
                <div className="text-sm">{st.address}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Suggest store floating button and form */}
      <div className="fixed right-4 bottom-24 z-40">
        <details className="group">
          <summary className="bg-emerald-600 text-white px-4 py-2 rounded shadow cursor-pointer">Sugerir tienda</summary>
          <form className="mt-2 bg-white p-3 rounded shadow w-80 dark:bg-slate-800" onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement & any;
            const data: SuggestForm = {
              name: form.name.value,
              address: form.address.value,
              phone: form.phone.value,
              website: form.website.value,
            };
            const lat = position?.lat ?? 0;
            const lng = position?.lng ?? 0;
            try {
              await storeService.suggestStore({ ...data, lat, lng });
              // refresh
              const s = await fetchStores();
              setStores(s);
              // close details
              (form.closest('details') as HTMLDetailsElement).open = false;
              // eslint-disable-next-line no-alert
              alert('Gracias — tu sugerencia fue enviada.');
            } catch (err) {
              // eslint-disable-next-line no-alert
              alert('No se pudo enviar la sugerencia. Intenta más tarde.');
            }
          }}>
            <div className="mb-2">
              <label className="text-sm">Nombre</label>
              <input name="name" required className="w-full border px-2 py-1 rounded mt-1" />
            </div>
            <div className="mb-2">
              <label className="text-sm">Dirección</label>
              <input name="address" className="w-full border px-2 py-1 rounded mt-1" />
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <input name="phone" placeholder="Teléfono" className="w-full border px-2 py-1 rounded mt-1" />
              <input name="website" placeholder="Web" className="w-full border px-2 py-1 rounded mt-1" />
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
// page implemented above as MapPage
