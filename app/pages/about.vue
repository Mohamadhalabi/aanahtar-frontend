<script setup lang="ts">
/**
 * Team. Photos go in public/images/team/ — the paths below expect
 * kerem.webp, huseyin.webp, ziya.webp, emin.webp, muhammet.webp.
 * Square images work best; the frame crops to a circle.
 */
const team = [
  { name: 'Kerem',    role: 'Satış', photo: '/images/team/kerem.webp' },
  { name: 'Hüseyin',  role: 'Satış', photo: '/images/team/huseyin.webp' },
  { name: 'Ziya',     role: 'Satış', photo: '/images/team/ziya.webp' },
  { name: 'Emin',     role: 'Satış', photo: '/images/team/emin.webp' },
  { name: 'Muhammet', role: 'Satış', photo: '/images/team/muhammet.webp' },
]

const intro = [
  {
    title: 'Biz Neler Yapıyoruz?',
    text: 'Anadolu Anahtar olarak, oto anahtar, immobilizer, otomasyon ve merkezi kilit sistemleri gibi ürünlerin ithalatını ve pazarlamasını yapıyoruz. Müşterilerimize, işleri için yenilikçi ve güvenilir çözümler sunuyoruz.',
    d: 'M20.6 6.6 12 3 3.4 6.6 5 18l7 3 7-3zM9 12l2 2 4-4',
  },
  {
    title: 'Vizyonumuz Nedir?',
    text: 'Vizyonumuz, sektörde lider bir firma olarak, en kaliteli ürün ve hizmetleri sunmak ve yenilikçi çözümlerle müşterilerimizin işlerini iyileştirmektir.',
    d: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  },
  {
    title: 'Şirketimizin Kuruluşu',
    text: '2018 yılında Mersin\'de kurulan Anadolu Anahtar, kısa sürede otomotiv ve anahtarcılık sektörlerinde güvenilir bir marka haline geldi.',
    d: 'M4 21V8l8-5 8 5v13M9 21v-6h6v6M4 21h16',
  },
]

const offers = [
  {
    title: 'Sizin İçin Neler Yapabiliriz?',
    text: 'Geniş ürün yelpazemizle, işinizi büyütmek ve güvenliğini artırmak için gerekli çözümleri sunuyoruz.',
  },
  {
    title: 'Bizimle İşbirliği Yapın',
    text: 'Kaliteli ürünlerimiz ve çözüm odaklı hizmetlerimizle, işinizi daha verimli hale getirmek için birlikte çalışabiliriz.',
  },
]

const values = [
  {
    title: 'Güvenilirlik',
    text: 'Güven, işimizin temel taşını oluşturur. Müşterilerimizle kurduğumuz her ilişkiyi, dürüstlük ve şeffaflık üzerine inşa ediyoruz. Uzun vadeli iş ortaklıkları kurarak, sektörde güvenilir bir isim olmayı sürdürüyoruz.',
  },
  {
    title: 'Yüksek Kalite',
    text: 'Ürünlerimizde ve hizmetlerimizde kaliteyi en üst seviyede tutmayı hedefliyoruz. İthal ettiğimiz her ürün, sıkı kalite kontrol süreçlerinden geçer. Müşterilerimize, ihtiyaçlarına en uygun, uzun ömürlü ve güvenli çözümler sunuyoruz.',
  },
  {
    title: 'Hızlı Çözümler',
    text: 'Zamanın değerini biliyoruz. Bu yüzden, müşterilerimize en hızlı ve en etkili çözümleri sunmaya özen gösteriyoruz. İhtiyaç duyduğunuzda, size en kısa sürede yanıt veriyor ve sorununuzu çözüyoruz.',
  },
  {
    title: 'Yenilikleri Kabul Etme',
    text: 'Sektördeki yenilikleri yakından takip ediyor ve işimize entegre ediyoruz. Teknolojik gelişmelere açık bir şekilde, en son çözümleri müşterilerimizle buluşturuyoruz. Yenilikçi bakış açımızla, iş süreçlerinizi sürekli olarak geliştiriyoruz.',
  },
  {
    title: 'Müşteri Memnuniyeti',
    text: 'Müşterilerimizin memnuniyeti, en büyük önceliğimizdir. Onların ihtiyaçlarını anlıyor, beklentilerini karşılamak ve aşmak için çalışıyoruz. Müşteri geri bildirimleri, hizmet kalitemizi sürekli olarak iyileştirmemize yardımcı olur.',
  },
]

// First one open, so the panel doesn't read as an inert list of headings.
const openValue = ref(0)

const bars = [
  { label: 'Kalite', value: 98 },
  { label: 'Güvenilirlik', value: 95 },
  { label: 'Memnuniyet', value: 92 },
]

useSeoMeta({
  title: 'Hakkımızda',
  description: '2018 yılında Mersin\'de kurulan Anadolu Anahtar, oto anahtar, immobilizer ve merkezi kilit sistemleri alanında güvenilir bir marka.',
})
</script>

