import { consola } from 'consola'

const logger = consola.withTag('api:products:random')

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const count = parseInt(query.count as string) || 4

  const productClient = useProductQueryClient(event)

  try {
    return await productClient.getRandomProducts({ count })
  } catch (error: unknown) {
    logger.error('Failed to fetch random products', error)
    throw error
  }
})
