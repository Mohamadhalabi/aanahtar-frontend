<script setup lang="ts">
const { customer, isLoggedIn, fetchMe } = useAuth()

const form = reactive({
  first_name: '', last_name: '', email: '', phone: '', company_name: '',
  current_password: '', password: '', password_confirmation: '',
})

// customer arrives from the client-side plugin, so it may still be null on the
// first tick — seed the form whenever it lands.
watchEffect(() => {
  if (!customer.value) return
  form.first_name   = customer.value.first_name ?? ''
  form.last_name    = customer.value.last_name ?? ''
  form.email        = customer.value.email ?? ''
  form.phone        = customer.value.phone ?? ''
  form.company_name = customer.value.company_name ?? ''
})

const busy = ref(false)
const done = ref('')
const error = ref('')
const fieldErrors = ref<Record<string, string[]>>({})

async function save() {
  busy.value = true
  done.value = ''
  error.value = ''
  fieldErrors.value = {}

  try {
    await $fetch('/api/auth/me', { method: 'PATCH', body: form })
    await fetchMe()             // pull the canonical record back

    form.current_password = ''
    form.password = ''
    form.password_confirmation = ''
    done.value = 'Hesap bilgileriniz güncellendi.'
  } catch (e: any) {
    fieldErrors.value = e?.data?.errors ?? {}
    error.value = e?.data?.message ?? 'Bilgiler kaydedilemedi.'
  } finally {
    busy.value = false
  }
}

const field = 'h-11 w-full rounded-full border border-line bg-white px-5 text-sm text-ink outline-none transition focus:border-brand'
const label = 'mb-2 block text-sm text-ink'
const pill = 'h-11 rounded-full bg-neutral-100 px-8 text-sm text-ink transition hover:bg-brand hover:text-white disabled:opacity-60'

useSeoMeta({ title: 'Hesap detayları' })
</script>

<template>
  <div class="wrap py-8">
    <nav class="mb-10 flex items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <NuxtLink to="/my-account" class="hover:text-brand">Hesabım</NuxtLink>
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">Hesap detayları</span>
    </nav>

    <h1 class="mb-10 text-center text-3xl text-ink">Hesabım</h1>

    <div class="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
      <AccountNav />

      <section v-if="isLoggedIn" class="max-w-xl">
        <p v-if="done" class="mb-6 rounded-md border border-brand/30 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          {{ done }}
        </p>
        <p v-if="error" class="mb-6 rounded-md border border-price/30 bg-price/5 px-4 py-3 text-sm text-price">
          {{ error }}
        </p>

        <div class="space-y-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="acc-first" :class="label">Ad</label>
              <input id="acc-first" v-model="form.first_name" type="text" :class="field">
              <p v-if="fieldErrors.first_name" class="mt-1.5 text-xs text-price">{{ fieldErrors.first_name[0] }}</p>
            </div>
            <div>
              <label for="acc-last" :class="label">Soyad</label>
              <input id="acc-last" v-model="form.last_name" type="text" :class="field">
            </div>
          </div>

          <div>
            <label for="acc-email" :class="label">E-posta adresi</label>
            <input id="acc-email" v-model="form.email" type="email" autocomplete="email" :class="field">
            <p v-if="fieldErrors.email" class="mt-1.5 text-xs text-price">{{ fieldErrors.email[0] }}</p>
          </div>

          <div>
            <label for="acc-phone" :class="label">Telefon</label>
            <input id="acc-phone" v-model="form.phone" type="tel" placeholder="501 234 56 78" :class="field">
          </div>

          <div>
            <label for="acc-company" :class="label">Firma Adı</label>
            <input id="acc-company" v-model="form.company_name" type="text" :class="field">
          </div>
        </div>

        <h2 class="mb-5 mt-10 text-lg text-ink">Parola değiştir</h2>
        <p class="mb-5 text-sm text-muted">
          Parolanızı değiştirmek istemiyorsanız bu alanları boş bırakın.
        </p>

        <div class="space-y-5">
          <div>
            <label for="acc-current" :class="label">Mevcut parola</label>
            <input id="acc-current" v-model="form.current_password" type="password"
                   autocomplete="current-password" :class="field">
            <p v-if="fieldErrors.current_password" class="mt-1.5 text-xs text-price">
              {{ fieldErrors.current_password[0] }}
            </p>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="acc-new" :class="label">Yeni parola</label>
              <input id="acc-new" v-model="form.password" type="password" autocomplete="new-password" :class="field">
              <p v-if="fieldErrors.password" class="mt-1.5 text-xs text-price">{{ fieldErrors.password[0] }}</p>
            </div>
            <div>
              <label for="acc-new2" :class="label">Yeni parola (tekrar)</label>
              <input id="acc-new2" v-model="form.password_confirmation" type="password"
                     autocomplete="new-password" :class="field">
            </div>
          </div>
        </div>

        <button type="button" :disabled="busy" :class="[pill, 'mt-8']" @click="save">
          {{ busy ? 'Kaydediliyor…' : 'Değişiklikleri kaydet' }}
        </button>
      </section>

      <section v-else>
        <p class="text-sm text-muted">
          Bu sayfayı görüntülemek için
          <NuxtLink to="/my-account" class="text-brand hover:underline">giriş yapın</NuxtLink>.
        </p>
      </section>
    </div>
  </div>
</template>