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

import type { H3Event } from 'h3'

export function useProductQueryClient(event: H3Event) {
  const { productQueryApiUrl: baseURL } = useRuntimeConfig()
  const headers: HeadersInit = { ...tenantHeaders(event) }

  return {
    async getProductById(productId: string): Promise<ProductResponse> {
      return $fetch<ProductResponse>(getGetProductByIdUrl(productId), { baseURL, headers })
    },

    async getRandomProducts(
      params: GetRandomProductsParams
    ): Promise<ProductResponse[]> {
      return $fetch<ProductResponse[]>(getGetRandomProductsUrl(params), { baseURL, headers })
    },

    async getProductList(
      params: GetProductListParams
    ): Promise<ProductListResponse> {
      return $fetch<ProductListResponse>(getGetProductListUrl(params), { baseURL, headers })
    },

    async getProductFacets(
      params: GetProductFacetsParams
    ): Promise<FacetsResponse> {
      return $fetch<FacetsResponse>(getGetProductFacetsUrl(params), { baseURL, headers })
    }
  }
}
