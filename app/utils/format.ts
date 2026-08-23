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

  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

  return `${current.value.symbol}${formatted}`
}
