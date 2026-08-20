<script setup lang="ts">
const { logout } = useAuth()

const links = [
  { to: '/my-account',                  label: 'Pano',           d: 'M4 13h7V4H4zM13 9h7V4h-7zM13 20h7v-9h-7zM4 20h7v-5H4z' },
  { to: '/my-account/siparisler',       label: 'Siparişler',     d: 'M6 7h12l-1 13H7zM9 7V5a3 3 0 0 1 6 0v2' },
  { to: '/my-account/indirimler',       label: 'İndirimler',     d: 'M5 4h9l5 5v11H5zM14 4v5h5M9 13h6M9 16h6' },
  { to: '/my-account/adresler',         label: 'Adresler',       d: 'M4 11 12 4l8 7v9H4zM10 20v-6h4v6' },
  { to: '/my-account/hesap-detaylari',  label: 'Hesap detayları', d: 'M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5' },
]

const route = useRoute()

// Exact match for the index, prefix match for the rest — otherwise /my-account
// stays highlighted on every child page.
function isActive(to: string) {
  return to === '/my-account' ? route.path === to : route.path.startsWith(to)
}
</script>

<template>
  <nav class="lg:w-72">
    <ul class="divide-y divide-line border-b border-line">
      <li v-for="l in links" :key="l.to">
        <NuxtLink
          :to="l.to"
          class="flex items-center justify-between gap-3 py-4 text-[15px] transition"
          :class="isActive(l.to) ? 'font-medium text-brand' : 'text-ink hover:text-brand'"
        >
          {{ l.label }}
          <svg
            class="h-5 w-5 shrink-0 text-muted" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          >
            <path :d="l.d" />
          </svg>
        </NuxtLink>
      </li>

      <li>
        <!-- A button, not a link: logging out is an action, and it must not be
             prefetched or opened in a new tab. -->
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between gap-3 py-4 text-left text-[15px] text-ink transition hover:text-brand"
          @click="logout()"
        >
          Oturumu kapat
          <svg
            class="h-5 w-5 shrink-0 text-muted" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="M15 4h4v16h-4M11 8l4 4-4 4M15 12H4" />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>