export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'auth_token')

  if (token) {
    await $fetch(`${config.backendOrigin}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'X-Client-Key': config.clientKey as string,
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => {})
  }

  deleteCookie(event, 'auth_token', { path: '/' })
  return { ok: true }
})
