import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/**', 'screenshots/**'],
      manifest: {
        name: 'AquaPedia',
        short_name: 'AquaPedia',
        description: 'Enciclopedia interactiva de peces de acuario',
        theme_color: '#0A7063',
        background_color: '#F3F2EE',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'es',
        categories: ['education', 'lifestyle'],
        shortcuts: [
          { name: 'Mi Colección', url: '/collection', icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }] },
          { name: 'Buscar especie', url: '/catalog', icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }] },
          { name: 'Mapa de tiendas', url: '/map', icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }] },
        ],
        icons: [72, 96, 128, 144, 152, 192, 384, 512].map(s => ({
          src: `/icons/icon-${s}.png`,
          sizes: `${s}x${s}`,
          type: 'image/png',
          purpose: s >= 192 ? 'any maskable' : 'any',
        })),
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/fish/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'fish-api', expiration: { maxAgeSeconds: 86400 } },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|svg)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 500, maxAgeSeconds: 2592000 } },
          },
          {
            urlPattern: /tile\.openstreetmap\.org/,
            handler: 'CacheFirst',
            options: { cacheName: 'map-tiles', expiration: { maxEntries: 1000, maxAgeSeconds: 604800 } },
          },
          {
            urlPattern: /supabase\.co/,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase', networkTimeoutSeconds: 5 },
          },
        ],
        navigateFallback: '/',
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
});
