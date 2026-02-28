import type { CategoryAttribute } from '@sokol111/ecommerce-category-query-service-api'
import type { LocationQueryValue } from 'vue-router'

export interface PriceFilter {
  minPrice?: number
  maxPrice?: number
}

export interface AttributeFilter {
  slug: string
  values?: string[]
  min?: number
  max?: number
}

export interface FiltersState {
  price: PriceFilter
  attributes: AttributeFilter[]
}

// --- Query param helpers ---

const PAGINATION_KEYS = ['page', 'size', 'sort', 'order'] as const

function queryFloat(value: LocationQueryValue | LocationQueryValue[]): number | undefined {
  return value ? parseFloat(value as string) : undefined
}

function parsePriceFromQuery(query: Record<string, unknown>): PriceFilter {
  return {
    minPrice: queryFloat(query.minPrice as LocationQueryValue),
    maxPrice: queryFloat(query.maxPrice as LocationQueryValue)
  }
}

function parseRangeAttribute(query: Record<string, unknown>, slug: string): AttributeFilter | undefined {
  const min = queryFloat(query[`${slug}.min`] as LocationQueryValue)
  const max = queryFloat(query[`${slug}.max`] as LocationQueryValue)
  return (min !== undefined || max !== undefined) ? { slug, min, max } : undefined
}

function parseDiscreteAttribute(query: Record<string, unknown>, slug: string): AttributeFilter | undefined {
  const value = query[slug] as LocationQueryValue
  return value ? { slug, values: (value as string).split(',') } : undefined
}

function parseAttributesFromQuery(query: Record<string, unknown>, schema: CategoryAttribute[]): AttributeFilter[] {
  return schema.reduce<AttributeFilter[]>((filters, attr) => {
    const parsed = attr.type === 'range'
      ? parseRangeAttribute(query, attr.slug)
      : parseDiscreteAttribute(query, attr.slug)

    if (parsed) filters.push(parsed)
    return filters
  }, [])
}

// --- Composable ---

export function useFilters(categoryAttributes: Ref<CategoryAttribute[]>) {
  const route = useRoute()
  const router = useRouter()

  // --- Read filters from URL ---

  const currentPrice = computed(() => parsePriceFromQuery(route.query))

  const currentAttributes = computed(() =>
    parseAttributesFromQuery(route.query, categoryAttributes.value)
  )

  const currentFilters = computed((): FiltersState => ({
    price: currentPrice.value,
    attributes: currentAttributes.value
  }))

  // --- Write filters to URL ---

  function buildBaseQuery(): Record<string, string | undefined> {
    return { ...route.query as Record<string, string>, page: '1' }
  }

  function applyPriceToQuery(query: Record<string, string | undefined>, price: PriceFilter) {
    query.minPrice = price.minPrice?.toString()
    query.maxPrice = price.maxPrice?.toString()
  }

  function applyAttributesToQuery(query: Record<string, string | undefined>, attributes: AttributeFilter[]) {
    // Clear all existing attribute params
    for (const attr of categoryAttributes.value) {
      query[attr.slug] = undefined
      query[`${attr.slug}.min`] = undefined
      query[`${attr.slug}.max`] = undefined
    }

    // Set new values
    for (const filter of attributes) {
      if (filter.values?.length) {
        query[filter.slug] = filter.values.join(',')
      }
      if (filter.min !== undefined) {
        query[`${filter.slug}.min`] = filter.min.toString()
      }
      if (filter.max !== undefined) {
        query[`${filter.slug}.max`] = filter.max.toString()
      }
    }
  }

  function updateFilters(newFilters: Partial<FiltersState>) {
    const query = buildBaseQuery()

    if (newFilters.price !== undefined) {
      applyPriceToQuery(query, newFilters.price)
    }
    if (newFilters.attributes !== undefined) {
      applyAttributesToQuery(query, newFilters.attributes)
    }

    router.push({ query })
  }

  // --- Convenience methods ---

  function setAttributeFilter(slug: string, values?: string[], min?: number, max?: number) {
    const withoutCurrent = currentAttributes.value.filter(a => a.slug !== slug)

    const hasValues = values?.length || min !== undefined || max !== undefined
    const newAttributes = hasValues
      ? [...withoutCurrent, { slug, values, min, max }]
      : withoutCurrent

    updateFilters({ attributes: newAttributes })
  }

  function setPriceFilter(minPrice?: number, maxPrice?: number) {
    updateFilters({ price: { minPrice, maxPrice } })
  }

  function clearAllFilters() {
    const query: Record<string, string> = { page: '1' }

    for (const key of PAGINATION_KEYS) {
      const value = route.query[key]
      if (value) query[key] = value as string
    }

    router.push({ query })
  }

  // --- Derived state ---

  const hasActiveFilters = computed(() =>
    currentPrice.value.minPrice !== undefined
    || currentPrice.value.maxPrice !== undefined
    || currentAttributes.value.length > 0
  )

  function getAttributeFilter(slug: string): AttributeFilter | undefined {
    return currentAttributes.value.find(a => a.slug === slug)
  }

  const attributeFiltersJson = computed(() => {
    const filters = currentAttributes.value
      .filter(f => f.values?.length || f.min !== undefined || f.max !== undefined)
      .map(({ slug, values, min, max }) => ({
        slug,
        ...(values && { values }),
        ...(min !== undefined && { min }),
        ...(max !== undefined && { max })
      }))

    return filters.length > 0 ? JSON.stringify(filters) : undefined
  })

  return {
    currentFilters,
    currentPrice,
    currentAttributes,
    updateFilters,
    setAttributeFilter,
    setPriceFilter,
    clearAllFilters,
    hasActiveFilters,
    getAttributeFilter,
    attributeFiltersJson
  }
}
