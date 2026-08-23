<script setup lang="ts">
/**
 * Static legal page. Content lives in this array rather than in the template so
 * the markup stays one loop — editing a paragraph means editing prose, not
 * hunting through nested divs.
 */
interface Section {
  title: string
  paragraphs?: string[]
  list?: string[]
  listIntro?: string
}

const intro = [
  'Mağazamızda verilen tüm servisler Kuyuluk, Fındıkpınarı Cd, 36103. Sk. No:70, 33330 Mezitli/Mersin adresinde kayıtlı Anadolu Anahtar firmamıza aittir ve firmamız tarafından işletilir.',
  'Firmamız, çeşitli amaçlarla kişisel veriler toplayabilir. Aşağıda, toplanan kişisel verilerin nasıl ve ne şekilde toplandığı, bu verilerin nasıl ve ne şekilde korunduğu belirtilmiştir.',
  'Üyelik veya mağazamız üzerindeki çeşitli form ve anketlerin doldurulması suretiyle üyelerin kendileriyle ilgili bir takım kişisel bilgileri (isim-soy isim, firma bilgileri, telefon, adres veya e-posta adresleri gibi) mağazamız tarafından işin doğası gereği toplanmaktadır.',
  'Firmamız bazı dönemlerde müşterilerine ve üyelerine kampanya bilgileri, yeni ürünler hakkında bilgiler, promosyon teklifleri gönderebilir. Üyelerimiz bu gibi bilgileri alıp almama konusunda her türlü seçimi üye olurken yapabilir, sonrasında üye girişi yaptıktan sonra hesap bilgileri bölümünden bu seçimi değiştirebilir ya da kendisine gelen bilgilendirme iletisindeki linkle bildirim yapabilir.',
  'Mağazamız üzerinden veya e-posta ile gerçekleştirilen onay sürecinde, üyelerimiz tarafından mağazamıza elektronik ortamdan iletilen kişisel bilgiler, üyelerimiz ile yaptığımız “Kullanıcı Sözleşmesi” ile belirlenen amaçlar ve kapsam dışında üçüncü kişilere açıklanmayacaktır.',
  'Sistemle ilgili sorunların tanımlanması ve verilen hizmet ile ilgili çıkabilecek sorunların veya uyuşmazlıkların hızla çözülmesi için firmamız, üyelerinin IP adresini kaydetmekte ve bunu kullanmaktadır. IP adresleri, kullanıcıları genel bir şekilde tanımlamak ve kapsamlı demografik bilgi toplamak amacıyla da kullanılabilir.',
  'Firmamız, Üyelik Sözleşmesi ile belirlenen amaçlar ve kapsam dışında da, talep edilen bilgileri kendisi veya işbirliği içinde olduğu kişiler tarafından doğrudan pazarlama yapmak amacıyla kullanabilir. Kişisel bilgiler, gerektiğinde kullanıcıyla temas kurmak için de kullanılabilir. Firmamız tarafından talep edilen bilgiler veya kullanıcı tarafından sağlanan bilgiler veya mağazamız üzerinden yapılan işlemlerle ilgili bilgiler; firmamız ve işbirliği içinde olduğu kişiler tarafından, “Üyelik Sözleşmesi” ile belirlenen amaçlar ve kapsam dışında da, üyelerimizin kimliği ifşa edilmeden çeşitli istatistiksel değerlendirmeler, veri tabanı oluşturma ve pazar araştırmalarında kullanılabilir.',
  'Firmamız, gizli bilgileri kesinlikle özel ve gizli tutmayı, bunu bir sır saklama yükümü olarak addetmeyi ve gizliliğin sağlanması ve sürdürülmesi, gizli bilginin tamamının veya herhangi bir kısmının kamu alanına girmesini veya yetkisiz kullanımını veya üçüncü bir kişiye ifşasını önlemek için gerekli tüm tedbirleri almayı ve gerekli özeni göstermeyi taahhüt etmektedir.',
]

