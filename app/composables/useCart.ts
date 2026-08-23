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

  // Shared state, not a fresh useCookie: constructing one here read the cookie
  // before login's write had been flushed, so the load() straight after login
  // went out unauthenticated and came back with the guest cart. Cart endpoints
  // carry no auth middleware, so without this header the backend sees a guest
  // and strips every price — even for a signed-in customer.
  const auth = useAuthToken()

  const currency = useCurrencyCode()
  const toast = useToast()

  const count = computed(() =>
    cart.value?.items.reduce((n, i) => n + i.quantity, 0) ?? 0)

  /**
   * @param notifyErrors Off for load(), which runs unattended on every page
   *   load — a failure there shouldn't put a toast in front of someone who
   *   never touched the cart.
   */
  async function call(url: string, opts: any = {}, notifyErrors = true) {
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
    } catch (e: any) {
      if (notifyErrors) {
        toast.error(e?.data?.message ?? 'Sepet güncellenemedi. Lütfen tekrar deneyin.')
      }
      // Rethrown so callers awaiting this still see the failure.
      throw e
    } finally {
      pending.value = false
    }
  }

  const load = () => call('/api/cart', {}, false)

  async function add(product_id: number, quantity = 1) {
    const res = await call('/api/cart/items', { method: 'POST', body: { product_id, quantity } })

    // Name and photo come from the response rather than being passed in, so
    // every call site gets them without knowing anything about toasts.
    const item = res.items.find(i => i.product_id === product_id)
    toast.success(
      item ? `${item.name} sepete eklendi.` : 'Ürün sepete eklendi.',
      { image: item?.image },
    )

    return res
  }

  /** Quantity changes stay silent: the stepper already shows the new number,
      and a toast per tap turns a nudge from 1 to 4 into three cards. */
  const update = (id: number, quantity: number) =>
    call(`/api/cart/items/${id}`, { method: 'PATCH', body: { quantity } })

  async function remove(id: number) {
    // Captured first — after the request the item is gone from the response.
    const item = cart.value?.items.find(i => i.id === id)

    const res = await call(`/api/cart/items/${id}`, { method: 'DELETE' })
    toast.info(
      item ? `${item.name} sepetten kaldırıldı.` : 'Ürün sepetten kaldırıldı.',
      { image: item?.image },
    )

    return res
  }

  return { cart, count, pending, token, load, add, update, remove }
}