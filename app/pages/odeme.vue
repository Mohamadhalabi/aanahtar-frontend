<script setup lang="ts">
// Must match OrderController — the server recomputes authoritatively, these
// are only for what the customer sees before confirming.
const TAX_RATE = 0.20
const FREE_SHIPPING_FROM = 5000
const SHIPPING_FLAT = 0.00

const { cart, load } = useCart()
const { customer, isLoggedIn } = useAuth()
const toast = useToast()

const items = computed(() => cart.value?.items ?? [])
const subtotal = computed(() => cart.value?.subtotal ?? 0)

// Supplied by the backend once a coupon is attached to the cart. Falls back to
// zero, so the summary is correct while the endpoints are still being built.
const discount = computed(() => (cart.value as any)?.discount ?? 0)
const coupon = computed(() => (cart.value as any)?.coupon ?? null)

const discounted = computed(() => Math.max(0, subtotal.value - discount.value))
const shipping = computed(() => (discounted.value >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT))
// VAT on the discounted figure, not the gross one — check this matches
// OrderController, or the customer sees one total and gets charged another.
const tax = computed(() => Math.round(discounted.value * TAX_RATE * 100) / 100)
const total = computed(() => discounted.value + tax.value + shipping.value)

const form = reactive({
  first_name: '', last_name: '', email: '', phone: '',
  address: '', postcode: '', state: '', city: '',
  // Card is not wired up yet, so there's only one option and it's fixed here.
  payment_method: 'havale',
  notes: '',
  terms: false,
})

const ready = ref(false)

function authHeader() {
  return { Authorization: `Bearer ${useCookie('auth_token').value}` }
}

onMounted(async () => {
  if (!cart.value) await load()

  // Prefill from the customer record and their saved address.
  if (customer.value) {
    form.first_name = customer.value.first_name ?? ''
    form.last_name = customer.value.last_name ?? ''
    form.email = customer.value.email ?? ''
    form.phone = customer.value.phone ?? ''
  }

  try {
    const res = await $fetch<{ address: any }>('/api/account/address', { headers: authHeader() })
    form.address = res.address?.address ?? ''
    form.city = res.address?.city ?? ''
    form.state = res.address?.state ?? ''
    form.postcode = res.address?.postcode ?? ''
  } catch {
    // No saved address is normal for a new customer.
  }

  ready.value = true
})

/* --- Coupon ------------------------------------------------------------- */

const couponCode = ref('')
const couponBusy = ref(false)
const couponError = ref('')

async function applyCoupon() {
  const code = couponCode.value.trim()
  if (!code) return

  couponBusy.value = true
  couponError.value = ''

  try {
    // Returns the same cart payload as every other cart endpoint, so the
    // summary updates from the shared state without a second request.
    const res = await $fetch<any>('/api/cart/coupon', {
      method: 'POST',
      body: { code },
      headers: { ...authHeader(), 'X-Cart-Token': useCookie('cart_token').value ?? '' },
    })
    cart.value = res
    couponCode.value = ''
    toast.success('Kupon uygulandı.')
  } catch (e: any) {
    // Inline rather than a toast: the message belongs beside the field being
    // corrected.
    couponError.value = e?.data?.message ?? 'Kupon uygulanamadı.'
  } finally {
    couponBusy.value = false
  }
}

async function removeCoupon() {
  couponBusy.value = true
  couponError.value = ''

  try {
    const res = await $fetch<any>('/api/cart/coupon', {
      method: 'DELETE',
      headers: { ...authHeader(), 'X-Cart-Token': useCookie('cart_token').value ?? '' },
    })
    cart.value = res
    toast.info('Kupon kaldırıldı.')
  } catch (e: any) {
    couponError.value = e?.data?.message ?? 'Kupon kaldırılamadı.'
  } finally {
    couponBusy.value = false
  }
}

/* --- Submit ------------------------------------------------------------- */

const busy = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string[]>>({})

async function submit() {
  busy.value = true
  error.value = ''
  fieldErrors.value = {}

  try {
    const res = await $fetch<{ order_number: string; redirect_url: string | null }>('/api/orders', {
      method: 'POST',
      body: form,
      headers: authHeader(),
    })

    await load()   // the cart is empty now

    if (res.redirect_url) {
      window.location.href = res.redirect_url
      return
    }

    await navigateTo(`/my-account/siparisler/${res.order_number}`)
  } catch (e: any) {
    fieldErrors.value = e?.data?.errors ?? {}
    error.value = e?.data?.message ?? 'Sipariş oluşturulamadı.'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    busy.value = false
  }
}

