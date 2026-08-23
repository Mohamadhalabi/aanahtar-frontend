<script setup lang="ts">
const { code, list, current, load, setCurrency } = useCurrency()

// Fetched during SSR: formatPrice needs the symbol at first paint, otherwise
// every price renders with the fallback for a frame.
await load()

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
        <NuxtLink to="/my-account/" class="flex items-center gap-1.5 hover:text-brand">
          <svg class="h-4 w-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
          </svg>
          Giriş Yap
        </NuxtLink>
      </div>
    </div>
  </div>
</template>