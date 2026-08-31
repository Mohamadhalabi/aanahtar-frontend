/**
 * Format a money value that already arrived converted from the API.
 *
 * This does NOT convert — the backend prices everything in the requested
 * currency, and converting again here would double-apply the rate. All this
 * does is put the right symbol and separators around the number.
 */
export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return ''

  const value = typeof amount === 'string' ? Number(amount) : amount
  if (Number.isNaN(value)) return ''

  const { current } = useCurrency()

  // Whole units only. The API already rounds prices up to an integer, so the
  // decimals were always ",00" — minimumFractionDigits has to be 0 as well,
  // since setting only the maximum still pads out to two places.
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  return `${current.value.symbol}${formatted}`
}