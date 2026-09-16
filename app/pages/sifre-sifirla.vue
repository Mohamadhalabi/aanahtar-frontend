<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const token = String(route.query.token || '')
const email = String(route.query.email || '')

const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const errorMsg = ref('')
const done = ref(false)

const invalidLink = computed(() => !token || !email)

async function submit() {
  errorMsg.value = ''

  if (password.value.length < 8) {
    errorMsg.value = 'Şifre en az 8 karakter olmalıdır.'
    return
  }
  if (password.value !== passwordConfirmation.value) {
    errorMsg.value = 'Şifreler eşleşmiyor.'
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token,
        email,
        password: password.value,
        password_confirmation: passwordConfirmation.value,
      },
    })
    done.value = true
    setTimeout(() => router.push('/my-account'), 2500)
  } catch (err: any) {
    errorMsg.value =
      err?.data?.message ||
      err?.statusMessage ||
      'Şifre sıfırlanamadı. Bağlantının süresi dolmuş olabilir.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Şifre Sıfırla' })
</script>

<template>
  <div class="mx-auto max-w-md px-4 py-12">
    <h1 class="mb-8 text-center text-3xl font-semibold">Şifre Sıfırla</h1>

    <div v-if="invalidLink" class="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Geçersiz bağlantı. Lütfen şifre sıfırlama talebini tekrar oluşturun.
      <NuxtLink to="/my-account/lost-password" class="mt-2 block underline">
        Yeni talep oluştur
      </NuxtLink>
    </div>

    <div v-else-if="done" class="rounded border border-green-200 bg-green-50 p-4 text-sm text-green-800">
      Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz…
    </div>

    <div v-else class="space-y-5">
      <p class="text-sm text-gray-600">
        <span class="font-medium">{{ email }}</span> için yeni şifrenizi belirleyin.
      </p>

      <div>
        <label class="mb-1 block text-sm font-medium" for="password">Yeni Şifre</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          class="w-full rounded border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none"
          @keyup.enter="submit"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium" for="password_confirmation">Yeni Şifre (Tekrar)</label>
        <input
          id="password_confirmation"
          v-model="passwordConfirmation"
          type="password"
          autocomplete="new-password"
          class="w-full rounded border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none"
          @keyup.enter="submit"
        />
      </div>

      <p v-if="errorMsg" class="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        {{ errorMsg }}
      </p>

      <button
        type="button"
        :disabled="loading"
        class="w-full rounded bg-gray-900 py-2.5 text-white transition hover:bg-gray-800 disabled:opacity-50"
        @click="submit"
      >
        {{ loading ? 'Gönderiliyor…' : 'Şifreyi Güncelle' }}
      </button>
    </div>
  </div>
</template>
