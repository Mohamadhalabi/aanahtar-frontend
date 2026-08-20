<script setup lang="ts">
interface Item {
  id: number
  product_id: number | null
  product_title: string
  product_sku: string | null
  thumb: string | null
  slug: string | null
  unit_price: number
  quantity: number
  line_total: number
  note: string | null
}

interface OrderDetail {
  order_number: string
  status: string
  total: number
  created_at: string | null
  subtotal: number
  discount: number
  tax: number
  shipping_cost: number
  payment_method: string | null
  coupon_code: string | null
  notes: string | null
  billing: Record<string, string | null>
  shipping: Record<string, string | null>
}

const route = useRoute()
const { isLoggedIn } = useAuth()
const number = computed(() => String(route.params.number))

const { data, pending, error } = await useApiFetch<{ order: OrderDetail; items: Item[] }>(
  () => `/account/orders/${number.value}`,
  { key: () => `account-order-${number.value}`, lazy: true, server: false },
)

const order = computed(() => data.value?.order ?? null)
const items = computed(() => data.value?.items ?? [])

/** Address parts, blanks dropped, joined for display. */
function addressLines(a: Record<string, string | null> | undefined) {
  if (!a) return []
  return [a.address, [a.postcode, a.city].filter(Boolean).join(' '), a.state, a.country]
    .map(v => (v ?? '').trim())
    .filter(Boolean)
}

useSeoMeta({ title: () => `Sipariş #${number.value}` })
</script>

<template>
  <div class="wrap py-8">
    <AccountBreadcrumb
      :parent="{ label: 'Siparişler', to: '/my-account/siparisler' }"
      :current="`#${number}`"
    />

    <h1 class="mb-10 text-center text-3xl text-ink">Hesabım</h1>

    <div class="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
      <AccountNav />

      <section v-if="isLoggedIn" class="min-w-0">
        <div v-if="pending" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-20 animate-pulse rounded-xl bg-neutral-100" />
        </div>

        <!-- Orders belonging to someone else 404 rather than 403, so this
             covers both "gone" and "not yours" without leaking which. -->
        <div v-else-if="error || !order" class="rounded-xl border border-line px-6 py-12 text-center">
          <p class="text-sm text-muted">Sipariş bulunamadı.</p>
          <NuxtLink to="/my-account/siparisler" class="btn-ghost mt-6">
            Siparişlere dön
          </NuxtLink>
        </div>

        <template v-else>
          <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-ink">Sipariş #{{ order.order_number }}</h2>
              <p class="mt-1 text-sm text-muted">{{ formatOrderDate(order.created_at) }}</p>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-medium" :class="orderStatus(order.status).class">
              {{ orderStatus(order.status).label }}
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr class="border-b border-line text-left text-[13px] text-muted">
                  <th class="py-3 pr-4 font-medium" colspan="2">Ürün</th>
                  <th class="py-3 pr-4 text-center font-medium">Adet</th>
                  <th class="py-3 text-right font-medium">Tutar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in items" :key="i.id" class="border-b border-line align-middle">
                  <!-- Fixed-width image cell so titles stay on a common left
                       edge whether or not a product still exists. -->
                  <td class="w-16 py-3 pr-3">
                    <component
                      :is="i.slug ? 'NuxtLink' : 'div'"
                      :to="i.slug ? `/urun/${i.slug}/` : undefined"
                      class="block h-14 w-14 overflow-hidden rounded-lg border border-line bg-white"
                    >
                      <NuxtImg
                        v-if="i.thumb"
                        :src="i.thumb" :alt="i.product_title"
                        width="112" height="112" loading="lazy"
                        class="h-full w-full object-contain"
                      />
                      <div v-else class="flex h-full w-full items-center justify-center bg-neutral-50">
                        <svg class="h-5 w-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                          <path d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5" /><circle cx="9" cy="9" r="1.4" />
                        </svg>
                      </div>
                    </component>
                  </td>

                  <td class="py-3 pr-4">
                    <component
                      :is="i.slug ? 'NuxtLink' : 'span'"
                      :to="i.slug ? `/urun/${i.slug}/` : undefined"
                      class="font-medium text-ink"
                      :class="i.slug && 'transition hover:text-brand'"
                    >
                      {{ i.product_title }}
                    </component>
                    <p v-if="i.product_sku" class="mt-0.5 text-xs text-muted">{{ i.product_sku }}</p>
                    <p v-if="i.note" class="mt-0.5 text-xs text-muted">{{ i.note }}</p>
                  </td>

                  <td class="py-3 pr-4 text-center text-muted">{{ i.quantity }}</td>
                  <td class="py-3 text-right font-medium text-ink">{{ formatPrice(i.line_total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <dl class="mt-6 ml-auto max-w-xs space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-muted">Ara toplam</dt>
              <dd class="text-ink">{{ formatPrice(order.subtotal) }}</dd>
            </div>
            <div v-if="order.discount > 0" class="flex justify-between">
              <dt class="text-muted">
                İndirim<span v-if="order.coupon_code" class="ml-1 text-xs">({{ order.coupon_code }})</span>
              </dt>
              <dd class="text-price">−{{ formatPrice(order.discount) }}</dd>
            </div>
            <div v-if="order.shipping_cost > 0" class="flex justify-between">
              <dt class="text-muted">Kargo</dt>
              <dd class="text-ink">{{ formatPrice(order.shipping_cost) }}</dd>
            </div>
            <div v-if="order.tax > 0" class="flex justify-between">
              <dt class="text-muted">KDV</dt>
              <dd class="text-ink">{{ formatPrice(order.tax) }}</dd>
            </div>
            <div class="flex justify-between border-t border-line pt-2 text-base font-semibold">
              <dt class="text-ink">Toplam</dt>
              <dd class="text-ink">{{ formatPrice(order.total) }}</dd>
            </div>
            <div v-if="order.payment_method" class="flex justify-between pt-1">
              <dt class="text-muted">Ödeme</dt>
              <dd class="text-muted">{{ order.payment_method }}</dd>
            </div>
          </dl>

          <div class="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 class="mb-3 text-[15px] font-semibold text-ink">Fatura adresi</h3>
              <p v-if="order.billing.name" class="text-sm text-ink">{{ order.billing.name }}</p>
              <p v-for="(line, i) in addressLines(order.billing)" :key="i" class="text-sm text-muted">{{ line }}</p>
              <p v-if="order.billing.phone" class="mt-1 text-sm text-muted">{{ order.billing.phone }}</p>
            </div>

            <div v-if="addressLines(order.shipping).length">
              <h3 class="mb-3 text-[15px] font-semibold text-ink">Teslimat adresi</h3>
              <p v-for="(line, i) in addressLines(order.shipping)" :key="i" class="text-sm text-muted">{{ line }}</p>
            </div>
          </div>

          <div v-if="order.notes" class="mt-10">
            <h3 class="mb-2 text-[15px] font-semibold text-ink">Sipariş notu</h3>
            <p class="text-sm text-muted">{{ order.notes }}</p>
          </div>
        </template>
      </section>

      <AccountSignInPrompt v-else />
    </div>
  </div>
</template>