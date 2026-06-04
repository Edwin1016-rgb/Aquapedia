import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/authStore';
import { usePushNotifications } from '../hooks/usePushNotifications';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const setUser = useAuthStore((s) => s.setUser);
  const { register } = usePushNotifications();

  async function tryEnableNotifications(userId: string) {
    try {
      if (Notification.permission === 'granted') {
        await register(userId);
      }
    } catch {}
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data, error: signErr } = await supabase.auth.signUp({ email, password });
      if (signErr) throw signErr;
      if (!data.session) {
        setMessage('Revisa tu correo para confirmar la cuenta. Luego inicia sesión.');
        setMode('login');
      } else {
        setUser({ id: data.user?.id ?? '', email, username, avatarUrl: undefined, badges: [], totalCards: 0, createdAt: new Date().toISOString() });
        tryEnableNotifications(data.user?.id ?? '');
      }
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data, error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) throw signErr;
      setUser({ id: data.user?.id ?? '', email, username: '', avatarUrl: undefined, badges: [], totalCards: 0, createdAt: new Date().toISOString() });
      tryEnableNotifications(data.user?.id ?? '');
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h1>
      <div className="mb-4">
        <button className={`px-3 py-2 mr-2 rounded ${mode === 'login' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-200'}`} onClick={() => setMode('login')}>Iniciar sesión</button>
        <button className={`px-3 py-2 rounded ${mode === 'signup' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-200'}`} onClick={() => setMode('signup')}>Registrarse</button>
      </div>

      <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-3">
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100" />
        </div>

        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100" />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Nombre de usuario</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100" />
          </div>
        )}

        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
        {message && <div className="text-sm text-emerald-600 dark:text-emerald-400">{message}</div>}

        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-md disabled:opacity-50">{loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
        </div>
      </form>
    </main>
  );
}