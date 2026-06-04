import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import Router from './router'
import { supabase } from './services/supabase'
import { useAuthStore } from './store/authStore'

function AuthGate({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          username: '',
          avatarUrl: undefined,
          badges: [],
          totalCards: 0,
          createdAt: session.user.created_at ?? new Date().toISOString(),
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          username: '',
          avatarUrl: undefined,
          badges: [],
          totalCards: 0,
          createdAt: session.user.created_at ?? new Date().toISOString(),
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return <>{children}</>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthGate>
      <Router />
    </AuthGate>
  </StrictMode>,
)
