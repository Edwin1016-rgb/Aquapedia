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
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-64"
    >
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {fish.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fish.imageUrl} alt={fish.commonName} loading="lazy" decoding="async" className="object-cover w-full h-full" />
        ) : (
          <div className="text-gray-400">Sin imagen</div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{fish.commonName}</h3>
          <span
            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${rarity.bg} ${rarity.text} ${
              (rarity as any).epic ? 'rarity-epic' : ''
            }`}
          >
            {rarity.label}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1">{fish.scientificName}</p>

        <div className="mt-3 space-y-2">
          <div>
            <div className="text-xs text-gray-500">Temperatura (°C)</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-emerald-500"
                style={{ width: `${Math.min(100, ((fish.tempMax - fish.tempMin) / 20) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">pH</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${Math.min(100, ((fish.phMax - fish.phMin) / 14) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
