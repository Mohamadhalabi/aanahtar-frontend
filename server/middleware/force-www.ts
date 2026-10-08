// server/middleware/force-www.ts
export default defineEventHandler((event) => {
  // Read the real host, including when behind Apache/Cloudflare
  const host = getRequestHost(event, { xForwardedHost: true }).split(':')[0]
  if (host !== 'aanahtar.com.tr') return

  const path = event.path || '/'
  // Never redirect internal/API/asset requests
  if (path.startsWith('/api/') || path.startsWith('/__sitemap') || path.startsWith('/_nuxt/')) return

  return sendRedirect(event, `https://www.aanahtar.com.tr${path}`, 301)
})