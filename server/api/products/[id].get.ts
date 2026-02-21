import { getProductQueryAPI } from '@sokol111/ecommerce-product-query-service-api'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required'
    })
  }

  try {
    const api = getProductQueryAPI()
    const response = await api.getProductById(id, { baseURL: config.productQueryApiUrl })
    return response.data
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Product not found'
        })
      }
    }
    throw error
  }
})
