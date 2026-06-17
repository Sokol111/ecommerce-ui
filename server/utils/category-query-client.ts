import { createClient } from '@connectrpc/connect'
import { createGrpcTransport } from '@connectrpc/connect-node'
import type { Category } from '@sokol111/ecommerce-category-query-service-api'
import { CategoryQueryService } from '@sokol111/ecommerce-category-query-service-api'

import type { H3Event } from 'h3'

export function useCategoryQueryClient(event: H3Event) {
  const { categoryQueryApiUrl: baseURL } = useRuntimeConfig()
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

  const client = createClient(CategoryQueryService, transport)

  return {
    async getCategoryById(categoryId: string): Promise<Category> {
      const response = await client.getCategoryById({ id: categoryId })
      return response.category!
    },

    async getAllActiveCategories(): Promise<Category[]> {
      const response = await client.getAllActiveCategories({})
      return response.categories
    }
  }
}
