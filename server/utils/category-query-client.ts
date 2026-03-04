import type { CategoryResponse } from '@sokol111/ecommerce-category-query-service-api'
import {
  getGetAllActiveCategoriesUrl,
  getGetCategoryByIdUrl
} from '@sokol111/ecommerce-category-query-service-api'

export function useCategoryQueryClient() {
  const { categoryQueryApiUrl: baseURL } = useRuntimeConfig()

  return {
    async getCategoryById(categoryId: string): Promise<CategoryResponse> {
      return $fetch<CategoryResponse>(getGetCategoryByIdUrl(categoryId), { baseURL })
    },

    async getAllActiveCategories(): Promise<CategoryResponse[]> {
      return $fetch<CategoryResponse[]>(getGetAllActiveCategoriesUrl(), { baseURL })
    }
  }
}
