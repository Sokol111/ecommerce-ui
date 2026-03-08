export default defineCachedEventHandler(async (event) => {
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
    throw error
  }
}, {
  maxAge: 900,
  getKey: event => `category:${getRouterParam(event, 'id')}`
})
