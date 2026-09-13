export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain')
  return `User-agent: *
Allow: /

# Private / transactional
Disallow: /sepet
Disallow: /odeme
Disallow: /my-account

# Search & filtered results (query-string URLs)
Disallow: /*?

Sitemap: https://www.aanahtar.com.tr/sitemap.xml
`
})
