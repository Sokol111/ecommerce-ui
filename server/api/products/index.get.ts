import { getProductQueryAPI, type GetProductListOrder, type GetProductListSort } from '@sokol111/ecommerce-product-query-service-api'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const page = parseInt(query.page as string) || 1
  const size = parseInt(query.size as string) || 20
  const categoryId = query.categoryId as string | undefined
  const sort = query.sort as GetProductListSort | undefined
  const order = query.order as GetProductListOrder | undefined
  const minPrice = query.minPrice ? parseFloat(query.minPrice as string) : undefined
  const maxPrice = query.maxPrice ? parseFloat(query.maxPrice as string) : undefined
  const attributeFilters = query.attributeFilters as string | undefined

  const api = getProductQueryAPI()
  const response = await api.getProductList(
    {
      page,
      size,
      categoryId,
      sort,
      order,
      minPrice,
      maxPrice,
      attributeFilters
    },
    { baseURL: config.productQueryApiUrl }
  )
  return response.data
})
