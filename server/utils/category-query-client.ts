import type { CategoryResponse } from '@sokol111/ecommerce-category-query-service-api'
import {
  getGetAllActiveCategoriesUrl,
  getGetCategoryByIdUrl
} from '@sokol111/ecommerce-category-query-service-api'

import type { H3Event } from 'h3'

export function useCategoryQueryClient(event: H3Event) {
  const { categoryQueryApiUrl: baseURL } = useRuntimeConfig()
  const headers: HeadersInit = { ...tenantHeaders(event) }

  return {
    async getCategoryById(categoryId: string): Promise<CategoryResponse> {
      return $fetch<CategoryResponse>(getGetCategoryByIdUrl(categoryId), { baseURL, headers })
    },

    async getAllActiveCategories(): Promise<CategoryResponse[]> {
      return $fetch<CategoryResponse[]>(getGetAllActiveCategoriesUrl(), { baseURL, headers })
    }
  }
}
