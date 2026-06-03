import { describe, it, expect } from 'vitest';
import { rarityClass } from './rarity';

describe('rarityClass', () => {
  it('maps comun', () => {
    const r = rarityClass('comun');
    expect(r.label).toBe('Común');
  });

  it('maps epico with epic flag', () => {
    const r = rarityClass('epico' as any);
    expect(r.label).toBe('Épico');
    expect((r as any).epic).toBeTruthy();
  });

  it('defaults unknown to comun', () => {
    const r = rarityClass('unknown' as any);
    expect(r.label).toBe('Común');
  });
});
