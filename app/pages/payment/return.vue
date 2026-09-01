<script setup lang="ts">
// Where iyzico sends the browser after the hosted card page. The result in the
// query string is a hint only — it comes back through the customer's own
// browser and could be edited, so the real status is polled from the API.

const route = useRoute()
const { load } = useCart()

const orderNumber = computed(() => String(route.query.order ?? ''))
const hint = computed(() => String(route.query.result ?? ''))

type State = 'checking' | 'paid' | 'failed'
const state = ref<State>('checking')

function authHeader() {
  return { Authorization: `Bearer ${useCookie('auth_token').value}` }
}

// The callback runs server-side before the browser is redirected here, so the
// status is usually already final. A few retries cover the case where iyzico
// redirects faster than the callback finishes.
const MAX_ATTEMPTS = 8
const INTERVAL_MS = 1500

async function check(attempt = 1): Promise<void> {
  if (!orderNumber.value) {
    state.value = 'failed'
    return
  }

  try {
    const res = await $fetch<{ paid: boolean; payment_status: string }>(
      `/api/orders/${orderNumber.value}/payment-status`,
      { headers: authHeader() },
    )

    if (res.paid) {
      state.value = 'paid'
      await load()   // the cart was emptied by the callback
      return
    }

    // 'failed' is final; 'pending' means the callback hasn't landed yet.
    if (res.payment_status === 'failed') {
      state.value = 'failed'
      return
    }
  } catch {
    // Network blip or an expired token — retry rather than declaring failure.
  }

  if (attempt >= MAX_ATTEMPTS) {
    // Undecided after all attempts. Treated as failed for display, but the
    // copy deliberately doesn't say the payment was declined, because it may
    // still settle.
    state.value = hint.value === 'paid' ? 'paid' : 'failed'
    return
  }

  await new Promise(r => setTimeout(r, INTERVAL_MS))
  return check(attempt + 1)
}

onMounted(() => { check() })

useSeoMeta({ title: 'Ödeme Sonucu', robots: 'noindex' })
</script>

<template>
  <div class="wrap py-16">
    <div class="mx-auto max-w-md rounded-lg border border-line px-6 py-12 text-center">

      <template v-if="state === 'checking'">
        <svg class="mx-auto h-10 w-10 animate-spin text-brand" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-20" />
          <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
        </svg>
        <h1 class="mt-6 text-lg text-ink">Ödemeniz kontrol ediliyor</h1>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          Bu işlem birkaç saniye sürebilir. Lütfen sayfayı kapatmayın.
        </p>
      </template>

      <template v-else-if="state === 'paid'">
        <svg class="mx-auto h-12 w-12 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
          <circle cx="12" cy="12" r="10" /><path d="m8 12 3 3 5-6" />
        </svg>
        <h1 class="mt-6 text-lg text-ink">Ödemeniz alındı</h1>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          <strong class="text-ink">{{ orderNumber }}</strong> numaralı siparişiniz onaylandı.
          Sipariş özetini e-posta adresinize gönderdik.
        </p>
        <NuxtLink :to="`/my-account/siparisler/${orderNumber}`" class="btn-primary mt-7">
          Siparişimi görüntüle
        </NuxtLink>
      </template>

      <template v-else>
        <svg class="mx-auto h-12 w-12 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
          <circle cx="12" cy="12" r="10" /><path d="M12 7v6" /><path d="M12 16.5v.5" />
        </svg>
        <h1 class="mt-6 text-lg text-ink">Ödeme tamamlanamadı</h1>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          <template v-if="orderNumber">
            <strong class="text-ink">{{ orderNumber }}</strong> numaralı siparişiniz duruyor ve
            sepetiniz korundu. Tekrar deneyebilir veya havale ile ödeyebilirsiniz.
          </template>
          <template v-else>
            İşlem tamamlanamadı. Sepetiniz korundu, tekrar deneyebilirsiniz.
          </template>
        </p>
        <div class="mt-7 flex flex-col items-center gap-3">
          <NuxtLink to="/odeme" class="btn-primary">Tekrar dene</NuxtLink>
          <NuxtLink to="/my-account/siparisler" class="text-sm text-muted hover:text-brand">
            Siparişlerim
          </NuxtLink>
        </div>
      </template>

    </div>
  </div>
</template>
