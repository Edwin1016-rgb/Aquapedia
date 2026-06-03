import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import BottomNav from './components/layout/BottomNav'
import Toast from './components/ui/Toast'
import Modal from './components/ui/Modal'
import useAchievementsStore from './store/achievementsStore'
import useUiStore from './store/uiStore'
import ErrorBoundary from './components/ui/ErrorBoundary'
import OfflineBanner from './components/ui/OfflineBanner'
import './App.css'

function App() {
  const modalBadge = useAchievementsStore((s) => s.modalBadge);
  useEffect(() => {
    // initialize persisted theme (idb-keyval)
    useUiStore.getState().initTheme();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <OfflineBanner />
      <Navbar />
      <ErrorBoundary>
        <main className="max-w-4xl mx-auto pt-6 pb-24">
          <Outlet />
        </main>
      </ErrorBoundary>
      <BottomNav />
      <Toast />
      {modalBadge ? (
        <Modal title={modalBadge.name} onClose={() => useAchievementsStore.getState().closeModal()}>
          <p className="text-sm">{modalBadge.description}</p>
        </Modal>
      ) : null}
    </div>
  )
}

export default App
