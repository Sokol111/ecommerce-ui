<script setup lang="ts">
import type { ProductResponse } from '@sokol111/ecommerce-product-query-service-api'

const route = useRoute()

const productId = computed(() => route.params.id as string)

const { data: product, error } = await useFetch<ProductResponse>(
  `/api/products/${productId.value}`
)

if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Товар не знайдено'
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
      <ProductGallery
        :image-url="product?.largeImageUrl"
        :product-name="product?.name || ''"
      />

      <!-- Product Info -->
      <div class="flex flex-col gap-6">
        <ProductInfo v-if="product" :product="product" />

        <!-- Product Attributes -->
        <ProductAttributes
          v-if="product?.attributes && product.attributes.length > 0"
          :attributes="product.attributes"
        />
      </div>
    </div>
  </div>
</template>
