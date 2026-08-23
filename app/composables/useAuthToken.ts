/**
 * The auth token, shared as state rather than read from the cookie at each
 * call site.
 *
 * `useCookie` reads `document.cookie` when the ref is created and writes back
 * through a watcher — which is async. So code that sets the token and then
 * constructs a *new* `useCookie('auth_token')` in the same tick reads the old
 * value. That was losing the Authorization header on the cart load that runs
 * straight after login, and the server answered as if to a guest.
 *
 * `useState` is app-wide and synchronous, so every caller sees the write
 * immediately; the cookie is kept in sync for persistence across reloads.
 */
export function useAuthToken() {
  const cookie = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
  })

  const token = useState<string | null>('auth-token', () => cookie.value ?? null)

  // One watcher per app instance, registered on first use.
  if (import.meta.client) {
    const bound = useState('auth-token-bound', () => false)
    if (!bound.value) {
      bound.value = true
      watch(token, (v) => { cookie.value = v }, { flush: 'sync' })
    }
  }

  return token
}
