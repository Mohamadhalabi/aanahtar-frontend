<script setup lang="ts">
const props = defineProps<{
  images: string[]
  index: number
  title?: string
}>()

const emit = defineEmits<{
  close: []
  'update:index': [value: number]
}>()

function go(dir: number) {
  const n = props.images.length
  if (!n) return
  emit('update:index', (props.index + dir + n) % n)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}

// The component is v-if'd by the parent, so mount/unmount is open/close —
// no need to watch a prop for the listener or the scroll lock.
onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex flex-col bg-black/95" role="dialog" aria-modal="true">
      <div class="flex items-center justify-between px-5 py-4 text-sm text-white/80">
        <span>{{ index + 1 }} / {{ images.length }}</span>
        <button
          type="button" aria-label="Kapat"
          class="cursor-pointer rounded-full p-1.5 transition hover:bg-white/10 hover:text-white"
          @click="emit('close')"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <!-- Clicking the backdrop closes; clicking the image itself must not,
           hence the stop on the inner wrapper. -->
      <div class="relative flex flex-1 items-center justify-center px-4 pb-4" @click="emit('close')">
        <button
          v-if="images.length > 1"
          type="button" aria-label="Önceki"
          class="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white sm:left-6"
          @click.stop="go(-1)"
        >
          <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>

        <div class="max-h-full max-w-3xl" @click.stop>
          <Transition name="lb" mode="out-in">
            <img
              :key="images[index]"
              :src="images[index]" :alt="title"
              class="max-h-[78vh] w-auto bg-white object-contain"
            >
          </Transition>
        </div>

        <button
          v-if="images.length > 1"
          type="button" aria-label="Sonraki"
          class="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white sm:right-6"
          @click.stop="go(1)"
        >
          <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <p v-if="title" class="px-5 pb-6 text-center text-sm text-white/80">{{ title }}</p>
    </div>
  </Teleport>
</template>

<style scoped>
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.18s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}
</style>
