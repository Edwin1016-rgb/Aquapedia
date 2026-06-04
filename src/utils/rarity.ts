export type Rarity = 'comun' | 'poco_comun' | 'raro' | 'epico';

export interface RarityStyle {
  bg: string;
  text: string;
  label: string;
  border: string;
  accent: string;
  epic?: true;
}

export function rarityClass(r: Rarity): RarityStyle {
  switch (r) {
    case 'comun':
      return { bg: 'bg-gray-300', text: 'text-gray-700', label: 'Común', border: 'border-gray-300', accent: 'bg-gray-400' };
    case 'poco_comun':
      return { bg: 'bg-emerald-200', text: 'text-emerald-800', label: 'Poco común', border: 'border-emerald-500', accent: 'bg-emerald-500' };
    case 'raro':
      return { bg: 'bg-blue-200', text: 'text-blue-800', label: 'Raro', border: 'border-blue-500', accent: 'bg-blue-500' };
    case 'epico':
      return { bg: 'bg-yellow-100', text: 'text-yellow-900', label: 'Épico', border: 'border-amber-500', accent: 'bg-amber-500', epic: true };
    default:
      return { bg: 'bg-gray-300', text: 'text-gray-700', label: 'Común', border: 'border-gray-300', accent: 'bg-gray-400' };
  }
}
