import { consola } from 'consola'

const logger = consola.withTag('api:categories')

export default defineEventHandler(async (event) => {
  const categoryClient = useCategoryQueryClient(event)

  try {
    return await categoryClient.getAllActiveCategories()
  } catch (error: unknown) {
    logger.error('Failed to fetch active categories', error)
    throw error
  }
})
