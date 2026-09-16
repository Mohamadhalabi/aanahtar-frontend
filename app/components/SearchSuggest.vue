<script setup lang="ts">
// Explicit rather than relying on auto-import: if Nuxt isn't scanning
// app/utils, `highlight` is undefined and the template throws the moment
// results arrive — which looks like the dropdown hanging on its skeleton.
import { highlight } from '~/utils/highlight'

const props = defineProps<{
  term: string
  focused: boolean
  /** Slug from the scope dropdown beside the input. Empty = all categories. */
  category?: string
}>()

const emit = defineEmits<{ close: [] }>()

interface Suggestion {
  id: number
  title: string
  slug: string
  sku: string | null
  thumb: string | null
  price: number | null
  old_price: number | null
  price_visible: boolean
  category: string | null
}

const items = ref<Suggestion[]>([])
const total = ref(0)
const loading = ref(false)
const active = ref(-1)
const list = ref<HTMLUListElement | null>(null)

// Suggest is a public route with no auth middleware, so without this header
// the backend sees a guest and strips the prices.
const auth = useCookie<string | null>('auth_token')

// This is raw $fetch, not useApiFetch, so nothing attaches X-Currency for us.
// Without it Currencies::current() falls back to the base currency and the
// dropdown showed unconverted USD figures under whatever symbol was selected
// — ₺3 and €3 for the same product.
const currency = useCurrencyCode()

let timer: ReturnType<typeof setTimeout> | undefined
let seq = 0

async function fetchSuggestions(term: string) {
  const mine = ++seq
  loading.value = true

  try {
    const res = await $fetch<any>('/api/search/suggest', {
      params: { q: term, ...(props.category ? { category: props.category } : {}) },
      headers: {
        ...(auth.value ? { Authorization: `Bearer ${auth.value}` } : {}),
        ...(currency.value ? { 'X-Currency': currency.value } : {}),
      },
    })

    // Out-of-order responses would otherwise flicker older results back in.
    if (mine !== seq) return

    const raw = res?.items
    items.value = Array.isArray(raw) ? raw : (raw?.data ?? [])
    total.value = res?.total ?? 0
    // New results start at the top, not wherever the last list was scrolled.
    nextTick(() => list.value?.scrollTo({ top: 0 }))
  } catch {
    if (mine === seq) {
      items.value = []
      total.value = 0
    }
  } finally {
    if (mine === seq) loading.value = false
  }
}

// Debounced: a request per keystroke would fire a dozen queries for one word.
// Watching the category too, so changing the scope re-runs the current term.
// `focused` is in the list as well: both the desktop and the mobile instance
// of this component are mounted at once and share `term`, so without the
// focus gate every keystroke fired the same query twice.
watch([() => props.term, () => props.category, () => props.focused], ([term]) => {
  clearTimeout(timer)
  active.value = -1

  if (!props.focused) return

  if (String(term).trim().length < 2) {
    items.value = []
    total.value = 0
    return
  }

  // Already have results for this term — reopening the panel shouldn't blank
  // it and re-query.
  if (items.value.length && String(term) === lastFetched) return

  timer = setTimeout(() => {
    lastFetched = String(term)
    fetchSuggestions(String(term))
  }, 250)
})

// Cached results are priced in the old currency, so they're dropped rather
// than left on screen with the new symbol — which is the same wrong-number
// bug in a different guise. Clearing lastFetched lets the watcher above
// re-query the term the visitor still has typed.
watch(currency, () => {
  items.value = []
  total.value = 0
  lastFetched = ''
})

let lastFetched = ''

onUnmounted(() => clearTimeout(timer))

const visible = computed(() => props.focused && props.term.trim().length >= 2)

function go(item: Suggestion) {
  emit('close')
  navigateTo(`/urun/${item.slug}/`)
}

function seeAll() {
  emit('close')
  navigateTo({
    path: '/shop',
    query: { q: props.term, ...(props.category ? { category: props.category } : {}) },
  })
}

// Exposed so the header's keydown handlers can drive the list.
function move(dir: number) {
  if (!items.value.length) return
  active.value = (active.value + dir + items.value.length) % items.value.length
  // The list scrolls now, so arrowing past the last visible row has to bring
  // the highlighted one into view (and wrap back to the top on the way round).
  nextTick(() => {
    const row = list.value?.children[active.value] as HTMLElement | undefined
    row?.scrollIntoView({ block: 'nearest' })
  })
}

function enter() {
  if (active.value >= 0 && items.value[active.value]) go(items.value[active.value])
  else seeAll()
}

defineExpose({ move, enter })
</script>

<template>
  <div
    v-if="visible"
    class="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-line bg-white shadow-[0_12px_40px_rgba(0,0,0,.14)]"
  >
    <div v-if="loading && !items.length" class="space-y-2 p-3">
      <div v-for="i in 3" :key="i" class="h-[52px] animate-pulse rounded-lg bg-neutral-100" />
    </div>

    <div v-else-if="!items.length" class="px-4 py-6 text-center text-sm text-muted">
      Sonuç bulunamadı.
    </div>

    <template v-else>
      <!-- Rows of ~66px in a list capped at 360px: about five and a half
           rows show, so the half-cut row tells you there's more to
           scroll. overscroll-contain keeps the page behind from scrolling
           once you reach the end. -->
      <ul ref="list" class="max-h-[360px] divide-y divide-line overflow-y-auto overscroll-contain">
        <li v-for="(item, i) in items" :key="item.id">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center gap-3.5 px-4 py-2.5 text-left transition"
            :class="i === active ? 'bg-neutral-50' : 'hover:bg-neutral-50'"
            @mousedown.prevent="go(item)"
            @mouseenter="active = i"
          >
            <NuxtImg
              v-if="item.thumb" :src="item.thumb" :alt="item.title"
              width="104" height="104" loading="lazy"
              class="h-[52px] w-[52px] shrink-0 rounded-md border border-line object-contain p-0.5"
            />
            <div v-else class="h-[52px] w-[52px] shrink-0 rounded-md bg-neutral-50" />

            <span class="min-w-0 flex-1">
              <!-- highlight() escapes the text and only injects <mark>.
                   One line, cut with an ellipsis; the full name is on hover. -->
              <span
                class="block truncate text-sm leading-snug text-ink [&_mark]:bg-brand/15 [&_mark]:font-semibold [&_mark]:text-brand"
                :title="item.title"
                v-html="highlight(item.title, term)"
              />
              <span class="mt-0.5 flex min-w-0 items-center gap-x-2 text-xs text-muted">
                <span
                  v-if="item.sku"
                  class="shrink-0 [&_mark]:bg-brand/15 [&_mark]:text-brand"
                  v-html="highlight(item.sku, term)"
                />
                <span v-if="item.category" class="truncate">· {{ item.category }}</span>
              </span>
            </span>

            <span v-if="item.price_visible && item.price !== null" class="shrink-0 text-right">
              <span class="block text-[15px] font-bold text-price">{{ formatPrice(item.price) }}</span>
              <span v-if="item.old_price" class="block text-xs text-muted line-through">
                {{ formatPrice(item.old_price) }}
              </span>
            </span>
          </button>
        </li>
      </ul>

      <button
        v-if="total > items.length"
        type="button"
        class="w-full cursor-pointer border-t border-line bg-neutral-50 px-4 py-3 text-center text-sm font-medium text-brand transition hover:bg-neutral-100"
        @mousedown.prevent="seeAll"
      >
        Tüm sonuçları gör ({{ total }})
      </button>
    </template>
  </div>
</template>