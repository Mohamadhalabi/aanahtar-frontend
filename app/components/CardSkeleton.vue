<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 1 })
</script>

<template>
  <!-- Reserves roughly a card's worth of height so the page doesn't jump when
       the real products arrive. -->
  <div
    v-for="i in count" :key="i"
    class="animate-pulse rounded-lg border border-line p-4"
  >
    <div class="h-3 w-20 rounded bg-line" />
    <div class="mt-3 h-3 w-full rounded bg-line" />
    <div class="mt-2 h-3 w-2/3 rounded bg-line" />
    <div class="mt-4 aspect-square rounded bg-line/60" />
    <div class="mt-4 h-8 w-full rounded bg-line" />
  </div>
</template>