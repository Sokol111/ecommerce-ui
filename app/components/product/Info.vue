<script setup lang="ts">
import type { ProductResponse } from '@sokol111/ecommerce-product-query-service-api';

interface Props {
  product: ProductResponse
  currency?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'USD'
})

const { name, description, price, quantity } = props.product
const isInStock = quantity > 0
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Product Name -->
    <h1 class="text-2xl lg:text-3xl font-bold">{{ name }}</h1>

    <!-- Price -->
    <div class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-primary">
        {{ price.toFixed(2) }} {{ currency }}
      </span>
    </div>

    <USeparator />

    <!-- Stock Status -->
    <div class="flex items-center gap-2">
      <template v-if="isInStock">
        <UBadge color="success" variant="solid" class="gap-1">
          <UIcon name="i-lucide-check" class="h-3 w-3" />
          В наявності
        </UBadge>
        <span class="text-sm text-(--ui-text-muted)">({{ quantity }} шт.)</span>
      </template>
      <template v-else>
        <UBadge color="error" variant="solid" class="gap-1">
          <UIcon name="i-lucide-package" class="h-3 w-3" />
          Немає в наявності
        </UBadge>
      </template>
    </div>

    <!-- Description -->
    <div v-if="description" class="mt-2">
      <h2 class="text-lg font-semibold mb-2">Опис</h2>
      <p class="text-(--ui-text-muted) leading-relaxed">{{ description }}</p>
    </div>

    <USeparator />

    <!-- Add to Cart Button -->
    <div class="flex flex-col sm:flex-row gap-3 mt-2">
      <UButton
        size="lg"
        class="flex-1"
        :disabled="!isInStock"
        icon="i-lucide-shopping-cart"
      >
        Додати до кошика
      </UButton>
    </div>
  </div>
</template>
