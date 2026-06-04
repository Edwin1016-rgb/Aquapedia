import { Link } from 'react-router-dom';
import DarkToggle from '../ui/DarkToggle';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-emerald-700">AquaPedia</Link>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex space-x-4">
            <Link to="/catalog" className="text-gray-600 dark:text-gray-200 hover:text-emerald-700">Catálogo</Link>
            <Link to="/map" className="text-gray-600 dark:text-gray-200 hover:text-emerald-700">Mapa</Link>
            {user && (
              <>
                <Link to="/collection" className="text-gray-600 dark:text-gray-200 hover:text-emerald-700">Colección</Link>
                <Link to="/profile" className="text-gray-600 dark:text-gray-200 hover:text-emerald-700">Perfil</Link>
              </>
            )}
            {!user && (
              <Link to="/auth" className="text-gray-600 dark:text-gray-200 hover:text-emerald-700">Iniciar sesión</Link>
            )}
          </div>
          <DarkToggle />
        </div>
      </div>
    </nav>
  );
}
