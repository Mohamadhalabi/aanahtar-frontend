<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const shown = ref(false)

onMounted(() => {
  // rootMargin renders it just before it enters view, so there's no visible pop-in.
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      shown.value = true
      io.disconnect()
    }
  }, { rootMargin: '400px' })

  if (el.value) io.observe(el.value)
  onUnmounted(() => io.disconnect())
})
</script>

<template>
  <div ref="el" class="min-h-[200px]">
    <slot v-if="shown" />
  </div>
</template>