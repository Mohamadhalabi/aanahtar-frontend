<script setup lang="ts">
// Shared so AppHeader (and anything else) can open it.
const open = useState('cart-drawer', () => false)

const { cart, count, pending, load, update, remove } = useCart()
const { isLoggedIn } = useAuth()
const route = useRoute()

const items = computed(() => cart.value?.items ?? [])
const priceVisible = computed(() => (cart.value as any)?.price_visible ?? isLoggedIn.value)

// The cart may not have been fetched yet on a cold page load.
watch(open, async (isOpen) => {
  if (isOpen && !cart.value) await load()
})

// Navigating away from under an open drawer leaves it covering the new page.
watch(() => route.fullPath, () => (open.value = false))

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

watchEffect((onCleanup) => {
  if (!open.value || !import.meta.client) return

  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'

  onCleanup(() => {
    window.removeEventListener('keydown', onKey)
    document.body.style.overflow = ''
  })
})

async function setQty(id: number, qty: number) {
  if (qty < 1) return
  await update(id, Math.min(999, qty))
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[90] bg-black/40" @click="open = false" />
    </Transition>

    <Transition name="slide">
      <aside
        v-if="open"
        class="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog" aria-modal="true" aria-label="Sepetim"
      >
        <header class="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-ink">Sepetim</h2>
          <button
            type="button" aria-label="Kapat"
            class="cursor-pointer rounded-full p-1.5 text-muted transition hover:bg-neutral-100 hover:text-ink"
            @click="open = false"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div class="flex-1 overflow-y-auto px-5">
          <p v-if="!priceVisible" class="mt-4 rounded-lg bg-neutral-50 px-4 py-3 text-[13px] leading-relaxed text-muted">
            Fiyatları görebilmek için
            <NuxtLink to="/my-account" class="text-brand hover:underline">giriş yapınız</NuxtLink>
            veya üye olunuz.
          </p>

          <div v-if="pending && !items.length" class="space-y-4 py-6">
            <div v-for="i in 3" :key="i" class="h-20 animate-pulse rounded-lg bg-neutral-100" />
          </div>

          <div v-else-if="!items.length" class="flex flex-col items-center justify-center py-20 text-center">
            <svg class="h-12 w-12 text-line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <path d="M3 5h3l2.2 10.5h10L20.5 8H7" /><circle cx="9.5" cy="19.5" r="1.5" /><circle cx="17.5" cy="19.5" r="1.5" />
            </svg>
            <p class="mt-4 text-sm text-muted">Sepetiniz boş.</p>
            <NuxtLink to="/magaza" class="btn-ghost mt-6" @click="open = false">Alışverişe başla</NuxtLink>
          </div>

          <ul v-else class="divide-y divide-line">
            <li v-for="i in items" :key="i.id" class="flex gap-3 py-4">
              <NuxtLink :to="`/urun/${i.slug}/`" class="shrink-0" @click="open = false">
                <NuxtImg
                  v-if="i.image" :src="i.image" :alt="i.name"
                  width="120" height="120" loading="lazy"
                  class="h-16 w-16 rounded-lg border border-line object-contain"
                />
                <div v-else class="h-16 w-16 rounded-lg bg-neutral-50" />
              </NuxtLink>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <NuxtLink
                    :to="`/urun/${i.slug}/`"
                    class="text-[13px] font-medium leading-snug text-ink transition hover:text-brand"
                    @click="open = false"
                  >
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

                <div class="mt-2 flex items-center justify-between gap-3">
                  <div class="flex h-8 items-center rounded-md border border-line">
                    <button
                      type="button" aria-label="Azalt"
                      class="h-full w-7 cursor-pointer text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                      :disabled="pending || i.quantity <= 1"
                      @click="setQty(i.id, i.quantity - 1)"
                    >−</button>
                    <span class="w-8 text-center text-sm text-ink">{{ i.quantity }}</span>
                    <button
                      type="button" aria-label="Artır"
                      class="h-full w-7 cursor-pointer text-muted transition hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
                      :disabled="pending"
                      @click="setQty(i.id, i.quantity + 1)"
                    >+</button>
                  </div>

                  <span v-if="priceVisible && i.line_total !== null" class="text-sm font-semibold text-ink">
                    {{ formatPrice(i.line_total) }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <footer v-if="items.length" class="border-t border-line px-5 py-4">
          <div v-if="priceVisible && cart?.subtotal !== null" class="mb-4 flex items-center justify-between">
            <span class="text-sm text-muted">Ara toplam ({{ count }} ürün)</span>
            <span class="text-lg font-semibold text-ink">{{ formatPrice(cart!.subtotal!) }}</span>
          </div>

          <p v-if="cart?.free_shipping" class="mb-4 rounded-lg bg-green-50 px-3 py-2 text-[13px] text-green-700">
            Kargo bedava.
          </p>

          <div class="flex gap-3">
            <NuxtLink to="/sepet" class="btn-ghost flex-1" @click="open = false">Sepetim</NuxtLink>

            <!-- Guests can't check out: the order needs a customer, and they
                 can't see what they'd be paying. -->
            <NuxtLink v-if="priceVisible" to="/odeme" class="btn-primary flex-1" @click="open = false">
              Ödeme
            </NuxtLink>
            <NuxtLink v-else to="/my-account" class="btn-primary flex-1" @click="open = false">
              Giriş Yap
            </NuxtLink>
          </div>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
