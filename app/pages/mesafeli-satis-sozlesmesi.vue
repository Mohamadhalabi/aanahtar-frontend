<script setup lang="ts">
/**
 * Static legal page. The articles live in this array rather than in the
 * template so editing a clause means editing a string — and so the numbering
 * can't drift out of sequence when one gets inserted.
 */
interface Article {
  no: number
  title: string
  paragraphs?: string[]
  /** Lettered sub-clauses, e.g. Madde 9's cayma exceptions. */
  lettered?: { label: string; text: string }[]
  letteredIntro?: string
}

/** Madde 1. Blank values render as a dash — this is a template until the
    company details are filled in. */
const seller = [
  { label: 'Ticari Ünvanı', value: 'Anadolu Anahtar Elek. Kilit İnş. Malz. Gıda Tem. Oto. Aks. San. ve Tic. Ltd. Şti.' },
  { label: 'Adresi', value: 'Kuyuluk, Fındıkpınarı Cd, 36103. Sk. No:70, 33330 Mezitli/Mersin' },
  { label: 'Telefon', value: '+90 552 436 80 30' },
  { label: 'Mersis No', value: '' },
  { label: 'E-Posta Adresi', value: 'satis@aanahtar.com.tr' },
  { label: 'İade Kargo Şirketi', value: 'Yurtiçi Kargo' },
]

const buyer = [
  { label: 'Adı – Soyadı', value: '' },
  { label: 'Adresi', value: '' },
  { label: 'Telefon', value: '' },
  { label: 'E-Posta', value: '' },
]

/** Madde 3. Per-line columns, then the order totals beneath them. */
const orderColumns = [
  'Ürün Kodu ve Adı',
  'Adet',
  'Satıcı Ünvanı',
  'Birim Fiyatı',
  'Birim İndirimi',
  'Kupon',
  'Puan',
  'Toplam Satış Tutarı',
  'Vade Farkı',
  'KDV Dahil Toplam Tutar',
]

const orderTotals = [
  'Kargo hariç toplam ürün bedeli',
  'Kargo ücreti',
  'Kargo dahil toplam bedel',
  'Ödeme şekli ve planı',
  'Alınan vade farkı',
  'Vade farkı hesabında kullanılan faiz oranı',
  'Teslim şartları',
  'Teslimat adresi',
  'Teslim edilecek kişi(ler)',
]

