const tl = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
})

export const formatPrice = (v: number | null | undefined) =>
  v == null ? '' : tl.format(v)