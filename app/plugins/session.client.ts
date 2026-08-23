/**
 * Replaces plugins/cart.ts.
 *
 * Order matters: the cart endpoints read the Authorization header to decide
 * whether prices are visible and whose cart to return. Loading the cart before
 * the session is restored meant the first load of every page ran as a guest —
 * so a returning customer saw an empty basket with no prices until something
 * else happened to re-fetch it.
 */
export default defineNuxtPlugin(async () => {
  const { fetchMe } = useAuth()
  const { load } = useCart()

  await fetchMe().catch(() => {})
  await load().catch(() => {})
})
