import { getCategoryAPI } from '@sokol111/ecommerce-category-query-service-api'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  try {
    const api = getCategoryAPI()
    const response = await api.getCategoryById(id, { baseURL: config.categoryQueryApiUrl })
    return response.data
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Category not found'
        })
      }
    }
    throw error
  }
})
