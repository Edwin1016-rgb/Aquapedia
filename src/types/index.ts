export interface Fish {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  description: string;
  imageUrl: string;
  communityPhotos: string[];
  tempMin: number; // C
  tempMax: number;
  phMin: number;
  phMax: number;
  hardnessMin: number; // GH
  hardnessMax: number;
  sizeAdultCm: number;
  lifespan: string;
  diet: 'omnivoro' | 'carnivoro' | 'herbivoro';
  temperament: 'pacifico' | 'semiagressivo' | 'agresivo';
  tankLevelMin: number; // litros
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  rarity: 'comun' | 'poco_comun' | 'raro' | 'epico';
  compatibleWith: string[];
  incompatibleWith: string[];
  careNotes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionCard {
  id: string;
  userId: string;
  fishId: string;
  fish?: Fish;
  userPhoto?: string;
  notes?: string;
  addedAt: string;
  isFavorite: boolean;
}

export interface AquaStore {
  id: string;
  name: string;
  type: 'tienda' | 'acuario_publico' | 'criador';
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  website?: string;
  schedule?: string;
  rating?: number;
  verifiedBy?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  badges: Badge[];
  totalCards: number;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt?: string;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  type: 'pez_del_dia' | 'nueva_especie' | 'alerta_compat' | 'tienda';
}
