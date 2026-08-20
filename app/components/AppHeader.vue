<script setup lang="ts">
const { data: categories } = await useCategories()
const { count } = useCart()

const term = ref('')
const scope = ref('')

// Shared with AppNav so the hamburger here can open the drawer there.
const drawer = useState('nav-drawer', () => false)
// Shared with CartDrawer.
const cartDrawer = useState('cart-drawer', () => false)

const desktopFocus = ref(false)
const mobileFocus = ref(false)
const desktopSuggest = ref<any>(null)
const mobileSuggest = ref<any>(null)

function search() {
  if (!term.value.trim()) return
  closeSuggest()
  navigateTo({
    path: '/magaza',
    query: { q: term.value, ...(scope.value ? { category: scope.value } : {}) },
  })
}

function closeSuggest() {
  desktopFocus.value = false
  mobileFocus.value = false
}

/** Blur fires before the dropdown's mousedown lands, hence the delay. */
function blurLater(which: 'desktop' | 'mobile') {
  setTimeout(() => {
    if (which === 'desktop') desktopFocus.value = false
    else mobileFocus.value = false
  }, 150)
}

function onKey(e: KeyboardEvent, which: 'desktop' | 'mobile') {
  const panel = which === 'desktop' ? desktopSuggest.value : mobileSuggest.value
  if (!panel) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    panel.move(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    panel.move(-1)
  } else if (e.key === 'Escape') {
    closeSuggest()
  }
}

function onEnter(which: 'desktop' | 'mobile') {
  const panel = which === 'desktop' ? desktopSuggest.value : mobileSuggest.value
  // Falls back to a normal search when nothing in the list is highlighted.
  if (panel) panel.enter()
  else search()
}
</script>

<template>
  <!-- Direct flex child of the layout, so sticky resolves against the viewport. -->
  <div class="sticky top-0 z-40 border-b border-line bg-white">
    <!-- Gaps tighten below sm: at 320px the logo is 154px of a 288px row, so
         there isn't 16px to spare between every item. -->
    <div class="wrap flex items-center gap-3 py-3 sm:gap-4 sm:py-4 lg:gap-10 lg:py-5">
      <button type="button" class="shrink-0 cursor-pointer text-ink lg:hidden" aria-label="Menü" @click="drawer = true">
        <svg class="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <NuxtLink to="/" class="min-w-0 shrink">
        <!-- 266x62, so h-11 renders 189px wide — too much of a narrow row.
             h-9 brings it to 154px and it scales back up from sm. -->
        <NuxtImg
          src="/images/logo/aanahtar-logo.webp"
          alt="Anadolu Anahtar"
          width="266" height="62"
          class="h-9 w-auto max-w-full sm:h-11 lg:h-[56px]"
          preload
        />
      </NuxtLink>

      <div class="relative hidden flex-1 lg:block">
        <div class="flex h-[46px] items-center overflow-hidden rounded-full border-2 border-brand bg-white pl-6">
          <input
            v-model="term"
            type="search"
            placeholder="Ürün Ara"
            autocomplete="off"
            class="h-full flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
            @focus="desktopFocus = true"
            @blur="blurLater('desktop')"
            @keydown="onKey($event, 'desktop')"
            @keyup.enter="onEnter('desktop')"
          >
          <select v-model="scope" class="h-full max-w-56 cursor-pointer bg-transparent pr-3 text-sm text-ink outline-none">
            <option value="">Tüm Kategoriler</option>
            <option v-for="c in categories" :key="c.id" :value="c.slug">{{ c.name }}</option>
          </select>
          <button
            type="button"
            aria-label="Ara"
            class="flex h-full w-16 shrink-0 cursor-pointer items-center justify-center bg-brand text-white transition hover:bg-brand-600"
            @click="search"
          >
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" />
            </svg>
          </button>
        </div>

        <SearchSuggest ref="desktopSuggest" :term="term" :category="scope" :focused="desktopFocus" @close="closeSuggest" />
      </div>

      <div class="ml-auto flex shrink-0 items-center gap-4 sm:gap-5 lg:gap-7">
        <NuxtLink to="/my-account" aria-label="Hesabım" class="text-ink hover:text-brand">
          <svg class="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
            <circle cx="12" cy="8" r="3.6" /><path d="M4.5 20.5c0-3.9 3.4-6 7.5-6s7.5 2.1 7.5 6" />
          </svg>
        </NuxtLink>

        <!-- Opens the drawer rather than navigating: /sepet still exists and is
             reachable from inside it. -->
        <button
          type="button"
          class="relative cursor-pointer text-ink hover:text-brand"
          aria-label="Sepet"
          @click="cartDrawer = true"
        >
          <svg class="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
            <path d="M3 5h3l2.2 10.5h10L20.5 8H7" /><circle cx="9.5" cy="19.5" r="1.6" /><circle cx="17.5" cy="19.5" r="1.6" />
          </svg>
          <!-- Client-only: the cart is per-visitor and must never be baked
               into HTML that gets cached and shared. -->
          <ClientOnly>
            <span v-if="count" class="absolute -bottom-1 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-semibold text-white">
              {{ count }}
            </span>
          </ClientOnly>
        </button>
      </div>
    </div>

    <!-- Mobile search -->
    <div class="wrap relative pb-3 sm:pb-4 lg:hidden">
      <div class="flex h-11 items-center overflow-hidden rounded-full border-2 border-brand bg-white pl-5">
        <input
          v-model="term"
          type="search"
          placeholder="Ürün Ara"
          autocomplete="off"
          class="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          @focus="mobileFocus = true"
          @blur="blurLater('mobile')"
          @keydown="onKey($event, 'mobile')"
          @keyup.enter="onEnter('mobile')"
        >
        <button
          type="button"
          aria-label="Ara"
          class="flex h-full w-14 shrink-0 cursor-pointer items-center justify-center bg-brand text-white"
          @click="search"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" />
          </svg>
        </button>
      </div>

      <div class="absolute inset-x-4 top-full">
        <SearchSuggest ref="mobileSuggest" :term="term" :focused="mobileFocus" @close="closeSuggest" />
      </div>
    </div>

    <CartDrawer />
  </div>
</template>
