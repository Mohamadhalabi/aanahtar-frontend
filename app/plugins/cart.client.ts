export default defineNuxtPlugin(async () => {
  const { load } = useCart()
  await load().catch(() => {})
})