const articles: Article[] = [
  {
    no: 2,
    title: 'Sözleşmenin Konusu ve Kapsamı',
    paragraphs: [
      'İşbu Mesafeli Satış Sözleşmesi (“Sözleşme”) 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği’ne uygun olarak düzenlenmiştir. İşbu Sözleşme’nin tarafları işbu Sözleşme tahtında 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği’nden kaynaklanan yükümlülük ve sorumluluklarını bildiklerini ve anladıklarını kabul ve beyan ederler.',
      'İşbu Sözleşmenin konusunu; Alıcı’nın, Anadolu Anahtar Elek. Kilit İnş. Malz. Gıda Tem. Oto. Aks. San. ve Tic. Ltd. Şti.’ne ait www.aanahtar.com.tr alan adlı web sitesinden (“Websitesi”), Satıcı’ya ait Mal/Hizmetin satın alınmasına yönelik elektronik olarak sipariş verdiği, Sözleşmede belirtilen niteliklere sahip Mal/Hizmetin satışı ve teslimi ile ilgili olarak 6502 Sayılı Tüketicinin Korunması Hakkındaki Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanması oluşturur.',
      'İşbu Sözleşmenin akdedilmesi tarafların ayrı ayrı Anadolu Anahtar Elek. Kilit ile akdetmiş oldukları websitesi üyelik sözleşmelerinin hükümlerinin ifasını engellemeyecek olup taraflar işbu Sözleşme konusu Mal/Hizmetin satışında Anadolu Anahtar Elek. Kilit’in herhangi bir şekilde taraf olmadığını ve Sözleşme kapsamında tarafların yükümlülüklerini yerine getirmeleri ile ilgili herhangi bir sorumluluğu ve taahhüdü bulunmadığını kabul ve beyan ederler.',
    ],
  },
  {
    no: 4,
    title: 'Malın Teslimi ve Teslim Şekli',
    paragraphs: [
      'Sözleşme Alıcı tarafından elektronik ortamda onaylanmakla yürürlüğe girmiş olup Alıcı’nın Satıcı’dan satın almış olduğu Malın/Hizmetin Alıcı’ya teslim edilmesiyle ifa edilmiş olur. Mal/Hizmet, Alıcı’nın sipariş formunda ve işbu Sözleşmede belirtmiş olduğu adrese ve belirtilen yetkili kişi/kişilere teslim edilecektir.',
    ],
  },
  {
    no: 5,
    title: 'Teslimat Masrafları ve İfası',
    paragraphs: [
      'Malın teslimat masrafları aksine bir hüküm yoksa Alıcı’ya aittir. Satıcı, web sitesinde teslimat ücretinin kendisince karşılanacağını beyan etmişse teslimat masrafları Satıcı’ya ait olacaktır.',
      'Malın teslimatı; Satıcı’nın stokunun müsait olması halinde ve ödemenin gerçekleşmesinden sonra taahhüt edilen sürede yapılır. Satıcı, sipariş konusu Mal/Hizmet ediminin yerine getirilmesinin imkânsızlaştığı haller saklı kalmak kaydıyla, Mal/Hizmet’i, Alıcı tarafından Mal/Hizmet’in sipariş edilmesinden itibaren 30 (otuz) gün içinde teslim eder. Herhangi bir nedenle Alıcı tarafından Mal/Hizmet bedeli ödenmez veya yapılan ödeme banka kayıtlarında iptal edilir ise, Satıcı Mal/Hizmet’in teslimi yükümlülüğünden kurtulmuş kabul edilir.',
      'Malın Satıcı tarafından kargoya verilmesinden sonra ve fakat Alıcı tarafından teslim alınmasından önce Alıcı tarafından yapılan sipariş iptallerinde kargo bedelinden Alıcı sorumludur.',
    ],
  },
  {
    no: 6,
    title: 'Alıcının Beyan ve Taahhütleri',
    paragraphs: [
      'Alıcı, web sitesinde yer alan Sözleşme konusu Malın/Hizmetin temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimat ve kargo bedeline ilişkin olarak Satıcı tarafından yüklenen ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder. Alıcılar, Tüketici sıfatıyla talep ve şikâyetlerini yukarıda yer alan Satıcı iletişim bilgilerine ve/veya web sitesinin sağladığı kanallarla ulaştırabilirler.',
      'Alıcı, işbu Sözleşme’yi ve Ön Bilgilendirme Formunu elektronik ortamda teyit etmekle, mesafeli sözleşmelerin akdinden önce Satıcı tarafından Alıcıya verilmesi gereken adres, siparişi verilen Mal/Hizmet’e ait temel özellikler, Mal/Hizmet’in vergiler dahil fiyatı, ödeme ve teslimat ile teslimat fiyatı bilgilerini de doğru ve eksiksiz olarak edindiğini teyit etmiş olur.',
      'Alıcı’nın, Sözleşme konusu Mal/Hizmet’i teslim almadan önce muayene etmeksizin; tahrip olmuş, kırık, ambalajı yırtılmış vb. hasarlı ve ayıplı Mal/Hizmeti kargo şirketinden teslim alması halinde sorumluluk tamamen kendisine aittir. Alıcı tarafından kargo şirketi görevlisinden teslim alınan Mal/Hizmet’in hasarsız ve sağlam olduğu kabul edilecektir. Teslimden sonra Mal/Hizmet’in sorumluluğu ve hasarlar Alıcı’ya aittir.',
      'Mal/Hizmet’in tesliminden sonra Alıcı’ya ait kredi kartının Alıcı’nın kusurundan kaynaklanmayan bir şekilde yetkisiz kişilerce haksız veya hukuka aykırı olarak kullanılması nedeni ile ilgili banka veya finans kuruluşunun Mal/Hizmet bedelini Satıcı’ya ödememesi halinde, Alıcı kendisine teslim edilmiş olması kaydıyla Mal/Hizmet’i 3 (üç) gün içinde Satıcı’ya iade etmekle yükümlüdür. Bu halde teslimat giderleri Alıcı’ya aittir.',
    ],
  },
  {
    no: 7,
    title: 'Satıcının Beyan ve Taahhütleri',
    paragraphs: [
      'Satıcı, Sözleşme konusu Mal/Hizmet’in Tüketici Mevzuatına uygun olarak, sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ve kullanım kılavuzları ile Alıcı’ya teslim edilmesinden sorumludur.',
      'Satıcı, mücbir sebepler veya nakliyeyi engelleyen olağanüstü durumlar nedeni ile sözleşme konusu Mal/Hizmeti süresi içinde teslim edemez ise, durumu öğrendiği tarihten itibaren 3 (üç) gün içinde Alıcı’ya bildirmekle yükümlüdür. Sözleşme konusu Mal/Hizmet, Alıcı’dan başka bir kişiye teslim edilecek ise, teslim edilecek kişinin teslimatı kabul etmemesinden Satıcı sorumlu tutulamaz.',
    ],
  },
  {
    no: 8,
    title: 'Cayma Hakkı',
    paragraphs: [
      'Alıcı, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, satın aldığı Mal/Hizmeti teslim tarihinden itibaren 14 (on dört) gün içerisinde cayma hakkını kullanarak iade edebilir. Cayma hakkı bildirimi ve Sözleşmeye ilişkin sair bildirimler Satıcı’ya ait ve/veya web sitesinde belirtilen iletişim kanalları ile gönderilecektir.',
      'Cayma hakkının kullanılması için süresi içerisinde Satıcı’ya mevzuat hükümlerine ve websitesindeki cayma hakkı kullanım seçeneğine uygun olarak bildirimde bulunulması şarttır.',
      'Cayma hakkının kullanılması halinde: (a) Alıcı cayma hakkını kullanmasından itibaren 10 (on) gün içerisinde Malı Satıcı’ya geri gönderir. (b) Cayma hakkı kapsamında iade edilecek Malın kutusu, ambalajı, varsa standart aksesuarları ve varsa Mal ile birlikte hediye edilen diğer ürünlerin de eksiksiz ve hasarsız olarak iade edilmesi gerekmektedir.',
      'Cayma hakkının kullanılmasını takip eden 14 (on dört) gün içerisinde Mal bedeli Alıcı’ya ödediği şekilde iade edilir. Mal, Satıcı’ya iade edilirken, Malın teslimi sırasında Alıcı’ya ibraz edilmiş olan orijinal faturanın da Alıcı tarafından iade edilmesi gerekmektedir.',
      'Alıcı iade edeceği Malı ön bilgilendirme formunda belirtilen Satıcı’nın anlaşmalı kargo şirketi ile Satıcı’ya gönderdiği sürece iade kargo bedeli Satıcı’ya aittir. Alıcı’nın iade edeceği Malı ön bilgilendirme formunda belirtilen Satıcı’nın anlaşmalı kargo şirketi dışında bir kargo şirketi ile göndermesi halinde iade kargo bedeli ve Malın kargo sürecinde uğrayacağı hasardan Satıcı sorumlu değildir.',
    ],
  },
  {
    no: 9,
    title: 'Cayma Hakkının Kullanılamayacağı Haller',
    letteredIntro: 'Cayma hakkı aşağıdaki hallerde kullanılamaz:',
    lettered: [
      { label: 'a', text: 'Fiyatı finansal piyasalardaki dalgalanmalara bağlı olarak değişen ve satıcının kontrolünde olmayan mal veya hizmetlere ilişkin sözleşmelerde (ziynet, altın ve gümüş kategorisindeki ürünler).' },
      { label: 'b', text: 'Tüketicinin istekleri veya açıkça onun kişisel ihtiyaçları doğrultusunda hazırlanan, niteliği itibariyle geri gönderilmeye elverişli olmayan ve çabuk bozulma tehlikesi olan veya son kullanma tarihi geçme ihtimali olan malların teslimine ilişkin sözleşmelerde.' },
      { label: 'c', text: 'Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan mallardan; iadesi sağlık ve hijyen açısından uygun olmayanların teslimine ilişkin sözleşmelerde.' },
      { label: 'd', text: 'Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan mallara ilişkin sözleşmelerde.' },
      { label: 'e', text: 'Tüketici tarafından ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olması şartıyla maddi ortamda sunulan kitap, ses veya görüntü kayıtlarına, yazılım programlarına ve bilgisayar sarf malzemelerine ilişkin sözleşmelerde.' },
      { label: 'f', text: 'Abonelik sözleşmesi kapsamında sağlananlar dışında gazete, dergi gibi süreli yayınların teslimine ilişkin sözleşmelerde.' },
      { label: 'g', text: 'Belirli bir tarihte veya dönemde yapılması gereken, konaklama, eşya taşıma, araba kiralama, yiyecek-içecek tedariki ve eğlence veya dinlenme amacıyla yapılan boş zamanın değerlendirilmesine ilişkin sözleşmelerde.' },
      { label: 'h', text: 'Bahis ve piyangoya ilişkin hizmetlerin ifasına ilişkin sözleşmelerde.' },
      { label: 'ı', text: 'Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile ifasına başlanan hizmetlere ilişkin sözleşmelerde.' },
      { label: 'i', text: 'Elektronik ortamda anında ifa edilen hizmetler ile tüketiciye anında teslim edilen gayri maddi mallara ilişkin sözleşmelerde ve sözleşmeye konu Mal/Hizmet’in Mesafeli Sözleşmeler Yönetmeliği’nin uygulama alanı dışında bırakılmış olan Mal/Hizmet türlerinden müteşekkil olması halinde.' },
    ],
  },
  {
    no: 10,
    title: 'Uyuşmazlıkların Çözümü',
    paragraphs: [
      'İşbu Mesafeli Satış Sözleşmesi’nin uygulanmasında, Ticaret Bakanlığınca ilan edilen değere kadar Alıcının Mal veya Hizmeti satın aldığı ve ikametgâhının bulunduğu yerdeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir. 6502 Sayılı Tüketicinin Korunması Hakkında Kanun’un 68’inci maddesinin 1. fıkrasında belirtilen alt ve üst limitler doğrultusunda tüketici talepleri hakkında ilçe/il tüketici hakem heyetleri yetkilidir.',
    ],
  },
  {
    no: 11,
    title: 'Malın/Hizmetin Fiyatı',
    paragraphs: [
      'Malın peşin veya vadeli satış fiyatı, sipariş formunda yer almakla birlikte, sipariş sonu gönderilen bilgilendirme maili ve ürün ile birlikte müşteriye gönderilen fatura içeriğinde mevcut olan fiyattır. Satıcı tarafından yapılan indirimler, kuponlar, kargo ücreti ve sair uygulamalar satış fiyatına yansıtılır.',
    ],
  },
  {
    no: 12,
    title: 'Temerrüt Hali ve Hukuki Sonuçları',
    paragraphs: [
      'Alıcı’nın, kredi kartı ile yapmış olduğu işlemlerde temerrüde düşmesi halinde kart sahibi bankanın kendisi ile yapmış olduğu kredi kartı sözleşmesi çerçevesinde faiz ödeyecek ve bankaya karşı sorumlu olacaktır. Bu durumda ilgili banka hukuki yollara başvurabilir; doğacak masrafları ve vekâlet ücretini Alıcı’dan talep edebilir ve her koşulda Alıcı’nın borcundan dolayı temerrüde düşmesi halinde, Alıcı’nın borcu gecikmeli ifasından dolayı Satıcı’nın uğradığı zarar ve ziyandan Alıcı sorumlu olacaktır.',
    ],
  },
  {
    no: 13,
    title: 'Bildirimler ve Delil Sözleşmesi',
    paragraphs: [
      'İşbu Sözleşme tahtında Taraflar arasında yapılacak her türlü yazışma, mevzuatta sayılan zorunlu haller dışında, e-posta aracılığıyla yapılacaktır.',
      'Alıcı, işbu Sözleşme’den doğabilecek ihtilaflarda Satıcı’nın resmi defter ve ticari kayıtlarıyla, kendi veritabanında ve sunucularında tuttuğu elektronik bilgilerin ve bilgisayar kayıtlarının bağlayıcı, kesin ve münhasır delil teşkil edeceğini, bu maddenin Hukuk Muhakemeleri Kanunu’nun 193. maddesi anlamında delil sözleşmesi niteliğinde olduğunu kabul, beyan ve taahhüt eder.',
    ],
  },
  {
    no: 14,
    title: 'Yürürlük',
    paragraphs: [
      '14 (on dört) maddeden ibaret bu Sözleşme, Taraflarca okunarak, Alıcı tarafından elektronik ortamda onaylanmak suretiyle akdedilmiş ve yürürlüğe girmiştir.',
    ],
  },
]

