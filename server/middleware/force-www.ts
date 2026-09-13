export default defineEventHandler((event) => {
  const host = getRequestHeader(event, 'host') || ''
  // Redirect bare domain -> www (skip localhost/dev)
  if (host === 'aanahtar.com.tr') {
    const proto = getRequestHeader(event, 'x-forwarded-proto') || 'https'
    return sendRedirect(event, `${proto}://www.aanahtar.com.tr${event.path}`, 301)
  }
})
