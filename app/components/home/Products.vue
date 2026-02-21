<script setup lang="ts">
const { getRandomProducts } = useProductApi()

const { data: products } = await useAsyncData('random-products', () => getRandomProducts(4))
</script>

<template>
  <section>
    <h2 class="text-lg font-semibold mb-4">Випадкові товари</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>
