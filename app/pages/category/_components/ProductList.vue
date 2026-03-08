<script setup lang="ts">
import type { ProductResponse } from '@sokol111/ecommerce-product-query-service-api';

interface Props {
  products: ProductResponse[]
}

defineProps<Props>()
</script>

<template>
  <div v-if="products.length === 0" class="text-(--ui-text-muted)">
    No products in this category.
  </div>
  <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
