<script setup lang="ts">
const { data: categories } = await useCategories()

const menuOpen = ref(false)
const hovered = ref<number | null>(null)
const openGroup = ref<number | null>(null)

// Shared with AppHeader, whose hamburger opens this drawer.
const drawer = useState('nav-drawer', () => false)

const route = useRoute()
watch(() => route.fullPath, () => { drawer.value = false })
</script>

<template>
  <div>
    <!-- Desktop nav -->
    <div class="hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,.06)] lg:block">
      <div class="wrap py-3 pb-0">
        <div class="flex items-stretch gap-8">
          <div
            class="relative"
            @mouseenter="menuOpen = true"
            @mouseleave="menuOpen = false; hovered = null"
          >
            <div
              class="flex h-[52px] w-[300px] cursor-pointer items-center gap-3 bg-brand px-6 text-[15px] font-semibold tracking-wide text-white"
              :class="menuOpen ? 'rounded-t-md' : 'rounded-md'"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              KATEGORİLER
            </div>

            <div v-show="menuOpen" class="absolute left-0 top-full z-50">
              <ul class="w-[300px] rounded-b-md border border-line bg-white shadow-[0_6px_24px_rgba(0,0,0,.12)]">
                <li
                  v-for="c in categories" :key="c.id"
                  class="relative border-b border-line last:border-0"
                  @mouseenter="hovered = c.id"
                >
                  <!-- Parents open a submenu; only leaf categories navigate. -->
                  <div
                    v-if="c.children?.length"
                    class="flex cursor-default items-center justify-between px-5 py-2.5 text-[14px]"
                    :class="hovered === c.id ? 'bg-neutral-50 text-brand' : 'text-ink'"
                  >
                    {{ c.name }}
                    <svg class="h-3.5 w-3.5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </div>

                  <NuxtLink
                    v-else
                    :to="`/product-category/${c.slug}/`"
                    class="block px-5 py-2.5 text-[14px] hover:bg-neutral-50 hover:text-brand"
                    :class="hovered === c.id ? 'bg-neutral-50 text-brand' : 'text-ink'"
                  >
                    {{ c.name }}
                  </NuxtLink>

                  <!-- Anchored to this row, so it opens level with whatever is hovered. -->
                  <ul
                    v-if="hovered === c.id && c.children?.length"
                    class="absolute left-full top-0 min-w-[280px] border border-line bg-white py-1 shadow-[0_6px_24px_rgba(0,0,0,.12)]"
                  >
                    <li v-for="s in c.children" :key="s.id">
                      <NuxtLink :to="`/product-category/${s.slug}/`" class="block px-5 py-2.5 text-[14px] text-ink hover:text-brand">
                        {{ s.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <nav class="flex items-center gap-8 text-[15px]">
            <NuxtLink to="/" class="text-ink hover:text-brand">Anasayfa</NuxtLink>
            <NuxtLink to="/magaza" class="text-ink hover:text-brand">Mağaza</NuxtLink>
            <NuxtLink to="/iletisim" class="text-ink hover:text-brand">İletişim</NuxtLink>
            <NuxtLink to="/hakkimizda" class="text-ink hover:text-brand">Hakkımızda</NuxtLink>
            <span class="font-semibold text-price">5000 TL VE ÜZERİ ÜCRETSİZ KARGO</span>
          </nav>
        </div>
      </div>
    </div>

    <!-- Mobile drawer: contents only exist in the DOM once opened. -->
    <Teleport to="body">
      <div v-if="drawer" class="fixed inset-0 z-[100] lg:hidden">
        <div class="absolute inset-0 bg-black/50" @click="drawer = false" />
        <nav class="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-white">
          <div class="flex items-center justify-between bg-brand px-5 py-4 text-white">
            <span class="text-sm font-semibold tracking-wide">KATEGORİLER</span>
            <button type="button" class="cursor-pointer" aria-label="Kapat" @click="drawer = false">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <ul>
            <li v-for="c in categories" :key="c.id" class="border-b border-line">
              <button
                v-if="c.children?.length"
                type="button"
                class="flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left text-[15px] text-ink"
                @click="openGroup = openGroup === c.id ? null : c.id"
              >
                {{ c.name }}
                <svg class="h-4 w-4 text-muted transition" :class="openGroup === c.id && 'rotate-90'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>

              <NuxtLink
                v-else
                :to="`/product-category/${c.slug}/`"
                class="block px-5 py-3 text-[15px] text-ink"
              >
                {{ c.name }}
              </NuxtLink>

              <ul v-if="openGroup === c.id" class="bg-neutral-50">
                <li v-for="s in c.children" :key="s.id">
                  <NuxtLink :to="`/product-category/${s.slug}/`" class="block px-9 py-2.5 text-sm text-ink">
                    {{ s.name }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>

          <ul class="mt-2 border-t border-line">
            <li><NuxtLink to="/" class="block px-5 py-3 text-[15px] text-ink">Anasayfa</NuxtLink></li>
            <li><NuxtLink to="/magaza" class="block px-5 py-3 text-[15px] text-ink">Mağaza</NuxtLink></li>
            <li><NuxtLink to="/iletisim" class="block px-5 py-3 text-[15px] text-ink">İletişim</NuxtLink></li>
            <li><NuxtLink to="/hakkimizda" class="block px-5 py-3 text-[15px] text-ink">Hakkımızda</NuxtLink></li>
          </ul>
        </nav>
      </div>
    </Teleport>
  </div>
</template>