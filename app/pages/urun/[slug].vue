<script setup lang="ts">
/**
 * Set to true if catalogue prices are stored NET and VAT is added at checkout —
 * that's what the old site did ("335 ₺ + KDV"). Whatever you pick here must
 * also match the cart, checkout and the JSON-LD offer below, or Google will
 * flag the schema price as inconsistent with the page.
 */
const PRICES_EXCLUDE_VAT = true

const route = useRoute()
const slug = route.params.slug as string

const { data: product, error } = await useApiFetch<{ data: any }>(`/products/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ürün bulunamadı', fatal: true })
}

const p = computed(() => product.value?.data)
const images = computed<string[]>(() => p.value?.images ?? [])

/* --- Gallery ---------------------------------------------------------- */

const imageIndex = ref(0)
const image = computed(() => images.value[imageIndex.value] ?? null)
const lightbox = ref(false)
watch(p, () => (imageIndex.value = 0))

/* --- Sidebar ---------------------------------------------------------- */

const { data: categories } = await useCategories()
const catMenu = ref(false)

const { data: onSale } = await useApiFetch<{ data: any[] }>('/products?on_sale=1&per_page=3', {
  key: 'sidebar-on-sale',
  lazy: true,
  server: false,
})

/* --- Cart ------------------------------------------------------------- */

const { add, pending: cartPending } = useCart()
const qty = ref(1)
const added = ref(false)

const maxQty = computed(() => p.value?.max_quantity ?? 999)

async function addToCart() {
  if (!p.value?.purchasable) return
  await add(p.value.id, qty.value)
  added.value = true
  setTimeout(() => (added.value = false), 1800)
}

/* --- Spec / tabs ------------------------------------------------------- */

const specRows = computed(() => {
  const v = p.value
  const rows: { label: string; value: string }[] = []
  if (!v) return rows

  if (v.brands?.length) {
    rows.push({ label: 'Marka', value: v.brands.map((b: any) => b.name).join(', ') })
  }
  if (v.manufacturers?.length) {
    rows.push({ label: 'Üretici', value: v.manufacturers.map((m: any) => m.name).join(', ') })
  }
  for (const [name, vals] of Object.entries(v.attributes ?? {})) {
    rows.push({ label: String(name), value: (vals as string[]).join(', ') })
  }

  return rows
})

// Only tabs with something behind them, so an empty panel is impossible.
const tabs = computed(() => {
  const t: { key: string; label: string }[] = []
  if (p.value?.content) t.push({ key: 'content', label: 'Açıklama' })
  if (specRows.value.length) t.push({ key: 'spec', label: 'Specification' })
  if (p.value?.faq?.length) t.push({ key: 'faq', label: 'Sıkça Sorulan Sorular' })
  return t
})

const tab = ref('content')
watchEffect(() => {
  if (tabs.value.length && !tabs.value.some(t => t.key === tab.value)) {
    tab.value = tabs.value[0].key
  }
})

const openFaq = ref<number | null>(0)

/* --- Head -------------------------------------------------------------- */

// Resolved during setup: calling useRuntimeConfig() inside the computed defers
// it past the point where the Nuxt instance still exists.
const siteUrl = useRuntimeConfig().public.siteUrl
const canonical = computed(() => `${siteUrl}/urun/${slug}/`)

useSeoMeta({
  title: () => p.value?.seo?.title,
  description: () => p.value?.seo?.description,
  ogTitle: () => p.value?.seo?.title,
  ogDescription: () => p.value?.seo?.description,
  ogImage: () => images.value[0],
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead(() => {
  const v = p.value
  if (!v) return {}

  const graph: Record<string, any>[] = [{
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: v.title,
    sku: v.sku || undefined,
    image: images.value.length ? images.value : undefined,
    description: v.seo?.description || undefined,
    brand: v.brands?.[0]?.name ? { '@type': 'Brand', name: v.brands[0].name } : undefined,
    offers: {
      '@type': 'Offer',
      url: canonical.value,
      priceCurrency: v.currency || 'TRY',
      price: String(v.price ?? ''),
      availability: v.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }]

  if (v.faq?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: v.faq.map((f: any) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }

  return {
    link: [{ rel: 'canonical', href: canonical.value }],
    script: graph.map(g => ({ type: 'application/ld+json', innerHTML: JSON.stringify(g) })),
  }
})
</script>

<template>
  <div v-if="p" class="wrap py-6">
    <nav class="mb-6 flex flex-wrap items-center gap-3 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <template v-if="p.categories?.length">
        <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 6 6 6-6 6" />
        </svg>
        <NuxtLink
          :to="`/product-category/${p.categories[0].slug}/`"
          class="rounded-md bg-neutral-100 px-3 py-1.5 text-ink transition hover:text-brand"
        >
          {{ p.categories[0].name }}
        </NuxtLink>
      </template>
      <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">{{ p.title }}</span>
    </nav>

    <div class="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)_minmax(0,32rem)] lg:gap-10">
      <!-- Sidebar -->
      <aside class="hidden min-w-0 lg:block">
        <div class="rounded-lg border border-line">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3.5 text-left text-sm text-ink transition hover:text-brand"
            :class="catMenu && 'border-b border-line'"
            :aria-expanded="catMenu"
            @click="catMenu = !catMenu"
          >
            Show All Categories
            <svg
              class="h-4 w-4 shrink-0 text-muted transition-transform"
              :class="catMenu ? 'rotate-90' : ''"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            >
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>

          <!-- Full list, scrollable: there are ~38 categories and the panel
               shouldn't push the product off screen. -->
          <ul v-if="catMenu" class="max-h-96 divide-y divide-line overflow-y-auto">
            <li v-for="c in categories" :key="c.id">
              <NuxtLink
                :to="`/product-category/${c.slug}/`"
                class="block px-4 py-3 text-sm text-ink transition hover:bg-neutral-50 hover:text-brand"
              >
                {{ c.name }}
              </NuxtLink>
            </li>
          </ul>

          <NuxtLink
            v-if="!catMenu && p.categories?.length"
            :to="`/product-category/${p.categories[0].slug}/`"
            class="block border-t border-line px-4 py-3.5 text-sm font-medium text-ink transition hover:text-brand"
          >
            {{ p.categories[0].name }}
          </NuxtLink>
        </div>

        <div v-if="onSale?.data?.length" class="mt-8">
          <h2 class="inline-block border-b-2 border-brand pb-2 text-[15px] font-medium text-ink">
            İndirimli Ürünler
          </h2>

          <ul class="mt-4 divide-y divide-line border-t border-line">
            <li v-for="s in onSale.data" :key="s.id">
              <NuxtLink :to="`/urun/${s.slug}/`" class="group flex items-start gap-3 py-4">
                <NuxtImg
                  v-if="s.thumb" :src="s.thumb" :alt="s.title"
                  width="120" height="120" loading="lazy"
                  class="h-14 w-14 shrink-0 object-contain"
                />
                <span class="text-[13px] leading-snug text-ink transition group-hover:text-brand">
                  {{ s.title }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Gallery -->
      <div class="min-w-0">
        <div class="relative">
          <span
            v-if="p.old_price"
            class="absolute left-0 top-0 z-10 rounded bg-price px-2 py-1 text-xs font-bold text-white"
          >
            −%{{ Math.round((1 - p.price / p.old_price) * 100) }}
          </span>

          <!-- mode="out-in" so the outgoing image fades before the new one
               arrives; a cross-fade would need both stacked absolutely. -->
          <Transition name="img" mode="out-in">
            <button
              v-if="image"
              :key="image"
              type="button"
              aria-label="Görseli büyüt"
              class="block w-full cursor-zoom-in"
              @click="lightbox = true"
            >
              <NuxtImg
                :src="image" :alt="p.title"
                width="600" height="600" sizes="100vw lg:440px"
                class="mx-auto aspect-square w-full max-w-[440px] object-contain"
              />
            </button>
            <div v-else class="mx-auto aspect-square w-full max-w-[440px] rounded bg-neutral-50" />
          </Transition>
        </div>

        <div v-if="images.length > 1" class="mt-4 flex flex-wrap justify-center gap-4">
          <button
            v-for="(img, i) in images" :key="img"
            type="button"
            class="h-16 w-20 shrink-0 cursor-pointer border-b-2 pb-1 transition"
            :class="i === imageIndex ? 'border-brand' : 'border-transparent hover:border-line'"
            @click="imageIndex = i"
          >
            <NuxtImg :src="img" :alt="p.title" width="160" height="160" loading="lazy"
                     class="h-full w-full object-contain" />
          </button>
        </div>
      </div>

      <!-- Buy box -->
      <div class="min-w-0">
        <p v-if="p.categories?.length" class="text-[13px] text-muted">{{ p.categories[0].name }}</p>

        <h1 class="mt-1 text-2xl font-semibold leading-snug text-ink">{{ p.title }}</h1>

        <ul v-if="p.badges?.length" class="mt-4 flex flex-wrap gap-2">
          <li
            v-for="b in p.badges" :key="b.key"
            class="rounded-full border border-brand/30 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600"
          >
            {{ b.label }}
          </li>
        </ul>

        <table v-if="specRows.length" class="mt-5 w-full border-collapse text-sm">
          <tbody>
            <tr v-for="row in specRows" :key="row.label" class="border border-line">
              <th class="w-40 border-r border-line px-4 py-3 text-left font-normal text-ink">
                {{ row.label }}:
              </th>
              <td class="px-4 py-3 text-ink">{{ row.value }}</td>
            </tr>
          </tbody>
        </table>

        <hr class="mt-6 border-line">

        <p v-if="p.sku" class="mt-5 text-sm text-ink">SKU: {{ p.sku }}</p>

        <div class="mt-3 flex flex-wrap items-baseline gap-3">
          <span class="text-[2rem] font-semibold leading-none text-brand">{{ formatPrice(p.price) }}</span>
          <span v-if="p.old_price" class="text-base text-muted line-through">
            {{ formatPrice(p.old_price) }}
          </span>
          <span v-if="PRICES_EXCLUDE_VAT" class="text-2xl font-light text-brand">+ KDV</span>
        </div>

        <p v-if="p.preorder_release_date" class="mt-3 text-sm text-muted">
          Tahmini teslim: {{ formatOrderDate(p.preorder_release_date) }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-4">
          <div class="flex h-12 items-center rounded-full border border-line px-2">
            <button
              type="button" aria-label="Azalt" :disabled="qty <= 1"
              class="h-full w-9 cursor-pointer text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              @click="qty = Math.max(1, qty - 1)"
            >−</button>
            <input
              v-model.number="qty" type="number" min="1" :max="maxQty" aria-label="Adet"
              class="h-full w-12 bg-transparent text-center text-sm text-ink outline-none
                     [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            >
            <button
              type="button" aria-label="Artır"
              class="h-full w-9 cursor-pointer text-muted transition hover:text-brand"
              @click="qty = Math.min(maxQty, qty + 1)"
            >+</button>
          </div>

          <button
            type="button"
            :disabled="!p.purchasable || cartPending"
            class="flex h-12 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-brand px-10 text-[15px] font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-muted"
            @click="addToCart"
          >
            <svg v-if="added" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m5 13 4 4L19 7" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <path d="M3 5h3l2.2 10.5h10L20.5 8H7" /><circle cx="9.5" cy="19.5" r="1.5" /><circle cx="17.5" cy="19.5" r="1.5" />
            </svg>
            {{ added ? 'Sepete eklendi' : 'Sepete Ekle' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <section v-if="tabs.length" class="mt-14">
      <div class="flex flex-wrap justify-center gap-10 border-b border-line">
        <button
          v-for="t in tabs" :key="t.key"
          type="button"
          class="relative cursor-pointer pb-3 text-[15px] transition"
          :class="tab === t.key ? 'font-medium text-brand' : 'text-ink hover:text-brand'"
          @click="tab = t.key"
        >
          {{ t.label }}
          <span v-if="tab === t.key" class="absolute inset-x-0 -bottom-px h-0.5 bg-brand" />
        </button>
      </div>

      <div class="rounded-b-lg border border-t-0 border-line p-6 sm:p-8">
        <!-- Sanitised server-side in ProductDetailResource, so this v-html is
             balanced HTML with no scripts or event handlers. -->
        <div
          v-if="tab === 'content'"
          class="product-content"
          v-html="p.content"
        />

        <table v-else-if="tab === 'spec'" class="w-full border-collapse text-sm">
          <tbody>
            <tr v-for="row in specRows" :key="row.label" class="border border-line">
              <th class="w-48 border-r border-line bg-neutral-50 px-4 py-3 text-left font-medium text-muted">
                {{ row.label }}
              </th>
              <td class="px-4 py-3 text-ink">{{ row.value }}</td>
            </tr>
          </tbody>
        </table>

        <ul v-else-if="tab === 'faq'" class="divide-y divide-line">
          <li v-for="(f, i) in p.faq" :key="i">
            <button
              type="button"
              class="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
              :aria-expanded="openFaq === i"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span class="text-[15px] font-medium text-ink">{{ f.question }}</span>
              <svg
                class="h-5 w-5 shrink-0 text-muted transition-transform"
                :class="openFaq === i && 'rotate-180'"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div v-if="openFaq === i" class="prose prose-sm max-w-none pb-5 text-muted" v-html="f.answer" />
          </li>
        </ul>
      </div>
    </section>

    <!-- Fetched when scrolled near, not on page load. -->
      <LazySection>
        <ProductRelated :slug="slug" />
      </LazySection>

    <ProductLightbox
      v-if="lightbox"
      :images="images"
      :index="imageIndex"
      :title="p.title"
      @update:index="imageIndex = $event"
      @close="lightbox = false"
    />
  </div>
</template>

<style scoped>
.img-enter-active,
.img-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.img-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.img-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>