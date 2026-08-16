<script setup lang="ts">
import type { Paginated, ProductCard as Card } from '~/types/catalog'

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug as string)

const { data: meta, error } = await useApiFetch<any>(() => `/category-page/${slug.value}`)

// A rate limit or a server fault is not a missing category — don't disguise
// infrastructure problems as 404s, or you'll debug the wrong thing.
if (error.value) {
  const status = error.value.statusCode ?? 500
  throw createError({
    statusCode: status === 404 ? 404 : status,
    statusMessage: status === 404
      ? 'Kategori bulunamadı'
      : 'Şu anda yüklenemedi, lütfen tekrar deneyin',
    fatal: true,
  })
}

// Filters live in the URL — shareable, back-button-safe, SSR-renderable.
const page = computed(() => Number(route.query.page) || 1)
const sort = computed(() => (route.query.sort as string) || 'default')
const brand = computed(() => (route.query.brand as string) || '')
const inStock = computed(() => route.query.in_stock === '1')

const { data: products, pending } = await useApiFetch<Paginated<Card>>('/products', {
  query: computed(() => ({
    category: slug.value,
    page: page.value,
    sort: sort.value,
    per_page: 24,
    ...(brand.value ? { brand: brand.value } : {}),
    ...(inStock.value ? { in_stock: 1 } : {}),
  })),
  watch: [page, sort, brand, inStock, slug],
})

function setQuery(patch: Record<string, any>) {
  const query: Record<string, any> = { ...route.query, ...patch, page: undefined }
  Object.keys(query).forEach(k => (query[k] === '' || query[k] == null) && delete query[k])
  router.push({ query })
}

const sorts = [
  { value: 'default', label: 'Varsayılan sıralama' },
  { value: 'newest', label: 'En yeniler' },
  { value: 'price_asc', label: 'Fiyat: düşükten yükseğe' },
  { value: 'price_desc', label: 'Fiyat: yüksekten düşüğe' },
  { value: 'name', label: 'İsme göre' },
]

useSeoMeta({
  title: () => meta.value?.category?.seo?.title,
  description: () => meta.value?.category?.seo?.description,
})
</script>

<template>
  <div v-if="meta" class="wrap py-6">
    <nav class="mb-5 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Anasayfa</NuxtLink>
      <template v-for="(c, i) in meta.breadcrumb" :key="c.slug">
        <span class="mx-1.5">/</span>
        <NuxtLink
          v-if="i < meta.breadcrumb.length - 1"
          :to="`/product-category/${c.slug}/`" class="hover:text-brand"
        >{{ c.name }}</NuxtLink>
        <span v-else class="text-ink">{{ c.name }}</span>
      </template>
    </nav>

    <div class="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
      <aside class="mb-6 lg:mb-0">
        <div v-if="meta.category.children.length" class="mb-7">
          <h3 class="mb-3 border-b border-line pb-2 text-[15px] font-semibold text-ink">
            Alt Kategoriler
          </h3>
          <ul class="space-y-2">
            <li v-for="c in meta.category.children" :key="c.slug">
              <NuxtLink :to="`/product-category/${c.slug}/`" class="text-[13px] text-ink hover:text-brand">
                {{ c.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="meta.brands?.length" class="mb-7">
          <h3 class="mb-3 border-b border-line pb-2 text-[15px] font-semibold text-ink">Markalar</h3>
          <ul class="space-y-2">
            <li v-for="b in meta.brands" :key="b.slug">
              <button
                type="button"
                class="flex w-full items-center justify-between text-left text-[13px] hover:text-brand"
                :class="brand === b.slug ? 'font-semibold text-brand' : 'text-ink'"
                @click="setQuery({ brand: brand === b.slug ? '' : b.slug })"
              >
                <span>{{ b.name }}</span>
                <span class="text-muted">({{ b.count }})</span>
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-3 border-b border-line pb-2 text-[15px] font-semibold text-ink">Stok Durumu</h3>
          <label class="flex cursor-pointer items-center gap-2 text-[13px] text-ink">
            <input
              type="checkbox" :checked="inStock" class="accent-brand"
              @change="setQuery({ in_stock: inStock ? '' : '1' })"
            >
            Sadece stokta olanlar
          </label>
        </div>
      </aside>

      <div>
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h1 class="text-xl font-semibold text-ink">{{ meta.category.name }}</h1>
            <p class="mt-0.5 text-[13px] text-muted">{{ products?.meta.total ?? 0 }} ürün</p>
          </div>

          <select
            :value="sort"
            class="h-10 rounded-md border border-line bg-white px-3 text-[13px] text-ink outline-none focus:border-brand"
            @change="setQuery({ sort: ($event.target as HTMLSelectElement).value })"
          >
            <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>

        <p v-if="!pending && !products?.data.length" class="py-16 text-center text-muted">
          Bu kategoride ürün bulunamadı.
        </p>

        <!-- 2 → 3 → 4. Skipping the 3-col step makes cards awkwardly narrow on
             tablets, where the 260px sidebar already eats much of the row. -->
        <div
          v-else
          class="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4"
          :class="pending && 'opacity-50 transition-opacity'"
        >
          <ProductCard v-for="p in products?.data" :key="p.id" :product="p" />
        </div>

        <div v-if="(products?.meta.last_page ?? 1) > 1" class="mt-8 flex justify-center gap-1">
          <NuxtLink
            v-for="n in products!.meta.last_page" :key="n"
            :to="{ query: { ...route.query, page: n } }"
            class="flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-[13px] transition"
            :class="n === page ? 'border-brand bg-brand text-white' : 'border-line text-ink hover:border-brand hover:text-brand'"
          >{{ n }}</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>