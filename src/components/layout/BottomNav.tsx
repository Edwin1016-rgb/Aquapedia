import { Link } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-0 right-0 flex justify-center">
      <div className="bg-white/95 backdrop-blur rounded-xl px-4 py-2 shadow-md flex gap-6">
        <Link to="/" className="text-gray-700">Home</Link>
        <Link to="/catalog" className="text-gray-700">Catálogo</Link>
        <Link to="/collection" className="text-gray-700">Colección</Link>
        <Link to="/map" className="text-gray-700">Mapa</Link>
      </div>
    </nav>
  );
}
