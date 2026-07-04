import { createClient } from '@connectrpc/connect'
import { createGrpcTransport } from '@connectrpc/connect-node'
import type {
  GetProductFacetsResponse,
  GetProductListResponse,
  Product
} from '@sokol111/ecommerce-product-query-service-api'
import {
  ProductQueryService
} from '@sokol111/ecommerce-product-query-service-api'

import type { H3Event } from 'h3'

export function useProductQueryClient(event: H3Event) {
  const { productQueryApiUrl: baseURL } = useRuntimeConfig()
  const headers = tenantHeaders(event) as Record<string, string>

  const transport = createGrpcTransport({
    baseUrl: baseURL,
    interceptors: [
      next => (req) => {
        for (const [key, value] of Object.entries(headers)) {
          req.header.set(key, value)
        }
        return next(req)
      }
    ]
  })

  const client = createClient(ProductQueryService, transport)

  return {
    async getProductById(productId: string): Promise<Product> {
      const response = await client.getProductById({ id: productId })
      return response.product!
    },

    async getRandomProducts(params: { count: number }): Promise<Product[]> {
      const response = await client.getRandomProducts(params)
      return response.items
    },

    async getProductList(params: {
      page: number
      size: number
      categoryId?: string
      sort?: string
      order?: string
      minPrice?: number
      maxPrice?: number
      attributeFilters?: string
    }): Promise<GetProductListResponse> {
      let parsedAttributeFilters
      if (params.attributeFilters) {
        try {
          parsedAttributeFilters = JSON.parse(params.attributeFilters)
        } catch {
          parsedAttributeFilters = undefined
        }
      }

      return await client.getProductList({
        page: params.page,
        size: params.size,
        categoryId: params.categoryId,
        sort: params.sort,
        order: params.order,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        attributeFilters: parsedAttributeFilters
      })
    },

    async getProductFacets(params: { categoryId: string }): Promise<GetProductFacetsResponse> {
      return client.getProductFacets(params)
    }
  }
}
