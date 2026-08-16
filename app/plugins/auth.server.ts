export default defineNuxtPlugin(async () => {
  const token = useCookie('auth_token').value
  if (!token) return

  const customer = useState<any>('customer', () => null)
  const config = useRuntimeConfig()

  try {
    const res = await $fetch<{ customer: any }>(`${config.backendOrigin}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    customer.value = res.customer
  } catch {
    customer.value = null
  }
})