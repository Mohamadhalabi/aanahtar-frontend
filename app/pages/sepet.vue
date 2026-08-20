<script setup lang="ts">
const { cart, count, pending, load, update, remove } = useCart()
const { isLoggedIn } = useAuth()

const items = computed(() => cart.value?.items ?? [])
const priceVisible = computed(() => (cart.value as any)?.price_visible ?? isLoggedIn.value)

// Client-only: the cart is per-visitor and must never be baked into HTML that
// gets cached and shared.
const ready = ref(false)
onMounted(async () => {
  if (!cart.value) await load()
  ready.value = true
})

async function setQty(id: number, qty: number) {
  if (qty < 1 || qty > 999) return
  await update(id, qty)
}

const clearing = ref(false)

async function clearCart() {
  clearing.value = true
  try {
    // No bulk-delete endpoint, so this walks the items. Sequential rather than
    // parallel: each response returns the whole cart, and concurrent writes
    // would race to overwrite it.
    for (const item of [...items.value]) {
      await remove(item.id)
    }
  } finally {
    clearing.value = false
  }
}

useSeoMeta({ title: 'Sepetim' })
</script>

<template>
  <div class="wrap py-8">
    <nav class="mb-8 flex items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">Sepetim</span>
    </nav>

    <h1 class="mb-6 text-2xl font-semibold text-ink">Sepetim</h1>

    <p v-if="ready && !priceVisible" class="mb-4 text-sm text-muted">
      Fiyatları görebilmek için
      <NuxtLink to="/my-account" class="text-brand hover:underline">giriş yapınız</NuxtLink>
      veya üye olunuz.
    </p>

    <div v-if="!ready" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 animate-pulse rounded-lg bg-neutral-100" />
    </div>

    <div v-else-if="!items.length" class="rounded-lg border border-line px-6 py-20 text-center">
      <svg class="mx-auto h-14 w-14 text-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
        <path d="M3 5h3l2.2 10.5h10L20.5 8H7" /><circle cx="9.5" cy="19.5" r="1.5" /><circle cx="17.5" cy="19.5" r="1.5" />
      </svg>
      <p class="mt-5 text-sm text-muted">Sepetinizde ürün bulunmuyor.</p>
      <NuxtLink to="/magaza" class="btn-primary mt-6">Alışverişe başla</NuxtLink>
    </div>

    <template v-else>
      <!-- Desktop: a real table, so the columns line up without relying on
           arbitrary grid-template values. -->
      <div class="hidden overflow-hidden rounded-lg border border-line md:block">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b border-line bg-neutral-50 text-left text-[13px] text-muted">
              <th class="w-12 px-4 py-3" />
              <th class="w-24 px-4 py-3" />
              <th class="px-4 py-3 font-medium">Ürün</th>
              <th class="w-32 px-4 py-3 text-right font-medium">Fiyat</th>
              <th class="w-40 px-4 py-3 text-center font-medium">Miktar</th>
              <th class="w-36 px-4 py-3 text-right font-medium">Ara Toplam</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="i in items" :key="i.id" class="border-b border-line last:border-b-0">
              <td class="px-4 py-4 align-middle">
                <button
                  type="button" :aria-label="`${i.name} kaldır`"
                  class="cursor-pointer rounded-full p-1.5 text-muted transition hover:bg-neutral-100 hover:text-price disabled:opacity-40"
                  :disabled="pending"
                  @click="remove(i.id)"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </td>

              <td class="px-4 py-4 align-middle">
                <NuxtLink :to="`/urun/${i.slug}/`" class="block">
                  <NuxtImg
                    v-if="i.image" :src="i.image" :alt="i.name"
                    width="160" height="160" loading="lazy"
                    class="h-16 w-16 rounded border border-line object-contain"
                  />
                  <div v-else class="h-16 w-16 rounded bg-neutral-50" />
                </NuxtLink>
              </td>

              <td class="px-4 py-4 align-middle">
                <NuxtLink :to="`/urun/${i.slug}/`" class="text-ink transition hover:text-brand">
                  {{ i.name }}
                </NuxtLink>
                <p v-if="i.is_preorder" class="mt-1 text-xs text-amber-600">Ön sipariş</p>
              </td>

              <td class="px-4 py-4 text-right align-middle text-ink">
                <span v-if="priceVisible && i.unit_price !== null">{{ formatPrice(i.unit_price) }}</span>
                <span v-else class="text-muted">—</span>
              </td>

              <td class="px-4 py-4 align-middle">
                <div class="mx-auto flex h-10 w-fit items-center rounded-lg border border-line">
                  <button
                    type="button" aria-label="Azalt"
                    class="h-full w-9 cursor-pointer text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="pending || i.quantity <= 1"
                    @click="setQty(i.id, i.quantity - 1)"
                  >−</button>
                  <span class="w-10 text-center text-ink">{{ i.quantity }}</span>
                  <button
                    type="button" aria-label="Artır"
                    class="h-full w-9 cursor-pointer text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="pending"
                    @click="setQty(i.id, i.quantity + 1)"
                  >+</button>
                </div>
              </td>

              <td class="px-4 py-4 text-right align-middle font-semibold text-ink">
                <span v-if="priceVisible && i.line_total !== null">{{ formatPrice(i.line_total) }}</span>
                <span v-else class="text-muted">—</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Actions live in the same bordered box as the table, like the old
             site's footer row. -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-neutral-50 px-4 py-4">
          <button
            type="button"
            class="h-11 cursor-pointer rounded-lg border border-line bg-white px-6 text-sm text-ink transition hover:border-price hover:text-price disabled:opacity-50"
            :disabled="clearing || pending"
            @click="clearCart"
          >
            {{ clearing ? 'Temizleniyor…' : 'Sepeti Temizle' }}
          </button>

          <div class="flex flex-wrap items-center gap-5">
            <div v-if="priceVisible && cart?.subtotal !== null" class="text-right">
              <span class="text-sm text-muted">Ara toplam ({{ count }} ürün): </span>
              <span class="text-lg font-semibold text-ink">{{ formatPrice(cart!.subtotal!) }}</span>
            </div>

            <!-- Guests can't check out: the order needs a customer, and they
                 can't see what they'd be paying. -->
            <NuxtLink
              v-if="priceVisible" to="/odeme"
              class="flex h-11 items-center rounded-lg bg-brand px-7 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Ödeme sayfasına git
            </NuxtLink>
            <NuxtLink
              v-else to="/my-account"
              class="flex h-11 items-center rounded-lg bg-brand px-7 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Giriş Yap
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Mobile: one card per item; six columns can't fit a phone. -->
      <div class="space-y-4 md:hidden">
        <div v-for="i in items" :key="i.id" class="rounded-lg border border-line p-4">
          <div class="flex gap-3">
            <NuxtLink :to="`/urun/${i.slug}/`" class="shrink-0">
              <NuxtImg
                v-if="i.image" :src="i.image" :alt="i.name"
                width="160" height="160" loading="lazy"
                class="h-20 w-20 rounded border border-line object-contain"
              />
              <div v-else class="h-20 w-20 rounded bg-neutral-50" />
            </NuxtLink>

            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <NuxtLink :to="`/urun/${i.slug}/`" class="text-sm leading-snug text-ink">
                  {{ i.name }}
                </NuxtLink>
                <button
                  type="button" :aria-label="`${i.name} kaldır`"
                  class="shrink-0 cursor-pointer p-1 text-muted transition hover:text-price"
                  :disabled="pending"
                  @click="remove(i.id)"
                >
                  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <p v-if="priceVisible && i.unit_price !== null" class="mt-1 text-sm text-muted">
                {{ formatPrice(i.unit_price) }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex h-10 items-center rounded-lg border border-line">
              <button
                type="button" aria-label="Azalt"
                class="h-full w-9 cursor-pointer text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="pending || i.quantity <= 1"
                @click="setQty(i.id, i.quantity - 1)"
              >−</button>
              <span class="w-10 text-center text-sm text-ink">{{ i.quantity }}</span>
              <button
                type="button" aria-label="Artır"
                class="h-full w-9 cursor-pointer text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="pending"
                @click="setQty(i.id, i.quantity + 1)"
              >+</button>
            </div>

            <span v-if="priceVisible && i.line_total !== null" class="text-sm font-semibold text-ink">
              {{ formatPrice(i.line_total) }}
            </span>
          </div>
        </div>

        <div class="rounded-lg border border-line p-4">
          <div v-if="priceVisible && cart?.subtotal !== null" class="mb-4 flex items-center justify-between">
            <span class="text-sm text-muted">Ara toplam ({{ count }} ürün)</span>
            <span class="text-lg font-semibold text-ink">{{ formatPrice(cart!.subtotal!) }}</span>
          </div>

          <NuxtLink
            v-if="priceVisible" to="/odeme"
            class="flex h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-medium text-white"
          >
            Ödeme sayfasına git
          </NuxtLink>
          <NuxtLink
            v-else to="/my-account"
            class="flex h-11 w-full items-center justify-center rounded-lg bg-brand text-sm font-medium text-white"
          >
            Giriş Yap
          </NuxtLink>

          <button
            type="button"
            class="mt-3 h-11 w-full cursor-pointer rounded-lg border border-line text-sm text-ink transition hover:border-price hover:text-price disabled:opacity-50"
            :disabled="clearing || pending"
            @click="clearCart"
          >
            {{ clearing ? 'Temizleniyor…' : 'Sepeti Temizle' }}
          </button>
        </div>
      </div>

      <p v-if="!cart?.free_shipping" class="mt-4 text-xs text-muted">
        5000 TL ve üzeri siparişlerde kargo ücretsizdir.
      </p>
    </template>
  </div>
</template>