<script setup lang="ts">
import type { ProductCard as Card } from '~/types/catalog'

const props = withDefaults(defineProps<{
  products: Card[]
  /** Rendered as the section heading, with the arrows aligned opposite it. */
  title?: string
  /** Autoplay delay in ms. Set to 0 to disable autoplay. */
  interval?: number
}>(), { interval: 5000 })

const {
  track, page, pages, held, dragging,
  goTo, step, hold, onScroll, onPointerDown, onClickCapture,
} = useCarousel(props.interval)
</script>

<template>
  <div
    @pointerenter="held = true"
    @pointerleave="held = false"
    @focusin="held = true"
    @focusout="held = false"
  >
    <!-- Heading and arrows share a row, so the arrows never sit over a card. -->
    <div v-if="title || pages > 1" class="mb-5 flex items-end justify-between gap-4 border-b border-line">
      <h2 v-if="title" class="-mb-px inline-block border-b-2 border-brand pb-2 text-lg font-semibold text-ink">
        {{ title }}
      </h2>
      <span v-else />

      <div v-if="pages > 1" class="flex shrink-0 gap-2 pb-2">
        <button
          type="button" aria-label="Önceki ürünler"
          class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition hover:border-brand hover:text-brand"
          @click="step(-1)"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        <button
          type="button" aria-label="Sonraki ürünler"
          class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line text-ink transition hover:border-brand hover:text-brand"
          @click="step(1)"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </div>
    </div>

    <div
      ref="track"
      class="-mx-1 flex gap-5 overflow-x-auto overscroll-x-contain px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      :class="dragging ? 'cursor-grabbing select-none' : ['snap-x snap-mandatory', pages > 1 && 'lg:cursor-grab']"
      @scroll.passive="onScroll"
      @pointerdown="onPointerDown"
      @click.capture="onClickCapture"
      @dragstart.prevent
      @wheel.passive="hold"
      @touchmove.passive="hold"
    >
      <div
        v-for="p in products" :key="p.id"
        class="w-[calc(50%-0.625rem)] shrink-0 snap-start sm:w-[calc(33.333%-0.833rem)] lg:w-[calc(25%-0.9375rem)] xl:w-[calc(20%-1rem)]"
      >
        <ProductCard :product="p" />
      </div>
    </div>

    <div v-if="pages > 1" class="mt-2 flex justify-center gap-2">
      <button
        v-for="(_, i) in pages" :key="i"
        type="button" :aria-label="`Ürün grubu ${i + 1}`" :aria-current="i === page"
        class="h-2 cursor-pointer rounded-full transition-all"
        :class="i === page ? 'w-6 bg-brand' : 'w-2 bg-line hover:bg-muted'"
        @click="hold(); goTo(i)"
      />
    </div>
  </div>
</template>