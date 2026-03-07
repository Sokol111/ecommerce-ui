import type {
  FacetsResponse,
  GetProductFacetsParams,
  GetProductListParams,
  GetRandomProductsParams,
  ProductListResponse,
  ProductResponse
} from '@sokol111/ecommerce-product-query-service-api'
import {
  getGetProductByIdUrl,
  getGetProductFacetsUrl,
  getGetProductListUrl,
  getGetRandomProductsUrl
} from '@sokol111/ecommerce-product-query-service-api'

export function useProductQueryClient() {
  const { productQueryApiUrl: baseURL } = useRuntimeConfig()

  return {
    async getProductById(productId: string): Promise<ProductResponse> {
      return $fetch<ProductResponse>(getGetProductByIdUrl(productId), { baseURL })
    },

    async getRandomProducts(
      params: GetRandomProductsParams
    ): Promise<ProductResponse[]> {
      return $fetch<ProductResponse[]>(getGetRandomProductsUrl(params), { baseURL })
    },

    async getProductList(
      params: GetProductListParams
    ): Promise<ProductListResponse> {
      return $fetch<ProductListResponse>(getGetProductListUrl(params), { baseURL })
    },

    async getProductFacets(
      params: GetProductFacetsParams
    ): Promise<FacetsResponse> {
      return $fetch<FacetsResponse>(getGetProductFacetsUrl(params), { baseURL })
    }
  }
}
