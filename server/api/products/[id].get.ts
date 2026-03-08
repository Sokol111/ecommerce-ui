export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required'
    })
  }

  const productClient = useProductQueryClient()

  try {
    return await productClient.getProductById(id)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }
    throw error
  }
})
