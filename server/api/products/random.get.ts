import { getProductQueryAPI } from '@sokol111/ecommerce-product-query-service-api'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const count = parseInt(query.count as string) || 4

  const api = getProductQueryAPI()
  const response = await api.getRandomProducts({ count }, { baseURL: config.productQueryApiUrl })
  return response.data
})
