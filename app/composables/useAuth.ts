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

  // Shared state rather than a per-call useCookie: see useAuthToken for why.
  // Readable by JS on purpose — useApiFetch attaches it as a bearer header on
  // the client, so httpOnly isn't an option here.
  const token = useAuthToken()

  function authHeaders(): Record<string, string> {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  async function login(email: string, password: string) {
    const cart = useCart()

    // Sent so the backend can fold anything added as a guest into the
    // customer's cart. Read before the token is set, since the server may
    // reissue it.
    const guestToken = cart.token.value

    const res = await $fetch<{ token: string; customer: Customer }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      headers: guestToken ? { 'X-Cart-Token': guestToken } : {},
    })

    // Was dropped on the floor before, which is why every authenticated call
    // after a successful login came back 401.
    token.value = res.token
    customer.value = res.customer

    // The guest token is cleared first: with it still set the backend can
    // resolve this browser's empty guest cart by token and answer with that
    // instead of the customer's. The response supplies the right token back.
    cart.token.value = null
    await cart.load()

    await refreshNuxtData()     // re-fetch products, now with prices
  }

  async function logout() {
    const cart = useCart()

    try {
      await $fetch('/api/auth/logout', { method: 'POST', headers: authHeaders() })
    } finally {
      // Clear locally even if the call fails — an expired token would
      // otherwise leave the user stuck in a half-logged-in state.
      token.value = null
      customer.value = null

      // The cart belongs to the account, not the browser. Leaving the token
      // behind hands the next person at this machine the previous customer's
      // basket.
      cart.token.value = null
      cart.cart.value = null

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

  return { customer, isLoggedIn, token, authHeaders, login, logout, fetchMe }
}