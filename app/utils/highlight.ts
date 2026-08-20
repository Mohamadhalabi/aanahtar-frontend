/**
 * Wrap every search token found in `text` with <mark>.
 *
 * The text is escaped first and the tokens are escaped for regex, so this is
 * safe to render with v-html — the only markup that survives is the <mark>
 * this function adds.
 */
export function highlight(text: string | null | undefined, query: string): string {
  const safe = escapeHtml(String(text ?? ''))
  const tokens = query.trim().split(/\s+/).filter(t => t.length > 0)

  if (!tokens.length) return safe

  // Longest first: otherwise a short token can split a longer one's match and
  // leave the markup interleaved.
  const pattern = tokens
    .sort((a, b) => b.length - a.length)
    .map(escapeRegex)
    .join('|')

  return safe.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}