<script setup lang="ts">
import type { ProductCard as Card } from '~/types/catalog'

interface Tab { name: string; slug: string; products: Card[] }

const props = withDefaults(defineProps<{
  title: string
  /** Off by default: this is a browse shelf, not a promo slot. */
  interval?: number
}>(), { interval: 0 })

const { data, pending } = await useApiFetch<{ tabs: Tab[] }>('/home/sections/collection', {
  key: 'home-section-collection',
  lazy: true,
  server: false,
})

const tabs = computed(() => data.value?.tabs ?? [])
const active = ref(0)
const products = computed(() => tabs.value[active.value]?.products ?? [])

const {
  track, page, pages, held, dragging, measure,
  goTo, hold, onScroll, onPointerDown, onClickCapture,
} = useCarousel(props.interval)

// Switching tabs swaps the whole track contents, so the page count and the
// scroll position both have to be reset before the dots mean anything.
async function select(i: number) {
  active.value = i
  await nextTick()
  track.value?.scrollTo({ left: 0, behavior: 'auto' })
  measure()
}

// Same problem when the fetch resolves: the track goes from empty to full.
watch(products, async () => {
  await nextTick()
  measure()
})
</script>

<template>
  <section
    v-if="pending || tabs.length"
    class="wrap mt-12"
    @pointerenter="held = true"
    @pointerleave="held = false"
    @focusin="held = true"
    @focusout="held = false"
  >
    <div class="mb-6 border-b border-line pb-3">
      <h2 class="text-lg font-semibold text-ink">{{ title }}</h2>

      <!-- Under the heading on mobile, beside it once there's room. -->
      <div
        v-if="tabs.length > 1"
        class="-mb-1 mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-0 sm:flex-wrap sm:justify-end"
      >
        <button
          v-for="(t, i) in tabs" :key="t.slug"
          type="button"
          class="shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition"
          :class="i === active ? 'bg-brand/10 font-medium text-brand' : 'text-muted hover:text-brand'"
          @click="select(i)"
        >
          {{ t.name }}
        </button>
      </div>
    </div>

    <div v-if="pending" class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      <CardSkeleton :count="6" />
    </div>

    <!-- grid-flow-col: cards fill top-to-bottom then across, so one horizontal
         page shows both rows at once. auto-cols sets the column width, which is
         what makes a page a whole number of cards. One row on mobile — two rows
         of 2-up cards is most of a phone screen for one shelf. -->
    <div
      v-else
      ref="track"
      class="-mx-1 grid grid-flow-col grid-rows-1 gap-5 overflow-x-auto overscroll-x-contain px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden auto-cols-[calc(50%-0.625rem)] sm:grid-rows-2 sm:auto-cols-[calc(33.333%-0.833rem)] lg:auto-cols-[calc(25%-0.9375rem)] xl:auto-cols-[calc(16.666%-1.042rem)]"
      :class="dragging ? 'cursor-grabbing select-none' : ['snap-x snap-mandatory', pages > 1 && 'lg:cursor-grab']"
      @scroll.passive="onScroll"
      @pointerdown="onPointerDown"
      @click.capture="onClickCapture"
      @dragstart.prevent
      @wheel.passive="hold"
      @touchmove.passive="hold"
    >
      <div v-for="p in products" :key="p.id" class="snap-start">
        <ProductCard :product="p" class="h-full" />
      </div>
    </div>

    <div v-if="pages > 1" class="mt-2 flex flex-wrap justify-center gap-2">
      <button
        v-for="(_, i) in pages" :key="i"
        type="button" :aria-label="`Ürün grubu ${i + 1}`" :aria-current="i === page"
        class="h-2 cursor-pointer rounded-full transition-all"
        :class="i === page ? 'w-6 bg-brand' : 'w-2 bg-line hover:bg-muted'"
        @click="hold(); goTo(i)"
      />
    </div>
  </section>
</template>