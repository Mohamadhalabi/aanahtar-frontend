<script setup lang="ts">
/**
 * Static policy page. Content lives in this array rather than in the template
 * so editing a clause means editing a string. Icons replace the source
 * document's emoji — the rest of the site draws its section marks as stroked
 * SVG, and emoji render differently on every platform.
 */
interface Section {
  title: string
  /** Single-path icon, stroked at 1.5 like the homepage trust strip. */
  icon: string
  items: string[]
}

const sections: Section[] = [
  {
    title: 'Teslimat',
    icon: 'M2 7h11v9H2zM13 10h4l3 3v3h-7zM6 18a1.6 1.6 0 1 0 0-.01M17 18a1.6 1.6 0 1 0 0-.01',
    items: [
      '3000 TL ve üzeri alışverişlerinizde kargo ücretsizdir.',
      '3000 TL altındaki siparişlerde kargo ücreti sipariş esnasında sisteme yansıtılmaktadır.',
      'Tüm gönderilerimiz Yurtiçi Kargo aracılığıyla yapılmaktadır. Böylece siparişleriniz Türkiye’nin her yerine hızlı ve güvenli bir şekilde ulaştırılır.',
      'Siparişleriniz onaylandıktan sonra en kısa sürede hazırlanarak kargoya teslim edilir. Kargo takip numaranız tarafınıza iletilir ve gönderinizi kolayca takip edebilirsiniz.',
    ],
  },
  {
    title: 'İade ve Değişim',
    icon: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
    items: [
      'Satın aldığınız ürünleri, teslim aldığınız tarihten itibaren 14 gün içerisinde iade etme hakkına sahipsiniz.',
      'İade edilecek ürünlerin kullanılmamış, hasar görmemiş ve orijinal ambalajı bozulmamış olması gerekmektedir.',
      'Üründe herhangi bir sorun, defo veya yanlış gönderim olması durumunda tüm iade kargo masrafları firmamız tarafından karşılanır.',
      'Kullanım hatasından kaynaklanan zararlar veya ambalajı açılmış/eksik ürünler iade kapsamına girmez.',
      'İade işlemi için öncelikle bizimle iletişime geçerek talebinizi bildirmeniz gerekmektedir. Onay sonrası ürününüzü belirtilen adrese Yurtiçi Kargo ile gönderebilirsiniz.',
      'İade edilen ürün tarafımıza ulaştıktan sonra gerekli incelemeler yapılır ve iade onaylandığında ödemeniz en kısa sürede hesabınıza iade edilir.',
    ],
  },
  {
    title: 'Önemli Notlar',
    icon: 'M12 9v4M12 17h.01M10.3 3.9 2.4 17.5A1.8 1.8 0 0 0 4 20.2h16a1.8 1.8 0 0 0 1.6-2.7L13.7 3.9a1.8 1.8 0 0 0-3.1 0z',
    items: [
      'Kargodan teslim aldığınız paketi mutlaka kontrol ediniz. Hasarlı ya da açılmış paketlerde, teslim almadan tutanak tutturmanız gerekmektedir.',
      'İade veya değişim sürecinde ürünün eksiksiz ve güvenli şekilde bize ulaşması için dikkatlice paketlenmesi önemlidir.',
    ],
  },
]

useSeoMeta({
  title: 'Teslimat ve İade Koşulları | Anadolu Anahtar',
  description:
    'Anadolu Anahtar teslimat ve iade koşulları: kargo ücretleri, gönderim süreleri, 14 günlük iade hakkı ve değişim süreci hakkında bilmeniz gerekenler.',
})
</script>

<template>
  <div class="wrap py-6">
    <nav class="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">Teslimat ve İade</span>
    </nav>

    <!-- Capped measure: this reads as a list of conditions, and a 180-character
         line makes the eye lose its place between them. -->
    <article class="pb-10">
      <h1 class="text-2xl font-semibold text-ink sm:text-[28px]">Teslimat ve İade Koşulları</h1>

      <p class="mt-4 text-[15px] leading-relaxed text-muted">
        Müşterilerimize en iyi alışveriş deneyimini sunmak için teslimat ve iade süreçlerimizi
        şeffaf, hızlı ve güvenilir bir şekilde yürütmekteyiz.
      </p>

      <section v-for="s in sections" :key="s.title" class="mt-10">
        <h2 class="flex items-center gap-3 text-lg font-semibold text-ink">
          <svg
            class="h-6 w-6 shrink-0 text-brand" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
          >
            <path :d="s.icon" />
          </svg>
          {{ s.title }}
        </h2>

        <!-- Left rule instead of bullets: these are conditions to scan, and the
             rule groups them under the heading without a column of dots. -->
        <ul class="mt-4 space-y-3 border-l-2 border-line pl-5 text-[15px] leading-relaxed text-muted">
          <li v-for="(item, i) in s.items" :key="i">{{ item }}</li>
        </ul>
      </section>

      <p class="mt-10 rounded-lg border border-line bg-brand-50 p-5 text-[15px] leading-relaxed text-ink">
        Müşteri memnuniyeti bizim için önceliklidir. Tüm teslimat ve iade süreçlerinde size destek
        olmaktan memnuniyet duyarız. Sorularınız için
        <NuxtLink to="/contact-us" class="font-medium text-brand hover:underline">iletişim sayfamızdan</NuxtLink>
        bize ulaşabilirsiniz.
      </p>
    </article>
  </div>
</template>