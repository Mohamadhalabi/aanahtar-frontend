export function useApiFetch<T>(url: string | (() => string), opts: any = {}) {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token')
  const currency = useCurrencyCode()

  return useFetch<T>(url, {
    baseURL: import.meta.server ? `${config.backendOrigin}/api` : '/api',
    credentials: 'include',
    ...opts,
    headers: { ...(opts.headers ?? {}) },

    onRequest(ctx: any) {
      // Read the cookies per request, not once at setup: logging in or
      // switching currency has to affect requests from components that were
      // already mounted.
      const set = (name: string, value: string) => {
        const h = ctx.options.headers
        if (typeof h?.set === 'function') h.set(name, value)
        else ctx.options.headers = { ...h, [name]: value }
      }

      // Sanctum tokens need the header; `credentials: include` alone was never
      // going to authenticate anything.
      if (token.value) set('Authorization', `Bearer ${token.value}`)

      // Catalogue prices are stored in USD and converted server-side, so
      // without this every price comes back in the default currency.
      if (currency.value) set('X-Currency', currency.value)

      return opts.onRequest?.(ctx)
    },
  })
}