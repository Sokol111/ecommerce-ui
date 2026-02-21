<script setup lang="ts">
interface Props {
  imageUrl?: string
  productName: string
}

defineProps<Props>()

const isZoomed = ref(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Main Image -->
    <div
      class="relative aspect-square w-full overflow-hidden rounded-lg border bg-gray-50 cursor-zoom-in"
      @click="isZoomed = !isZoomed"
    >
      <img
        :src="imageUrl || '/placeholder.png'"
        :alt="productName"
        class="object-contain w-full h-full transition-transform duration-300"
        :class="{ 'scale-150': isZoomed, 'scale-100': !isZoomed }"
      >
    </div>

    <!-- Zoom hint -->
    <p class="text-xs text-(--ui-text-muted) text-center">
      Натисніть на зображення, щоб збільшити
    </p>
  </div>
</template>
