import { getCategoryAPI } from '@sokol111/ecommerce-category-query-service-api'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const api = getCategoryAPI()
  const response = await api.getAllActiveCategories({ baseURL: config.categoryQueryApiUrl })
  return response.data
})
