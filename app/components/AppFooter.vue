<script setup lang="ts">
const { data: categories } = await useCategories()

/**
 * The tree's top level holds broad groups, so filtering it alone surfaced only
 * three entries. Flattening first lets child categories — "Dolu Kumandalar",
 * "Xhorse Kumandalar" and the rest — reach the list.
 */
function flatten(nodes: any[]): any[] {
  return (nodes ?? []).flatMap(n => [n, ...flatten(n.children ?? [])])
}

const remotes = computed(() =>
  flatten(categories.value).filter(c => /kumanda/i.test(c.name)).slice(0, 7),
)
</script>

<template>
  <footer class="mt-16 bg-neutral-50">
    <div class="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 lg:grid-cols-[1fr_2fr]">
      <div class="min-w-0">
        <NuxtImg src="/images/logo/aanahtar-logo.webp" alt="Anadolu Anahtar" width="340" height="80" class="h-20 w-auto" loading="lazy" />

        <div class="mt-6 flex items-center gap-3">
          <svg class="h-9 w-9 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
            <path d="M4 13a8 8 0 0 1 16 0M4 13v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" />
          </svg>
          <div>
            <p class="text-xs text-neutral-500">Sorularınız mı var?</p>
            <a href="tel:+905524368030" class="text-xl font-semibold text-ink">+90 552 436 80 30</a>
          </div>
        </div>

        <h3 class="mt-8 text-sm font-semibold text-ink">Neden Anadolu Anahtar?</h3>
        <p class="mt-2 text-[13px] leading-relaxed text-neutral-600">
          Anadolu Anahtar, güvenilirlik, kalite, hızlı çözümler ve müşteri odaklı hizmet
          anlayışıyla öne çıkar. Sektördeki tecrübemiz ve yenilikçi yaklaşımımızla,
          müşterilerimize en iyi ürün ve hizmetleri sunmayı taahhüt ediyoruz. Bizimle çalışmak,
          sadece ihtiyaçlarınızı karşılamakla kalmaz, aynı zamanda işlerinizi daha güvenli ve
          verimli hale getirir. Anadolu Anahtar’ı tercih ederek, işinizi güçlü bir ortakla bir
          adım öne taşırsınız.
        </p>

        <div class="mt-5 flex gap-4 text-neutral-500">
          <a href="#" aria-label="Facebook" class="hover:text-brand-500">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-9h3l.5-3.5H13V7.2c0-1 .3-1.7 1.8-1.7H17V2.4C16.6 2.3 15.5 2.2 14.3 2.2 11.7 2.2 10 3.8 10 6.8v2.7H7V13h3v9z"/></svg>
          </a>
          <a href="#" aria-label="WhatsApp" class="hover:text-brand-500">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-3-.7-2.5-1-4.1-3.6-4.2-3.8-.1-.2-1-1.4-1-2.6s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.2 1.5 1.9 1 .9 1.8 1.1 2 1.2.3.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.4.3.1.2.1.6 0 1Z"/></svg>
          </a>
          <a href="#" aria-label="Instagram" class="hover:text-brand-500">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
          </a>
          <a href="#" aria-label="YouTube" class="hover:text-brand-500">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8c1.5.5 8.8.5 8.8.5s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12ZM9.8 15.2V8.8L15.5 12Z"/></svg>
          </a>
        </div>
      </div>

      <!-- Five columns at xl, three at lg: at 1200px five link columns leave
           each one narrow enough that most labels wrap to two lines. -->
      <div class="grid min-w-0 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div class="min-w-0">
          <h4 class="mb-3 font-semibold text-ink">Koşullar</h4>
          <ul class="space-y-2 text-[13px] text-neutral-600">
            <li><NuxtLink to="/gizlilik-ve-guvenlik-politikasi" class="hover:text-brand-500">Gizlilik Ve Güvenlik Politikası</NuxtLink></li>
            <li><NuxtLink to="/teslimat-ve-iade" class="hover:text-brand-500">Teslimat ve İade</NuxtLink></li>
            <li><NuxtLink to="/mesafeli-satis-sozlesmesi" class="hover:text-brand-500">Mesafeli Satış Sözleşmesi</NuxtLink></li>
          </ul>
        </div>

        <div class="min-w-0">
          <h4 class="mb-3 font-semibold text-ink">Kumandalar</h4>
          <ul class="space-y-2 text-[13px] text-neutral-600">
            <li v-for="c in remotes" :key="c.id">
              <NuxtLink :to="`/product-category/${c.slug}/`" class="hover:text-brand-500">{{ c.name }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="min-w-0">
          <h4 class="mb-3 font-semibold text-ink">Anadolu Anahtar</h4>
          <ul class="space-y-2 text-[13px] text-neutral-600">
            <li><NuxtLink to="/" class="hover:text-brand-500">Anasayfa</NuxtLink></li>
            <li><NuxtLink to="/shop" class="hover:text-brand-500">Mağaza</NuxtLink></li>
            <li><NuxtLink to="/contact-us" class="hover:text-brand-500">İletişim</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-brand-500">Hakkımızda</NuxtLink></li>
            <li class="font-semibold text-price">5000 TL VE ÜZERİ ÜCRETSİZ KARGO</li>
          </ul>
        </div>

        <!-- Prose rather than links, so it reads as a column of text and not a
             list with dead entries. -->
        <div class="min-w-0">
          <h4 class="mb-3 font-semibold text-ink">Şirketimizin Kuruluşu</h4>
          <p class="text-[13px] leading-relaxed text-neutral-600">
            2018 yılında Mersin’de kurulan Anadolu Anahtar, kısa sürede otomotiv ve anahtarcılık
            sektörlerinde güvenilir bir marka haline geldi.
          </p>
        </div>

        <div class="min-w-0">
          <h4 class="mb-3 font-semibold text-ink">Hesabım</h4>
          <ul class="space-y-2 text-[13px] text-neutral-600">
            <li><NuxtLink to="/siparis-takip" class="hover:text-brand-500">Siparişinizi Takip Edin</NuxtLink></li>
            <li><NuxtLink to="/my-account" class="hover:text-brand-500">Giriş Yap</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-line py-5 text-center text-[13px] text-neutral-500">
      © <span class="font-semibold text-ink">Anadolu Anahtar 2017-{{ new Date().getFullYear() }}</span> - All Rights Reserved
    </div>
  </footer>
</template>