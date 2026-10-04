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

  // Whole units for normal prices ($28,32 → $28). Prices under 1 keep two
  // decimals, otherwise they'd round down to $0 ($0,40 stays $0,40).
  // Rounded to cents first so 0.999 counts as 1 and shows as $1.
  const cents = Math.round(value * 100) / 100
  const digits = cents > 0 && cents < 1 ? 2 : 0

  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(cents)

  return `${current.value.symbol}${formatted}`
}