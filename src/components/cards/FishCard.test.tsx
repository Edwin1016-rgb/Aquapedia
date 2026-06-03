
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FishCard from './FishCard';

const fish = {
  id: 'f1',
  commonName: 'Guppy',
  scientificName: 'Poecilia reticulata',
  imageUrl: '/images/guppy.webp',
  tempMin: 22,
  tempMax: 28,
  phMin: 6.5,
  phMax: 7.5,
  hardnessMin: 1,
  hardnessMax: 10,
  sizeAdultCm: 4,
  lifespan: '2-3 años',
  diet: 'omnivoro',
  temperament: 'pacifico',
  tankLevelMin: 20,
  difficultyLevel: 1,
  rarity: 'comun',
  family: '',
  description: '',
  compatibleWith: [],
  incompatibleWith: [],
  careNotes: '',
  tags: [],
};

describe('FishCard', () => {
  it('renders image and names', () => {
    render(<FishCard fish={fish as any} />);
    expect(screen.getByAltText('Guppy')).toBeTruthy();
    expect(screen.getByText('Guppy')).toBeTruthy();
    expect(screen.getByText('Poecilia reticulata')).toBeTruthy();
  });
});
