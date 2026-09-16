<script setup lang="ts">
const { code, list, current, load, setCurrency } = useCurrency()

// Fetched during SSR: formatPrice needs the symbol at first paint, otherwise
// every price renders with the fallback for a frame.
await load()

/**
 * Session. `customer` is only populated by fetchMe(), so without this call the
 * bar renders as a guest on every fresh page load even with a valid token.
 * It returns immediately when there's no token, so guests pay nothing.
 *
 * If a plugin already calls fetchMe() on app init, delete the await below —
 * `customer` is useState, so the state is shared and the call is redundant.
 */
const { customer, isLoggedIn, fetchMe } = useAuth()

// Client-side only: the homepage is SWR-cached, so running fetchMe() during
// SSR would bake a guest header into the cached HTML. Running it on mount
// re-checks the real token cookie on every load and updates the header.
onMounted(() => { fetchMe() })

/**
 * First name only. Full names run long enough to wrap the top bar on mobile,
 * and the email local-part is a reasonable last resort for accounts registered
 * without a name rather than showing a bare "Hoş geldiniz,".
 */
const displayName = computed(() => {
  const c = customer.value
  if (!c) return ''

  const name = (c.first_name ?? c.name ?? '').trim()
  if (name) return name.split(/\s+/)[0]

  return c.email.split('@')[0]
})

const switching = ref(false)

async function onChange(event: Event) {
  const next = (event.target as HTMLSelectElement).value
  switching.value = true
  try {
    await setCurrency(next)
  } finally {
    switching.value = false
  }
}
</script>

<template>
  <div class="border-b border-line bg-white">
    <div class="wrap flex h-11 items-center justify-between text-[13px] text-ink">
      <div class="flex items-center">
        <select
          :value="code ?? current.code"
          :disabled="switching || list.length < 2"
          class="mr-4 h-7 cursor-pointer rounded border border-line bg-white px-2 text-[13px] text-ink disabled:cursor-default disabled:opacity-70"
          aria-label="Para birimi"
          @change="onChange"
        >
          <option v-for="c in list" :key="c.code" :value="c.code">
            {{ c.code }}
          </option>
          <!-- Placeholder until the list arrives, so the control isn't blank. -->
          <option v-if="!list.length" :value="current.code">{{ current.code }}</option>
        </select>

        <span class="mr-4 hidden h-4 w-px bg-line sm:block" />
        <NuxtLink to="/subelerimiz" class="hidden items-center gap-1.5 hover:text-brand sm:flex">
          <svg class="h-4 w-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 9 4.5 4h15L21 9M3 9h18M3 9v10h18V9M9 19v-6h6v6" />
          </svg>
          Şubelerimiz
        </NuxtLink>
        <span class="mx-4 hidden h-4 w-px bg-line sm:block" />
        <NuxtLink to="/contact-us" class="hidden hover:text-brand sm:block">Ekip Üyesi</NuxtLink>
      </div>

      <div class="flex items-center">
        <NuxtLink to="/siparis-takip" class="flex items-center gap-1.5 hover:text-brand">
          <svg class="h-4 w-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" /><circle cx="6" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" />
          </svg>
          <span class="hidden sm:inline">Siparişinizi Takip Edin</span>
        </NuxtLink>
        <span class="mx-4 h-4 w-px bg-line" />

        <!-- Both states point at /my-account/: logged in it's the account
             dashboard, logged out it's the login form. -->
        <NuxtLink
          v-if="isLoggedIn"
          to="/my-account/"
          class="flex min-w-0 items-center gap-1.5 hover:text-brand"
        >
          <svg class="h-4 w-4 shrink-0 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
          </svg>
          <span class="min-w-0 truncate">
            <span class="hidden sm:inline">Hoş geldiniz, </span>
            <span class="font-medium">{{ displayName }}</span>
          </span>
        </NuxtLink>

        <NuxtLink v-else to="/my-account/" class="flex items-center gap-1.5 hover:text-brand">
          <svg class="h-4 w-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
          </svg>
          Giriş Yap
        </NuxtLink>
      </div>
    </div>
  </div>
</template>