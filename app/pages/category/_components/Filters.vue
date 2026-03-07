<script setup lang="ts">
import type { CategoryAttribute } from '@sokol111/ecommerce-category-query-service-api';
import type { FacetsResponse } from '@sokol111/ecommerce-product-query-service-api';
import RangeFilter from './RangeFilter.vue';

const { categoryAttributes, facets } = defineProps<{
  categoryAttributes: CategoryAttribute[]
  facets?: FacetsResponse
}>()

const {
  currentFilters,
  setPriceFilter,
  setAttributeFilter,
  clearAllFilters,
  hasActiveFilters,
  getAttributeFilter
} = useFilters()

const facetsBySlug = computed(() => {
  const map = new Map<string, Map<string, number>>()
  if (!facets) return map
  for (const facet of facets.facets) {
    const valuesMap = new Map<string, number>()
    for (const v of facet.values) {
      valuesMap.set(v.value, v.count)
    }
    map.set(facet.slug, valuesMap)
  }
  return map
})

const filterableAttributes = computed(() =>
  categoryAttributes.filter(attr => attr.filterable)
)

// Accordion items with full attribute data for direct access in slots
const accordionItems = computed(() =>
  filterableAttributes.value.map(attr => ({
    value: attr.slug,
    label: attr.name,
    attr
  }))
)

const defaultOpenSlugs = filterableAttributes.value.slice(0, 3).map(attr => attr.slug)

const isChoiceType = (type: string) => type === 'single' || type === 'multiple'

const handlePriceChange = (min?: number, max?: number) => {
  setPriceFilter({ minPrice: min, maxPrice: max })
}

const handleCheckboxChange = (slug: string, values: string[]) => {
  setAttributeFilter({ slug, values: values.length > 0 ? values : undefined })
}

const handleRangeChange = (slug: string, min?: number, max?: number) => {
  setAttributeFilter({ slug, min, max })
}

const handleBooleanChange = (slug: string, checked: boolean) => {
  setAttributeFilter({ slug, values: checked ? ['true'] : undefined })
}

const getCheckboxOptions = (attr: CategoryAttribute) => {
  const attrFacets = facetsBySlug.value.get(attr.slug)
  return (attr.options ?? [])
    .filter(opt => !attrFacets || attrFacets.has(opt.slug))
    .map(opt => {
      const count = attrFacets?.get(opt.slug)
      return {
        value: opt.slug,
        label: count !== undefined ? `${opt.name} (${count})` : opt.name
      }
    })
}

const hasBooleanProducts = (slug: string) => {
  const attrFacets = facetsBySlug.value.get(slug)
  return !attrFacets || attrFacets.has('true')
}
</script>

<template>
  <aside class="w-full lg:w-64 shrink-0">
    <div class="sticky top-4 bg-default rounded-lg border p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold flex items-center gap-2">
          <UIcon name="i-lucide-sliders-horizontal" class="size-5" />
          Фільтри
        </h2>
        <UButton v-if="hasActiveFilters" variant="ghost" size="sm" @click="clearAllFilters">
          Очистити
        </UButton>
      </div>

      <USeparator class="mb-4" />

      <!-- Price Filter -->
      <RangeFilter
        label="Ціна"
        :min="currentFilters.price.minPrice"
        :max="currentFilters.price.maxPrice"
        :range-min="facets?.priceRange?.min"
        :range-max="facets?.priceRange?.max"
        @apply="handlePriceChange"
      />

      <template v-if="filterableAttributes.length > 0">
        <USeparator class="my-4" />

        <!-- Attribute Filters -->
        <UAccordion
          :default-value="defaultOpenSlugs"
          type="multiple"
          :items="accordionItems"
          :unmount-on-hide="false"
        >
          <template #body="{ item: { attr } }">
            <!-- Checkbox (single/multiple) -->
            <UCheckboxGroup
              v-if="isChoiceType(attr.type) && attr.options"
              :model-value="getAttributeFilter(attr.slug)?.values ?? []"
              :items="getCheckboxOptions(attr)"
              class="space-y-2 max-h-48 overflow-y-auto"
              @update:model-value="(v: unknown) => handleCheckboxChange(attr.slug, v as string[])"
            />

            <!-- Range -->
            <RangeFilter
              v-else-if="attr.type === 'range'"
              :unit="attr.unit"
              :min="getAttributeFilter(attr.slug)?.min"
              :max="getAttributeFilter(attr.slug)?.max"
              @apply="(min, max) => handleRangeChange(attr.slug, min, max)"
            />

            <!-- Boolean -->
            <USwitch
              v-else-if="attr.type === 'boolean' && hasBooleanProducts(attr.slug)"
              :model-value="getAttributeFilter(attr.slug)?.values?.includes('true') ?? false"
              label="Так"
              @update:model-value="(v) => handleBooleanChange(attr.slug, v)"
            />
          </template>
        </UAccordion>
      </template>
    </div>
  </aside>
</template>
