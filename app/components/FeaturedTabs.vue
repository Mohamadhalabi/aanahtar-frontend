<script setup lang="ts">
import type { ProductCard as Card } from '~/types/catalog'

interface Tab {
  name: string
  slug: string
  featured: Card | null
  products: Card[]
}

// Fetched here rather than in the page: this component only mounts once
// LazySection scrolls it into view, so the request goes out then and not
// before. `key` keeps it in the Nuxt payload, so scrolling past twice or
// navigating back doesn't hit the API again.
const { data, pending } = await useApiFetch<{ tabs: Tab[] }>('/home/sections/featured', {
  key: 'home-section-featured',
  lazy: true,
  server: false,
})

const tabs = computed(() => data.value?.tabs ?? [])
const active = ref(0)
const tab = computed(() => tabs.value[active.value])

// The featured slot falls back to the first product so a category that hasn't
// had one picked still fills the centre column instead of leaving a hole.
const featured = computed(() => tab.value?.featured ?? tab.value?.products[0] ?? null)

const rest = computed(() => {
  const list = tab.value?.products ?? []
  return (tab.value?.featured ? list : list.slice(1)).slice(0, 8)
})

/* --- Featured card ------------------------------------------------------
   Rendered here instead of through ProductCard: it's twice the width and
   keeps its gallery on show, neither of which is wanted on the eight cards
   around it. The quantity control is built the same way as ProductCard's,
   only larger and stretched to fill its row. */

const { add, pending: cartPending } = useCart()
const added = ref(false)
const qty = ref(1)

/** Typing into the field can leave it empty, or at 0, or at 4000. Everything
    that writes to qty goes through here so the cart never sees any of those. */
function setQty(n: unknown) {
  const parsed = Math.round(Number(n))
  qty.value = Number.isFinite(parsed) ? Math.min(999, Math.max(1, parsed)) : 1
}

/** `images` isn't on the Card type yet — if the list endpoint doesn't send it,
    this stays empty and the strip just doesn't render. */
const gallery = computed<string[]>(() => {
  const list = (featured.value as any)?.images
  if (!Array.isArray(list)) return []
  return list.filter(Boolean).slice(0, 4)
})

const preview = ref<string | null>(null)
const shown = computed(() => preview.value ?? featured.value?.thumb ?? null)

// A different tab is a different product, so neither the gallery selection nor
// the quantity can carry over — they belong to the product that's leaving.
watch(active, () => {
  preview.value = null
  qty.value = 1
})

async function addFeatured() {
  if (!featured.value?.in_stock) return
  await add(featured.value.id, qty.value)
  added.value = true
  setTimeout(() => (added.value = false), 1600)
}
</script>

