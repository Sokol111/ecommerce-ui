import type { CategoryResponse } from '@sokol111/ecommerce-category-query-service-api'

export function useCategoryApi() {
  const getAllActiveCategories = async (): Promise<CategoryResponse[]> => {
    return await $fetch('/api/categories')
  }

  const getCategoryById = async (id: string): Promise<CategoryResponse> => {
    return await $fetch(`/api/categories/${id}`)
  }

  return {
    getAllActiveCategories,
    getCategoryById
  }
}
