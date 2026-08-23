<script setup lang="ts">
/**
 * Branches. Hardcoded for the same reason as the team list — two entries that
 * change rarely. Fill in the İstanbul details; only the Mersin address was
 * available from the old site.
 *
 * `mapQuery` is used for both the embed and the "directions" link, so the two
 * can't drift apart.
 */
const branches = [
  {
    city: 'Mersin',
    name: 'Mersin Şubesi',
    address: 'Kuyuluk, Fındıkpınarı Cd. No:70, 33330 Mezitli/Mersin',
    phone: '+90 552 436 80 30',
    phoneHref: 'tel:+905524368030',
    email: 'satis@aanahtar.com.tr',
    hours: 'Pazartesi – Cumartesi, 09:00 – 18:00',
    mapQuery: 'Kuyuluk, Fındıkpınarı Cd. No:70, 33330 Mezitli/Mersin',
  },
  {
    city: 'İstanbul',
    name: 'İstanbul Şubesi',
    address: 'Adres bilgisi eklenecek',
    phone: '+90 552 436 80 30',
    phoneHref: 'tel:+905524368030',
    email: 'info@aanahtar.com.tr',
    hours: 'Pazartesi – Cumartesi, 09:00 – 18:00',
    mapQuery: 'İstanbul',
  },
]

function embedUrl(query: string) {
  // The keyless embed: no API key, no billing account, and enough for a pin.
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
}

function directionsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

useSeoMeta({
  title: 'Şubelerimiz',
  description: 'Anadolu Anahtar Mersin ve İstanbul şubelerimizin adres ve iletişim bilgileri.',
})
</script>

<template>
  <div class="wrap py-8">
    <nav class="mb-10 flex items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">Şubelerimiz</span>
    </nav>

    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-3xl font-semibold text-ink">Şubelerimiz</h1>
      <p class="mt-3 text-sm leading-relaxed text-muted">
        Mersin ve İstanbul'daki şubelerimizden bize ulaşabilir, ürünlerimizi
        yerinde inceleyebilirsiniz.
      </p>
    </div>

    <div class="mt-10 grid gap-8 lg:grid-cols-2">
      <section
        v-for="branch in branches" :key="branch.city"
        class="overflow-hidden rounded-2xl border border-line"
      >
        <!-- Map first: on a branch page the location is the headline, and a
             pin communicates it faster than an address line. -->
        <div class="aspect-[16/10] w-full bg-neutral-100">
          <iframe
            :src="embedUrl(branch.mapQuery)"
            :title="`${branch.name} konumu`"
            class="h-full w-full border-0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
        </div>

        <div class="p-6">
          <h2 class="text-xl font-semibold text-ink">{{ branch.name }}</h2>

          <dl class="mt-5 space-y-4 text-sm">
            <div class="flex gap-3">
              <dt class="shrink-0 text-muted" aria-label="Adres">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" />
                </svg>
              </dt>
              <dd class="leading-relaxed text-ink">{{ branch.address }}</dd>
            </div>

            <div class="flex gap-3">
              <dt class="shrink-0 text-muted" aria-label="Telefon">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 5c0-.6.4-1 1-1h2.5c.4 0 .8.3 1 .7l1 3c.1.4 0 .8-.3 1L7.8 10a12 12 0 0 0 6.2 6.2l1.3-1.4c.3-.3.7-.4 1-.3l3 1c.4.2.7.6.7 1V19c0 .6-.4 1-1 1h-1A16 16 0 0 1 4 6V5Z" />
                </svg>
              </dt>
              <dd>
                <a :href="branch.phoneHref" class="text-brand hover:underline">{{ branch.phone }}</a>
              </dd>
            </div>

            <div class="flex gap-3">
              <dt class="shrink-0 text-muted" aria-label="E-posta">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
                </svg>
              </dt>
              <dd>
                <a :href="`mailto:${branch.email}`" class="text-brand hover:underline">{{ branch.email }}</a>
              </dd>
            </div>

            <div class="flex gap-3">
              <dt class="shrink-0 text-muted" aria-label="Çalışma saatleri">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                </svg>
              </dt>
              <dd class="text-muted">{{ branch.hours }}</dd>
            </div>
          </dl>

          <a
            :href="directionsUrl(branch.mapQuery)"
            target="_blank" rel="noopener noreferrer"
            class="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-6 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="m3 11 18-8-8 18-2-8z" />
            </svg>
            Yol Tarifi Al
          </a>
        </div>
      </section>
    </div>

    <p class="mt-10 text-center text-sm text-muted">
      Sorularınız için
      <NuxtLink to="/iletisim" class="text-brand hover:underline">satış ekibimize</NuxtLink>
      doğrudan ulaşabilirsiniz.
    </p>
  </div>
</template>
