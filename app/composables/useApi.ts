export function useApiFetch<T>(url: string | (() => string), opts: any = {}) {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')

  return useFetch<T>(url, {
    baseURL: import.meta.server ? `${config.backendOrigin}/api` : '/api',
    credentials: 'include',
    ...opts,
    headers: { ...(opts.headers ?? {}) },

    onRequest(ctx: any) {
      // Read the cookie per request, not once at setup: logging in mid-session
      // has to affect requests from components that were already mounted.
      // Also runs on the client now — Sanctum tokens need the header, and
      // `credentials: include` alone was never going to authenticate anything.
      if (token.value) {
        const h = ctx.options.headers
        if (typeof h?.set === 'function') h.set('Authorization', `Bearer ${token.value}`)
        else ctx.options.headers = { ...h, Authorization: `Bearer ${token.value}` }
      }

      return opts.onRequest?.(ctx)
    },
  })
}