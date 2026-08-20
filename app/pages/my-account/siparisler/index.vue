<script setup lang="ts">
interface Order {
  id: number
  order_number: string
  status: string
  total: number
  currency_code: string
  created_at: string | null
}

const { isLoggedIn } = useAuth()
const page = ref(1)

const { data, pending } = await useApiFetch<{
  data: Order[]
  current_page: number
  last_page: number
  total: number
}>(() => `/account/orders?page=${page.value}`, {
  key: 'account-orders',
  lazy: true,
  server: false,
  watch: [page],
})

const orders = computed(() => data.value?.data ?? [])
const lastPage = computed(() => data.value?.last_page ?? 1)

useSeoMeta({ title: 'Siparişler' })
</script>

<template>
  <div class="wrap py-8">
    <AccountBreadcrumb current="Siparişler" />

    <h1 class="mb-10 text-center text-3xl text-ink">Hesabım</h1>

    <div class="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
      <AccountNav />

      <section v-if="isLoggedIn" class="min-w-0">
        <div v-if="pending" class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-14 animate-pulse rounded-lg bg-neutral-100" />
        </div>

        <div v-else-if="!orders.length" class="rounded-lg border border-line px-6 py-12 text-center">
          <p class="text-sm text-muted">Henüz bir sipariş vermediniz.</p>
          <NuxtLink to="/magaza" class="mt-6 inline-flex h-11 items-center rounded-full bg-neutral-100 px-8 text-sm text-ink transition hover:bg-brand hover:text-white">
            Alışverişe başla
          </NuxtLink>
        </div>

        <!-- Scrolls horizontally rather than squeezing five columns onto a
             phone; min-w-0 on the section is what lets it actually scroll. -->
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[38rem] border-collapse text-sm">
            <thead>
              <tr class="border-b border-line text-left text-[13px] text-muted">
                <th class="py-3 pr-4 font-medium">Sipariş</th>
                <th class="py-3 pr-4 font-medium">Tarih</th>
                <th class="py-3 pr-4 font-medium">Durum</th>
                <th class="py-3 pr-4 text-right font-medium">Toplam</th>
                <th class="py-3" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id" class="border-b border-line">
                <td class="py-4 pr-4 font-medium text-ink">#{{ o.order_number }}</td>
                <td class="py-4 pr-4 text-muted">{{ formatOrderDate(o.created_at) }}</td>
                <td class="py-4 pr-4">
                  <span class="inline-block rounded-full px-3 py-1 text-xs font-medium" :class="orderStatus(o.status).class">
                    {{ orderStatus(o.status).label }}
                  </span>
                </td>
                <td class="py-4 pr-4 text-right font-semibold text-ink">{{ formatPrice(o.total) }}</td>
                <td class="py-4 text-right">
                  <NuxtLink :to="`/my-account/siparisler/${o.order_number}`" class="text-sm text-brand hover:underline">
                    Görüntüle
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="lastPage > 1" class="mt-8 flex items-center justify-center gap-3">
          <button
            type="button" :disabled="page <= 1"
            class="h-10 cursor-pointer rounded-full border border-line px-5 text-sm text-ink transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            @click="page--"
          >
            Önceki
          </button>
          <span class="text-sm text-muted">{{ page }} / {{ lastPage }}</span>
          <button
            type="button" :disabled="page >= lastPage"
            class="h-10 cursor-pointer rounded-full border border-line px-5 text-sm text-ink transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
            @click="page++"
          >
            Sonraki
          </button>
        </div>
      </section>

      <AccountSignInPrompt v-else />
    </div>
  </div>
</template>