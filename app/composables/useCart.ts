export interface CartItem {
  id: number
  product_id: number
  name: string
  slug: string
  image: string | null
  quantity: number
  unit_price: number | null
  line_total: number | null
  is_preorder: boolean
}

export interface Cart {
  token: string
  price_visible: boolean
  items: CartItem[]
  subtotal: number | null
  free_shipping: boolean
  has_preorder: boolean
  currency: { code: string; symbol: string; rate: number } | null
}

export function useCart() {
  const cart = useState<Cart | null>('cart', () => null)
  const pending = useState('cart-pending', () => false)

  // The backend identifies a guest cart by the X-Cart-Token header, so the
  // token has to be persisted here and echoed back on every request.
  const token = useCookie<string | null>('cart_token', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    path: '/',
  })

  // Written by useAuth on login. Cart requests need it too: the cart endpoints
  // carry no auth middleware, so without this header the backend sees a guest
  // and strips every price — even for a signed-in customer.
  const auth = useCookie<string | null>('auth_token')

  const currency = useCurrencyCode()

  const count = computed(() =>
    cart.value?.items.reduce((n, i) => n + i.quantity, 0) ?? 0)

  async function call(url: string, opts: any = {}) {
    pending.value = true
    try {
      const headers: Record<string, string> = { ...(opts.headers ?? {}) }
      if (token.value) headers['X-Cart-Token'] = token.value
      if (auth.value) headers.Authorization = `Bearer ${auth.value}`
      // Cart totals are converted server-side like everything else.
      if (currency.value) headers['X-Currency'] = currency.value

      const res = await $fetch<Cart>(url, { credentials: 'include', ...opts, headers })
      cart.value = res
      if (res?.token) token.value = res.token
      return res
    } finally {
      pending.value = false
    }
  }

  const load   = () => call('/api/cart')
  const add    = (product_id: number, quantity = 1) =>
    call('/api/cart/items', { method: 'POST', body: { product_id, quantity } })
  const update = (id: number, quantity: number) =>
    call(`/api/cart/items/${id}`, { method: 'PATCH', body: { quantity } })
  const remove = (id: number) =>
    call(`/api/cart/items/${id}`, { method: 'DELETE' })

  return { cart, count, pending, token, load, add, update, remove }
}