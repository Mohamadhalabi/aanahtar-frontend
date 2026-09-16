export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    return await $fetch(`${config.backendOrigin}/api/auth/reset-password`, {
      method: 'POST',
      body,
      headers: { 'X-Client-Key': config.clientKey as string },
    })
  } catch (err: any) {
    const status = err?.response?.status || 500
    const data = err?.data
    const message =
      data?.errors?.email?.[0] ||
      data?.errors?.password?.[0] ||
      data?.message ||
      'Şifre sıfırlanamadı.'

    throw createError({
      statusCode: status,
      statusMessage: message,
      data: { message, errors: data?.errors },
    })
  }
})
