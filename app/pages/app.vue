<script setup lang="ts">
const APP_STORE = 'https://apps.apple.com/us/app/anadolu-anahtar/id6756212156'
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.anadolu.anahtar&hl=tr'

function detectOs(ua: string): 'ios' | 'android' | null {
  if (/android/i.test(ua)) return 'android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  return null
}

// On the server, read the User-Agent header so the redirect happens before
// any HTML is sent. On the client (e.g. after a NuxtLink click), use the browser's.
const ua = import.meta.server
  ? useRequestHeaders(['user-agent'])['user-agent'] ?? ''
  : navigator.userAgent

let os = detectOs(ua)

// iPads on iPadOS 13+ pretend to be a Mac. Only the browser can tell them
// apart, by checking for a touch screen.
if (!os && import.meta.client && /macintosh/i.test(ua) && navigator.maxTouchPoints > 1) {
  os = 'ios'
}

if (os) {
  await navigateTo(os === 'ios' ? APP_STORE : PLAY_STORE, {
    external: true,
    redirectCode: 302,
  })
}

useHead({ title: 'Uygulamayı İndir | Anadolu Anahtar' })
</script>

<template>
  <!-- Only seen on desktop or unknown devices: show both stores. -->
  <section class="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
    <h1 class="text-2xl font-semibold text-ink">Anadolu Anahtar Uygulaması</h1>
    <p class="mt-3 text-muted">
      Uygulamamızı telefonunuza indirmek için mağazanızı seçin.
    </p>

    <div class="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
      <a
        :href="APP_STORE"
        target="_blank" rel="noopener"
        class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-600"
      >
        App Store
      </a>
      <a
        :href="PLAY_STORE"
        target="_blank" rel="noopener"
        class="rounded-lg border border-line px-6 py-3 font-medium text-ink transition hover:border-brand hover:text-brand"
      >
        Google Play
      </a>
    </div>
  </section>
</template>