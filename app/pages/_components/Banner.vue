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
        Portfolio Project by Ihor Sokolovskyi
      </h1>
      <p class="text-sm md:text-base text-neutral-300 max-w-2xl">
        A full-stack e-commerce platform built with Go microservices and Nuxt.
        Explore the architecture and project structure on
        <a
          href="https://github.com/Sokol111/ecommerce-workspace"
          target="_blank"
          rel="noopener noreferrer"
          class="text-white underline underline-offset-2 hover:text-neutral-100"
        >GitHub</a>.
      </p>
    </div>
  </section>
</template>
