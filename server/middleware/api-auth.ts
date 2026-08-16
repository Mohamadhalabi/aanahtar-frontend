export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/')) return

  const token = getCookie(event, 'auth_token')
  if (token) {
    event.node.req.headers.authorization = `Bearer ${token}`
  }
})