import type { Fish } from '../types';

export type CompatibilityLevel = 'compatible' | 'caution' | 'incompatible';

export interface CompatibilityResult {
  level: CompatibilityLevel;
  reasons: string[];
}

export function checkCompatibility(fish: Fish, params: { temp?: number; ph?: number; otherTemperament?: Fish['temperament'] }): CompatibilityResult {
  const reasons: string[] = [];
  let level: CompatibilityLevel = 'compatible';
  const escalate = (newLevel: CompatibilityLevel) => {
    if (level === 'incompatible') return;
    if (newLevel === 'incompatible') {
      level = 'incompatible';
      return;
    }
    if (level !== 'caution') level = newLevel;
  };

  if (typeof params.temp === 'number') {
    if (params.temp < fish.tempMin || params.temp > fish.tempMax) {
      reasons.push(`Temperatura fuera del rango (${fish.tempMin}–${fish.tempMax}°C)`);
      level = 'incompatible';
    } else {
      // caution if within 1°C of border
      if (params.temp <= fish.tempMin + 1 || params.temp >= fish.tempMax - 1) {
        reasons.push('Temperatura cerca del límite');
        escalate('caution');
      }
    }
  }

  if (typeof params.ph === 'number') {
    if (params.ph < fish.phMin || params.ph > fish.phMax) {
      reasons.push(`pH fuera del rango (${fish.phMin}–${fish.phMax})`);
      level = 'incompatible';
    } else {
      // caution if within 0.5 of border
      if (params.ph <= fish.phMin + 0.5 || params.ph >= fish.phMax - 0.5) {
        reasons.push('pH cerca del límite');
        escalate('caution');
      }
    }
  }

  if (params.otherTemperament) {
    const t = fish.temperament;
    const o = params.otherTemperament;
    if (t === 'agresivo' && o === 'pacifico') {
      reasons.push('Pez agresivo junto a uno pacífico — riesgo alto');
      escalate('incompatible');
    }
    if (t === 'semiagressivo' && o === 'pacifico') {
      reasons.push('Pez semiagresivo con pacífico — vigilar comportamiento');
      escalate('caution');
    }
    // symmetrical check
    if (o === 'agresivo' && t === 'pacifico') {
      reasons.push('Otro pez agresivo puede atacar a este pacífico');
      escalate('incompatible');
    }
  }

  return { level, reasons };
}

export default checkCompatibility;