<template>
  <div>
    <div class="wrap py-8">
      <nav class="mb-10 flex items-center gap-2 text-[13px] text-muted">
        <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 6 6 6-6 6" />
        </svg>
        <span class="text-ink">Hakkımızda</span>
      </nav>

      <div class="mx-auto max-w-2xl text-center">
        <h1 class="text-3xl font-semibold text-ink">Hakkımızda</h1>
        <p class="mt-3 text-sm leading-relaxed text-muted">
          Otomotiv ve anahtarcılık sektöründe, doğru ürünü doğru zamanda sunmak için çalışıyoruz.
        </p>
      </div>

      <!-- Intro cards -->
      <section class="mt-10 grid gap-5 lg:grid-cols-3">
        <div
          v-for="item in intro" :key="item.title"
          class="rounded-2xl border border-line p-6 transition hover:border-brand/30 hover:shadow-[0_8px_28px_rgba(0,0,0,.07)]"
        >
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <svg
              class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
            >
              <path :d="item.d" />
            </svg>
          </span>
          <h2 class="mt-4 text-[17px] font-semibold text-ink">{{ item.title }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">{{ item.text }}</p>
        </div>
      </section>
    </div>

    <!-- Team. Full-bleed band; photos are the point of this section, so they
         get the room. -->
    <section class="bg-neutral-50 py-14">
      <div class="wrap">
        <div class="mx-auto mb-10 max-w-xl text-center">
          <h2 class="text-2xl font-semibold text-ink">Ekibimiz</h2>
          <p class="mt-2 text-sm text-muted">Sorularınız için doğrudan ulaşabileceğiniz satış ekibimiz.</p>
        </div>

        <ul class="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          <li v-for="member in team" :key="member.name" class="group text-center">
            <!-- Ring drawn with padding + a gradient rather than a border, so
                 its thickness scales with the photo instead of hairlining. -->
            <div
              class="mx-auto aspect-square w-full max-w-[240px] rounded-full bg-gradient-to-b from-brand to-brand-600 p-[6px] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_36px_rgba(0,0,0,.16)]"
            >
              <NuxtImg
                :src="member.photo" :alt="member.name"
                width="480" height="480" sizes="50vw sm:33vw lg:240px"
                loading="lazy"
                class="h-full w-full rounded-full bg-white object-cover"
              />
            </div>

            <p class="mt-5 text-lg font-medium text-ink">{{ member.name }}</p>
            <p class="mt-0.5 text-[13px] uppercase tracking-wide text-muted">{{ member.role }}</p>
          </li>
        </ul>
      </div>
    </section>

    <div class="wrap py-14">
      <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <!-- Left: offers, story, bars -->
        <div>
          <div class="grid gap-6 sm:grid-cols-2">
            <div v-for="item in offers" :key="item.title" class="rounded-2xl bg-neutral-50 p-5">
              <h2 class="text-[15px] font-semibold text-ink">{{ item.title }}</h2>
              <p class="mt-2 text-sm leading-relaxed text-muted">{{ item.text }}</p>
            </div>
          </div>

          <h2 class="mt-10 text-xl font-semibold text-ink">Neden Anadolu Anahtar</h2>
          <p class="mt-4 text-sm leading-relaxed text-muted">
            Anadolu Anahtar, güvenilirlik, kalite, hızlı çözümler ve müşteri odaklı hizmet
            anlayışıyla öne çıkar. Sektördeki tecrübemiz ve yenilikçi yaklaşımımızla,
            müşterilerimize en iyi ürün ve hizmetleri sunmayı taahhüt ediyoruz. Bizimle
            çalışmak, sadece ihtiyaçlarınızı karşılamakla kalmaz, aynı zamanda işlerinizi
            daha güvenli ve verimli hale getirir. Anadolu Anahtar'ı tercih ederek, işinizi
            güçlü bir ortakla bir adım öne taşırsınız.
          </p>

          <ul class="mt-8 space-y-4">
            <li v-for="bar in bars" :key="bar.label">
              <div class="mb-1.5 flex items-baseline justify-between text-[13px]">
                <span class="font-medium text-ink">{{ bar.label }}</span>
                <span class="text-muted">%{{ bar.value }}</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-brand to-brand-600 transition-[width] duration-700"
                  :style="{ width: `${bar.value}%` }"
                />
              </div>
            </li>
          </ul>
        </div>

        <!-- Right: values accordion -->
        <div>
          <h2 class="text-xl font-semibold text-ink">Sizin için neler yapabiliriz?</h2>

          <ul class="mt-6 space-y-3">
            <li
              v-for="(value, i) in values" :key="value.title"
              class="overflow-hidden rounded-xl border transition"
              :class="openValue === i ? 'border-brand/30 bg-brand/[0.03]' : 'border-line hover:border-neutral-300'"
            >
              <button
                type="button"
                class="flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left"
                :aria-expanded="openValue === i"
                @click="openValue = openValue === i ? -1 : i"
              >
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition"
                  :class="openValue === i ? 'bg-brand text-white' : 'bg-neutral-100 text-muted'"
                >
                  <svg
                    class="h-4 w-4 transition-transform duration-200"
                    :class="openValue === i && 'rotate-45'"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>

                <span
                  class="flex-1 text-[15px] transition"
                  :class="openValue === i ? 'font-medium text-ink' : 'text-ink'"
                >
                  {{ value.title }}
                </span>
              </button>

              <p v-if="openValue === i" class="px-4 pb-4 pl-15 text-sm leading-relaxed text-muted">
                {{ value.text }}
              </p>
            </li>
          </ul>

          <p class="mt-8 rounded-xl bg-neutral-50 p-5 text-sm leading-relaxed text-muted">
            Bu değerler doğrultusunda, Anadolu Anahtar olarak, sektördeki liderliğimizi
            korumak ve her zaman müşterilerimizin yanında olmak için çalışıyoruz.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Not a default Tailwind step; lines the answer up with the heading text
   rather than the icon. */
.pl-15 {
  padding-left: 3.75rem;
}
</style>