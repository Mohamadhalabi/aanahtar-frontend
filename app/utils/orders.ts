/**
 * Woo's status slugs, carried over verbatim by the import. Unknown slugs fall
 * through to the raw value rather than rendering blank.
 */
const ORDER_STATUSES: Record<string, { label: string; class: string }> = {
  pending:    { label: 'Beklemede',        class: 'bg-amber-50 text-amber-700' },
  processing: { label: 'Hazırlanıyor',     class: 'bg-blue-50 text-blue-700' },
  'on-hold':  { label: 'Beklemeye alındı', class: 'bg-neutral-100 text-muted' },
  completed:  { label: 'Tamamlandı',       class: 'bg-green-50 text-green-700' },
  cancelled:  { label: 'İptal edildi',     class: 'bg-neutral-100 text-muted' },
  refunded:   { label: 'İade edildi',      class: 'bg-neutral-100 text-muted' },
  failed:     { label: 'Başarısız',        class: 'bg-price/5 text-price' },
}

export function orderStatus(key: string) {
  return ORDER_STATUSES[key] ?? { label: key, class: 'bg-neutral-100 text-muted' }
}

export function formatOrderDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}