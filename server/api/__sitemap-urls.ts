export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const key = { 'X-Client-Key': config.clientKey as string }
  const base = 'https://www.aanahtar.com.tr'
  const urls: any[] = []

  try {
    const cats: any = await $fetch(`${config.backendOrigin}/api/categories`, { headers: key })
    const walk = (list: any[]) => {
      for (const c of list ?? []) {
        if (c.slug) urls.push({ loc: `/product-category/${c.slug}`, changefreq: 'weekly' })
        if (c.children?.length) walk(c.children)
      }
    }
    walk(cats?.data ?? cats ?? [])
  } catch (e) { console.error('sitemap cats', e) }

  try {
    const res: any = await $fetch(`${config.backendOrigin}/api/sitemap-products`, { headers: key })
    for (const p of (res?.data ?? [])) {
      if (!p.slug) continue
      const entry: any = { loc: `/urun/${p.slug}`, changefreq: 'weekly' }
      if (p.images?.length) {
        entry.images = p.images.map((img: string) => ({
          loc: img.startsWith('http') ? img : `${base}${img}`,
        }))
      }
      urls.push(entry)
    }
  } catch (e) { console.error('sitemap products', e) }

  return urls
})
