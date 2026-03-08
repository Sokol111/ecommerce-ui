<script setup lang="ts">
import type { ProductResponse } from '@sokol111/ecommerce-product-query-service-api';

const { data: products } = await useFetch<ProductResponse[]>('/api/products/random', {
  query: { count: 4 }
})
</script>

<template>
  <section>
    <h2 class="text-lg font-semibold mb-4">Random Products</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>
