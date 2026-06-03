import { useState, useEffect } from 'react';

export function useGeolocation(options?: PositionOptions) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocalización no disponible en este navegador');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      options,
    );

    return () => navigator.geolocation.clearWatch(id);
  }, [options]);

  return { position, error } as const;
}

export default useGeolocation;
