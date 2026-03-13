<script setup lang="ts">
import type { ProductResponse } from '@sokol111/ecommerce-product-query-service-api'

interface Props {
  product: ProductResponse
  currency?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'USD'
})

const { id, name, price, smallImageUrl, description } = props.product
</script>

<template>
  <NuxtLink
    :to="`/product/${id}`"
    class="group border rounded-lg p-3 flex flex-col gap-2 hover:shadow transition bg-(--ui-bg)"
  >
    <div class="relative w-full aspect-square overflow-hidden rounded">
      <img
        :src="smallImageUrl || '/placeholder.png'"
        :alt="name"
        class="object-cover w-full h-full group-hover:scale-105 transition-transform"
      >
    </div>
    <div class="flex-1 flex flex-col">
      <h3 class="text-sm font-medium line-clamp-2 mb-1">{{ name }}</h3>
      <p
        v-if="description"
        class="text-xs text-(--ui-text-muted) line-clamp-2 mb-1"
      >
        {{ description }}
      </p>
      <span class="text-primary font-semibold mt-auto">
        {{ price % 1 === 0 ? price.toFixed(0) : price.toFixed(2) }} {{ currency }}
      </span>
    </div>
  </NuxtLink>
</template>
