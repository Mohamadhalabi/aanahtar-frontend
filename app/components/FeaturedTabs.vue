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

        <!-- Three blocks rather than explicit grid placement: the featured card
             is one column between two 2x2 blocks, and it stacks first on mobile
             without any row/col-start juggling. -->
        <div class="grid gap-5 lg:grid-cols-5">
          <!-- items-center, not h-full: letting the card stretch across both
               rows just makes one very tall card with a stretched image. -->
          <div v-if="featured" class="order-first flex items-center lg:order-none lg:col-span-1">
            <ProductCard :product="featured" class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-5 lg:order-first lg:col-span-2">
            <ProductCard v-for="p in rest.slice(0, 4)" :key="p.id" :product="p" />
          </div>

          <div class="grid grid-cols-2 gap-5 lg:col-span-2">
            <ProductCard v-for="p in rest.slice(4, 8)" :key="p.id" :product="p" />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>