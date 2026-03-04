<script setup lang="ts">
import type { CategoryAttribute } from '@sokol111/ecommerce-category-query-service-api';
import RangeFilter from './RangeFilter.vue';

const { categoryAttributes } = defineProps<{
  categoryAttributes: CategoryAttribute[]
}>()

const {
  currentFilters,
  setPriceFilter,
  setAttributeFilter,
  clearAllFilters,
  hasActiveFilters,
  getAttributeFilter
} = useFilters()

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

const openSlugs = ref(filterableAttributes.value.slice(0, 3).map(attr => attr.slug))

// Handlers
const handleCheckboxChange = (slug: string, values: string[]) => {
  setAttributeFilter({ slug, values: values.length > 0 ? values : undefined })
}

const handleRangeChange = (slug: string, min?: number, max?: number) => {
  setAttributeFilter({ slug, min, max })
}

const handleBooleanChange = (slug: string, checked: boolean) => {
  setAttributeFilter({ slug, values: checked ? ['true'] : undefined })
}

// For UCheckboxGroup - transform options to required format
const getCheckboxOptions = (attr: CategoryAttribute) => {
  return attr.options?.map(opt => ({
    value: opt.slug,
    label: opt.name
  })) ?? []
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
        @apply="(min?: number, max?: number) => setPriceFilter({ minPrice: min, maxPrice: max })"
      />

      <template v-if="filterableAttributes.length > 0">
        <USeparator class="my-4" />

        <!-- Attribute Filters -->
        <UAccordion
          v-model="openSlugs"
          type="multiple"
          :items="accordionItems"
        >
          <template #body="{ item }">
            <!-- Checkbox (single/multiple) -->
            <UCheckboxGroup
              v-if="(item.attr.type === 'single' || item.attr.type === 'multiple') && item.attr.options"
              :model-value="getAttributeFilter(item.attr.slug)?.values ?? []"
              :items="getCheckboxOptions(item.attr)"
              class="space-y-2 max-h-48 overflow-y-auto"
              @update:model-value="(v: unknown) => handleCheckboxChange(item.attr.slug, v as string[])"
            />

            <!-- Range -->
            <RangeFilter
              v-else-if="item.attr.type === 'range'"
              :unit="item.attr.unit"
              :min="getAttributeFilter(item.attr.slug)?.min"
              :max="getAttributeFilter(item.attr.slug)?.max"
              @apply="(min, max) => handleRangeChange(item.attr.slug, min, max)"
            />

            <!-- Boolean -->
            <USwitch
              v-else-if="item.attr.type === 'boolean'"
              :model-value="getAttributeFilter(item.attr.slug)?.values?.includes('true') ?? false"
              label="Так"
              @update:model-value="(v) => handleBooleanChange(item.attr.slug, v)"
            />
          </template>
        </UAccordion>
      </template>
    </div>
  </aside>
</template>
