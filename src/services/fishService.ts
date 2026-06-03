import type { Fish } from '../types';
import { supabase } from './supabase';
import { db } from '../db/indexedDB';

export async function fetchFishList(): Promise<Fish[]> {
  try {
    const { data, error } = await supabase
      .from('fish')
      .select('*')
      .order('common_name', { ascending: true })
      .limit(100);

    if (error) throw error;
    if (!data) return [];

    const fishes = data.map((row: any) => ({
      id: row.id,
      commonName: row.common_name,
      scientificName: row.scientific_name,
      family: row.family,
      description: row.description ?? '',
      imageUrl: row.image_url ?? '',
      communityPhotos: row.community_photos ?? [],
      tempMin: Number(row.temp_min),
      tempMax: Number(row.temp_max),
      phMin: Number(row.ph_min),
      phMax: Number(row.ph_max),
      hardnessMin: row.hardness_min ?? 0,
      hardnessMax: row.hardness_max ?? 0,
      sizeAdultCm: Number(row.size_adult_cm),
      lifespan: row.lifespan ?? '',
      diet: row.diet as Fish['diet'],
      temperament: row.temperament as Fish['temperament'],
      tankLevelMin: row.tank_level_min ?? 0,
      difficultyLevel: (row.difficulty_level as Fish['difficultyLevel']) ?? 1,
      rarity: row.rarity as Fish['rarity'],
      compatibleWith: row.compatible_with ?? [],
      incompatibleWith: row.incompatible_with ?? [],
      careNotes: row.care_notes ?? '',
      tags: row.tags ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) as Fish[];

    // Guardar en IndexedDB (Dexie)
    try {
      await db.fish.bulkPut(fishes);
    } catch (e) {
      // no fatal: si falla el guardado, solo loguear
      // eslint-disable-next-line no-console
      console.warn('No se pudo guardar fish en IndexedDB', e);
    }

    return fishes;
  } catch (error: unknown) {
    // Fallback a Dexie si la red falla
    const cached = await db.fish.toArray();
    if (cached.length > 0) return cached;
    throw error;
  }
}

export async function getFishById(id: string): Promise<Fish | undefined> {
  try {
    const { data, error } = await supabase.from('fish').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) return undefined;
    const row = data as any;
    const fish: Fish = {
      id: row.id,
      commonName: row.common_name,
      scientificName: row.scientific_name,
      family: row.family,
      description: row.description ?? '',
      imageUrl: row.image_url ?? '',
      communityPhotos: row.community_photos ?? [],
      tempMin: Number(row.temp_min),
      tempMax: Number(row.temp_max),
      phMin: Number(row.ph_min),
      phMax: Number(row.ph_max),
      hardnessMin: row.hardness_min ?? 0,
      hardnessMax: row.hardness_max ?? 0,
      sizeAdultCm: Number(row.size_adult_cm),
      lifespan: row.lifespan ?? '',
      diet: row.diet as Fish['diet'],
      temperament: row.temperament as Fish['temperament'],
      tankLevelMin: row.tank_level_min ?? 0,
      difficultyLevel: (row.difficulty_level as Fish['difficultyLevel']) ?? 1,
      rarity: row.rarity as Fish['rarity'],
      compatibleWith: row.compatible_with ?? [],
      incompatibleWith: row.incompatible_with ?? [],
      careNotes: row.care_notes ?? '',
      tags: row.tags ?? [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    // Guardar individual en IndexedDB
    try {
      await db.fish.put(fish);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('No se pudo almacenar fish en IndexedDB', e);
    }

    return fish;
  } catch (error: unknown) {
    // fallback a Dexie
    const cached = await db.fish.get(id);
    return cached;
  }
}
