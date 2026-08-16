<script setup lang="ts">
import type { ProductCard as Card } from '~/types/catalog'

interface Tab { name: string; slug: string; products: Card[] }

const { data, pending } = await useApiFetch<{ deal: Card | null; tabs: Tab[] }>('/home/sections/deal', {
  key: 'home-section-deal',
  lazy: true,
  server: false,
})

const deal = computed(() => data.value?.deal ?? null)
const tabs = computed(() => data.value?.tabs ?? [])
const active = ref(0)
const products = computed(() => tabs.value[active.value]?.products ?? [])
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
          <div class="rounded-lg border border-line p-4 sm:p-5 lg:sticky lg:top-24">
            <div class="mb-4 flex items-start justify-between gap-3">
              <h2 class="text-[15px] font-semibold text-ink">Bu fiyatı Kaçırmayınız</h2>
              <span
                v-if="deal.discount"
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
              >
                {{ deal.discount }}%
              </span>
            </div>

            <!-- Capped on mobile: full width makes one enormous card above a
                 grid of small ones. -->
            <div class="mx-auto max-w-[260px] lg:max-w-none">
              <ProductCard :product="deal" />
            </div>
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