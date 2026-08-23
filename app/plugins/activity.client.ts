/**
 * Reports navigation to the backend.
 *
 * Client-only: on an SPA the server sees one request for the first page and
 * nothing after that, so route changes have to be reported explicitly.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  // Stable per browser, so a guest's actions group together in the admin.
  // The IP alone merges everyone behind one office router.
  const visitor = useCookie<string | null>('visitor_id', {
    maxAge: 60 * 60 * 24 * 365 * 2,
    sameSite: 'lax',
    path: '/',
  })

  if (!visitor.value) {
    visitor.value = crypto.randomUUID()
  }

  const auth = useCookie<string | null>('auth_token')

  let last = ''

  async function report(action: string, label: string | null, url: string) {
    // Vue Router fires for query-only changes too — filtering the shop page's
    // every filter click keeps this from flooding the log.
    if (url === last) return
    last = url

    try {
      await $fetch('/api/activity', {
        method: 'POST',
        body: { action, label, url },
        headers: {
          'X-Visitor-Id': visitor.value ?? '',
          ...(auth.value ? { Authorization: `Bearer ${auth.value}` } : {}),
        },
      })
    } catch {
      // Never let analytics break navigation.
    }
  }

  router.afterEach((to) => {
    // Deferred so it doesn't compete with the page's own data fetching.
    setTimeout(() => {
      const isProduct = to.path.startsWith('/urun/')
      report(
        isProduct ? 'product_view' : 'page_view',
        (document?.title || to.path).slice(0, 255),
        window.location.href,
      )
    }, 300)
  })

  // The first load doesn't fire afterEach.
  nuxtApp.hook('app:mounted', () => {
    setTimeout(() => {
      report('page_view', document.title.slice(0, 255), window.location.href)
    }, 300)
  })
})
