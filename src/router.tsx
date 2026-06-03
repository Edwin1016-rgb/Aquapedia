import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';

const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const FishDetail = lazy(() => import('./pages/FishDetail'));
const Collection = lazy(() => import('./pages/Collection'));
const MapPage = lazy(() => import('./pages/Map'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const Offline = lazy(() => import('./pages/Offline'));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Cargando…</div>}>
        <Routes>
          <Route path="/" element={<App />}> 
            <Route index element={<Home />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="fish/:id" element={<FishDetail />} />
            <Route path="collection" element={<Collection />} />
            <Route path="map" element={<MapPage />} />
            <Route path="auth" element={<Auth />} />
            <Route path="profile" element={<Profile />} />
            <Route path="offline" element={<Offline />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
