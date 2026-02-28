import type {
  GetProductListParams,
  GetRandomProductsParams,
  ProductListResponse,
  ProductResponse
} from '@sokol111/ecommerce-product-query-service-api'
import { getProductQueryAPI } from '@sokol111/ecommerce-product-query-service-api'

const api = getProductQueryAPI()

export function useProductQueryClient() {
  const { productQueryApiUrl: baseURL } = useRuntimeConfig()

  return {
    async getProductById(productId: string): Promise<ProductResponse> {
      const response = await api.getProductById(productId, { baseURL })
      return response.data
    },

    async getRandomProducts(
      params: GetRandomProductsParams
    ): Promise<ProductResponse[]> {
      const response = await api.getRandomProducts(params, { baseURL })
      return response.data
    },

    async getProductList(
      params: GetProductListParams
    ): Promise<ProductListResponse> {
      const response = await api.getProductList(params, { baseURL })
      return response.data
    }
  }
}
