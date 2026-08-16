<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: product, error } = await useApiFetch<{ data: any }>(`/products/${slug}`)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ürün bulunamadı', fatal: true })
}

const p = computed(() => product.value?.data)
const activeImage = ref<string | null>(null)
const image = computed(() => activeImage.value ?? p.value?.images?.[0] ?? null)

useSeoMeta({
  title: () => p.value?.seo?.title,
  description: () => p.value?.seo?.description,
  ogTitle: () => p.value?.seo?.title,
  ogImage: () => p.value?.images?.[0],
})
</script>

<template>
  <div v-if="p" class="mx-auto max-w-[1200px] px-4 py-6">
    <nav class="mb-4 text-xs text-neutral-500">
      <NuxtLink to="/" class="hover:text-brand-500">Anasayfa</NuxtLink>
      <template v-if="p.categories?.length">
        <span class="mx-1">/</span>
        <NuxtLink
          :to="`/product-category/${p.categories[0].slug}/`"
          class="hover:text-brand-500"
        >{{ p.categories[0].name }}</NuxtLink>
      </template>
    </nav>

    <div class="grid gap-8 lg:grid-cols-2">
      <div>
        <div class="border border-line bg-white p-4">
          <img
            v-if="image" :src="image" :alt="p.title"
            class="mx-auto aspect-square w-full object-contain"
          >
        </div>

        <div v-if="p.images.length > 1" class="mt-2 flex gap-2">
          <button
            v-for="img in p.images" :key="img"
            type="button"
            class="h-16 w-16 border p-1"
            :class="img === image ? 'border-brand-500' : 'border-line'"
            @click="activeImage = img"
          >
            <img :src="img" :alt="p.title" class="h-full w-full object-contain">
          </button>
        </div>
      </div>

      <div>
        <h1 class="text-xl font-semibold text-ink">{{ p.title }}</h1>
        <p v-if="p.sku" class="mt-1 text-xs text-neutral-500">Ürün Kodu: {{ p.sku }}</p>

        <ul v-if="p.badges.length" class="mt-3 flex flex-wrap gap-1.5">
          <li
            v-for="b in p.badges" :key="b.key"
            class="border border-brand-500/30 bg-brand-50 px-2 py-0.5 text-[11px] text-brand-600"
          >{{ b.label }}</li>
        </ul>

        <div class="mt-4 flex items-baseline gap-3 border-y border-line py-4">
          <span class="text-3xl font-bold text-price">{{ formatPrice(p.price) }}</span>
          <span v-if="p.old_price" class="text-sm text-neutral-400 line-through">
            {{ formatPrice(p.old_price) }}
          </span>
        </div>

        <p class="mt-3 text-sm" :class="p.in_stock ? 'text-green-600' : 'text-price'">
          {{ p.in_stock ? 'Stokta var' : 'Stokta yok' }}
        </p>

        <button
          type="button"
          :disabled="!p.in_stock"
          class="mt-4 w-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-neutral-300 sm:w-auto"
        >
          Sepete Ekle
        </button>

        <dl v-if="Object.keys(p.attributes ?? {}).length" class="mt-6 space-y-1 text-sm">
          <div v-for="(vals, name) in p.attributes" :key="name" class="flex gap-2">
            <dt class="min-w-32 text-neutral-500">{{ name }}</dt>
            <dd class="text-ink">{{ vals.join(', ') }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <section v-if="p.content" class="mt-10">
      <h2 class="mb-3 inline-block border-b-2 border-brand-500 pb-2 font-semibold text-ink">
        Ürün Açıklaması
      </h2>
      <div class="prose max-w-none text-sm text-ink" v-html="p.content" />
    </section>
  </div>
</template>