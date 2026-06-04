import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function BottomNav() {
  const user = useAuthStore((s) => s.user);

  return (
    <nav className="fixed bottom-4 left-0 right-0 flex justify-center z-40">
      <div className="bg-white/95 dark:bg-slate-800 backdrop-blur rounded-xl px-4 py-2 shadow-md flex gap-6">
        <Link to="/" className="text-gray-700 dark:text-gray-200">Home</Link>
        <Link to="/catalog" className="text-gray-700 dark:text-gray-200">Catálogo</Link>
        {user && (
          <>
            <Link to="/collection" className="text-gray-700 dark:text-gray-200">Colección</Link>
            <Link to="/profile" className="text-gray-700 dark:text-gray-200">Perfil</Link>
          </>
        )}
        {!user && (
          <Link to="/auth" className="text-gray-700 dark:text-gray-200">Entrar</Link>
        )}
        <Link to="/map" className="text-gray-700 dark:text-gray-200">Mapa</Link>
      </div>
    </nav>
  );
}
