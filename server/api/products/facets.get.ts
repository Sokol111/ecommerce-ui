export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const categoryId = query.categoryId as string

  if (!categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category ID is required'
    })
  }

  const productClient = useProductQueryClient()
  return await productClient.getProductFacets({ categoryId })
}, {
  maxAge: 900,
  getKey: (event) => {
    const query = getQuery(event)
    return `facets:${query.categoryId}`
  }
})
