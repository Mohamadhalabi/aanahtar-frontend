import tailwindcss from '@tailwindcss/vite'

const BACKEND = process.env.BACKEND_ORIGIN ?? 'http://127.0.0.1:8000'

/**
 * Staging switch. Set NOINDEX=1 in the PM2 env on the test subdomain only.
 *
 * Gated on an env var rather than hardcoded, because a `noindex` header left
 * behind on the real storefront would drop it out of Google entirely — and
 * that's exactly the kind of line that survives a copy-paste to production.
 * Absent the flag, nothing is added.
 */
const NOINDEX = process.env.NOINDEX === '1'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-11',
  modules: ['@nuxt/image', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  runtimeConfig: {
    // Server-side only. The composable appends /api itself, so no env var
    // can strip it — that's what broke SSR before.
    backendOrigin: BACKEND,
    public: {
      siteUrl: 'http://localhost:3000',
      // Read by server/routes/robots.txt.ts, which can't see build-time
      // constants.
      noindex: NOINDEX,
    },
  },
  router: {
    options: { strict: false },
  },
  routeRules: {
    // Declared first so the per-path rules below can still add their own
    // headers; Nitro merges rather than replaces.
    ...(NOINDEX
      ? { '/**': { headers: { 'x-robots-tag': 'noindex, nofollow, noarchive' } } }
      : {}),

    // Same-origin proxy → no CORS, cart cookie just works.
    '/api/**':    { proxy: `${BACKEND}/api/**` },
    '/images/**': { proxy: `${BACKEND}/images/**`, headers: { 'cache-control': 'public, max-age=31536000, immutable' } },

    // Never cache anything user-specific.
    '/sepet':      { headers: { 'cache-control': 'no-store' } },
    '/odeme/**':   { ssr: true, headers: { 'cache-control': 'no-store' } },
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