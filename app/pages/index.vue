<script setup lang="ts">
import type { ProductCard as Card } from '~/types/catalog'

interface Slide { image: string; link: string | null; alt: string | null }

interface Home {
  hero: Slide[]
  promos: Slide[]
  banners: Slide[]
  new_products: Card[]
}

// Above the fold only. The three sections below fetch their own data when
// scrolled into view — see the components themselves.
const { data } = await useApiFetch<Home>('/home')

const heroIndex = ref(0)

function move(dir: number) {
  const n = data.value?.hero.length ?? 0
  if (!n) return
  heroIndex.value = (heroIndex.value + dir + n) % n
}

// Auto-advance, paused when the tab is hidden so it doesn't churn in the background.
onMounted(() => {
  const timer = setInterval(() => {
    if (!document.hidden) move(1)
  }, 6000)
  onUnmounted(() => clearInterval(timer))
})

/**
 * The four cards under the hero.
 *
 * Hardcoded rather than fetched: these are a fixed piece of shop furniture,
 * not merchandising that changes weekly, and putting them behind an endpoint
 * would mean a backend change every time the wording moves. Edit here.
 *
 * Images go in public/images/promos/ — square-ish, transparent or white
 * background, since they sit on a light grey card.
 */
const highlights = [
  {
    kicker: 'Açma Kapama',
    title: 'Anadolu Plus',
    to: '/product-category/acma-kapama/',
    image: '/images/promos/acma-kapama.webp',
  },
  {
    kicker: 'Uzaktan Çalıştırma',
    title: 'Anadolu Plus',
    to: '/product-category/universal-uzaktan-calistirma/',
    image: '/images/promos/uzaktan-calistirma.webp',
  },
  {
    kicker: 'Lonsdor',
    title: 'K518Pro Cihazı',
    note: 'Yeni',
    to: '/urun/8840-yeni-lonsdor-k518-pro-k518pro-versatile-anahtar-programci/',
    image: '/images/promos/lonsdor-k518pro.webp',
  },
  {
    kicker: 'Türkiyede Tek',
    title: 'Pluto JLR',
    note: 'Distribütör',
    to: '/urun/8855-pluto-jlr-rangerover-engineering-tool',
    image: '/images/promos/pluto-jlr.webp',
  },
]

