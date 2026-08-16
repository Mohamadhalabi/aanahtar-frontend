export function useApiFetch<T>(url: string | (() => string), opts: any = {}) {
  const config = useRuntimeConfig()
  const headers: Record<string, string> = { ...(opts.headers ?? {}) }

  if (import.meta.server) {
    const token = useCookie('auth_token').value
    if (token) headers.Authorization = `Bearer ${token}`
  }

  return useFetch<T>(url, {
    baseURL: import.meta.server ? `${config.backendOrigin}/api` : '/api',
    credentials: 'include',
    ...opts,
    headers,
  })
}