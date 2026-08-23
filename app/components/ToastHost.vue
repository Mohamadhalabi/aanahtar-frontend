<script setup lang="ts">
const { toasts, dismiss } = useToast()

const icons: Record<string, string> = {
  success: 'm5 13 4 4L19 7',
  error: 'M12 8v5M12 16h.01M10.3 3.9 2.4 17.5A1.8 1.8 0 0 0 4 20.2h16a1.8 1.8 0 0 0 1.6-2.7L13.7 3.9a1.8 1.8 0 0 0-3.1 0z',
  info: 'M12 16v-5M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
}
</script>

<template>
  <!-- Teleported: the layout's flex column would otherwise take part in
       positioning this, and any ancestor with a transform would trap the
       fixed element inside it. -->
  <Teleport to="body">
    <!-- Mobile: centred near the top, clear of the thumb. Desktop: top-right,
         pushed down past the sticky header so it doesn't sit on the logo.
         pointer-events-none on the stack, auto on each card — the gap beside a
         toast shouldn't swallow clicks on the page underneath. -->
    <div
      class="pointer-events-none fixed left-1/2 top-4 z-[100] flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 flex-col items-stretch gap-3
             sm:left-auto sm:right-6 sm:top-24 sm:w-[30rem] sm:max-w-none sm:translate-x-0"
    >
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
        enter-from-class="-translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-3"
        leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
        leave-to-class="opacity-0"
        move-class="transition duration-200"
      >
        <div
          v-for="t in toasts" :key="t.id"
          class="pointer-events-auto flex items-center gap-4 rounded-2xl border p-4 shadow-[0_14px_40px_rgba(0,0,0,.15)] sm:p-5"
          :class="{
            'border-brand/25 bg-brand-50': t.type === 'success',
            'border-price/30 bg-white': t.type === 'error',
            'border-line bg-white': t.type === 'info',
          }"
          :role="t.type === 'error' ? 'alert' : 'status'"
          :aria-live="t.type === 'error' ? 'assertive' : 'polite'"
        >
          <!-- Thumbnail when the toast is about a specific product, with the
               tick tucked into its corner: the photo identifies which item,
               the badge still says it worked. White plate behind it because
               product shots are cut out on white and would otherwise dissolve
               into the blue card. -->
          <div v-if="t.image" class="relative shrink-0">
            <NuxtImg
              :src="t.image" alt=""
              width="160" height="160" loading="lazy"
              class="h-16 w-16 rounded-xl border border-line bg-white object-contain p-1.5"
            />
            <span
              class="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full text-white ring-2"
              :class="t.type === 'error' ? 'bg-price ring-white' : 'bg-brand ring-brand-50'"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path :d="icons[t.type]" />
              </svg>
            </span>
          </div>

          <!-- No product: the icon carries the whole message, so it takes the
               space the thumbnail would have had. -->
          <span
            v-else
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            :class="{
              'bg-brand text-white': t.type === 'success',
              'bg-price/10 text-price': t.type === 'error',
              'bg-neutral-100 text-muted': t.type === 'info',
            }"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path :d="icons[t.type]" />
            </svg>
          </span>

          <p class="min-w-0 flex-1 text-[15px] leading-relaxed text-ink">{{ t.message }}</p>

          <!-- Always present, both breakpoints: auto-dismiss is a convenience,
               not the only way out. -->
          <button
            type="button" aria-label="Kapat"
            class="-m-1.5 shrink-0 cursor-pointer self-start rounded-full p-1.5 text-muted transition hover:bg-black/5 hover:text-ink"
            @click="dismiss(t.id)"
          >
            <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>