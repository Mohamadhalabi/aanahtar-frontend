<script setup lang="ts">
interface FacetValue { id: number; name: string; slug: string; count: number }
interface AttributeFacet { id: number; name: string; slug: string; values: FacetValue[] }
interface RelationFacet { name: string; slug: string; count: number }

const props = defineProps<{
  attributes: AttributeFacet[]
  brands: RelationFacet[]
  manufacturers: RelationFacet[]
  /** Ticked attribute-value ids. */
  selected: number[]
  activeBrands: string[]
  activeManufacturers: string[]
}>()

const emit = defineEmits<{
  'update:attr': [ids: number[]]
  'update:brands': [slugs: string[]]
  'update:manufacturers': [slugs: string[]]
}>()

// Closed by default: six expanded panels bury the product grid on anything
// shorter than a desktop screen.
const open = ref<Record<string, boolean>>({})

function isOpen(key: string) {
  return open.value[key] === true
}

function toggle(key: string) {
  open.value[key] = !isOpen(key)
}

// A group holding an active selection opens itself, so arriving on a filtered
// URL doesn't hide what's already applied behind a collapsed header.
watchEffect(() => {
  for (const attr of props.attributes) {
    if (attr.values.some(v => props.selected.includes(v.id))) {
      open.value[`a-${attr.id}`] = true
    }
  }
  if (props.activeBrands.length) open.value.brands = true
  if (props.activeManufacturers.length) open.value.manufacturers = true
})

function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value]
}

/** Count of ticked options in a group, shown on the collapsed header. */
function attrCount(attr: AttributeFacet) {
  return attr.values.filter(v => props.selected.includes(v.id)).length
}
</script>

<template>
  <div class="space-y-4">
    <!-- Üretici first: with only two of them it's the broadest cut a customer
         can make, so it belongs directly under the categories. -->
    <div v-if="manufacturers.length" class="rounded-lg border border-line">
      <button
        type="button"
        class="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-ink"
        :aria-expanded="isOpen('manufacturers')"
        @click="toggle('manufacturers')"
      >
        <span class="flex min-w-0 items-center gap-2">
          Üretici
          <span
            v-if="activeManufacturers.length"
            class="shrink-0 rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white"
          >{{ activeManufacturers.length }}</span>
        </span>
        <svg
          class="h-4 w-4 shrink-0 text-muted transition-transform"
          :class="isOpen('manufacturers') && 'rotate-180'"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul v-if="isOpen('manufacturers')" class="max-h-64 overflow-y-auto border-t border-line px-4 py-2">
        <li v-for="m in manufacturers" :key="m.slug">
          <label class="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
            <input
              type="checkbox"
              class="accent-[var(--color-brand,#2563eb)]"
              :checked="activeManufacturers.includes(m.slug)"
              @change="emit('update:manufacturers', toggleIn(activeManufacturers, m.slug))"
            >
            <span class="min-w-0 flex-1 truncate text-ink">{{ m.name }}</span>
            <span class="shrink-0 text-xs text-muted">({{ m.count }})</span>
          </label>
        </li>
      </ul>
    </div>

    <!-- Marka. Checkboxes, not links: several makes at once is a normal ask. -->
    <div v-if="brands.length" class="rounded-lg border border-line">
      <button
        type="button"
        class="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-ink"
        :aria-expanded="isOpen('brands')"
        @click="toggle('brands')"
      >
        <span class="flex min-w-0 items-center gap-2">
          Marka
          <span
            v-if="activeBrands.length"
            class="shrink-0 rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white"
          >{{ activeBrands.length }}</span>
        </span>
        <svg
          class="h-4 w-4 shrink-0 text-muted transition-transform"
          :class="isOpen('brands') && 'rotate-180'"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul v-if="isOpen('brands')" class="max-h-64 overflow-y-auto border-t border-line px-4 py-2">
        <li v-for="b in brands" :key="b.slug">
          <label class="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
            <input
              type="checkbox"
              class="accent-[var(--color-brand,#2563eb)]"
              :checked="activeBrands.includes(b.slug)"
              @change="emit('update:brands', toggleIn(activeBrands, b.slug))"
            >
            <span class="min-w-0 flex-1 truncate text-ink">{{ b.name }}</span>
            <span class="shrink-0 text-xs text-muted">({{ b.count }})</span>
          </label>
        </li>
      </ul>
    </div>

    <!-- Attributes last: these are the narrowest refinements. -->
    <div v-for="attr in attributes" :key="attr.id" class="rounded-lg border border-line">
      <button
        type="button"
        class="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-ink"
        :aria-expanded="isOpen(`a-${attr.id}`)"
        @click="toggle(`a-${attr.id}`)"
      >
        <span class="flex min-w-0 items-center gap-2">
          <span class="truncate">{{ attr.name }}</span>
          <span
            v-if="attrCount(attr)"
            class="shrink-0 rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white"
          >{{ attrCount(attr) }}</span>
        </span>
        <svg
          class="h-4 w-4 shrink-0 text-muted transition-transform"
          :class="isOpen(`a-${attr.id}`) && 'rotate-180'"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul v-if="isOpen(`a-${attr.id}`)" class="max-h-64 overflow-y-auto border-t border-line px-4 py-2">
        <li v-for="v in attr.values" :key="v.id">
          <label class="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
            <input
              type="checkbox"
              class="accent-[var(--color-brand,#2563eb)]"
              :checked="selected.includes(v.id)"
              @change="emit('update:attr', toggleIn(selected, v.id))"
            >
            <span class="min-w-0 flex-1 truncate text-ink">{{ v.name }}</span>
            <span class="shrink-0 text-xs text-muted">({{ v.count }})</span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>