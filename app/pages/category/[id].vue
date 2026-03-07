<script setup lang="ts">
import type { CategoryResponse } from '@sokol111/ecommerce-category-query-service-api'
import type { FacetsResponse, GetProductListOrder, GetProductListSort, ProductListResponse } from '@sokol111/ecommerce-product-query-service-api'
import ActiveFilters from './_components/ActiveFilters.vue'
import Filters from './_components/Filters.vue'
import ProductList from './_components/ProductList.vue'

const route = useRoute('category-id')

const PAGE_SIZE = 12
const categoryId = computed(() => route.params.id)

// Fetch category
const { data: category, error: categoryError } = await useFetch<CategoryResponse>(
  `/api/categories/${categoryId.value}`
)

if (categoryError.value || !category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Категорія не знайдена' })
}

// Filters
const categoryAttributes = computed(() => category.value?.attributes ?? [])
const { currentFilters, attributeFiltersJson } = useFilters()

// Query params
const page = computed(() => parseInt(route.query.page as string) || 1)
const size = computed(() => parseInt(route.query.size as string) || PAGE_SIZE)
const sort = computed(() => route.query.sort as GetProductListSort | undefined)
const order = computed(() => route.query.order as GetProductListOrder | undefined)

// Fetch products
const { data: productList } = await useFetch<ProductListResponse>('/api/products', {
  query: {
    page,
    size,
    categoryId,
    sort,
    order,
    minPrice: () => currentFilters.value.price.minPrice,
    maxPrice: () => currentFilters.value.price.maxPrice,
    attributeFilters: attributeFiltersJson
  }
})

// Fetch facets
const { data: facets } = await useFetch<FacetsResponse>('/api/products/facets', {
  query: { categoryId }
})

const totalPages = computed(() => Math.ceil((productList.value?.total ?? 0) / size.value))
const hasFilters = computed(() => (category.value?.attributes?.length ?? 0) > 0)

useSeoMeta({ title: category.value?.name })
</script>

<template>
  <div class="py-6">
    <h1 class="text-2xl font-bold mb-6">{{ category?.name }}</h1>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Filters Sidebar -->
      <Filters v-if="hasFilters" :category-attributes="categoryAttributes" :facets="facets ?? undefined" />

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <!-- Active Filters -->
        <ActiveFilters v-if="hasFilters" :category-attributes="categoryAttributes" />

        <!-- Product Grid -->
        <ProductList :products="productList?.items ?? []" />

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8">
          <AppPagination :current-page="page" :total-pages="totalPages" />
        </div>
      </div>
    </div>
  </div>
</template>
