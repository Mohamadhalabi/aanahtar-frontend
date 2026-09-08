import tailwindcss from '@tailwindcss/vite'

const BACKEND = process.env.BACKEND_ORIGIN ?? 'http://127.0.0.1:8000'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-11',
  modules: ['@nuxt/image', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  runtimeConfig: {
    // Server-only: never appears in the client bundle. Read by
    // server/api/[...path].ts and attached to every upstream request.
    clientKey: process.env.CLIENT_KEY_WEB,
    backendOrigin: BACKEND,
    public: {
      siteUrl: 'http://localhost:3000',
    },
  },

  router: {
    options: { strict: false },
  },

  routeRules: {
    // NOTE: no '/api/**' proxy rule here, deliberately.
    //
    // routeRules proxying runs in Nitro BEFORE route handlers, so a rule here
    // would forward requests straight to Laravel and server/api/[...path].ts
    // would never execute — meaning no X-Client-Key, and a 401 on everything.
    // The handler does the proxying instead, and it's still same-origin, so
    // the no-CORS property is unchanged.

    '/images/**': { proxy: `${BACKEND}/images/**`, headers: { 'cache-control': 'public, max-age=31536000, immutable' } },

    // Never cache anything user-specific.
    '/sepet':    { headers: { 'cache-control': 'no-store' } },
    '/odeme/**': { ssr: true, headers: { 'cache-control': 'no-store' } },
  },

  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
  },

  image: {
    format: ['avif', 'webp'],
    // NuxtImg refuses remote hosts unless they're allowlisted.
    domains: [
      'www.aanahtar.com.tr',
      'aanahtar.com.tr',
      'aanahtar.expertdev.net',
      'www.aanahtar.expertdev.net',
    ],
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'tr' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})