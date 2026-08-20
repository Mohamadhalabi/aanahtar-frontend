<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const slug = computed(() => String(route.params.slug))

const sort = computed(() => String(route.query.sort ?? 'default'))
const perPage = computed(() => Number(route.query.per_page ?? 16))
const page = computed(() => Number(route.query.page ?? 1))

/** Router gives a single value or an array depending on count. */
function asArray(value: any): string[] {
  if (!value) return []
  return (Array.isArray(value) ? value : [value]).map(String).filter(Boolean)
}

const attrIds = computed(() => asArray(route.query.attr).map(Number).filter(Boolean))
const brands = computed(() => [...new Set([...asArray(route.query.brands), ...asArray(route.query.brand)])])
const manufacturers = computed(() =>
  [...new Set([...asArray(route.query.manufacturers), ...asArray(route.query.manufacturer)])])
const inStock = computed(() => route.query.in_stock === '1')

/** Shared by both requests, so the facets always describe the visible results. */
function baseParams() {
  const p = new URLSearchParams()
  p.set('category', slug.value)
  for (const b of brands.value) p.append('brands[]', b)
  for (const m of manufacturers.value) p.append('manufacturers[]', m)
  for (const id of attrIds.value) p.append('attr[]', String(id))
  if (inStock.value) p.set('in_stock', '1')
  return p
}

const endpoint = computed(() => {
  const p = baseParams()
  p.set('sort', sort.value)
  p.set('per_page', String(perPage.value))
  p.set('page', String(page.value))
  return `/products?${p.toString()}`
})

const filtersUrl = computed(() => `/filters?${baseParams().toString()}`)

// Header, breadcrumb and children — one request, independent of the filters.
const { data: pageData, error } = await useApiFetch<any>(() => `/category-page/${slug.value}`, {
  key: () => `category-page-${slug.value}`,
  watch: [slug],
})

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Kategori bulunamadı', fatal: true })
}

const category = computed(() => pageData.value?.category ?? null)
const breadcrumb = computed(() => pageData.value?.breadcrumb ?? [])

const { data, pending } = await useApiFetch<any>(endpoint, {
  key: () => `category-${endpoint.value}`,
  watch: [endpoint],
})

const products = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta ?? { total: 0, current_page: 1, last_page: 1, from: 0, to: 0 })

// Client-side and lazy: the grid shouldn't wait on the sidebar.
const { data: facets } = await useApiFetch<any>(filtersUrl, {
  key: () => `category-filters-${filtersUrl.value}`,
  lazy: true,
  server: false,
  watch: [filtersUrl],
})

// Full tree, so the customer can move to any category without going back to
// the shop page first.
const { data: categories } = await useCategories()
const { data: countData } = await useApiFetch<{ counts: Record<string, number> }>('/categories-counts', {
  key: 'category-counts',
  lazy: true,
  server: false,
})
const counts = computed(() => countData.value?.counts ?? {})

/** A different category is a different page, not a filter — so this navigates
    rather than pushing a query, and the filters reset with it. */
function goToCategory(next: string) {
  navigateTo(`/product-category/${next}/`)
}

/** Query updates always reset to page 1 — staying on page 4 of a new filter
    strands the customer on an empty result set. */
function setQuery(patch: Record<string, any>, keepPage = false) {
  const next: Record<string, any> = { ...route.query, ...patch }
  if (!keepPage) delete next.page
  for (const k of Object.keys(next)) {
    const v = next[k]
    if (v === '' || v == null || (Array.isArray(v) && !v.length)) delete next[k]
  }
  router.push({ path: route.path, query: next })
}

function setBrands(list: string[]) {
  setQuery({ brands: list, brand: undefined })
}

function setManufacturers(list: string[]) {
  setQuery({ manufacturers: list, manufacturer: undefined })
}

function clearFilters() {
  router.push({ path: route.path, query: {} })
}

