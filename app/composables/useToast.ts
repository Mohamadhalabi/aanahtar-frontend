export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
  /** Optional thumbnail, e.g. the product a cart toast refers to. */
  image?: string | null
}

export interface ToastOptions {
  image?: string | null
}

/** How long each type stays up. Errors linger — they're the ones worth reading. */
const DURATION: Record<ToastType, number> = {
  success: 3000,
  info: 3500,
  error: 6000,
}

/** More than this on screen and the newest ones are off the bottom edge. */
const MAX_VISIBLE = 3

// Client-only, and outside the composable so repeated useToast() calls share
// them. Keyed by toast id.
const timers = new Map<number, ReturnType<typeof setTimeout>>()

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])
  const seq = useState('toast-seq', () => 0)

  function dismiss(id: number) {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function push(type: ToastType, message: string, opts: ToastOptions = {}) {
    // Nothing renders these on the server, and a timer set there would never
    // fire — the toast would stick around after hydration.
    if (!import.meta.client) return

    // Tapping "+" five times shouldn't stack five identical cards. Same
    // message: restart its timer instead of adding another.
    const existing = toasts.value.find(t => t.message === message && t.type === type)
    if (existing) {
      const timer = timers.get(existing.id)
      if (timer) clearTimeout(timer)
      timers.set(existing.id, setTimeout(() => dismiss(existing.id), DURATION[type]))
      return
    }

    const id = ++seq.value
    toasts.value = [...toasts.value, { id, type, message, image: opts.image ?? null }].slice(-MAX_VISIBLE)
    timers.set(id, setTimeout(() => dismiss(id), DURATION[type]))
  }

  return {
    toasts,
    dismiss,
    success: (message: string, opts?: ToastOptions) => push('success', message, opts),
    error: (message: string, opts?: ToastOptions) => push('error', message, opts),
    info: (message: string, opts?: ToastOptions) => push('info', message, opts),
  }
}