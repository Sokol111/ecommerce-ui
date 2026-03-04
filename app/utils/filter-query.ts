import type { FiltersState } from '~/composables/useFilters'

const PAGINATION_KEYS = ['page', 'size', 'sort', 'order'] as const
const EMPTY: FiltersState = { price: {}, attributes: [] }

export function queryToFilters(query: Record<string, unknown>): FiltersState {
  const raw = query.filters
  if (!raw || typeof raw !== 'string') return EMPTY

  try {
    const parsed = JSON.parse(raw)
    return {
      price: parsed.price ?? {},
      attributes: Array.isArray(parsed.attributes) ? parsed.attributes : []
    }
  } catch {
    return EMPTY
  }
}

function serializeFilters(filters: FiltersState): string | undefined {
  const hasAny = Object.values(filters.price).some(v => v !== undefined)
    || filters.attributes.length > 0

  return hasAny ? JSON.stringify(filters) : undefined
}

function preservePagination(
  currentQuery: Record<string, unknown>
): Record<string, string | undefined> {
  const query: Record<string, string | undefined> = {}

  for (const key of PAGINATION_KEYS) {
    const value = currentQuery[key]
    if (value) query[key] = value as string
  }

  return query
}

export function filtersToQuery(
  filters: FiltersState,
  currentQuery: Record<string, unknown>
): Record<string, string | undefined> {
  return {
    ...preservePagination(currentQuery),
    page: '1',
    filters: serializeFilters(filters)
  }
}
