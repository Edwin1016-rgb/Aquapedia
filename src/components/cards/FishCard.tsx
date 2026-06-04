import type { Fish } from '../../types';
import { rarityClass } from '../../utils/rarity';

type Props = {
  fish: Fish;
  onClick?: () => void;
};

export default function FishCard({ fish, onClick }: Props) {
  const rarity = rarityClass(fish.rarity);

  return (
    <article
      role="button"
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all border-l-4 ${rarity.border} w-full`}
    >
      <div className={`h-2 ${rarity.accent}`} />
      <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
        {fish.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fish.imageUrl} alt={fish.commonName} loading="lazy" decoding="async" className="object-cover w-full h-full" />
        ) : (
          <div className="text-gray-400">Sin imagen</div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-semibold ${rarity.epic ? 'rarity-epic' : ''}`}>{fish.commonName}</h3>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${rarity.bg} ${rarity.text} shrink-0`}>
            {rarity.label}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-1 italic truncate">{fish.scientificName}</p>

        <div className="mt-2 flex gap-1 flex-wrap">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{fish.diet}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{fish.temperament}</span>
        </div>
      </div>
    </article>
  );
}
