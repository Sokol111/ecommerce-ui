import { consola } from 'consola'

const logger = consola.withTag('api:products')

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page = parseInt(query.page as string) || 1
  const size = parseInt(query.size as string) || 20
  const categoryId = query.categoryId as string | undefined
  const sort = query.sort as string | undefined
  const order = query.order as string | undefined
  const parsedMinPrice = query.minPrice ? parseFloat(query.minPrice as string) : undefined
  const parsedMaxPrice = query.maxPrice ? parseFloat(query.maxPrice as string) : undefined
  const minPrice = Number.isFinite(parsedMinPrice) ? parsedMinPrice : undefined
  const maxPrice = Number.isFinite(parsedMaxPrice) ? parsedMaxPrice : undefined
  const attributeFilters = query.attributeFilters as string | undefined

  const productClient = useProductQueryClient(event)

  try {
    return await productClient.getProductList({
      page,
      size,
      categoryId,
      sort,
      order,
      minPrice,
      maxPrice,
      attributeFilters
    })
  } catch (error: unknown) {
    logger.error('Failed to fetch product list', { categoryId, page, size }, error)
    throw error
  }
})
