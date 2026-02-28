<script setup lang="ts">
const handleClick = () => {
  alert('Clicked')
}
</script>

<template>
  <section
    class="relative w-full h-96 overflow-hidden rounded-md"
    aria-label="Banner"
  >
    <div
      class="absolute inset-0 -z-10 bg-cover bg-center"
      style="background-image: linear-gradient(135deg, #111827, #1f2937)"
    />
    <div class="absolute inset-0 bg-black/40" />
    <div class="relative h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-white">
        Ласкаво просимо
      </h1>
      <p class="text-sm md:text-base text-neutral-200">
        Проста банерна секція без жодних параметрів.
      </p>
      <UButton
        variant="solid"
        color="neutral"
        @click="handleClick"
      >
        Дія →
      </UButton>
    </div>
  </section>
</template>
