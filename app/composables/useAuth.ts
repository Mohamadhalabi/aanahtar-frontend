export interface Customer {
  id: number
  name: string
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  company_name: string | null
  is_approved: boolean
}

export function useAuth() {
  const customer = useState<Customer | null>('customer', () => null)
  const isLoggedIn = computed(() => customer.value !== null)

  // Readable by JS on purpose: useApiFetch has to attach it as a bearer header
  // on the client, so httpOnly isn't an option here. See the trade-off note.
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
  })

  function authHeaders(): Record<string, string> {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  async function login(email: string, password: string) {
    const res = await $fetch<{ token: string; customer: Customer }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })

    // Was dropped on the floor before, which is why every authenticated call
    // after a successful login came back 401.
    token.value = res.token
    customer.value = res.customer

    await useCart().load()      // pick up the merged cart
    await refreshNuxtData()     // re-fetch products, now with prices
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST', headers: authHeaders() })
    } finally {
      // Clear locally even if the call fails — an expired token would
      // otherwise leave the user stuck in a half-logged-in state.
      token.value = null
      customer.value = null
      await refreshNuxtData()
      await navigateTo('/')
    }
  }

  /** Restores the session on load. A token with no profile behind it is stale. */
  async function fetchMe() {
    if (!token.value) {
      customer.value = null
      return
    }

    try {
      const res = await $fetch<{ customer: Customer }>('/api/auth/me', { headers: authHeaders() })
      customer.value = res.customer
    } catch {
      token.value = null
      customer.value = null
    }
  }

  return { customer, isLoggedIn, login, logout, fetchMe }
}