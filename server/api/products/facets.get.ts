import { consola } from 'consola'

const logger = consola.withTag('api:products:facets')

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categoryId = query.categoryId as string

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  const productClient = useProductQueryClient(event)

  try {
    return await productClient.getProductFacets({ categoryId })
  } catch (error: unknown) {
    logger.error(`Failed to fetch facets for category ${categoryId}`, error)
    throw error
  }
})
