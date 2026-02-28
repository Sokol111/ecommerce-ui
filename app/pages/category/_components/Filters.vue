<script setup lang="ts">
import type { CategoryAttribute } from '@sokol111/ecommerce-category-query-service-api';
import RangeFilter from './RangeFilter.vue';

interface Props {
  categoryAttributes: CategoryAttribute[]
}

const props = defineProps<Props>()
const categoryAttributesRef = computed(() => props.categoryAttributes)

const {
  currentFilters,
  setPriceFilter,
  setAttributeFilter,
  clearAllFilters,
  hasActiveFilters,
  getAttributeFilter
} = useFilters(categoryAttributesRef)

const filterableAttributes = computed(() =>
  props.categoryAttributes.filter(attr => attr.filterable)
)

// Handlers
const handleCheckboxChange = (slug: string, values: string[]) => {
  setAttributeFilter(slug, values.length > 0 ? values : undefined)
}

const handleRangeChange = (slug: string, min?: number, max?: number) => {
  setAttributeFilter(slug, undefined, min, max)
}

const handleBooleanChange = (slug: string, checked: boolean) => {
  setAttributeFilter(slug, checked ? ['true'] : undefined)
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
        @apply="setPriceFilter"
      />

      <template v-if="filterableAttributes.length > 0">
        <USeparator class="my-4" />

        <!-- Attribute Filters -->
        <UAccordion
          :items="filterableAttributes.map(attr => ({ value: attr.slug, label: attr.name }))"
          :default-value="filterableAttributes.slice(0, 3).map(attr => attr.slug)"
          multiple
        >
          <template #content="{ item }">
            <template v-for="attr in filterableAttributes" :key="attr.slug">
              <template v-if="item.value === attr.slug">
                <!-- Checkbox (single/multiple) -->
                <UCheckboxGroup
                  v-if="(attr.type === 'single' || attr.type === 'multiple') && attr.options"
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
                  v-else-if="attr.type === 'boolean'"
                  :model-value="getAttributeFilter(attr.slug)?.values?.includes('true') ?? false"
                  label="Так"
                  @update:model-value="(v) => handleBooleanChange(attr.slug, v)"
                />
              </template>
            </template>
          </template>
        </UAccordion>
      </template>
    </div>
  </aside>
</template>
