/**
 * Paging, mouse-drag and autoplay for a native scroll-snap track.
 *
 * The track keeps doing the scrolling — this only adds what the browser
 * doesn't give you: a page count, a current page, click-drag for mouse users,
 * and an optional timer. Touch and trackpad are untouched.
 *
 * Usage: bind `track` as a ref on the scroll container, wire the handlers,
 * and drop `snap-x snap-mandatory` while `dragging` is true.
 */
export function useCarousel(interval = 5000) {
  const track = ref<HTMLElement | null>(null)
  const page = ref(0)
  const pages = ref(1)
  const held = ref(false)          // pointer or keyboard is on the carousel
  const dragging = ref(false)

  let resumeAt = 0                 // autoplay stays quiet until this timestamp
  let timer: ReturnType<typeof setInterval> | undefined
  let raf = 0
  let ro: ResizeObserver | undefined
  let smooth: ScrollBehavior = 'smooth'

  // Drag state
  let startX = 0
  let startLeft = 0
  let dragged = 0                  // px travelled in the current gesture

  function clamp(i: number) {
    return Math.min(Math.max(i, 0), pages.value - 1)
  }

  /**
   * How far one page of cards actually is.
   *
   * NOT clientWidth. With n cards per view each card is
   * (content - (n-1) x gap) / n wide, so the next page's first card sits at
   * n x (card + gap) = content + gap. Paging by clientWidth leaves every page
   * short by one gap, which compounds: the cards drift out of alignment and
   * the count gains a phantom trailing page. Most visible at 2-up on mobile.
   *
   * Reading padding and gap off the computed style keeps this correct for
   * both the flex track and the two-row grid one, at every breakpoint.
   */
  function metrics() {
    const el = track.value
    if (!el) return { stride: 1, max: 0 }

    const cs = getComputedStyle(el)
    const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0)
    const gap = parseFloat(cs.columnGap) || 0

    return {
      stride: Math.max(1, el.clientWidth - padX + gap),
      max: el.scrollWidth - el.clientWidth,
    }
  }

  function measure() {
    if (!track.value) return
    const { stride, max } = metrics()
    // The 0.02 absorbs sub-pixel rounding only — the geometry is exact now.
    pages.value = max <= 4 ? 1 : Math.ceil(max / stride - 0.02) + 1
    sync()
  }

  function sync() {
    const el = track.value
    if (!el) return
    const { stride, max } = metrics()
    const i = el.scrollLeft >= max - 4
      ? pages.value - 1
      : Math.round(el.scrollLeft / stride)
    page.value = clamp(i)
  }

  function goTo(i: number) {
    const el = track.value
    if (!el) return
    const { stride, max } = metrics()
    el.scrollTo({ left: Math.min(i * stride, max), behavior: smooth })
  }

  function step(dir: number) {
    hold()
    goTo((page.value + dir + pages.value) % pages.value)
  }

  /** Any manual interaction buys the user 6s of silence from autoplay. */
  function hold() {
    resumeAt = Date.now() + 6000
  }

  function onScroll() {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      sync()
    })
  }

  /* --- Mouse drag -------------------------------------------------------
     Touch and trackpads already scroll natively, so this only takes over for
     a mouse. Listeners go on window rather than setPointerCapture: capturing
     retargets the click and the buttons inside the cards stop working. */

  function onPointerDown(e: PointerEvent) {
    const el = track.value
    if (!el || e.pointerType !== 'mouse' || e.button !== 0 || pages.value < 2) return

    dragging.value = true
    dragged = 0
    startX = e.clientX
    startLeft = el.scrollLeft
    hold()

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
  }

  function onPointerMove(e: PointerEvent) {
    const el = track.value
    if (!el) return
    dragged = e.clientX - startX
    el.scrollLeft = startLeft - dragged
  }

  async function onPointerUp(e: PointerEvent) {
    const el = track.value
    window.removeEventListener('pointermove', onPointerMove)
    dragging.value = false
    hold()
    if (!el) return

    const dx = e.clientX - startX
    if (Math.abs(dx) < 4) return    // a plain click, leave the scroll alone

    // Wait for snap-mandatory to come back before animating to the target page.
    await nextTick()

    const { stride } = metrics()
    const from = Math.round(startLeft / stride)
    let target = Math.round(el.scrollLeft / stride)
    // A short flick still counts as a page turn.
    if (target === from && Math.abs(dx) > 60) target = from + (dx < 0 ? 1 : -1)
    goTo(clamp(target))
  }

  /** Swallow the click that ends a drag so cards don't navigate. */
  function onClickCapture(e: MouseEvent) {
    if (Math.abs(dragged) > 4) {
      e.preventDefault()
      e.stopPropagation()
      dragged = 0
    }
  }

  onMounted(() => {
    const el = track.value
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) smooth = 'auto'

    measure()
    ro = new ResizeObserver(measure)
    ro.observe(el)

    if (interval > 0) {
      timer = setInterval(() => {
        if (held.value || dragging.value || document.hidden || pages.value < 2) return
        if (Date.now() < resumeAt) return
        goTo((page.value + 1) % pages.value)
      }, interval)
    }
  })

  onUnmounted(() => {
    clearInterval(timer)
    cancelAnimationFrame(raf)
    ro?.disconnect()
    window.removeEventListener('pointermove', onPointerMove)
  })

  return {
    track, page, pages, held, dragging,
    measure, goTo, step, hold,
    onScroll, onPointerDown, onClickCapture,
  }
}