const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis',
  'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize',
  'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ',
  'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak',
]

useSeoMeta({ title: 'Ödeme' })
</script>

<template>
  <div class="wrap py-8">
    <nav class="mb-8 flex items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <NuxtLink to="/sepet" class="hover:text-brand">Sepetim</NuxtLink>
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">Ödeme</span>
    </nav>

    <div v-if="ready && !isLoggedIn" class="rounded-lg border border-line px-6 py-16 text-center">
      <p class="text-sm text-muted">Sipariş verebilmek için giriş yapmanız gerekiyor.</p>
      <NuxtLink to="/my-account" class="btn-primary mt-6">Giriş Yap</NuxtLink>
    </div>

    <div v-else-if="ready && !items.length" class="rounded-lg border border-line px-6 py-16 text-center">
      <p class="text-sm text-muted">Sepetinizde ürün bulunmuyor.</p>
      <NuxtLink to="/shop" class="btn-primary mt-6">Alışverişe başla</NuxtLink>
    </div>

    <div v-else class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <!-- Billing -->
      <div class="min-w-0">
        <h1 class="border-b border-line pb-3 text-xl text-ink">Fatura detayları</h1>

        <p v-if="error" class="mt-5 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {{ error }}
        </p>

        <div class="mt-6 space-y-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="co-first" class="form-label">Ad</label>
              <input id="co-first" v-model="form.first_name" type="text" class="field" :class="fieldErrors.first_name && 'field-error'">
              <p v-if="fieldErrors.first_name" class="form-error">{{ fieldErrors.first_name[0] }}</p>
            </div>
            <div>
              <label for="co-last" class="form-label">Soyad</label>
              <input id="co-last" v-model="form.last_name" type="text" class="field">
            </div>
          </div>

          <div>
            <span class="form-label">Ülke</span>
            <p class="text-sm text-ink">Türkiye</p>
          </div>

          <div>
            <label for="co-address" class="form-label">Sokak adresi</label>
            <textarea id="co-address" v-model="form.address" rows="3" class="field-area" :class="fieldErrors.address && 'field-error'" />
            <p v-if="fieldErrors.address" class="form-error">{{ fieldErrors.address[0] }}</p>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="co-post" class="form-label">Posta kodu</label>
              <input id="co-post" v-model="form.postcode" type="text" inputmode="numeric" class="field">
            </div>
            <div>
              <label for="co-state" class="form-label">İlçe / Semt</label>
              <input id="co-state" v-model="form.state" type="text" class="field">
            </div>
          </div>

          <div>
            <label for="co-city" class="form-label">Şehir</label>
            <select id="co-city" v-model="form.city" class="field" :class="fieldErrors.city && 'field-error'">
              <option value="" disabled>Seçiniz</option>
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select>
            <p v-if="fieldErrors.city" class="form-error">{{ fieldErrors.city[0] }}</p>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="co-phone" class="form-label">Telefon</label>
              <input id="co-phone" v-model="form.phone" type="tel" class="field" :class="fieldErrors.phone && 'field-error'">
              <p v-if="fieldErrors.phone" class="form-error">{{ fieldErrors.phone[0] }}</p>
            </div>
            <div>
              <label for="co-email" class="form-label">E-posta adresi</label>
              <input id="co-email" v-model="form.email" type="email" class="field" :class="fieldErrors.email && 'field-error'">
              <p v-if="fieldErrors.email" class="form-error">{{ fieldErrors.email[0] }}</p>
            </div>
          </div>
        </div>

        <h2 class="mt-10 border-b border-line pb-3 text-xl text-ink">Ek bilgi</h2>

        <div class="mt-6">
          <label for="co-notes" class="form-label">Siparişinizle ilgili notlar (isteğe bağlı)</label>
          <textarea
            id="co-notes" v-model="form.notes" rows="4" class="field-area"
            placeholder="Siparişiniz ile ilgili notlar. örn. teslimat için özel notlar."
          />
        </div>
      </div>

      <!-- Summary -->
      <aside>
        <div class="lg:sticky lg:top-28">
          <h2 class="border-b border-line pb-3 text-xl text-ink">Siparişiniz</h2>

          <div class="mt-5 rounded-lg border border-line">
            <ul class="divide-y divide-line">
              <li v-for="i in items" :key="i.id" class="flex items-center gap-3 px-4 py-3">
                <NuxtImg
                  v-if="i.image" :src="i.image" :alt="i.name"
                  width="112" height="112" loading="lazy"
                  class="h-12 w-12 shrink-0 rounded border border-line object-contain"
                />
                <div v-else class="h-12 w-12 shrink-0 rounded bg-neutral-50" />

                <span class="min-w-0 flex-1 text-[13px] leading-snug text-ink">
                  {{ i.name }} <span class="text-muted">× {{ i.quantity }}</span>
                </span>

                <span class="shrink-0 text-[13px] text-ink">
                  {{ i.line_total !== null ? formatPrice(i.line_total) : '—' }}
                </span>
              </li>
            </ul>

            <!-- Coupon sits inside the summary box, above the totals it
                 changes, so the effect is visible in the same glance. -->
            <div class="border-t border-line px-4 py-3">
              <div v-if="coupon" class="flex items-center justify-between gap-3">
                <span class="flex min-w-0 items-center gap-2">
                  <svg class="h-4 w-4 shrink-0 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                    <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 2 2 0 0 0 0-4z" /><path d="M13 7v10" />
                  </svg>
                  <span class="truncate text-[13px] font-medium text-ink">{{ coupon.code }}</span>
                </span>
                <button
                  type="button"
                  class="shrink-0 cursor-pointer text-xs text-muted underline-offset-2 transition hover:text-danger hover:underline disabled:opacity-50"
                  :disabled="couponBusy"
                  @click="removeCoupon"
                >
                  Kaldır
                </button>
              </div>

              <div v-else>
                <label for="co-coupon" class="mb-1.5 block text-[13px] text-muted">Kupon kodunuz varsa</label>
                <div class="flex gap-2">
                  <input
                    id="co-coupon"
                    v-model="couponCode"
                    type="text"
                    placeholder="HOSGELDIN10"
                    autocomplete="off"
                    class="field h-10 flex-1 uppercase placeholder:normal-case"
                    :class="couponError && 'field-error'"
                    @keyup.enter="applyCoupon"
                  >
                  <button
                    type="button"
                    class="h-10 shrink-0 cursor-pointer rounded-xl border border-line px-4 text-sm text-ink transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="couponBusy || !couponCode.trim()"
                    @click="applyCoupon"
                  >
                    {{ couponBusy ? '…' : 'Uygula' }}
                  </button>
                </div>
                <p v-if="couponError" class="form-error">{{ couponError }}</p>
              </div>
            </div>

            <dl class="divide-y divide-line border-t border-line text-sm">
              <div class="flex justify-between px-4 py-3">
                <dt class="text-muted">Ara Toplam</dt>
                <dd class="text-ink">{{ formatPrice(subtotal) }}</dd>
              </div>
              <div v-if="discount > 0" class="flex justify-between px-4 py-3">
                <dt class="text-muted">İndirim</dt>
                <dd class="text-brand">−{{ formatPrice(discount) }}</dd>
              </div>
              <div class="flex justify-between px-4 py-3">
                <dt class="text-muted">KDV (%20)</dt>
                <dd class="text-ink">{{ formatPrice(tax) }}</dd>
              </div>
              <div class="flex justify-between px-4 py-3 text-base font-semibold">
                <dt class="text-ink">Toplam</dt>
                <dd class="text-ink">{{ formatPrice(total) }}</dd>
              </div>
            </dl>
          </div>

          <!-- Card payment is not live yet. Rather than showing it disabled and
               inviting "why can't I click this", there's one method and it's
               stated plainly. -->
          <div class="mt-5 rounded-lg border border-line px-4 py-3">
            <p class="text-sm font-medium text-ink">Banka Havalesi / EFT</p>
            <p class="mt-1 text-xs leading-relaxed text-muted">
              Sipariş onayından sonra hesap bilgileri tarafınıza iletilecektir.
            </p>
          </div>

          <label class="mt-5 flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-muted">
            <input v-model="form.terms" type="checkbox" class="mt-0.5 accent-[var(--color-brand,#2563eb)]">
            <span>
              <NuxtLink to="/sartlar-ve-kosullar" class="text-brand hover:underline">Şartlar ve koşullar</NuxtLink>
              sayfasını okudum ve kabul ediyorum.
            </span>
          </label>
          <p v-if="fieldErrors.terms" class="form-error">{{ fieldErrors.terms[0] }}</p>

          <button
            type="button"
            class="btn-primary mt-5 w-full"
            :disabled="busy || !form.terms"
            @click="submit"
          >
            {{ busy ? 'Gönderiliyor…' : 'Siparişi onayla' }}
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>