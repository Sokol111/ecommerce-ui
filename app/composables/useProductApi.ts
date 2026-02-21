import type { ProductListResponse, ProductResponse } from '@sokol111/ecommerce-product-query-service-api'

export interface ProductQueryParams {
  page?: number
  size?: number
  categoryId?: string
  sort?: string
  order?: string
  minPrice?: number
  maxPrice?: number
  attributeFilters?: string
}

export function useProductApi() {
  const getRandomProducts = async (count: number = 4): Promise<ProductResponse[]> => {
    return await $fetch('/api/products/random', {
      query: { count }
    })
  }

  const getProductById = async (id: string): Promise<ProductResponse> => {
    return await $fetch(`/api/products/${id}`)
  }

  const getProductList = async (params: ProductQueryParams = {}): Promise<ProductListResponse> => {
    return await $fetch('/api/products', {
      query: params
    })
  }

  return {
    getRandomProducts,
    getProductById,
    getProductList
  }
}
