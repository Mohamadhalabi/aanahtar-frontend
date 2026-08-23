<script setup lang="ts">
// Must match OrderController — the server recomputes authoritatively, these
// are only for what the customer sees before confirming.
const TAX_RATE = 0.20
const FREE_SHIPPING_FROM = 5000
const SHIPPING_FLAT = 0.00

const { cart, load } = useCart()
const { customer, isLoggedIn } = useAuth()

const items = computed(() => cart.value?.items ?? [])
const subtotal = computed(() => cart.value?.subtotal ?? 0)
const shipping = computed(() => (subtotal.value >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT))
const tax = computed(() => Math.round(subtotal.value * TAX_RATE * 100) / 100)
const total = computed(() => subtotal.value + tax.value + shipping.value)

const form = reactive({
  first_name: '', last_name: '', email: '', phone: '',
  address: '', postcode: '', state: '', city: '',
  payment_method: 'havale',
  notes: '',
  terms: false,
})

const ready = ref(false)

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
    const res = await $fetch<{ address: any }>('/api/account/address', {
      headers: { Authorization: `Bearer ${useCookie('auth_token').value}` },
    })
    form.address = res.address?.address ?? ''
    form.city = res.address?.city ?? ''
    form.state = res.address?.state ?? ''
    form.postcode = res.address?.postcode ?? ''
  } catch {
    // No saved address is normal for a new customer.
  }

  ready.value = true
})

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
      headers: { Authorization: `Bearer ${useCookie('auth_token').value}` },
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

        <p v-if="error" class="mt-5 rounded-lg border border-price/30 bg-price/5 px-4 py-3 text-sm text-price">
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

            <dl class="divide-y divide-line border-t border-line text-sm">
              <div class="flex justify-between px-4 py-3">
                <dt class="text-muted">Ara Toplam</dt>
                <dd class="text-ink">{{ formatPrice(subtotal) }}</dd>
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

          <div class="mt-5 space-y-3">
            <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-line px-4 py-3">
              <input v-model="form.payment_method" type="radio" value="havale" class="mt-0.5 accent-[var(--color-brand,#2563eb)]">
              <span>
                <span class="block text-sm font-medium text-ink">Banka Havalesi / EFT</span>
                <span class="mt-1 block text-xs leading-relaxed text-muted">
                  Sipariş onayından sonra hesap bilgileri tarafınıza iletilecektir.
                </span>
              </span>
            </label>

            <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-line px-4 py-3">
              <input v-model="form.payment_method" type="radio" value="card" class="mt-0.5 accent-[var(--color-brand,#2563eb)]">
              <span>
                <span class="block text-sm font-medium text-ink">Banka / Banka Kartı ile Ödeme</span>
                <span class="mt-1 block text-xs leading-relaxed text-muted">
                  Siparişiniz oluşturulduktan sonra ödeme adımına yönlendirileceksiniz.
                </span>
              </span>
            </label>
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