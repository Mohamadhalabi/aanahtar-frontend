export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const res = await $fetch<{ token: string; customer: any }>(
    `${config.backendOrigin}/api/login`,
    { method: 'POST', body },
  )

  // HttpOnly: JavaScript can't read it, so an XSS bug can't steal the session.
  setCookie(event, 'auth_token', res.token, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return { customer: res.customer }
})