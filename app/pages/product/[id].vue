<script setup lang="ts">
import type { Product } from '@sokol111/ecommerce-product-query-service-api'
import Attributes from './_components/Attributes.vue'
import Gallery from './_components/Gallery.vue'
import Info from './_components/Info.vue'

const route = useRoute('product-id')

const productId = computed(() => route.params.id)

const { data: product, error } = await useFetch<Product>(
  `/api/products/${productId.value}`
)

if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found'
  })
}

useSeoMeta({
  title: product.value?.name
})
</script>

<template>
  <div class="py-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- Product Image Gallery -->
      <Gallery
        :image-url="product?.largeImageUrl"
        :product-name="product?.name || ''"
      />

      <!-- Product Info -->
      <div class="flex flex-col gap-6">
        <Info
          v-if="product"
          :product="product"
        />

        <!-- Product Attributes -->
        <Attributes
          v-if="product?.attributes && product.attributes.length > 0"
          :attributes="product.attributes"
        />
      </div>
    </div>
  </div>
</template>
