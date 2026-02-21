<script setup lang="ts">
import type { GetProductListOrder, GetProductListSort } from '@sokol111/ecommerce-product-query-service-api'

const route = useRoute()
const { getCategoryById } = useCategoryApi()
const { getProductList } = useProductApi()

const PAGE_SIZE = 12
const categoryId = computed(() => route.params.id as string)

// Fetch category
const { data: category, error: categoryError } = await useAsyncData(
  `category-${categoryId.value}`,
  () => getCategoryById(categoryId.value)
)

if (categoryError.value || !category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Категорія не знайдена' })
}

// Filters composable
const categoryAttributesRef = computed(() => category.value?.attributes ?? [])
const { currentFilters, attributeFiltersJson } = useFilters(categoryAttributesRef)

// Query params
const page = computed(() => parseInt(route.query.page as string) || 1)
const size = computed(() => parseInt(route.query.size as string) || PAGE_SIZE)
const sort = computed(() => route.query.sort as GetProductListSort | undefined)
const order = computed(() => route.query.order as GetProductListOrder | undefined)

// Fetch products
const { data: productList } = await useAsyncData(
  `products-${categoryId.value}`,
  () => getProductList({
    page: page.value,
    size: size.value,
    categoryId: categoryId.value,
    sort: sort.value,
    order: order.value,
    minPrice: currentFilters.value.price.minPrice,
    maxPrice: currentFilters.value.price.maxPrice,
    attributeFilters: attributeFiltersJson.value
  }),
  { watch: [page, size, sort, order, currentFilters] }
)

const totalPages = computed(() => Math.ceil((productList.value?.total ?? 0) / size.value))
const hasFilters = computed(() => (category.value?.attributes?.length ?? 0) > 0)

useSeoMeta({ title: category.value?.name })
</script>

<template>
  <div class="py-6">
    <h1 class="text-2xl font-bold mb-6">{{ category?.name }}</h1>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Filters Sidebar -->
      <CategoryFilters
        v-if="hasFilters && category?.attributes"
        :category-attributes="category.attributes"
      />

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <!-- Active Filters -->
        <CategoryActiveFilters
          v-if="hasFilters && category?.attributes"
          :category-attributes="category.attributes"
        />

        <!-- Product Grid -->
        <CategoryProductList :products="productList?.items ?? []" />

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8">
          <AppPagination :current-page="page" :total-pages="totalPages" />
        </div>
      </div>
    </div>
  </div>
</template>