const sections: Section[] = [
  {
    title: 'Kredi Kartı Güvenliği',
    paragraphs: [
      'Firmamız, alışveriş sitelerimizden alışveriş yapan kredi kartı sahiplerinin güvenliğini ilk planda tutmaktadır. Kredi kartı bilgileriniz hiçbir şekilde sistemimizde saklanmamaktadır.',
      'İşlemler sürecine girdiğinizde güvenli bir sitede olduğunuzu anlamak için dikkat etmeniz gereken iki şey vardır. Bunlardan biri tarayıcınızın en alt satırında bulunan bir anahtar ya da kilit simgesidir. Bu güvenli bir internet sayfasında olduğunuzu gösterir ve her türlü bilgileriniz şifrelenerek korunur. Bu bilgiler, ancak satış işlemleri sürecine bağlı olarak ve verdiğiniz talimat istikametinde kullanılır. Alışveriş sırasında kullanılan kredi kartı ile ilgili bilgiler alışveriş sitelerimizden bağımsız olarak 128 bit SSL (Secure Sockets Layer) protokolü ile şifrelenip sorgulanmak üzere ilgili bankaya ulaştırılır. Kartın kullanılabilirliği onaylandığı takdirde alışverişe devam edilir. Kartla ilgili hiçbir bilgi tarafımızdan görüntülenemediğinden ve kaydedilmediğinden, üçüncü şahısların herhangi bir koşulda bu bilgileri ele geçirmesi engellenmiş olur.',
      'Online olarak kredi kartı ile verilen siparişlerin ödeme/fatura/teslimat adresi bilgilerinin güvenilirliği firmamız tarafından Kredi Kartları Dolandırıcılığı’na karşı denetlenmektedir. Bu yüzden, alışveriş sitelerimizden ilk defa sipariş veren müşterilerin siparişlerinin tedarik ve teslimat aşamasına gelebilmesi için öncelikle finansal ve adres/telefon bilgilerinin doğruluğunun onaylanması gereklidir. Bu bilgilerin kontrolü için gerekirse kredi kartı sahibi müşteri ile veya ilgili banka ile irtibata geçilmektedir.',
      'Üye olurken verdiğiniz tüm bilgilere sadece siz ulaşabilir ve siz değiştirebilirsiniz. Üye giriş bilgilerinizi güvenli koruduğunuz takdirde başkalarının sizinle ilgili bilgilere ulaşması ve bunları değiştirmesi mümkün değildir. Bu amaçla, üyelik işlemleri sırasında 128 bit SSL güvenlik alanı içinde hareket edilir. Bu sistem kırılması mümkün olmayan uluslararası bir şifreleme standardıdır.',
      'Bilgi hattı veya müşteri hizmetleri servisi bulunan ve açık adres ve telefon bilgilerinin belirtildiği internet alışveriş siteleri günümüzde daha fazla tercih edilmektedir. Bu sayede aklınıza takılan bütün konular hakkında detaylı bilgi alabilir, online alışveriş hizmeti sağlayan firmanın güvenilirliği konusunda daha sağlıklı bilgi edinebilirsiniz.',
      'Not: İnternet alışveriş sitelerinde firmanın açık adresinin ve telefonunun yer almasına dikkat edilmesini tavsiye ediyoruz. Alışveriş yapacaksanız alışverişinizi yapmadan ürünü aldığınız mağazanın bütün telefon ve adres bilgilerini not edin. Eğer güvenmiyorsanız alışverişten önce telefon ederek teyit edin. Firmamıza ait tüm online alışveriş sitelerimizde firmamıza dair tüm bilgiler ve firma yeri belirtilmiştir.',
    ],
  },
  {
    title: 'Mail Order Kredi Kartı Bilgileri Güvenliği',
    paragraphs: [
      'Kredi kartı mail-order yöntemi ile bize göndereceğiniz kimlik ve kredi kartı bilgileriniz firmamız tarafından gizlilik prensibine göre saklanacaktır. Bu bilgiler olası banka ile oluşabilecek kredi kartından para çekim itirazlarına karşı 60 gün süre ile bekletilip daha sonrasında imha edilmektedir. Sipariş ettiğiniz ürünlerin bedeli karşılığında bize göndereceğiniz tarafınızdan onaylı mail-order formu bedeli dışında herhangi bir bedelin kartınızdan çekilmesi halinde doğal olarak bankaya itiraz edebilir ve bu tutarın ödenmesini engelleyebileceğiniz için bir risk oluşturmamaktadır.',
    ],
  },
  {
    title: 'Üçüncü Taraf Web Siteleri ve Uygulamalar',
    paragraphs: [
      'Mağazamız, web sitesi dâhilinde başka sitelere link verebilir. Firmamız, bu linkler vasıtasıyla erişilen sitelerin gizlilik uygulamaları ve içeriklerine yönelik herhangi bir sorumluluk taşımamaktadır. Firmamıza ait sitede yayınlanan reklamlar, reklamcılık yapan iş ortaklarımız aracılığı ile kullanıcılarımıza dağıtılır. İşbu sözleşmedeki Gizlilik Politikası prensipleri, sadece mağazamızın kullanımına ilişkindir, üçüncü taraf web sitelerini kapsamaz.',
    ],
  },
  {
    title: 'İstisnai Haller',
    listIntro: 'Aşağıda belirtilen sınırlı hallerde firmamız, işbu “Gizlilik Politikası” hükümleri dışında kullanıcılara ait bilgileri üçüncü kişilere açıklayabilir. Bu durumlar sınırlı sayıda olmak üzere:',
    list: [
      'Kanun, Kanun Hükmünde Kararname, Yönetmelik vb. yetkili hukuki otorite tarafından çıkarılan ve yürürlükte olan hukuk kurallarının getirdiği zorunluluklara uymak;',
      'Mağazamızın kullanıcılarla akdettiği “Üyelik Sözleşmesi”nin ve diğer sözleşmelerin gereklerini yerine getirmek ve bunları uygulamaya koymak amacıyla;',
      'Yetkili idari ve adli otorite tarafından usulüne göre yürütülen bir araştırma veya soruşturmanın yürütümü amacıyla kullanıcılarla ilgili bilgi talep edilmesi;',
      'Kullanıcıların hakları veya güvenliklerini korumak için bilgi vermenin gerekli olduğu haller.',
    ],
  },
  {
    title: 'E-Posta Güvenliği',
    paragraphs: [
      'Mağazamızın Müşteri Hizmetleri’ne, herhangi bir siparişinizle ilgili olarak göndereceğiniz e-postalarda, asla kredi kartı numaranızı veya şifrelerinizi yazmayınız. E-postalarda yer alan bilgiler üçüncü şahıslar tarafından görülebilir. Firmamız e-postalarınızdan aktarılan bilgilerin güvenliğini hiçbir koşulda garanti edemez.',
    ],
  },
  {
    title: 'Tarayıcı Çerezleri',
    paragraphs: [
      'Firmamız, mağazamızı ziyaret eden kullanıcılar ve kullanıcıların web sitesini kullanımı hakkındaki bilgileri teknik bir iletişim dosyası (Çerez-Cookie) kullanarak elde edebilir. Bahsi geçen teknik iletişim dosyaları, ana bellekte saklanmak üzere bir internet sitesinin kullanıcının tarayıcısına gönderdiği küçük metin dosyalarıdır. Teknik iletişim dosyası site hakkında durum ve tercihleri saklayarak internetin kullanımını kolaylaştırır.',
      'Teknik iletişim dosyası, siteyi kaç kişinin ziyaret ettiğini, bir kişinin siteyi hangi amaçla, kaç kez ziyaret ettiğini ve ne kadar sitede kaldıkları hakkında istatistiksel bilgileri elde etmeye ve kullanıcılar için özel tasarlanmış kullanıcı sayfalarından dinamik olarak reklam ve içerik üretilmesine yardımcı olur. Teknik iletişim dosyası, ana bellekte veya e-postanızdan veri veya başkaca herhangi bir kişisel bilgi almak için tasarlanmamıştır. Tarayıcıların pek çoğu başta teknik iletişim dosyasını kabul eder biçimde tasarlanmıştır, ancak kullanıcılar dilerse teknik iletişim dosyasının gelmemesi veya teknik iletişim dosyası gönderildiğinde uyarı verilmesini sağlayacak biçimde ayarları değiştirebilirler.',
      'Firmamız, işbu “Gizlilik Politikası” hükümlerini dilediği zaman sitede yayınlamak veya kullanıcılara elektronik posta göndermek suretiyle değiştirebilir. Gizlilik Politikası hükümleri değiştiği takdirde, yayınlandığı tarihte yürürlük kazanır.',
    ],
  },
]