<template>
  <!-- Full-bleed grey band: the section sets the background, `wrap` inside
       keeps the content on the same grid as everything else. -->
  <section v-if="pending || tabs.length" class="mt-12 bg-neutral-50 py-8 sm:py-10">
    <div class="wrap">
      <div v-if="pending" class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        <CardSkeleton :count="10" />
      </div>

      <template v-else>
        <!-- Nine labels wrap into a six-line stack on a 320px screen, so below
             `sm` this scrolls sideways instead. -->
        <div class="mb-6 flex gap-x-6 overflow-x-auto border-b border-line pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3">
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

        <!-- Six columns, three blocks of two: the featured card takes the same
             width as a whole 2x2 block, which is what makes it read as the
             centrepiece rather than a slightly bigger tile. -->
        <div class="grid gap-5 lg:grid-cols-6">
          <div class="grid min-w-0 grid-cols-2 gap-5 lg:order-first lg:col-span-2">
            <ProductCard v-for="p in rest.slice(0, 4)" :key="p.id" :product="p" />
          </div>

          <!-- Stretches the full height of both rows, so the photo gets the
               room that justifies the slot. -->
          <article
            v-if="featured"
            class="order-first flex min-w-0 flex-col rounded-lg border border-line bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,.09)] sm:p-4 lg:order-none lg:col-span-2"
          >
            <NuxtLink
              :to="`/urun/${featured.slug}/`"
              class="flex min-h-0 flex-1 flex-col rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <p class="mb-1.5 truncate text-[11px] text-muted">{{ featured.category }}</p>

              <h3 class="mb-4 line-clamp-2 text-[15px] font-medium leading-snug text-ink transition hover:text-brand" :title="featured.title">
                {{ featured.title }}
              </h3>

              <!-- min-h keeps the card tall on mobile, where there's no second
                   row of cards to stretch against. -->
              <div class="relative min-h-[14rem] flex-1 overflow-hidden rounded sm:min-h-[16rem]">
                <NuxtImg
                  v-if="shown"
                  :src="shown"
                  :alt="featured.title"
                  width="600" height="600"
                  sizes="100vw lg:34vw"
                  loading="lazy"
                  draggable="false"
                  class="absolute inset-0 h-full w-full object-contain"
                  :class="!featured.in_stock && 'opacity-60'"
                />
                <div v-else class="h-full w-full rounded bg-neutral-50" />

                <span
                  v-if="!featured.in_stock"
                  class="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/55 py-1 text-center text-xs font-semibold tracking-wide text-white"
                >
                  STOKTA YOK
                </span>
              </div>
            </NuxtLink>

            <p v-if="featured.price_visible" class="mt-4">
              <span class="text-lg font-bold text-price">{{ formatPrice(featured.price) }}</span>
              <span v-if="featured.old_price" class="ml-2 text-sm text-muted line-through">
                {{ formatPrice(featured.old_price) }}
              </span>
            </p>

            <!-- Gallery on its own row, controls on theirs: the stepper takes
                 whatever width the button leaves, at every breakpoint. Below
                 `sm` the stepper and button stack too — side by side they need
                 ~260px, which a 289px screen doesn't have once the card and
                 page padding come off. -->
            <div class="mt-4 space-y-3">
              <ul v-if="gallery.length > 1" class="flex flex-wrap gap-2">
                <li v-for="(img, i) in gallery" :key="i">
                  <button
                    type="button"
                    :aria-label="`Görsel ${i + 1}`"
                    class="block h-12 w-12 cursor-pointer overflow-hidden rounded-md border p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:h-14 sm:w-14"
                    :class="shown === img ? 'border-brand' : 'border-line hover:border-brand/50'"
                    @mouseenter="preview = img"
                    @focus="preview = img"
                    @click.prevent="preview = img"
                  >
                    <NuxtImg :src="img" alt="" width="56" height="56" loading="lazy" class="h-full w-full object-contain" />
                  </button>
                </li>
              </ul>

              <div class="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <!-- flex-1, so it fills the row rather than sitting at its
                     content width. Pill to match the button beside it;
                     overflow-hidden clips the divider lines to the pill ends. -->
                <div
                  class="flex h-11 w-full min-w-0 flex-1 items-center overflow-hidden rounded-full border border-line bg-white transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15"
                  :class="!featured.in_stock && 'opacity-50'"
                >
                  <button
                    type="button" aria-label="Azalt"
                    class="h-full w-11 shrink-0 cursor-pointer text-lg leading-none text-muted transition hover:bg-neutral-50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="qty <= 1 || !featured.in_stock"
                    @click="setQty(qty - 1)"
                  >−</button>

                  <input
                    :value="qty"
                    type="number" inputmode="numeric" min="1" max="999" aria-label="Adet"
                    :disabled="!featured.in_stock"
                    class="h-full w-full min-w-0 flex-1 border-x border-line bg-transparent text-center text-sm font-medium text-ink outline-none
                           disabled:cursor-not-allowed
                           [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                    @change="setQty(($event.target as HTMLInputElement).value)"
                    @blur="setQty(($event.target as HTMLInputElement).value)"
                  >

                  <button
                    type="button" aria-label="Artır"
                    class="h-full w-11 shrink-0 cursor-pointer text-lg leading-none text-muted transition hover:bg-neutral-50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="qty >= 999 || !featured.in_stock"
                    @click="setQty(qty + 1)"
                  >+</button>
                </div>

                <button
                  type="button"
                  :disabled="!featured.in_stock || cartPending"
                  class="inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-muted sm:w-auto"
                  :class="added && 'bg-green-600 hover:bg-green-600'"
                  @click="addFeatured"
                >
                  <svg v-if="added" class="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                  <svg v-else class="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                    <path d="M3 5h3l2.2 10.5h10L20.5 8H7" /><circle cx="9.5" cy="19.5" r="1.5" /><circle cx="17.5" cy="19.5" r="1.5" />
                  </svg>
                  {{ added ? 'Sepete eklendi' : 'Sepete Ekle' }}
                </button>
              </div>
            </div>
          </article>

          <div class="grid min-w-0 grid-cols-2 gap-5 lg:col-span-2">
            <ProductCard v-for="p in rest.slice(4, 8)" :key="p.id" :product="p" />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>