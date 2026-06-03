export type Rarity = 'comun' | 'poco_comun' | 'raro' | 'epico';

export function rarityClass(r: Rarity) {
  switch (r) {
    case 'comun':
      return { bg: 'bg-gray-300', text: 'text-gray-700', label: 'Común' };
    case 'poco_comun':
      return { bg: 'bg-emerald-200', text: 'text-emerald-800', label: 'Poco común' };
    case 'raro':
      return { bg: 'bg-blue-200', text: 'text-blue-800', label: 'Raro' };
    case 'epico':
      return { bg: 'bg-yellow-100', text: 'text-yellow-900', label: 'Épico', epic: true };
    default:
      return { bg: 'bg-gray-300', text: 'text-gray-700', label: 'Común' };
  }
}
