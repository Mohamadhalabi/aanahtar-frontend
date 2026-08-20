<script setup lang="ts">
interface Coupon {
  id: number
  code: string
  type: string
  value: number
  min_cart_amount: number | null
  expires_at: string | null
}

const { isLoggedIn } = useAuth()

const { data, pending } = await useApiFetch<{ coupons: Coupon[] }>('/account/coupons', {
  key: 'account-coupons',
  lazy: true,
  server: false,
})

const coupons = computed(() => data.value?.coupons ?? [])

/** `type` comes from the coupons table; anything not percent-like is a fixed amount. */
function discountLabel(c: Coupon) {
  return /percent|percentage|yuzde|%/i.test(c.type)
    ? `%${c.value % 1 === 0 ? c.value : c.value.toFixed(2)}`
    : formatPrice(c.value)
}

const copied = ref<string | null>(null)

async function copy(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = code
    setTimeout(() => (copied.value = null), 1600)
  } catch {
    // Clipboard is blocked on insecure origins — the code is visible anyway.
  }
}

useSeoMeta({ title: 'İndirimler' })
</script>

<template>
  <div class="wrap py-8">
    <AccountBreadcrumb current="İndirimler" />

    <h1 class="mb-10 text-center text-3xl text-ink">Hesabım</h1>

    <div class="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
      <AccountNav />

      <section v-if="isLoggedIn" class="min-w-0">
        <p class="mb-8 text-sm text-muted">
          Şu anda geçerli olan indirim kodları. Kodu sepet sayfasında uygulayabilirsiniz.
        </p>

        <div v-if="pending" class="grid gap-4 sm:grid-cols-2">
          <div v-for="i in 4" :key="i" class="h-28 animate-pulse rounded-lg bg-neutral-100" />
        </div>

        <div v-else-if="!coupons.length" class="rounded-lg border border-line px-6 py-12 text-center">
          <p class="text-sm text-muted">Şu anda geçerli bir indirim kodu bulunmuyor.</p>
        </div>

        <div v-else class="grid gap-4 sm:grid-cols-2">
          <div v-for="c in coupons" :key="c.id" class="rounded-lg border border-line p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-lg font-bold text-brand">{{ discountLabel(c) }} indirim</p>
                <p v-if="c.min_cart_amount" class="mt-1 text-xs text-muted">
                  {{ formatPrice(c.min_cart_amount) }} ve üzeri alışverişlerde
                </p>
              </div>

              <button
                type="button"
                class="shrink-0 cursor-pointer rounded-full border border-dashed border-brand px-3 py-1.5 text-sm font-medium text-brand transition hover:bg-brand hover:text-white"
                @click="copy(c.code)"
              >
                {{ copied === c.code ? 'Kopyalandı' : c.code }}
              </button>
            </div>

            <p v-if="c.expires_at" class="mt-4 text-xs text-muted">
              Son geçerlilik: {{ formatOrderDate(c.expires_at) }}
            </p>
          </div>
        </div>
      </section>

      <AccountSignInPrompt v-else />
    </div>
  </div>
</template>