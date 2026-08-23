<script setup lang="ts">
import type { ProductCard as Card } from '~/types/catalog'

interface Tab { name: string; slug: string; products: Card[] }

/**
 * Which product fills the "Bu fiyatı Kaçırmayınız" rail.
 *
 * Set to a product slug — the same one that appears in its /urun/ URL. The
 * product has to be present in one of the three tabs below, since that's the
 * only product data this component receives; a slug from outside them won't
 * be found and the rail falls back to the first product of the first tab.
 *
 * Set to '' to always use that fallback.
 */
const DEAL_SLUG = '0126-qj-motor-yimi-150-fino-150-motosiklet-set-modulu'

const { data, pending } = await useApiFetch<{ deal: Card | null; tabs: Tab[] }>('/home/sections/deal', {
  key: 'home-section-deal',
  lazy: true,
  server: false,
})

const tabs = computed(() => data.value?.tabs ?? [])
const active = ref(0)

/** Every product across all tabs, so the pinned slug can be found whichever
    tab it happens to sit in. */
const allProducts = computed<Card[]>(() => tabs.value.flatMap(t => t.products ?? []))

const deal = computed<Card | null>(() => {
  if (DEAL_SLUG) {
    const pinned = allProducts.value.find(p => p.slug === DEAL_SLUG)
    if (pinned) return pinned
    // Wrong slug, or the product dropped out of these tabs. Rather than leave
    // the rail empty, fall through — but say so, because a silent swap is hard
    // to notice on a page this busy.
    if (import.meta.dev) {
      console.warn(`[DealTabs] DEAL_SLUG "${DEAL_SLUG}" isn't in any tab; using the first product instead.`)
    }
  }
  return allProducts.value[0] ?? null
})

// The deal comes out of the grid: the same product in both places, side by
// side, reads as a bug.
const products = computed(() =>
  (tabs.value[active.value]?.products ?? []).filter(p => p.id !== deal.value?.id),
)
</script>

<template>
  <section v-if="pending || deal || tabs.length" class="wrap mt-12">
    <div class="grid gap-5 lg:grid-cols-4">
      <div v-if="pending" class="grid min-w-0 grid-cols-2 gap-5 sm:grid-cols-3 lg:col-span-4 xl:grid-cols-4">
        <CardSkeleton :count="8" />
      </div>

      <template v-else>
        <!-- Deal rail. Sticky on tall screens so it stays alongside the grid
             instead of scrolling away from the products it competes with. -->
        <aside v-if="deal" class="min-w-0 lg:col-span-1">
          <!-- Brand border rather than the usual hairline: this panel is meant
               to be picked out from the cards beside it. -->
          <div class="rounded-lg border-2 border-brand p-4 sm:p-5 lg:sticky lg:top-24">
            <div class="mb-4 flex items-start justify-between gap-3">
              <h2 class="text-[15px] font-semibold text-ink">Bu fiyatı Kaçırmayınız</h2>
              <span
                v-if="deal.discount"
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
              >
                {{ deal.discount }}%
              </span>
            </div>

            <!-- Not a ProductCard: this slot reads photo first, name beneath,
                 and carries no stepper — the panel's job is to pull attention
                 to one product, and a second set of controls next to the grid's
                 dilutes that. Capped on mobile, where full width makes one
                 enormous card above a grid of small ones. -->
            <NuxtLink
              :to="`/urun/${deal.slug}/`"
              class="group mx-auto block max-w-[260px] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 lg:max-w-none"
            >
              <div class="relative aspect-square overflow-hidden rounded">
                <NuxtImg
                  v-if="deal.thumb"
                  :src="deal.thumb"
                  :alt="deal.title"
                  width="520" height="520"
                  sizes="260px lg:24vw"
                  loading="lazy"
                  draggable="false"
                  class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  :class="!deal.in_stock && 'opacity-60'"
                />
                <div v-else class="h-full w-full rounded bg-neutral-50" />

                <ul v-if="deal.badges.length" class="absolute left-0 top-0 flex flex-col items-start gap-1">
                  <li
                    v-for="b in deal.badges" :key="b.key"
                    class="rounded px-2 py-0.5 text-[10px] font-semibold text-white"
                    :class="{
                      'bg-green-600': b.key === 'new',
                      'bg-brand': b.key === 'free_shipping',
                      'bg-amber-500': b.key === 'preorder',
                    }"
                  >
                    {{ b.label }}
                  </li>
                </ul>

                <span
                  v-if="!deal.in_stock"
                  class="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/55 py-1 text-center text-xs font-semibold tracking-wide text-white"
                >
                  STOKTA YOK
                </span>
              </div>

              <!-- Below the photo and centred, which is what separates this
                   from a grid card at a glance. -->
              <h3
                class="mt-4 line-clamp-2 text-center text-[13px] font-medium leading-snug text-ink transition group-hover:text-brand"
                :title="deal.title"
              >
                {{ deal.title }}
              </h3>

              <p v-if="deal.price_visible" class="mt-2 text-center">
                <span class="text-[15px] font-bold text-price">{{ formatPrice(deal.price) }}</span>
                <span v-if="deal.old_price" class="ml-2 text-xs text-muted line-through">
                  {{ formatPrice(deal.old_price) }}
                </span>
              </p>
            </NuxtLink>
          </div>
        </aside>

        <!-- min-w-0 is load-bearing: without it this grid item's width floor is
             set by its contents, so the nowrap tab row below expands the column
             instead of scrolling inside it — and widens the whole page. -->
        <div class="min-w-0" :class="deal ? 'lg:col-span-3' : 'lg:col-span-4'">
          <div
            v-if="tabs.length"
            class="mb-6 flex gap-x-6 overflow-x-auto border-b border-line pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3"
          >
            <button
              v-for="(t, i) in tabs" :key="t.slug"
              type="button"
              class="relative shrink-0 cursor-pointer whitespace-nowrap pb-3 text-[15px] transition"
              :class="i === active ? 'font-medium text-brand' : 'text-ink hover:text-brand'"
              @click="active = i"
            >
              {{ t.name }}
              <span v-if="i === active" class="absolute inset-x-0 -bottom-[13px] h-0.5 bg-brand" />
            </button>
          </div>

          <!-- Card height follows card width, so the column count is the height
               control: three columns across this region made them enormous. -->
          <div class="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
            <ProductCard v-for="p in products" :key="p.id" :product="p" />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>