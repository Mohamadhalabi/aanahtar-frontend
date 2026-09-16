import tailwindcss from '@tailwindcss/vite'

const BACKEND = process.env.BACKEND_ORIGIN ?? 'http://127.0.0.1:8000'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-11',
  modules: ['@nuxt/image', '@pinia/nuxt', '@nuxtjs/sitemap'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  runtimeConfig: {
    clientKey: process.env.CLIENT_KEY_WEB,
    backendOrigin: BACKEND,
    public: {
      siteUrl: 'https://www.aanahtar.com.tr',
    },
  },

  // Canonical site URL for sitemap + SEO
  site: {
    url: 'https://www.aanahtar.com.tr',
  },

  sitemap: {
    // Pull dynamic product + category URLs from our own endpoint.
    sources: ['/api/__sitemap-urls'],
    // Pages marked noindex (search/filters) are excluded automatically.
    exclude: ['/my-account/**', '/sepet', '/odeme/**'],
  },

  router: {
    options: { strict: false },
  },

  routeRules: {
    // NOTE: no '/api/**' proxy rule here, deliberately.
    // The handler does the proxying instead (attaches X-Client-Key), same-origin.
    '/images/uploads/**': { proxy: `${BACKEND}/images/uploads/**`, headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/sliders/**': { proxy: `${BACKEND}/images/sliders/**`, headers: { 'cache-control': 'public, max-age=86400' } },
    // Every other folder in the backend's public storage (test, product, media ids, ...).
    '/images/**':         { proxy: `${BACKEND}/images/**`,         headers: { 'cache-control': 'public, max-age=86400' } },

    '/sepet':    { headers: { 'cache-control': 'no-store' } },
    '/odeme/**': { ssr: true, headers: { 'cache-control': 'no-store' } },
  },

  nitro: {
    compressPublicAssets: { gzip: true, brotli: true },
  },

  image: {
    provider: 'none',
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'tr' },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})
