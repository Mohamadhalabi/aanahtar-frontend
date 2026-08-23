export interface CurrencyOption {
  code: string
  name: string
  symbol: string
  rate: number
  is_default: boolean
}

/** No backend default configured yet — see the note about is_default. */
const FALLBACK_CODE = 'TRY'

/**
 * Shared state, not a bare useCookie.
 *
 * useCookie hands back an INDEPENDENT ref per call, so the copy inside
 * useApiFetch never saw the top bar's write and kept sending the previous
 * currency — which is why picking TRY applied USD's rate and picking EUR
 * applied TRY's. useState is app-wide, so every reader sees the same value.
 */
export function useCurrencyCode() {
  const cookie = useCookie<string | null>('currency', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  return useState<string | null>('currency-code', () => cookie.value ?? FALLBACK_CODE)
}

export function useCurrency() {
  const code = useCurrencyCode()
  const list = useState<CurrencyOption[]>('currencies', () => [])

  const fallback: CurrencyOption = {
    code: FALLBACK_CODE, name: 'Türk Lirası', symbol: '₺', rate: 1, is_default: true,
  }

  const current = computed<CurrencyOption>(() =>
    list.value.find(c => c.code === code.value)
    ?? list.value.find(c => c.is_default)
    ?? list.value[0]
    ?? fallback)

  /**
   * Fetched during SSR rather than lazily: formatPrice needs the symbol at
   * first paint, and a client-only load would render every price with the
   * fallback symbol for a frame.
   */
  async function load() {
    const { data } = await useApiFetch<{ currencies: CurrencyOption[]; current: { code: string } }>(
      '/currencies',
      { key: 'currencies' },
    )

    if (data.value?.currencies?.length) {
      list.value = data.value.currencies

      // Keep whatever the visitor picked. Only fall back to the backend's
      // default if the stored code isn't a currency any more.
      if (!list.value.some(c => c.code === code.value)) {
        code.value = data.value.current.code
      }
    }
  }

  /**
   * Every price on the page came from the API in the old currency, so both the
   * cart and the page data are refetched — converting client-side would drift
   * from what checkout will actually charge.
   */
  async function setCurrency(next: string) {
    if (next === code.value) return

    code.value = next

    // Written explicitly: useState doesn't persist, and the cookie is what
    // makes the choice survive a reload and reach the server on SSR.
    const cookie = useCookie<string | null>('currency', {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      path: '/',
    })
    cookie.value = next

    await Promise.all([useCart().load(), refreshNuxtData()])
  }

  return { code, list, current, load, setCurrency }
}