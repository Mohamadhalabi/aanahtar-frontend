export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // Forward the guest cart token so the backend can merge it into the account.
  const cartToken = getCookie(event, 'cart_token')

  const headers: Record<string, string> = {
    'X-Client-Key': config.clientKey as string,
  }
  if (cartToken) {
    headers['X-Cart-Token'] = cartToken
    // Also pass as a cookie, since the backend reads $request->cookie('cart_token')
    headers['Cookie'] = `cart_token=${cartToken}`
  }

  const res = await $fetch<{ token: string; customer: any }>(
    `${config.backendOrigin}/api/auth/login`,
    { method: 'POST', body, headers },
  )

  setCookie(event, 'auth_token', res.token, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return { customer: res.customer }
})
