/**
 * Rehydrates the logged-in customer once per page load.
 *
 * Client-only by design: server-rendered requests already authenticate, because
 * useApiFetch reads the same cookie during SSR — so prices and any other
 * customer-specific data render correctly without this. All this recovers is
 * the profile itself (header state, account links), which isn't needed in the
 * server-rendered HTML.
 */
export default defineNuxtPlugin(async () => {
  await useAuth().fetchMe()
})