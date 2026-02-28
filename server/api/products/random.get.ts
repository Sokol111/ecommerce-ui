export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const count = parseInt(query.count as string) || 4

  const productClient = useProductQueryClient()
  return await productClient.getRandomProducts({ count })
})
