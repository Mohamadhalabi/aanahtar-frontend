<script setup lang="ts">
defineProps<{
  current: string
  /** Optional middle crumb, e.g. Siparişler on an order detail page. */
  parent?: { label: string; to: string }
}>()
</script>

<template>
  <nav class="mb-10 flex flex-wrap items-center gap-2 text-[13px] text-muted">
    <NuxtLink to="/" class="hover:text-brand">Ana Sayfa</NuxtLink>
    <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="m9 6 6 6-6 6" />
    </svg>

    <NuxtLink to="/my-account" class="hover:text-brand">Hesabım</NuxtLink>
    <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="m9 6 6 6-6 6" />
    </svg>

    <template v-if="parent">
      <NuxtLink :to="parent.to" class="hover:text-brand">{{ parent.label }}</NuxtLink>
      <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6" />
      </svg>
    </template>

    <span class="text-ink">{{ current }}</span>
  </nav>
</template>