const trust = [
  { title: '5000 TL', sub: 'Üzeri Ücretsiz Kargo', d: 'M2 7h11v9H2zM13 10h4l3 3v3h-7zM6 18a1.6 1.6 0 1 0 0-.01M17 18a1.6 1.6 0 1 0 0-.01' },
  { title: '99% Pozitif', sub: 'Geri Bildirim', d: 'M7 11v9H3v-9zM7 11l4-8a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17 20H7' },
  { title: 'Kolay', sub: 'Ücretsiz İade', d: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5' },
  { title: 'Güvenli', sub: 'Ödeme Sistemi', d: 'M3 7h18v11H3zM3 11h18M7 15h4' },
  { title: 'Yüksek Kaliteli', sub: 'Ürünler', d: 'M20.6 6.6 12 3 3.4 6.6 5 18l7 3 7-3zM9 12l2 2 4-4' },
]

useSeoMeta({
  title: 'Anadolu Anahtar | Oto Anahtar ve Kumanda',
  description: 'Otomotiv anahtar, kumanda, emülatör ve anahtarcılık ürünleri.',
})
</script>

<template>
  <div v-if="data">
    <!-- Hero -->
    <section v-if="data.hero.length" class="relative">
      <!--
        Every slide is stacked in the same place and only opacity changes, so
        both the outgoing and incoming image are painted during the crossfade.
        Toggling `hidden` — as this did before — can't animate at all, because
        display:none isn't a transitionable property.

        The first slide stays in normal flow to give the section its height;
        the rest are absolutely positioned on top of it. That keeps the layout
        stable without hardcoding an aspect ratio the banners might not match.
      -->
      <div class="relative w-full overflow-hidden bg-neutral-100">
        <component
          v-for="(s, i) in data.hero" :key="i"
          :is="s.link ? 'a' : 'div'"
          :href="s.link ?? undefined"
          class="inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
          :class="[
            i === 0 ? 'relative' : 'absolute',
            i === heroIndex ? 'opacity-100' : 'opacity-0',
            // The hidden slides mustn't swallow clicks meant for the visible
            // one, or for the arrows sitting above them.
            i === heroIndex ? '' : 'pointer-events-none',
          ]"
          :aria-hidden="i !== heroIndex"
        >
          <img
            :src="s.image"
            :alt="s.alt ?? 'Anadolu Anahtar'"
            class="w-full"
            :loading="i === 0 ? 'eager' : 'lazy'"
          >
        </component>

        <button
          v-if="data.hero.length > 1"
          type="button" aria-label="Önceki"
          class="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 text-ink transition hover:bg-white"
          @click="move(-1)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 6-6 6 6 6" /></svg>
        </button>

        <button
          v-if="data.hero.length > 1"
          type="button" aria-label="Sonraki"
          class="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 text-ink transition hover:bg-white"
          @click="move(1)"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6" /></svg>
        </button>

        <div v-if="data.hero.length > 1" class="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
          <button
            v-for="(_, i) in data.hero" :key="i"
            type="button" :aria-label="`Slayt ${i + 1}`"
            class="h-2 cursor-pointer rounded-full transition-all duration-300"
            :class="i === heroIndex ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'"
            @click="heroIndex = i"
          />
        </div>
      </div>
    </section>

    <!-- Highlight cards. Directly under the hero: this is the first thing a
         visitor scrolls to, and these are the four things the shop most wants
         to put in front of them. -->
    <section class="wrap mt-8">
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="h in highlights" :key="h.kicker + h.title">
          <NuxtLink
            :to="h.to"
            class="group flex h-full items-center gap-4 rounded-lg bg-neutral-50 p-4 transition hover:bg-white hover:shadow-[0_8px_26px_rgba(0,0,0,.10)]"
          >
            <NuxtImg
              :src="h.image" :alt="`${h.kicker} ${h.title}`"
              width="220" height="220" loading="lazy"
              class="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28"
            />

            <div class="min-w-0">
              <p class="text-[13px] leading-snug text-muted">{{ h.kicker }}</p>
              <p class="text-[15px] font-bold uppercase leading-snug text-ink">{{ h.title }}</p>
              <p v-if="h.note" class="text-[15px] font-bold uppercase leading-snug text-ink">{{ h.note }}</p>

              <span class="mt-2.5 inline-flex items-center gap-2 text-[13px] text-muted transition group-hover:text-brand">
                Görüntüle
                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                  <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </span>
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Trust strip -->
    <section class="wrap mt-8">
      <ul class="grid divide-y divide-line rounded-lg border border-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x">
        <li v-for="t in trust" :key="t.title" class="flex items-center justify-center gap-4 px-4 py-5">
          <svg
            class="h-9 w-9 shrink-0 text-brand" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"
          >
            <path :d="t.d" />
          </svg>
          <div>
            <p class="text-[15px] font-semibold text-ink">{{ t.title }}</p>
            <p class="text-[13px] text-muted">{{ t.sub }}</p>
          </div>
        </li>
      </ul>
    </section>

    <!-- Mid banners -->
    <section v-if="data.banners.length" class="wrap mt-8">
      <div class="grid gap-5 lg:grid-cols-2">
        <component
          v-for="(b, i) in data.banners" :key="i"
          :is="b.link ? 'NuxtLink' : 'div'"
          :to="b.link ?? undefined"
          class="overflow-hidden rounded-lg"
        >
          <NuxtImg :src="b.image" :alt="b.alt ?? ''" width="1400" height="400" loading="lazy" class="h-full w-full object-cover" />
        </component>
      </div>
    </section>

    <!-- Promo cards. Column count follows the slide count so two banners get
         half the row each instead of a quarter. -->
    <section v-if="data.promos.length" class="wrap mt-12">
      <div
        class="grid gap-5"
        :class="data.promos.length === 2 ? 'sm:grid-cols-2'
          : data.promos.length === 3 ? 'sm:grid-cols-2 lg:grid-cols-3'
          : 'sm:grid-cols-2 lg:grid-cols-4'"
      >
        <component
          v-for="(p, i) in data.promos" :key="i"
          :is="p.link ? 'NuxtLink' : 'div'"
          :to="p.link ?? undefined"
          class="overflow-hidden rounded-lg transition hover:shadow-[0_6px_22px_rgba(0,0,0,.10)]"
        >
          <!-- h-auto, no object-cover: the banner keeps its own aspect ratio
               and nothing gets clipped, whatever shape the upload is. -->
          <NuxtImg :src="p.image" :alt="p.alt ?? ''" sizes="100vw sm:50vw" loading="lazy" class="h-auto w-full" />
        </component>
      </div>
    </section>

    <!-- New products. Server-rendered: above the fold on desktop and worth
         having in the HTML for crawlers. -->
    <section v-if="data.new_products.length" class="wrap mt-8">
      <ProductCarousel title="Yeni ürünler" :products="data.new_products" />
    </section>

    <!--
      Below the fold. Each component mounts only when scrolled near, and
      fetches its own data at that point.

      DeferredSection, not LazySection: Nuxt reserves the `Lazy` prefix for the
      dynamic-import wrappers it generates for every component, so a component
      actually named LazySection collides with it. Dev resolved it one way and
      the production build the other, which is why these three rendered
      locally and came back empty on the server.

      The min-heights matter: with nothing rendered yet these three would
      otherwise stack at zero height in the same place, all intersect at once,
      and fire three requests immediately — which is the thing we're trying to
      avoid.
    -->
    <div class="min-h-[560px]">
      <DeferredSection><FeaturedTabs /></DeferredSection>
    </div>

    <div class="min-h-[560px]">
      <DeferredSection><DealTabs /></DeferredSection>
    </div>

    <div class="min-h-[560px]">
      <DeferredSection>
        <CollectionCarousel title="Emülatörler ve diğer kategoriler" />
      </DeferredSection>
    </div>

  </div>
</template>