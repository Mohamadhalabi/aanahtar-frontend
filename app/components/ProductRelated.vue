<script setup lang="ts">
import type { ProductCard as Card } from '~/types/catalog'

const props = defineProps<{ slug: string }>()

// Mounted by LazySection only when scrolled near, so this request goes out
// then rather than on page load.
const { data, pending } = await useApiFetch<{ data: Card[] }>(`/products/${props.slug}/related`, {
  key: `related-${props.slug}`,
  lazy: true,
  server: false,
})

const products = computed(() => data.value?.data ?? [])
</script>

<template>
  <section v-if="pending || products.length" class="mt-14">
    <!-- The title goes to ProductCarousel rather than being rendered here:
         the carousel draws its own header row, and having both left a heading
         stacked on an empty one with a big gap between. -->
    <template v-if="pending">
      <h2 class="mb-5 inline-block border-b-2 border-brand pb-2 text-lg font-semibold text-ink">
        İlgili ürünler
      </h2>
      <div class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <CardSkeleton :count="5" />
      </div>
    </template>

    <ProductCarousel v-else title="İlgili ürünler" :products="products" :interval="0" />
  </section>
</template>