<script setup lang="ts">
import type { CategoryAttribute } from '@sokol111/ecommerce-category-query-service-api';

interface Props {
  categoryAttributes: CategoryAttribute[]
}

const props = defineProps<Props>()
const categoryAttributesRef = computed(() => props.categoryAttributes)

const { currentFilters, setPriceFilter, setAttributeFilter, clearAllFilters, hasActiveFilters } = useFilters(categoryAttributesRef)

const getAttributeName = (slug: string) =>
  props.categoryAttributes.find(a => a.slug === slug)?.name ?? slug

const getOptionName = (attrSlug: string, optionSlug: string) => {
  const attr = props.categoryAttributes.find(a => a.slug === attrSlug)
  return attr?.options?.find(o => o.slug === optionSlug)?.name ?? optionSlug
}

const priceLabel = computed(() => {
  const { minPrice, maxPrice } = currentFilters.value.price
  if (minPrice && maxPrice) return `$${minPrice} - $${maxPrice}`
  if (minPrice) return `Від $${minPrice}`
  if (maxPrice) return `До $${maxPrice}`
  return ''
})
</script>

<template>
  <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mb-4">
    <span class="text-sm text-muted">Активні фільтри:</span>

    <!-- Price -->
    <UBadge v-if="currentFilters.price.minPrice || currentFilters.price.maxPrice" color="neutral" variant="subtle">
      Ціна: {{ priceLabel }}
      <UButton variant="ghost" size="xs" icon="i-lucide-x" class="ml-1 -mr-1" @click="setPriceFilter()" />
    </UBadge>

    <!-- Attribute values -->
    <template v-for="filter in currentFilters.attributes" :key="filter.slug">
      <UBadge v-for="val in (filter.values ?? [])" :key="`${filter.slug}-${val}`" color="neutral" variant="subtle">
        {{ getAttributeName(filter.slug) }}: {{ getOptionName(filter.slug, val) }}
        <UButton variant="ghost" size="xs" icon="i-lucide-x" class="ml-1 -mr-1" @click="setAttributeFilter(filter.slug)" />
      </UBadge>

      <!-- Range values -->
      <UBadge v-if="filter.min !== undefined || filter.max !== undefined" color="neutral" variant="subtle">
        {{ getAttributeName(filter.slug) }}:
        {{ filter.min && filter.max ? `${filter.min} - ${filter.max}` : filter.min ? `Від ${filter.min}` : `До ${filter.max}` }}
        <UButton variant="ghost" size="xs" icon="i-lucide-x" class="ml-1 -mr-1" @click="setAttributeFilter(filter.slug)" />
      </UBadge>
    </template>

    <UButton variant="ghost" size="xs" @click="clearAllFilters">Очистити все</UButton>
  </div>
</template>
