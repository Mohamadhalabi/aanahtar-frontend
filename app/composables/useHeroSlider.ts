/** Auto-advancing slideshow index with manual override. */
export function useHeroSlider(count: () => number, intervalMs = 6000) {
  const index = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  function move(dir: number) {
    const n = count()
    if (!n) return
    index.value = (index.value + dir + n) % n
  }

  function start() {
    stop()
    timer = setInterval(() => {
      if (!document.hidden) move(1)
    }, intervalMs)
  }

  function stop() {
    if (timer) clearInterval(timer)
    timer = null
  }

  // Manual navigation resets the clock, so a click is never immediately
  // overridden by an auto-advance a fraction of a second later.
  function nav(dir: number) {
    move(dir)
    start()
  }

  function goTo(i: number) {
    index.value = i
    start()
  }

  onMounted(start)
  onUnmounted(stop)

  return { index, nav, goTo }
}