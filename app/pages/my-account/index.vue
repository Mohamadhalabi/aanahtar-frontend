<script setup lang="ts">
const { login } = useAuth()

const loginForm = reactive({ email: '', password: '' })
const regForm = reactive({
  first_name: '', last_name: '', company_name: '',
  email: '', phone: '', password: '', password_confirmation: '',
})

const loginError = ref('')
const regError = ref('')
const regDone = ref('')
const busy = ref(false)

async function doLogin() {
  loginError.value = ''
  busy.value = true
  try {
    await login(loginForm.email, loginForm.password)
    await navigateTo('/')
  } catch (e: any) {
    loginError.value = e?.data?.data?.message ?? e?.data?.message ?? 'Giriş yapılamadı.'
  } finally {
    busy.value = false
  }
}

async function doRegister() {
  regError.value = ''
  regDone.value = ''
  busy.value = true
  try {
    const res = await $fetch<{ message: string }>('/api/register', { method: 'POST', body: regForm })
    regDone.value = res.message
  } catch (e: any) {
    regError.value = e?.data?.message ?? 'Kayıt tamamlanamadı.'
  } finally {
    busy.value = false
  }
}

const field = 'h-11 w-full rounded-full border border-line bg-white px-5 text-sm text-ink outline-none transition focus:border-brand'
const label = 'mb-2 block text-sm text-ink'
const pill = 'h-11 rounded-full bg-neutral-100 px-8 text-sm text-ink transition hover:bg-brand hover:text-white disabled:opacity-60'

useSeoMeta({ title: 'Hesabım' })
</script>

<template>
  <div class="wrap py-8">
    <nav class="mb-10 flex items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">Hesabım</span>
    </nav>

    <div class="relative grid gap-14 lg:grid-cols-2 lg:gap-24">
      <!-- Divider with the "or" badge, desktop only -->
      <div class="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-line lg:block">
        <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-white px-3 py-1.5 text-xs italic text-muted">
          or
        </span>
      </div>

      <section>
        <h2 class="text-xl text-ink">Giriş Yap</h2>
        <div class="mt-3 mb-7 h-0.5 w-full bg-line">
          <div class="h-0.5 w-24 bg-brand" />
        </div>

        <p class="mb-6 text-sm text-muted">Tekrar hoşgeldiniz! Hesabınızda oturum açın.</p>

        <p v-if="loginError" class="mb-5 rounded-md border border-price/30 bg-price/5 px-4 py-3 text-sm text-price">
          {{ loginError }}
        </p>

        <div class="space-y-5">
          <div>
            <label for="login-email" :class="label">E-posta adresi</label>
            <input id="login-email" v-model="loginForm.email" type="email" autocomplete="email"
                   :class="field" @keyup.enter="doLogin">
          </div>

          <div>
            <label for="login-password" :class="label">Parola</label>
            <input id="login-password" v-model="loginForm.password" type="password" autocomplete="current-password"
                   :class="field" @keyup.enter="doLogin">
          </div>

          <button type="button" :disabled="busy" :class="pill" @click="doLogin">
            {{ busy ? 'Giriş yapılıyor…' : 'Giriş Yap' }}
          </button>

          <p>
            <NuxtLink to="/my-account/lost-password/" class="text-sm text-muted hover:text-brand">
              Parolanızı mı unuttunuz?
            </NuxtLink>
          </p>
        </div>
      </section>

      <section>
        <h2 class="text-xl text-ink">Üye Ol</h2>
        <div class="mt-3 mb-7 h-0.5 w-full bg-line">
          <div class="h-0.5 w-20 bg-brand" />
        </div>

        <p class="mb-6 text-sm leading-relaxed text-muted">
          Kişiselleştirilmiş bir alışveriş deneyiminin avantajlarından yararlanmak için
          bugün yeni hesap oluşturun.
        </p>

        <p v-if="regDone" class="mb-5 rounded-md border border-brand/30 bg-brand-50 px-4 py-3 text-sm text-brand-600">
          {{ regDone }}
        </p>
        <p v-if="regError" class="mb-5 rounded-md border border-price/30 bg-price/5 px-4 py-3 text-sm text-price">
          {{ regError }}
        </p>

        <div v-if="!regDone" class="space-y-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="reg-first" :class="label">Ad</label>
              <input id="reg-first" v-model="regForm.first_name" type="text" :class="field">
            </div>
            <div>
              <label for="reg-last" :class="label">Soyad</label>
              <input id="reg-last" v-model="regForm.last_name" type="text" :class="field">
            </div>
          </div>

          <div>
            <label for="reg-email" :class="label">E-posta adresi</label>
            <input id="reg-email" v-model="regForm.email" type="email" autocomplete="email" :class="field">
          </div>

          <div>
            <label for="reg-phone" :class="label">Telefon</label>
            <div class="flex h-11 items-center rounded-full border border-line bg-white">
              <span class="flex h-full items-center gap-1.5 rounded-l-full border-r border-line px-4 text-sm text-ink">
                🇹🇷 +90
              </span>
              <input id="reg-phone" v-model="regForm.phone" type="tel" placeholder="501 234 56 78"
                     class="h-full flex-1 rounded-r-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted">
            </div>
          </div>

          <div>
            <label for="reg-company" :class="label">Firma Adı</label>
            <input id="reg-company" v-model="regForm.company_name" type="text" :class="field">
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="reg-pass" :class="label">Parola</label>
              <input id="reg-pass" v-model="regForm.password" type="password" autocomplete="new-password" :class="field">
            </div>
            <div>
              <label for="reg-pass2" :class="label">Parola (tekrar)</label>
              <input id="reg-pass2" v-model="regForm.password_confirmation" type="password" autocomplete="new-password" :class="field">
            </div>
          </div>

          <button type="button" :disabled="busy" :class="pill" @click="doRegister">
            {{ busy ? 'Gönderiliyor…' : 'Üye Ol' }}
          </button>
        </div>

        <div class="mt-10">
          <p class="mb-4 text-sm text-ink">Bugün kaydolduğunuzda şunları yapabileceksiniz:</p>
          <ul class="space-y-3 text-sm text-muted">
            <li v-for="benefit in [
              'Ürün fiyatlarını görüntüleyin',
              'Siparişlerinizi kolayca takip edin',
              'Tüm alışverişlerinizin kaydını tutun',
            ]" :key="benefit" class="flex items-center gap-3">
              <svg class="h-4 w-4 shrink-0 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="m5 13 4 4L19 7" />
              </svg>
              {{ benefit }}
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>