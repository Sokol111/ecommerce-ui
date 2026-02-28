import type { CategoryAttribute } from '@sokol111/ecommerce-category-query-service-api'

const CATEGORY_FILTERS_KEY = Symbol('categoryFilters') as InjectionKey<
  ReturnType<typeof useFilters> & { categoryAttributes: Ref<CategoryAttribute[]> }
>

/**
 * Provides useFilters instance + categoryAttributes to all child components.
 * Call once in the page/layout that fetches category data.
 */
export function provideCategoryFilters(categoryAttributes: Ref<CategoryAttribute[]>) {
  const filters = useFilters(categoryAttributes)
  const provided = { ...filters, categoryAttributes }

  provide(CATEGORY_FILTERS_KEY, provided)

  return provided
}

/**
 * Injects the category filters provided by a parent page/layout.
 * No arguments needed — categoryAttributes is already included.
 */
export function useCategoryFilters() {
  const injected = inject(CATEGORY_FILTERS_KEY)

  if (!injected) {
    throw new Error('useCategoryFilters() requires a parent component to call provideCategoryFilters()')
  }

  return injected
}
