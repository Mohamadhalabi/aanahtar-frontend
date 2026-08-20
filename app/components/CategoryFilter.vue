<script setup lang="ts">
interface Node {
  id: number
  name: string
  slug: string
  children?: Node[]
}

const props = withDefaults(defineProps<{
  nodes: Node[]
  counts: Record<string, number>
  active: string
  /** Nesting depth, for the indent. Set by the component on itself. */
  level?: number
}>(), { level: 0 })

const emit = defineEmits<{ select: [slug: string] }>()

// A branch containing the active category starts open, so deep-linking to a
// child doesn't land the customer on a collapsed tree with no visible context.
function containsActive(node: Node): boolean {
  if (node.slug === props.active) return true
  return (node.children ?? []).some(containsActive)
}

const open = ref<Record<number, boolean>>({})

watchEffect(() => {
  for (const node of props.nodes) {
    if (containsActive(node)) open.value[node.id] = true
  }
})

function toggle(node: Node) {
  open.value[node.id] = !open.value[node.id]
}
</script>

<template>
  <ul :class="level === 0 ? 'divide-y divide-line' : ''">
    <li v-for="node in nodes" :key="node.id" :class="level > 0 && 'border-t border-line/60'">
      <div class="flex items-center">
        <button
          type="button"
          class="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 py-3 pr-2 text-left text-sm transition hover:text-brand"
          :style="{ paddingLeft: `${1 + level * 0.85}rem` }"
          :class="node.slug === active ? 'font-medium text-brand' : 'text-ink'"
          @click="emit('select', node.slug)"
        >
          <span class="min-w-0 truncate">{{ node.name }}</span>
          <span v-if="counts[node.slug]" class="shrink-0 text-xs text-muted">({{ counts[node.slug] }})</span>
        </button>

        <!-- Separate control: clicking the name filters, clicking the chevron
             expands. Combining them means you can't browse without filtering. -->
        <button
          v-if="node.children?.length"
          type="button"
          :aria-label="open[node.id] ? 'Daralt' : 'Genişlet'"
          :aria-expanded="open[node.id]"
          class="mr-2 shrink-0 cursor-pointer rounded p-1.5 text-muted transition hover:bg-neutral-100 hover:text-ink"
          @click="toggle(node)"
        >
          <svg
            class="h-4 w-4 transition-transform"
            :class="open[node.id] && 'rotate-90'"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <CategoryFilter
        v-if="node.children?.length && open[node.id]"
        :nodes="node.children"
        :counts="counts"
        :active="active"
        :level="level + 1"
        @select="emit('select', $event)"
      />
    </li>
  </ul>
</template>
