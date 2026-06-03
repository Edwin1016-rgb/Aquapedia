import { describe, it, expect } from 'vitest';
import { checkCompatibility } from './compatibility';

const sampleFish = {
  id: '1',
  commonName: 'TestFish',
  scientificName: 'Testus fishus',
  family: 'Testidae',
  description: '',
  imageUrl: '',
  tempMin: 22,
  tempMax: 28,
  phMin: 6.5,
  phMax: 7.5,
  hardnessMin: 1,
  hardnessMax: 10,
  sizeAdultCm: 5,
  lifespan: '3 years',
  diet: 'omnivoro',
  temperament: 'pacifico',
  tankLevelMin: 20,
  difficultyLevel: 1,
  rarity: 'comun',
  compatibleWith: [],
  incompatibleWith: [],
  careNotes: '',
  tags: [],
};

describe('checkCompatibility', () => {
  it('returns caution when params near border', () => {
    const res = checkCompatibility(sampleFish as any, { temp: 25, ph: 7.1 });
    expect(res.level).toBe('caution');
    expect(res.reasons.length).toBeGreaterThanOrEqual(0);
  });

  it('returns incompatible when temp out of range', () => {
    const res = checkCompatibility(sampleFish as any, { temp: 30 });
    expect(res.level).toBe('incompatible');
    expect(res.reasons.some((r) => r.includes('Temperatura fuera'))).toBe(true);
  });

  it('returns caution when temp near border', () => {
    const res = checkCompatibility(sampleFish as any, { temp: 22.5 });
    expect(res.level).toBe('caution');
    expect(res.reasons.some((r) => r.includes('Temperatura cerca'))).toBe(true);
  });

  it('returns incompatible when temperament mismatch', () => {
    const aggressive = { ...sampleFish, temperament: 'agresivo' } as any;
    const res = checkCompatibility(aggressive, { otherTemperament: 'pacifico' });
    expect(res.level).toBe('incompatible');
  });
});
