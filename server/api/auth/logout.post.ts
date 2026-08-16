export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const config = useRuntimeConfig()

  if (token) {
    await $fetch(`${config.backendOrigin}/api/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {})
  }

  deleteCookie(event, 'auth_token', { path: '/' })
  return { ok: true }
})