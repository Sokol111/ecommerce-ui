import { consola } from 'consola'

const logger = consola.withTag('api:categories:[id]')

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  const categoryClient = useCategoryQueryClient()

  try {
    return await categoryClient.getCategoryById(id)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }
    logger.error(`Failed to fetch category ${id}`, error)
    throw error
  }
})
