import { filtersToQuery, queryToFilters } from '~/utils/filter-query'

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

const EMPTY_FILTERS: FiltersState = { price: {}, attributes: [] }

export function useFilters() {
  const route = useRoute()
  const router = useRouter()

  // ── Read from URL ──

  const currentFilters = computed(() => queryToFilters(route.query))
  const currentPrice = computed(() => currentFilters.value.price)
  const currentAttributes = computed(() => currentFilters.value.attributes)

  const hasActiveFilters = computed(() =>
    Object.values(currentPrice.value).some(v => v !== undefined)
    || currentAttributes.value.length > 0
  )

  const attributeFiltersJson = computed(() =>
    currentAttributes.value.length > 0
      ? JSON.stringify(currentAttributes.value)
      : undefined
  )

  // ── Write to URL ──

  function applyFilters(filters: FiltersState) {
    router.push({ query: filtersToQuery(filters, route.query) })
  }

  function updateFilters(patch: Partial<FiltersState>) {
    applyFilters({ ...currentFilters.value, ...patch })
  }

  function setAttributeFilter(filter: AttributeFilter) {
    const withoutCurrent = currentAttributes.value.filter(a => a.slug !== filter.slug)
    const hasValues = filter.values?.length || filter.min !== undefined || filter.max !== undefined

    updateFilters({
      attributes: hasValues ? [...withoutCurrent, filter] : withoutCurrent
    })
  }

  function removeAttributeValue(slug: string, value: string) {
    const current = getAttributeFilter(slug)
    if (!current) return

    const remainingValues = (current.values ?? []).filter(v => v !== value)

    setAttributeFilter({
      slug,
      values: remainingValues.length > 0 ? remainingValues : undefined,
      min: current.min,
      max: current.max
    })
  }

  function setPriceFilter(price: PriceFilter) {
    updateFilters({ price })
  }

  function clearAllFilters() {
    applyFilters(EMPTY_FILTERS)
  }

  function getAttributeFilter(slug: string): AttributeFilter | undefined {
    return currentAttributes.value.find(a => a.slug === slug)
  }

  return {
    currentFilters,
    setAttributeFilter,
    removeAttributeValue,
    setPriceFilter,
    clearAllFilters,
    hasActiveFilters,
    getAttributeFilter,
    attributeFiltersJson
  }
}
