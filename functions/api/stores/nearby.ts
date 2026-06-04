interface Env {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

interface OsmStore {
  id: number;
  lat: number;
  lon: number;
  center?: { lat: number; lon: number };
  tags: Record<string, string>;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const radius = url.searchParams.get('radius') || '10000';

  if (!lat || !lng) return new Response('Missing lat/lng', { status: 400 });

  const overpassQuery = `[out:json];
  (
    node["shop"="pet"](around:${radius},${lat},${lng});
    node["shop"="aquarium"](around:${radius},${lat},${lng});
    way["shop"="pet"](around:${radius},${lat},${lng});
    way["shop"="aquarium"](around:${radius},${lat},${lng});
    node["amenity"="aquarium_shop"](around:${radius},${lat},${lng});
    node["shop"="pet_supplies"](around:${radius},${lat},${lng});
  );
  out center;`;

  let osmStores: any[] = [];
  let dbStores: any[] = [];

  try {
    const osmRes = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(overpassQuery)}`,
      signal: AbortSignal.timeout(10000),
    });
    if (osmRes.ok) {
      const osmData: { elements?: OsmStore[] } = await osmRes.json();
      osmStores = (osmData.elements || []).map((el: OsmStore) => ({
        id: `osm_${el.id}`,
        name: el.tags?.name || el.tags?.shop || 'Tienda de mascotas',
        type: el.tags?.shop === 'aquarium' ? 'acuario_publico' : 'tienda',
        lat: el.lat ?? el.center?.lat ?? 0,
        lng: el.lon ?? el.center?.lon ?? 0,
        address: el.tags?.['addr:street']
          ? `${el.tags?.['addr:street']} ${el.tags?.['addr:housenumber'] || ''}`.trim()
          : '',
        phone: el.tags?.phone || '',
        website: el.tags?.website || '',
        schedule: el.tags?.['opening_hours'] || '',
        rating: null,
        verifiedBy: null,
        source: 'openstreetmap',
      }));
    }
  } catch {
    // Overpass no disponible, continuar solo con Supabase
  }

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const dbRes = await fetch(
        `${env.SUPABASE_URL}/rest/v1/aqua_stores?select=*`,
        {
          headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        },
      );
      if (dbRes.ok) dbStores = await dbRes.json();
    } catch {
      // Supabase no disponible
    }
  }

  return new Response(JSON.stringify({ stores: [...osmStores, ...dbStores] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
