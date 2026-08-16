export interface CartItem {
  id: number
  product_id: number
  name: string
  slug: string
  image: string | null
  quantity: number
  unit_price: number | null
  line_total: number | null
}

export interface Cart {
  token: string
  items: CartItem[]
  subtotal: number | null
  free_shipping: boolean
  currency: string | null
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

  const count = computed(() =>
    cart.value?.items.reduce((n, i) => n + i.quantity, 0) ?? 0)

  async function call(url: string, opts: any = {}) {
    pending.value = true
    try {
      const headers: Record<string, string> = { ...(opts.headers ?? {}) }
      if (token.value) headers['X-Cart-Token'] = token.value

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