useSeoMeta({
  title: 'Mesafeli Satış Sözleşmesi | Anadolu Anahtar',
  description:
    'Anadolu Anahtar mesafeli satış sözleşmesi: tarafların hak ve yükümlülükleri, teslimat, cayma hakkı ve uyuşmazlıkların çözümü.',
})
</script>

<template>
  <div class="wrap py-6">
    <nav class="mb-6 flex flex-wrap items-center gap-2 text-[13px] text-muted">
      <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
      <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
      <span class="text-ink">Mesafeli Satış Sözleşmesi</span>
    </nav>

    <article class="pb-10">
      <h1 class="text-2xl font-semibold text-ink sm:text-[28px]">Mesafeli Satış Sözleşmesi</h1>

      <!-- Madde 1. Two panels side by side: the parties are a pair, and reading
           them in parallel is the point. -->
      <section class="mt-8">
        <h2 class="text-lg font-semibold text-ink">
          <span class="text-muted">Madde 1 —</span> Taraflar
        </h2>

        <div class="mt-4 grid gap-5 lg:grid-cols-2">
          <div v-for="party in [{ name: 'Satıcı', rows: seller }, { name: 'Alıcı', rows: buyer }]" :key="party.name" class="rounded-lg border border-line p-5">
            <h3 class="text-[13px] font-semibold uppercase tracking-wide text-brand">{{ party.name }}</h3>

            <dl class="mt-4 space-y-3 text-[15px]">
              <div v-for="row in party.rows" :key="row.label" class="sm:flex sm:gap-4">
                <dt class="w-44 shrink-0 text-muted">{{ row.label }}</dt>
                <!-- Blank fields are filled per order; the dash keeps the row
                     from collapsing into the one below it. -->
                <dd class="break-words text-ink">{{ row.value || '—' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <!-- Madde 3. Column headers only — the values belong to an individual
           order, not to this page. -->
      <section class="mt-10">
        <h2 class="text-lg font-semibold text-ink">
          <span class="text-muted">Madde 3 —</span> Sözleşme Konusu Mal ve Hizmetin Temel Nitelikleri ve Fiyatı (KDV Dahil)
        </h2>

        <div class="mt-4 overflow-x-auto rounded-lg border border-line">
          <table class="w-full min-w-[52rem] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th
                  v-for="col in orderColumns" :key="col"
                  class="whitespace-nowrap border-b border-line bg-neutral-50 px-4 py-3 font-medium text-ink"
                >
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="col in orderColumns" :key="col" class="px-4 py-4 text-muted">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        <dl class="mt-5 grid gap-x-8 gap-y-3 text-[15px] sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="row in orderTotals" :key="row" class="flex gap-3 border-b border-line pb-2">
            <dt class="text-muted">{{ row }}</dt>
            <dd class="ml-auto text-ink">—</dd>
          </div>
        </dl>

        <p class="mt-5 text-[15px] leading-relaxed text-muted">
          İlan edilen fiyatlar ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir.
          Süreli olarak ilan edilen fiyatlar ise belirtilen süre sonuna kadar geçerlidir.
        </p>

        <p class="mt-4 rounded-lg border border-line bg-brand-50 p-4 text-[15px] font-medium leading-relaxed text-ink">
          Söz konusu ürün bedeli, ödeme koruma sistemi kapsamında Satıcı adına Anadolu Anahtar
          tarafından Alıcı’dan tahsil edilmektedir. Alıcı, malın bedelini Anadolu Anahtar’a ödemekle,
          ürün bedelini Satıcı’ya ödemiş sayılacaktır.
        </p>
      </section>

      <section v-for="a in articles" :key="a.no" class="mt-10">
        <h2 class="text-lg font-semibold text-ink">
          <span class="text-muted">Madde {{ a.no }} —</span> {{ a.title }}
        </h2>

        <div class="mt-3 space-y-4 text-[15px] leading-relaxed text-muted">
          <p v-for="(p, i) in a.paragraphs ?? []" :key="i">{{ p }}</p>

          <p v-if="a.letteredIntro">{{ a.letteredIntro }}</p>

          <!-- Turkish ordering runs a, b, c … h, ı, i — list-style can't produce
               that, so the labels are explicit. -->
          <ul v-if="a.lettered" class="space-y-3">
            <li v-for="item in a.lettered" :key="item.label" class="flex gap-3">
              <span class="w-5 shrink-0 font-medium text-brand">{{ item.label }})</span>
              <span>{{ item.text }}</span>
            </li>
          </ul>
        </div>
      </section>
    </article>
  </div>
</template>