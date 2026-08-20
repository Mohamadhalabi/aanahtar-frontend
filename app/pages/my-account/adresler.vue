<script setup lang="ts">
interface Address {
  address: string | null
  city: string | null
  state: string | null
  postcode: string | null
  country: string | null
}

const { isLoggedIn } = useAuth()

const { data, pending, refresh } = await useApiFetch<{ address: Address }>('/account/address', {
  key: 'account-address',
  lazy: true,
  server: false,
})

const form = reactive({ address: '', city: '', state: '', postcode: '', country: 'Türkiye' })

watchEffect(() => {
  const a = data.value?.address
  if (!a) return
  form.address  = a.address ?? ''
  form.city     = a.city ?? ''
  form.state    = a.state ?? ''
  form.postcode = a.postcode ?? ''
  form.country  = a.country ?? 'Türkiye'
})

const busy = ref(false)
const done = ref('')
const error = ref('')

async function save() {
  busy.value = true
  done.value = ''
  error.value = ''

  try {
    await $fetch('/api/account/address', { method: 'PUT', body: form })
    await refresh()
    done.value = 'Adresiniz güncellendi.'
  } catch (e: any) {
    error.value = e?.data?.message ?? 'Adres kaydedilemedi.'
  } finally {
    busy.value = false
  }
}

useSeoMeta({ title: 'Adresler' })
</script>

<template>
  <div class="wrap py-8">
    <AccountBreadcrumb current="Adresler" />

    <h1 class="mb-10 text-center text-3xl text-ink">Hesabım</h1>

    <div class="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
      <AccountNav />

      <section v-if="isLoggedIn" class="max-w-xl">
        <h2 class="text-lg font-semibold text-ink">Adres</h2>
        <p class="mb-8 mt-1 text-sm text-muted">
          Siparişlerinizde varsayılan olarak kullanılacak adres.
        </p>

        <div v-if="pending" class="space-y-4">
          <div class="h-24 animate-pulse rounded-xl bg-neutral-100" />
          <div v-for="i in 2" :key="i" class="grid gap-5 sm:grid-cols-2">
            <div class="h-11 animate-pulse rounded-xl bg-neutral-100" />
            <div class="h-11 animate-pulse rounded-xl bg-neutral-100" />
          </div>
        </div>

        <template v-else>
          <p v-if="done" class="mb-6 rounded-xl border border-brand/30 bg-brand-50 px-4 py-3 text-sm text-brand-600">
            {{ done }}
          </p>
          <p v-if="error" class="mb-6 rounded-xl border border-price/30 bg-price/5 px-4 py-3 text-sm text-price">
            {{ error }}
          </p>

          <div class="space-y-5">
            <div>
              <label for="adr-address" class="form-label">Adres</label>
              <textarea id="adr-address" v-model="form.address" rows="3" class="field-area" />
              <p class="form-hint">Mahalle, cadde, bina ve daire bilgisi.</p>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="adr-city" class="form-label">İl / Şehir</label>
                <input id="adr-city" v-model="form.city" type="text" autocomplete="address-level1" class="field">
              </div>
              <div>
                <label for="adr-state" class="form-label">İlçe</label>
                <input id="adr-state" v-model="form.state" type="text" autocomplete="address-level2" class="field">
              </div>
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="adr-post" class="form-label">Posta kodu</label>
                <input id="adr-post" v-model="form.postcode" type="text" inputmode="numeric"
                       autocomplete="postal-code" class="field">
              </div>
              <div>
                <label for="adr-country" class="form-label">Ülke</label>
                <input id="adr-country" v-model="form.country" type="text" autocomplete="country-name" class="field">
              </div>
            </div>
          </div>

          <button type="button" :disabled="busy" class="btn-primary mt-8" @click="save">
            {{ busy ? 'Kaydediliyor…' : 'Adresi kaydet' }}
          </button>
        </template>
      </section>

      <AccountSignInPrompt v-else />
    </div>
  </div>
</template>