export interface Customer {
  id: number
  name: string
  email: string
  phone: string | null
  is_approved: boolean
}

export function useAuth() {
  const customer = useState<Customer | null>('customer', () => null)
  const isLoggedIn = computed(() => customer.value !== null)

async function login(email: string, password: string) {
    const res = await $fetch<{ customer: Customer }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    customer.value = res.customer
    await useCart().load()      // pick up the merged cart
    await refreshNuxtData()     // re-fetch products, now with prices
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    customer.value = null
    await refreshNuxtData()
    await navigateTo('/')
  }

  return { customer, isLoggedIn, login, logout }
}