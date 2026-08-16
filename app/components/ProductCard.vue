<script setup lang="ts">
import type { ProductCard } from '~/types/catalog'

const props = defineProps<{ product: ProductCard }>()

const { add, pending } = useCart()
const qty = ref(1)
const added = ref(false)

async function addToCart() {
  if (!props.product.in_stock) return
  await add(props.product.id, qty.value)
  added.value = true
  setTimeout(() => (added.value = false), 1600)
}
</script>

<template>
  <!-- min-w-0: as a grid item this defaults to min-width:auto, which lets the
       contents force the whole track — and the page — wider than the viewport. -->
  <div class="group relative flex min-w-0 flex-col rounded-lg border border-line bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,.09)] transition duration-200 hover:z-10 hover:border-brand/20 hover:shadow-[0_10px_32px_rgba(0,0,0,.18)] sm:p-4">
    <span
      v-if="product.discount"
      class="absolute left-3 top-3 z-10 rounded bg-price px-2 py-0.5 text-[11px] font-bold text-white sm:left-4 sm:top-4"
    >
      -%{{ product.discount }}
    </span>

    <NuxtLink :to="`/urun/${product.slug}/`" class="block">
      <p class="mb-1.5 truncate text-[11px] text-muted">{{ product.category }}</p>

      <h3 class="mb-3 h-9 overflow-hidden text-[13px] font-medium leading-[1.15rem] text-ink transition group-hover:text-brand">
        {{ product.title }}
      </h3>

      <div class="relative aspect-square">
        <NuxtImg
          v-if="product.thumb"
          :src="product.thumb"
          :alt="product.title"
          width="300" height="300"
          sizes="sm:50vw md:33vw lg:25vw"
          loading="lazy"
          draggable="false"
          class="h-full w-full object-contain"
        />
        <div v-else class="h-full w-full rounded bg-neutral-50" />

        <!-- Badges come straight from the API's badges() accessor; the card
             has no badge logic of its own. -->
        <ul v-if="product.badges.length" class="absolute left-0 top-0 flex flex-col items-start gap-1">
          <li
            v-for="b in product.badges" :key="b.key"
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
          v-if="!product.in_stock"
          class="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/55 py-1 text-center text-xs font-semibold tracking-wide text-white"
        >
          STOKTA YOK
        </span>
      </div>
    </NuxtLink>

    <!-- Hidden entirely for guests: no placeholder, so the row below just moves up. -->
    <div v-if="product.price_visible" class="mt-3">
      <span class="text-[15px] font-bold text-price">{{ formatPrice(product.price) }}</span>
      <span v-if="product.old_price" class="ml-2 text-xs text-muted line-through">
        {{ formatPrice(product.old_price) }}
      </span>
    </div>

    <!-- Stepper + cart button need ~118px side by side. A 2-up card on a 320px
         screen has ~98px of content width, so they stack there and only sit on
         one line once there's room. -->
    <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex h-9 w-full items-center rounded-md border border-line sm:w-auto">
        <button
          type="button" aria-label="Azalt"
          class="h-full w-8 shrink-0 cursor-pointer text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="qty <= 1"
          @click="qty = Math.max(1, qty - 1)"
        >−</button>

        <input
          v-model.number="qty"
          type="number" min="1" max="999" aria-label="Adet"
          class="h-full w-full min-w-0 flex-1 border-x border-line text-center text-sm text-ink outline-none
                 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none sm:w-10 sm:flex-none"
        >

        <button
          type="button" aria-label="Artır"
          class="h-full w-8 shrink-0 cursor-pointer text-muted transition hover:text-brand"
          @click="qty = Math.min(999, qty + 1)"
        >+</button>
      </div>

      <button
        type="button"
        :disabled="!product.in_stock || pending"
        :aria-label="`${product.title} sepete ekle`"
        class="flex h-9 w-full shrink-0 cursor-pointer items-center justify-center rounded-md bg-brand text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-muted sm:w-9 sm:rounded-full"
        @click="addToCart"
      >
        <svg v-if="added" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m5 13 4 4L19 7" />
        </svg>
        <svg v-else class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
          <path d="M3 5h3l2.2 10.5h10L20.5 8H7" /><circle cx="9.5" cy="19.5" r="1.5" /><circle cx="17.5" cy="19.5" r="1.5" />
        </svg>
      </button>
    </div>
  </div>
</template>