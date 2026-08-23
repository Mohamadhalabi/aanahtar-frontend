<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)
const isDev = import.meta.dev

/**
 * Nuxt's default 404 message is the framework's own English string, and a
 * thrown createError often carries something only useful to a developer
 * ("Kategori bulunamadı" is fine, "fetch failed" is not). So the copy is ours,
 * keyed on the status.
 */
const heading = computed(() => (is404.value ? 'Sayfa bulunamadı' : 'Bir şeyler ters gitti'))

const body = computed(() =>
  is404.value
    ? 'Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Aşağıdaki bağlantılardan devam edebilirsiniz.'
    : 'Beklenmeyen bir hata oluştu. Kısa bir süre sonra tekrar deneyin veya bizimle iletişime geçin.',
)

// clearError before navigating: the error state persists otherwise and the
// destination renders this page again.
function goHome() {
  clearError({ redirect: '/' })
}

function goBack() {
  // No history to return to on a cold load (someone pasting a dead link, or
  // arriving from a search engine) — home is the only sensible destination.
  if (import.meta.client && window.history.length > 1) {
    clearError()
    history.back()
    return
  }
  goHome()
}

const links = [
  { to: '/shop', label: 'Mağaza' },
  { to: '/contact-us', label: 'İletişim' },
  { to: '/siparis-takip', label: 'Siparişinizi Takip Edin' },
  { to: '/my-account', label: 'Hesabım' },
]

useSeoMeta({
  title: () => (is404.value ? 'Sayfa bulunamadı | Anadolu Anahtar' : 'Hata | Anadolu Anahtar'),
  // A soft-404 that search engines index is worse than none at all.
  robots: 'noindex, follow',
})
</script>

<template>
  <!-- Error pages sit outside the layout system, so the layout is mounted
       explicitly here. Header, nav and footer mean a dead end still offers the
       search box and the category menu — usually a faster way out than any
       link this page could list. -->
  <NuxtLayout name="default">
    <div class="wrap flex items-center justify-center py-20 sm:py-28">
      <div class="w-full max-w-lg text-center">
        <!-- The key silhouette rather than a generic warning triangle: it's the
             one shape this catalogue is entirely made of. -->
        <svg
          class="mx-auto h-16 w-16 text-brand" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="4.5" />
          <circle cx="8" cy="8" r="1.4" />
          <path d="M11.2 11.2 20 20M17 17l-2 2M19 15l-1.5 1.5" />
        </svg>

        <p class="mt-5 text-[56px] font-bold leading-none tracking-tight text-brand sm:text-[72px]">
          {{ error?.statusCode || 404 }}
        </p>

        <h1 class="mt-3 text-2xl font-semibold text-ink">{{ heading }}</h1>

        <p class="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">
          {{ body }}
        </p>

        <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" class="btn-primary" @click="goHome">
            Ana sayfaya dön
          </button>
          <button type="button" class="btn-ghost" @click="goBack">
            Geri dön
          </button>
        </div>

        <!-- A dead end is the moment someone leaves. These are the four places
             they were most likely heading. -->
        <div class="mt-12 border-t border-line pt-8">
          <p class="text-[13px] text-muted">Şunlara göz atabilirsiniz</p>
          <ul class="mt-4 flex flex-wrap justify-center gap-2">
            <li v-for="l in links" :key="l.to">
              <NuxtLink
                :to="l.to"
                class="inline-block rounded-full border border-line px-4 py-2 text-[13px] text-ink transition hover:border-brand hover:text-brand"
                @click="clearError()"
              >
                {{ l.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Only in dev: in production this would leak stack traces to
             customers, and the message is rarely in Turkish anyway. -->
        <pre
          v-if="isDev && error?.message"
          class="mt-10 overflow-x-auto rounded-lg border border-line bg-neutral-50 p-4 text-left text-xs text-muted"
        >{{ error.message }}</pre>
      </div>
    </div>
  </NuxtLayout>
</template>