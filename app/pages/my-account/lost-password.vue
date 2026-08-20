<script setup lang="ts">
const email = ref('')
const done = ref('')
const busy = ref(false)

async function submit() {
  busy.value = true
  try {
    const res = await $fetch<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST', body: { email: email.value },
    })
    done.value = res.message
  } catch {
    done.value = 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'
  } finally {
    busy.value = false
  }
}

useSeoMeta({ title: 'Şifremi unuttum' })
</script>

<template>
  <div class="wrap max-w-3xl py-10">
    <nav class="mb-8 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <span class="mx-2">›</span>
      <NuxtLink to="/my-account/" class="hover:text-brand">Hesabım</NuxtLink>
      <span class="mx-2">›</span>
      <span class="text-ink">Şifremi unuttum</span>
    </nav>

    <h1 class="mb-8 text-center text-3xl text-ink">Şifremi unuttum</h1>

    <p v-if="done" class="mb-6 border border-brand/30 bg-brand-50 px-4 py-3 text-sm text-brand-600">
      {{ done }}
    </p>

    <template v-else>
      <p class="mb-6 text-sm text-muted">
        Şifrenizi mi unuttunuz? Lütfen e-posta adresinizi girin. Yeni bir şifre oluşturmanız için
        e-posta adresinize bir bağlantı gönderilecektir.
      </p>

      <label class="mb-2 block text-sm text-ink">E-posta adresi</label>
      <input v-model="email" type="email" autocomplete="email"
             class="mb-6 h-12 w-full rounded-full border border-line px-5 text-sm outline-none focus:border-brand"
             @keyup.enter="submit">

      <button type="button" :disabled="busy"
              class="h-11 rounded-full bg-neutral-100 px-6 text-sm text-ink transition hover:bg-brand hover:text-white disabled:opacity-60"
              @click="submit">
        {{ busy ? 'Gönderiliyor…' : 'Şifre sıfırlama' }}
      </button>
    </template>
  </div>
</template>