export interface Badge { key: string; label: string }

export interface ProductCard {
  id: number
  title: string
  slug: string
  sku: string | null
  price: number
  old_price: number | null
  discount: number | null
  currency: string
  in_stock: boolean
  thumb: string | null
  badges: Badge[]
  category?: string | null
}

export interface Category {
  id: number
  name: string
  slug: string
  image: string | null
  children: Category[]
}

export interface Paginated<T> {
  data: T[]
  meta: { current_page: number; last_page: number; total: number; per_page: number }
}