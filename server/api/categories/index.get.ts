export default defineEventHandler(async () => {
  const categoryClient = useCategoryQueryClient()
  return await categoryClient.getAllActiveCategories()
})