const company = {
  name: 'Anadolu Anahtar',
  address: 'Kuyuluk, Fındıkpınarı Cd, 36103. Sk. No:70, 33330 Mezitli/Mersin',
  email: 'satis@aanahtar.com.tr',
  phone: '+90 552 436 80 30',
}

useSeoMeta({
  title: 'Gizlilik ve Güvenlik Politikası | Anadolu Anahtar',
  description:
    'Anadolu Anahtar gizlilik ve güvenlik politikası: kişisel verilerin toplanması ve korunması, kredi kartı güvenliği, çerezler ve iletişim bilgileri.',
})
</script>

<template>
  <div class="wrap py-6">
    <nav class="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">Gizlilik ve Güvenlik Politikası</span>
    </nav>

    <!-- Capped measure: legal text at the full 1400px wrap is close to
         unreadable — the eye loses the line on the way back. -->
    <article class="pb-10">
      <h1 class="text-2xl font-semibold text-ink sm:text-[28px]">Gizlilik ve Güvenlik Politikası</h1>

      <div class="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
        <p v-for="(p, i) in intro" :key="i">{{ p }}</p>
      </div>

      <section v-for="s in sections" :key="s.title" class="mt-10">
        <h2 class="text-lg font-semibold text-ink">{{ s.title }}</h2>

        <div class="mt-3 space-y-4 text-[15px] leading-relaxed text-muted">
          <p v-for="(p, i) in s.paragraphs ?? []" :key="i">{{ p }}</p>

          <p v-if="s.listIntro">{{ s.listIntro }}</p>

          <ol v-if="s.list" class="list-decimal space-y-2 pl-5 marker:text-brand">
            <li v-for="(item, i) in s.list" :key="i" class="pl-1">{{ item }}</li>
          </ol>
        </div>
      </section>

      <!-- Contact details get a panel rather than another paragraph: this is
           the part people scroll to the bottom looking for. -->
      <section class="mt-10 rounded-lg border border-line p-5">
        <h2 class="text-lg font-semibold text-ink">İletişim</h2>
        <p class="mt-3 text-[15px] leading-relaxed text-muted">
          Gizlilik politikamız ile ilgili her türlü soru ve önerileriniz için bize
          <a :href="`mailto:${company.email}`" class="text-brand hover:underline">{{ company.email }}</a>
          adresinden ulaşabilirsiniz.
        </p>

        <dl class="mt-5 space-y-3 text-[15px]">
          <div class="sm:flex sm:gap-4">
            <dt class="w-32 shrink-0 text-muted">Firma Ünvanı</dt>
            <dd class="text-ink">{{ company.name }}</dd>
          </div>
          <div class="sm:flex sm:gap-4">
            <dt class="w-32 shrink-0 text-muted">Adres</dt>
            <dd class="text-ink">{{ company.address }}</dd>
          </div>
          <div class="sm:flex sm:gap-4">
            <dt class="w-32 shrink-0 text-muted">E-posta</dt>
            <dd>
              <a :href="`mailto:${company.email}`" class="text-brand hover:underline">{{ company.email }}</a>
            </dd>
          </div>
          <div class="sm:flex sm:gap-4">
            <dt class="w-32 shrink-0 text-muted">Telefon</dt>
            <dd>
              <!-- tel: needs the number without spaces, the label reads better with them. -->
              <a :href="`tel:${company.phone.replace(/\s/g, '')}`" class="text-brand hover:underline">{{ company.phone }}</a>
            </dd>
          </div>
        </dl>
      </section>
    </article>
  </div>
</template>