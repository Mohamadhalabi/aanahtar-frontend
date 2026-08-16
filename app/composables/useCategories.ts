import type { Category } from '~/types/catalog'

export function useCategories() {
  // Shared key = one request per page render, not one per component.
  return useApiFetch<{ data: Category[] }>('/categories', {
    key: 'categories-tree',
    transform: (r: any) => r.data as Category[],
    default: () => [] as Category[],
  })
}