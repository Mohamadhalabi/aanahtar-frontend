export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const cartToken = getCookie(event, 'cart_token')
  const headers: Record<string, string> = {
    'X-Client-Key': config.clientKey as string,
  }
  if (cartToken) {
    headers['X-Cart-Token'] = cartToken
    headers['Cookie'] = `cart_token=${cartToken}`
  }

  try {
    const res = await $fetch<{ token: string; customer: any }>(
      `${config.backendOrigin}/api/auth/login`,
      { method: 'POST', body, headers },
    )
    return { customer: res.customer, token: res.token }
  } catch (err: any) {
    // Forward the backend's validation message (wrong password / not approved)
    // instead of turning it into a generic "Server Error".
    const status = err?.response?.status || 500
    const data = err?.data

    // Laravel validation errors: { message, errors: { email: ["..."] } }
    const message =
      data?.errors?.email?.[0] ||
      data?.message ||
      'Giriş yapılamadı.'

    throw createError({
      statusCode: status,
      statusMessage: message,
      data: { message, errors: data?.errors },
    })
  }
})
