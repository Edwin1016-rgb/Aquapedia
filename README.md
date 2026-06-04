# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

# AquaPedia — project notes

This workspace contains the AquaPedia PWA: an offline-first React + TypeScript + Vite app with Dexie IndexedDB and Supabase integration.

Quick start (project-specific):

- Copy `.env.example` to `.env` and set: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_VAPID_PUBLIC_KEY`.
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Tests: `npm run test` (Vitest + Testing Library)

Deploy (Cloudflare Pages):

- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variables in the Pages UI:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_VAPID_PUBLIC_KEY`
  - `SUPABASE_URL` (server-side, same value)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side, from Supabase Dashboard → Settings → API → service_role)
  - `VAPID_PUBLIC_KEY` (server-side, same as `VITE_VAPID_PUBLIC_KEY`)
  - `VAPID_PRIVATE_KEY` (server-side, from Supabase Dashboard → Settings → API → Push Notifications)
- Enable `nodejs_compat` compatibility flag in Pages Settings → Functions → Compatibility flags.
- Ensure `public/_redirects` exists with `/* /index.html 200` for SPA routing.

Notifications flow:
1. User enables notifications in Profile → browser prompts for permission → subscription saved to Supabase.
2. To send a notification from the frontend, call `sendNotification({ userId, title, body })` from `notificationService.ts`.
3. To broadcast to all users: `notifyAll({ title, body })` → calls `POST /api/notify/all`.
4. Daily fish at 9am: set up a cron job (cron-job.org or similar) to hit `POST /api/notify/daily` with empty body.
   - The function picks a random fish from the DB and sends it to all subscribed users.

Notification types implemented:
| Tipo | Disparador | Origen |
|---|---|---|
| 🐟 Pez del día | Cron externo a las 9am → `POST /api/notify/daily` | Server |
| 🆕 Nueva especie | Llamar `notifyAll(...)` desde el backend | Server |
| ⚠️ Alerta compatibilidad | Al añadir pez incompatible en colección | Frontend (collectionService) |
| 🏆 Logro desbloqueado | Al obtener badge | Frontend (achievementsService) |

See `supabase/seed_full.sql` for the included 50-species seed.
