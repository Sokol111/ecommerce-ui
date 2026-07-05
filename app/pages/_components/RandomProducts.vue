<script setup lang="ts">
import type { Product } from '@sokol111/ecommerce-product-query-service-api'

const { data: products, error } = await useFetch<Product[]>('/api/products/random', {
  query: { count: 4 }
})
</script>

<template>
  <section>
    <h2 class="text-lg font-semibold mb-4">
      Random Products
    </h2>
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      title="Failed to load random products"
    />
    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>
