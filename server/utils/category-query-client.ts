import type { CategoryResponse } from '@sokol111/ecommerce-category-query-service-api'
import { getCategoryAPI } from '@sokol111/ecommerce-category-query-service-api'

const api = getCategoryAPI()

export function useCategoryQueryClient() {
  const { categoryQueryApiUrl: baseURL } = useRuntimeConfig()

  return {
    async getCategoryById(categoryId: string): Promise<CategoryResponse> {
      const response = await api.getCategoryById(categoryId, { baseURL })
      return response.data
    },

    async getAllActiveCategories(): Promise<CategoryResponse[]> {
      const response = await api.getAllActiveCategories({ baseURL })
      return response.data
    }
  }
}