function goToPage(n: number) {
  if (n < 1 || n > meta.value.last_page) return
  setQuery({ page: n }, true)
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* --- Active filter chips ---------------------------------------------- */

function attrValue(id: number) {
  for (const a of facets.value?.attributes ?? []) {
    const v = a.values.find((x: any) => x.id === id)
    if (v) return v
  }
  return null
}

function facetName(list: any[], slugValue: string) {
  return list?.find((x: any) => x.slug === slugValue)?.name ?? slugValue
}

const chips = computed(() => {
  const out: { key: string; label: string; remove: () => void }[] = []

  for (const id of attrIds.value) {
    // Falls back to the id while the facets are still loading.
    out.push({
      key: `a-${id}`,
      label: attrValue(id)?.name ?? String(id),
      remove: () => setQuery({ attr: attrIds.value.filter(x => x !== id) }),
    })
  }

  for (const s of brands.value) {
    out.push({
      key: `b-${s}`,
      label: facetName(facets.value?.brands, s),
      remove: () => setBrands(brands.value.filter(x => x !== s)),
    })
  }

  for (const s of manufacturers.value) {
    out.push({
      key: `m-${s}`,
      label: facetName(facets.value?.manufacturers, s),
      remove: () => setManufacturers(manufacturers.value.filter(x => x !== s)),
    })
  }

  if (inStock.value) {
    out.push({ key: 'stock', label: 'Sadece stokta olanlar', remove: () => setQuery({ in_stock: undefined }) })
  }

  return out
})

const mobileFilters = ref(false)

const sorts = [
  { value: 'default', label: 'Varsayılan sıralama' },
  { value: 'newest', label: 'En yeniler' },
  { value: 'price_asc', label: 'Fiyat: düşükten yükseğe' },
  { value: 'price_desc', label: 'Fiyat: yüksekten düşüğe' },
  { value: 'name', label: 'İsme göre' },
]

useSeoMeta({
  title: () => category.value?.seo?.title,
  description: () => category.value?.seo?.description,
  // Filtered and paginated permutations are near-duplicates; only the clean
  // category page is worth indexing.
  robots: () => (page.value > 1 || chips.value.length ? 'noindex, follow' : 'index, follow'),
})
</script>

<template>
  <div v-if="category" class="wrap py-6">
    <nav class="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <template v-for="(crumb, i) in breadcrumb" :key="crumb.slug">
        <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 6 6 6-6 6" />
        </svg>
        <NuxtLink
          v-if="i < breadcrumb.length - 1"
          :to="`/product-category/${crumb.slug}/`"
          class="hover:text-brand"
        >
          {{ crumb.name }}
        </NuxtLink>
        <span v-else class="text-ink">{{ crumb.name }}</span>
      </template>
    </nav>

    <div class="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
      <!-- Sidebar. Hidden on mobile behind a toggle: filters above a grid push
           the products off the first screen entirely. -->
      <aside class="min-w-0 space-y-4" :class="mobileFilters ? 'block' : 'hidden lg:block'">
        <!-- Active filters, above everything: what's applied should be visible
             without scrolling through the panels that applied it. -->
        <div v-if="chips.length" class="rounded-lg border border-line p-3">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-xs font-medium uppercase tracking-wide text-muted">Seçili filtreler</span>
            <button type="button" class="cursor-pointer text-xs text-brand hover:underline" @click="clearFilters">
              Tümünü temizle
            </button>
          </div>

          <ul class="flex flex-wrap gap-2">
            <li v-for="chip in chips" :key="chip.key">
              <button
                type="button"
                class="flex cursor-pointer items-center gap-1.5 rounded-full bg-brand/10 py-1 pl-3 pr-2 text-[13px] text-brand transition hover:bg-brand/20"
                @click="chip.remove()"
              >
                {{ chip.label }}
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <!-- Whole tree, current branch expanded — jumping to a sibling or a
             child shouldn't require going back to the shop page. -->
        <div class="rounded-lg border border-line">
          <div class="flex items-center justify-between border-b border-line px-4 py-3">
            <span class="text-sm font-medium text-ink">Kategoriler</span>
            <NuxtLink to="/magaza" class="text-xs text-brand hover:underline">Tümü</NuxtLink>
          </div>

          <div class="max-h-[28rem] overflow-y-auto">
            <CategoryFilter
              :nodes="categories"
              :counts="counts"
              :active="slug"
              @select="goToCategory($event)"
            />
          </div>
        </div>

        <div class="rounded-lg border border-line px-4 py-3">
          <label class="flex cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              class="accent-[var(--color-brand,#2563eb)]"
              :checked="inStock"
              @change="setQuery({ in_stock: inStock ? undefined : '1' })"
            >
            <span class="text-ink">Sadece stokta olanlar</span>
          </label>
        </div>

        <ProductFilters
          v-if="facets"
          :attributes="facets.attributes ?? []"
          :brands="facets.brands ?? []"
          :manufacturers="facets.manufacturers ?? []"
          :selected="attrIds"
          :active-brands="brands"
          :active-manufacturers="manufacturers"
          @update:attr="setQuery({ attr: $event })"
          @update:brands="setBrands"
          @update:manufacturers="setManufacturers"
        />
      </aside>

      <!-- Results -->
      <div class="min-w-0">
        <div class="mb-5">
          <h1 class="text-2xl font-semibold text-ink">{{ category.name }}</h1>
          <p class="mt-1 text-[13px] text-muted">{{ meta.total }} ürün</p>

          <!-- Children as quick links, so the most likely next click is one
               tap away rather than buried in the tree. -->
          <ul v-if="category.children?.length" class="mt-4 flex flex-wrap gap-2">
            <li v-for="child in category.children" :key="child.slug">
              <NuxtLink
                :to="`/product-category/${child.slug}/`"
                class="inline-block rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink transition hover:border-brand hover:text-brand"
              >
                {{ child.name }}
              </NuxtLink>
            </li>
          </ul>

          <p
            v-if="category.description"
            class="product-content mt-4 max-w-3xl"
            v-html="category.description"
          />
        </div>

        <div class="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line px-4 py-3">
          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-line px-4 text-sm text-ink transition hover:border-brand hover:text-brand lg:hidden"
              @click="mobileFilters = !mobileFilters"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
              Filtreler
              <span v-if="chips.length" class="rounded-full bg-brand px-1.5 text-[11px] text-white">{{ chips.length }}</span>
            </button>

            <select
              :value="sort"
              class="h-10 cursor-pointer rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none"
              @change="setQuery({ sort: ($event.target as HTMLSelectElement).value })"
            >
              <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>

            <select
              :value="perPage"
              class="h-10 cursor-pointer rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none"
              @change="setQuery({ per_page: ($event.target as HTMLSelectElement).value })"
            >
              <option v-for="n in [16, 24, 48]" :key="n" :value="n">{{ n }} ürün</option>
            </select>
          </div>

          <div v-if="meta.last_page > 1" class="flex items-center gap-2 text-sm text-muted">
            <span>{{ meta.current_page }} / {{ meta.last_page }}</span>
            <button
              type="button" aria-label="Önceki sayfa"
              class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-line transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="meta.current_page <= 1"
              @click="goToPage(meta.current_page - 1)"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <button
              type="button" aria-label="Sonraki sayfa"
              class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-line transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="meta.current_page >= meta.last_page"
              @click="goToPage(meta.current_page + 1)"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <div v-if="pending" class="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          <CardSkeleton :count="8" />
        </div>

        <div v-else-if="!products.length" class="rounded-lg border border-line px-6 py-20 text-center">
          <p class="text-sm text-muted">Bu seçimle eşleşen ürün bulunmuyor.</p>
          <button v-if="chips.length" type="button" class="btn-ghost mt-6" @click="clearFilters">
            Filtreleri temizle
          </button>
        </div>

        <div v-else class="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          <ProductCard v-for="p in products" :key="p.id" :product="p" />
        </div>

        <!-- Numbered pages at the bottom; the top control is for quick paging. -->
        <div v-if="meta.last_page > 1" class="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            class="h-10 cursor-pointer rounded-lg border border-line px-4 text-sm transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="meta.current_page <= 1"
            @click="goToPage(meta.current_page - 1)"
          >
            Önceki
          </button>

          <button
            v-for="n in meta.last_page" :key="n"
            v-show="Math.abs(n - meta.current_page) < 3 || n === 1 || n === meta.last_page"
            type="button"
            class="h-10 min-w-10 cursor-pointer rounded-lg border px-3 text-sm transition"
            :class="n === meta.current_page
              ? 'border-brand bg-brand text-white'
              : 'border-line text-ink hover:border-brand hover:text-brand'"
            @click="goToPage(n)"
          >
            {{ n }}
          </button>

          <button
            type="button"
            class="h-10 cursor-pointer rounded-lg border border-line px-4 text-sm transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="meta.current_page >= meta.last_page"
            @click="goToPage(meta.current_page + 1)"
          >
            Sonraki
          </button>
        </div>
      </div>
    </div>
  </div>
</template>