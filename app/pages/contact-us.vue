<script setup lang="ts">
/**
 * Team contacts. Hardcoded rather than fetched: five entries that change once
 * a year don't justify a table and an admin screen.
 *
 * Numbers are stored bare (international, no +, spaces or dashes) and the
 * wa.me link is built below. wa.me picks the app on mobile and web.whatsapp
 * on desktop, whereas web.whatsapp.com always forces the browser client — so
 * phone visitors would land on a QR-code page instead of their chat.
 */
const team = [
  {
    name: 'Kerem',
    whatsapp: '905524368030',
    facebook: 'https://www.facebook.com/kerem.anadoluanahtar',
  },
  {
    name: 'Hüseyin',
    whatsapp: '905527567233',
    facebook: 'https://www.facebook.com/mersin.anadoluanahtar',
  },
  {
    name: 'Ziya',
    whatsapp: '905333488722',
    facebook: 'https://www.facebook.com/AnadoluAnah',
  },
  {
    name: 'Emin',
    whatsapp: '905385584090',
    facebook: 'https://www.facebook.com/profile.php?id=61566479495805',
  },
  {
    name: 'Muhammet',
    whatsapp: '905380644412',
    facebook: 'https://www.facebook.com/profile.php?id=61566479495805',
  },
]

/** Prefilled so the customer doesn't have to open with "merhaba". */
function waLink(number: string, name: string) {
  const text = encodeURIComponent(`Merhaba ${name}, Anadolu Anahtar hakkında bilgi almak istiyorum.`)
  return `https://wa.me/${number}?text=${text}`
}

function displayNumber(number: string) {
  // 905524368030 -> +90 552 436 80 30
  const m = number.match(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/)
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]}` : `+${number}`
}

const company = {
  phone: '+90 552 436 80 30',
  phoneHref: 'tel:+905524368030',
  emails: ['satis@aanahtar.com.tr', 'info@aanahtar.com.tr'],
  address: 'Kuyuluk, Fındıkpınarı Cd. No:70, 33330 Mezitli/Mersin',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kuyuluk+F%C4%B1nd%C4%B1kp%C4%B1nar%C4%B1+Cd.+No%3A70+33330+Mezitli+Mersin',
}

useSeoMeta({
  title: 'İletişim',
  description: 'Anadolu Anahtar iletişim bilgileri, satış ekibimiz ve mağaza adresimiz.',
})
</script>

<template>
  <div class="wrap py-8">
    <nav class="mb-8 flex items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">İletişim</span>
    </nav>

    <h1 class="text-2xl font-semibold text-ink">İletişim</h1>
    <p class="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
      Satış ekibimizden dilediğiniz kişiye doğrudan ulaşabilir, ürünler ve
      siparişleriniz hakkında bilgi alabilirsiniz.
    </p>

    <!-- Team -->
    <section class="mt-8">
      <h2 class="mb-5 inline-block border-b-2 border-brand pb-2 text-lg font-semibold text-ink">
        Satış Ekibimiz
      </h2>

      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="member in team" :key="member.name"
          class="rounded-xl border border-line p-5 transition hover:border-brand/30 hover:shadow-[0_6px_22px_rgba(0,0,0,.08)]"
        >
          <div class="flex items-center gap-3">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="8" r="3.6" /><path d="M4.5 20.5c0-3.9 3.4-6 7.5-6s7.5 2.1 7.5 6" />
              </svg>
            </span>

            <span class="min-w-0">
              <span class="block truncate text-base font-medium text-ink">{{ member.name }}</span>
              <a
                :href="`tel:+${member.whatsapp}`"
                class="block text-[13px] text-muted transition hover:text-brand"
              >
                {{ displayNumber(member.whatsapp) }}
              </a>
            </span>
          </div>

          <div class="mt-4 flex gap-2">
            <a
              :href="waLink(member.whatsapp, member.name)"
              target="_blank" rel="noopener noreferrer"
              :aria-label="`${member.name} — WhatsApp`"
              class="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-medium text-white transition hover:opacity-90"
            >
              <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4a3.2 3.2 0 0 0-1 2.4A5.6 5.6 0 0 0 7.3 12a12.7 12.7 0 0 0 4.9 4.3c.7.3 1.2.5 1.6.6a3.9 3.9 0 0 0 1.8.1 3 3 0 0 0 2-1.4c.2-.6.2-1.1.2-1.2s-.2-.2-.4-.3Z" />
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
              </svg>
              WhatsApp
            </a>

            <a
              :href="member.facebook"
              target="_blank" rel="noopener noreferrer"
              :aria-label="`${member.name} — Facebook`"
              class="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1877F2] text-white transition hover:opacity-90"
            >
              <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
              </svg>
            </a>
          </div>
        </li>
      </ul>
    </section>

    <!-- Company details -->
    <section class="mt-12 grid gap-6 lg:grid-cols-3">
      <div class="rounded-xl border border-line p-5">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 5c0-.6.4-1 1-1h2.5c.4 0 .8.3 1 .7l1 3c.1.4 0 .8-.3 1L7.8 10a12 12 0 0 0 6.2 6.2l1.3-1.4c.3-.3.7-.4 1-.3l3 1c.4.2.7.6.7 1V19c0 .6-.4 1-1 1h-1A16 16 0 0 1 4 6V5Z" />
          </svg>
        </span>
        <h3 class="mt-4 text-[15px] font-semibold text-ink">Bizi Arayın</h3>
        <a :href="company.phoneHref" class="mt-1 block text-sm text-brand hover:underline">
          {{ company.phone }}
        </a>
        <p class="mt-2 text-xs text-muted">Hafta içi 09:00 – 18:00</p>
      </div>

      <div class="rounded-xl border border-line p-5">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
          </svg>
        </span>
        <h3 class="mt-4 text-[15px] font-semibold text-ink">E-posta</h3>
        <a
          v-for="email in company.emails" :key="email"
          :href="`mailto:${email}`"
          class="mt-1 block text-sm text-brand hover:underline"
        >
          {{ email }}
        </a>
      </div>

      <div class="rounded-xl border border-line p-5">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" />
          </svg>
        </span>
        <h3 class="mt-4 text-[15px] font-semibold text-ink">Adresimiz</h3>
        <p class="mt-1 text-sm leading-relaxed text-muted">{{ company.address }}</p>
        <a
          :href="company.mapsUrl" target="_blank" rel="noopener noreferrer"
          class="mt-2 inline-block text-sm text-brand hover:underline"
        >
          Haritada göster
        </a>
      </div>
    </section>

    <!-- About -->
    <section class="mt-12 rounded-xl bg-neutral-50 p-6 sm:p-8">
      <h2 class="text-lg font-semibold text-ink">Neden Anadolu Anahtar?</h2>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
        Anadolu Anahtar, güvenilirlik, kalite, hızlı çözümler ve müşteri odaklı hizmet
        anlayışıyla öne çıkar. Sektördeki tecrübemiz ve yenilikçi yaklaşımımızla,
        müşterilerimize en iyi ürün ve hizmetleri sunmayı taahhüt ediyoruz. Bizimle
        çalışmak, sadece ihtiyaçlarınızı karşılamakla kalmaz, aynı zamanda işlerinizi
        daha güvenli ve verimli hale getirir. Anadolu Anahtar'ı tercih ederek, işinizi
        güçlü bir ortakla bir adım öne taşırsınız.
      </p>
    </section>
  </div>
</template>