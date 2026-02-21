import type { CategoryAttribute } from '@sokol111/ecommerce-category-query-service-api'

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

export function useFilters(categoryAttributes: Ref<CategoryAttribute[]>) {
  const route = useRoute()
  const router = useRouter()

  const currentFilters = computed((): FiltersState => {
    const price: PriceFilter = {}
    const attributes: AttributeFilter[] = []

    const minPrice = route.query.minPrice
    const maxPrice = route.query.maxPrice

    if (minPrice) price.minPrice = parseFloat(minPrice as string)
    if (maxPrice) price.maxPrice = parseFloat(maxPrice as string)

    for (const attr of categoryAttributes.value) {
      const slug = attr.slug

      if (attr.type === 'range') {
        const min = route.query[`${slug}.min`]
        const max = route.query[`${slug}.max`]
        if (min || max) {
          attributes.push({
            slug,
            min: min ? parseFloat(min as string) : undefined,
            max: max ? parseFloat(max as string) : undefined
          })
        }
      } else {
        const value = route.query[slug]
        if (value) {
          attributes.push({
            slug,
            values: (value as string).split(',')
          })
        }
      }
    }

    return { price, attributes }
  })

  const updateFilters = (newFilters: Partial<FiltersState>) => {
    const query: Record<string, string | undefined> = { ...route.query as Record<string, string> }

    // Reset to page 1 when filters change
    query.page = '1'

    // Update price filters
    if (newFilters.price !== undefined) {
      if (newFilters.price.minPrice !== undefined) {
        query.minPrice = newFilters.price.minPrice.toString()
      } else {
        delete query.minPrice
      }
      if (newFilters.price.maxPrice !== undefined) {
        query.maxPrice = newFilters.price.maxPrice.toString()
      } else {
        delete query.maxPrice
      }
    }

    // Update attribute filters
    if (newFilters.attributes !== undefined) {
      // Clear all existing attribute params
      for (const attr of categoryAttributes.value) {
        delete query[attr.slug]
        delete query[`${attr.slug}.min`]
        delete query[`${attr.slug}.max`]
      }

      // Set new ones
      for (const filter of newFilters.attributes) {
        if (filter.values && filter.values.length > 0) {
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

    router.push({ query })
  }

  const setAttributeFilter = (slug: string, values?: string[], min?: number, max?: number) => {
    const newAttributes = currentFilters.value.attributes.filter(a => a.slug !== slug)

    if ((values && values.length > 0) || min !== undefined || max !== undefined) {
      newAttributes.push({ slug, values, min, max })
    }

    updateFilters({ attributes: newAttributes })
  }

  const setPriceFilter = (minPrice?: number, maxPrice?: number) => {
    updateFilters({ price: { minPrice, maxPrice } })
  }

  const clearAllFilters = () => {
    const query: Record<string, string> = {}
    const size = route.query.size
    const sort = route.query.sort
    const order = route.query.order

    query.page = '1'
    if (size) query.size = size as string
    if (sort) query.sort = sort as string
    if (order) query.order = order as string

    router.push({ query })
  }

  const hasActiveFilters = computed(() => {
    return (
      currentFilters.value.price.minPrice !== undefined
      || currentFilters.value.price.maxPrice !== undefined
      || currentFilters.value.attributes.length > 0
    )
  })

  const getAttributeFilter = (slug: string): AttributeFilter | undefined => {
    return currentFilters.value.attributes.find(a => a.slug === slug)
  }

  // Build JSON string for API
  const attributeFiltersJson = computed(() => {
    const filters = currentFilters.value.attributes
      .filter(f => (f.values && f.values.length > 0) || f.min !== undefined || f.max !== undefined)
      .map(f => ({
        slug: f.slug,
        ...(f.values && { values: f.values }),
        ...(f.min !== undefined && { min: f.min }),
        ...(f.max !== undefined && { max: f.max })
      }))
    return filters.length > 0 ? JSON.stringify(filters) : undefined
  })

  return {
    currentFilters,
    updateFilters,
    setAttributeFilter,
    setPriceFilter,
    clearAllFilters,
    hasActiveFilters,
    getAttributeFilter,
    attributeFiltersJson
  }
}
