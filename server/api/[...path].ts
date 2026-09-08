export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = getRouterParam(event, 'path')
  const query = getQuery(event)

  const headers: Record<string, string> = {
    'X-Client-Key': config.clientKey,
  }

  // Pass the visitor's own credentials through — the client key is not a
  // substitute for them.
  for (const h of ['authorization', 'x-cart-token', 'x-currency']) {
    const value = getHeader(event, h)
    if (value) headers[h] = value
  }

  // So Laravel's rate limiters see the real visitor, not this server.
  headers['x-forwarded-for'] = getRequestIP(event, { xForwardedFor: true }) || ''

  try {
    return await $fetch(`${config.backendOrigin}/api/${path}`, {
      method: getMethod(event),
      query,
      body: ['GET', 'HEAD'].includes(getMethod(event))
        ? undefined
        : await readBody(event).catch(() => undefined),
      headers,
    })
  } catch (err: any) {
    // Forward Laravel's status and body rather than turning everything into
    // a 500 — the frontend needs to tell a 401 from a 422.
    throw createError({
      statusCode: err?.response?.status || 502,
      statusMessage: err?.response?.statusText || 'Upstream error',
      data: err?.data,
    })
  }
})