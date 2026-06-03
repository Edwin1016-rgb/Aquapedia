import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/authStore';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUser = useAuthStore((s) => s.setUser);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: signErr } = await supabase.auth.signUp({ email, password });
      if (signErr) throw signErr;
      setUser({ id: data.user?.id ?? '', email, username, avatarUrl: undefined, badges: [], totalCards: 0, createdAt: new Date().toISOString() });
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
    try {
      const { data, error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) throw signErr;
      setUser({ id: data.user?.id ?? '', email, username: '', avatarUrl: undefined, badges: [], totalCards: 0, createdAt: new Date().toISOString() });
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h1>
      <div className="mb-4">
        <button className={`px-3 py-2 mr-2 ${mode === 'login' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`} onClick={() => setMode('login')}>Iniciar sesión</button>
        <button className={`px-3 py-2 ${mode === 'signup' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`} onClick={() => setMode('signup')}>Registrarse</button>
      </div>

      <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-3">
        <div>
          <label className="text-sm">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="text-sm">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="text-sm">Nombre de usuario</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
        )}

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded-md">{loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
        </div>
      </form>
    </main>
  );
}
